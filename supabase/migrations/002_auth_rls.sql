-- =============================================================
-- EnigmAI – Migration 002: Authentication & per-tenant RLS
-- Run AFTER 001_initial_schema.sql
-- =============================================================

-- 1. Link every store to its owner in auth.users
alter table stores
  add column if not exists user_id uuid
    references auth.users(id) on delete cascade;

create unique index if not exists idx_stores_user
  on stores(user_id);      -- one store per user (extend later for teams)

-- 2. Helper: resolve the store_id that belongs to the current user.
--    Used in every RLS policy so we don't repeat the sub-query.
create or replace function my_store_id()
returns uuid language sql security definer stable as $$
  select id from stores where user_id = auth.uid() limit 1;
$$;

-- =============================================================
-- 3. RLS policies  (replace the open ones from migration 001)
-- =============================================================

-- ── stores ──────────────────────────────────────────────────
drop policy if exists "stores: owner access" on stores;
create policy "stores: owner access" on stores
  using      (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ── customers ───────────────────────────────────────────────
drop policy if exists "customers: owner access" on customers;
create policy "customers: owner access" on customers
  using      (store_id = my_store_id())
  with check (store_id = my_store_id());

-- ── products ────────────────────────────────────────────────
drop policy if exists "products: owner access" on products;
create policy "products: owner access" on products
  using      (store_id = my_store_id())
  with check (store_id = my_store_id());

-- ── chat_sessions ────────────────────────────────────────────
drop policy if exists "sessions: owner access" on chat_sessions;
create policy "sessions: owner access" on chat_sessions
  using      (store_id = my_store_id())
  with check (store_id = my_store_id());

-- ── chat_messages ────────────────────────────────────────────
-- Keep the widget-insert policy from migration 001.
-- Add a read policy for the dashboard owner.
drop policy if exists "messages: owner read" on chat_messages;
create policy "messages: owner read" on chat_messages
  for select
  using (
    exists (
      select 1 from chat_sessions s
       where s.id = session_id
         and s.store_id = my_store_id()
    )
  );

-- ── support_tickets ─────────────────────────────────────────
drop policy if exists "tickets: owner access" on support_tickets;
create policy "tickets: owner access" on support_tickets
  using      (store_id = my_store_id())
  with check (store_id = my_store_id());
