create table if not exists public.rolling_papers (
  id text primary key,
  title text not null check (char_length(title) between 1 and 80),
  creator_name text not null check (char_length(creator_name) between 1 and 30),
  admin_token_hash text not null,
  is_closed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  rolling_paper_id text not null references public.rolling_papers(id) on delete cascade,
  author text not null check (char_length(author) between 1 and 30),
  content text not null check (char_length(content) between 1 and 500),
  color text not null default 'yellow',
  created_at timestamptz not null default now()
);

create index if not exists messages_paper_created_idx
  on public.messages(rolling_paper_id, created_at asc);

alter table public.rolling_papers enable row level security;
alter table public.messages enable row level security;
-- This app accesses Supabase only through server-side route handlers using the service-role key.
