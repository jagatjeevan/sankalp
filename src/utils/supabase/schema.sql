-- Supabase schema for Sankalp
-- Run this SQL in the Supabase SQL editor (or via migration) to create required tables.

-- Enable pgcrypto for UUID generation (Supabase already provides this extension).
create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  category_id uuid not null references categories(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists user_locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  email text not null,
  full_name text not null,
  latitude double precision not null,
  longitude double precision not null,
  location_history jsonb not null default '[]',
  created_at timestamptz not null default now(),
  unique (user_id)
);

create index if not exists idx_categories_user on categories(user_id);
create index if not exists idx_todos_user_category on todos(user_id, category_id);
create index if not exists idx_user_locations_user on user_locations(user_id);
