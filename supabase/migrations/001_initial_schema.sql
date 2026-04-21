-- =============================================================
-- EnigmAI – Database Schema
-- Run this in Supabase > SQL Editor (once, in order)
-- =============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- =============================================================
-- ENUM TYPES
-- =============================================================

create type customer_status   as enum ('new', 'regular', 'vip');
create type product_status    as enum ('active', 'out_of_stock', 'archived');
create type ticket_priority   as enum ('normal', 'high', 'urgent');
create type ticket_status     as enum ('open', 'closed');
create type message_role      as enum ('user', 'agent');
create type session_status    as enum ('active', 'closed', 'escalated');

-- =============================================================
-- STORES  (one row per SaaS tenant)
-- =============================================================

create table stores (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  domain      text        unique,
  phone       text,
  address     text,
  about       text,                     -- context injected into AI system prompt
  agent_name  text        default 'ארי',
  agent_persona jsonb     default '{}', -- { traits, rules, style }
  created_at  timestamptz default now()
);

-- =============================================================
-- CUSTOMERS
-- =============================================================

create table customers (
  id           uuid primary key default gen_random_uuid(),
  store_id     uuid        not null references stores(id) on delete cascade,
  name         text        not null,
  email        text,
  phone        text,
  status       customer_status not null default 'new',
  total_spent  numeric(10,2)   not null default 0,
  orders_count int             not null default 0,
  rating       numeric(3,1),            -- average satisfaction 1–5
  notes        text,
  last_chat_at timestamptz,
  created_at   timestamptz default now()
);

create index idx_customers_store on customers(store_id);
create index idx_customers_email on customers(store_id, email);

-- =============================================================
-- PRODUCTS
-- =============================================================

create table products (
  id             uuid primary key default gen_random_uuid(),
  store_id       uuid          not null references stores(id) on delete cascade,
  name           text          not null,
  sku            text,
  description    text,
  price          numeric(10,2) not null,
  original_price numeric(10,2),         -- null = not on sale
  stock          int           not null default 0,
  image_url      text,
  status         product_status not null default 'active',
  sold_count     int           not null default 0,
  rating         numeric(3,1),
  created_at     timestamptz   default now(),
  updated_at     timestamptz   default now()
);

create index idx_products_store  on products(store_id);
create index idx_products_sku    on products(store_id, sku);
create index idx_products_status on products(store_id, status);

-- Auto-update updated_at on every row change
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_products_updated_at
  before update on products
  for each row execute procedure set_updated_at();

-- =============================================================
-- CHAT SESSIONS
-- =============================================================

create table chat_sessions (
  id            uuid primary key default gen_random_uuid(),
  store_id      uuid          not null references stores(id) on delete cascade,
  customer_id   uuid          references customers(id) on delete set null,
  summary       text,                    -- AI-generated after session ends
  message_count int           not null default 0,
  status        session_status not null default 'active',
  escalated_at  timestamptz,
  closed_at     timestamptz,
  created_at    timestamptz   default now(),
  updated_at    timestamptz   default now()
);

create index idx_sessions_store    on chat_sessions(store_id);
create index idx_sessions_customer on chat_sessions(customer_id);
create index idx_sessions_status   on chat_sessions(store_id, status);
create index idx_sessions_date     on chat_sessions(store_id, created_at desc);

create trigger trg_sessions_updated_at
  before update on chat_sessions
  for each row execute procedure set_updated_at();

-- =============================================================
-- CHAT MESSAGES
-- =============================================================

create table chat_messages (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid         not null references chat_sessions(id) on delete cascade,
  role       message_role not null,
  content    text         not null,
  metadata   jsonb        default '{}', -- e.g. { product_ids, intent }
  created_at timestamptz  default now()
);

create index idx_messages_session on chat_messages(session_id, created_at asc);

-- Keep message_count in sync automatically
create or replace function inc_message_count()
returns trigger language plpgsql as $$
begin
  update chat_sessions
     set message_count = message_count + 1,
         updated_at    = now()
   where id = new.session_id;
  return new;
end;
$$;

create trigger trg_inc_message_count
  after insert on chat_messages
  for each row execute procedure inc_message_count();

-- =============================================================
-- SUPPORT TICKETS
-- =============================================================

create table support_tickets (
  id           text primary key,         -- e.g. "TKT-0041"
  store_id     uuid          not null references stores(id) on delete cascade,
  session_id   uuid          references chat_sessions(id) on delete set null,
  customer_id  uuid          references customers(id) on delete set null,
  order_number text,
  summary      text          not null,
  priority     ticket_priority not null default 'normal',
  status       ticket_status   not null default 'open',
  assigned_to  text,                     -- team member name or user id
  resolved_by  text,
  resolved_at  timestamptz,
  created_at   timestamptz   default now(),
  updated_at   timestamptz   default now()
);

create index idx_tickets_store  on support_tickets(store_id);
create index idx_tickets_status on support_tickets(store_id, status);
create index idx_tickets_date   on support_tickets(store_id, created_at desc);

create trigger trg_tickets_updated_at
  before update on support_tickets
  for each row execute procedure set_updated_at();

-- Auto-generate TKT id (TKT-0001 … TKT-9999)
create sequence ticket_seq start 1;

create or replace function generate_ticket_id()
returns trigger language plpgsql as $$
begin
  if new.id is null or new.id = '' then
    new.id := 'TKT-' || lpad(nextval('ticket_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

create trigger trg_ticket_id
  before insert on support_tickets
  for each row execute procedure generate_ticket_id();

-- =============================================================
-- ROW-LEVEL SECURITY  (RLS)
-- Each store can only see its own data.
-- =============================================================

alter table stores          enable row level security;
alter table customers       enable row level security;
alter table products        enable row level security;
alter table chat_sessions   enable row level security;
alter table chat_messages   enable row level security;
alter table support_tickets enable row level security;

-- Server-side operations use the service-role key (bypasses RLS).
-- Client-side (widget) uses the anon key with these policies:

-- Anon can INSERT messages into active sessions (for the chat widget)
create policy "widget can insert messages"
  on chat_messages for insert
  with check (
    exists (
      select 1 from chat_sessions s
       where s.id = session_id
         and s.status = 'active'
    )
  );

-- Anon can read messages in their own session (pass session_id in URL/JWT)
-- Full dashboard access is protected by the service-role key on the server.
