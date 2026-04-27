-- =============================================================
-- EnigmAI – Team Members Table
-- Run this in Supabase > SQL Editor
-- =============================================================

create type member_role   as enum ('owner', 'admin', 'support');
create type member_status as enum ('active', 'offline', 'pending');

create table team_members (
  id         uuid primary key default gen_random_uuid(),
  store_id   uuid          not null references stores(id) on delete cascade,
  name       text          not null,
  email      text          not null,
  role       member_role   not null default 'support',
  status     member_status not null default 'pending',
  created_at timestamptz   default now()
);

create index idx_team_members_store on team_members(store_id);
create index idx_team_members_email on team_members(store_id, email);

alter table team_members enable row level security;
