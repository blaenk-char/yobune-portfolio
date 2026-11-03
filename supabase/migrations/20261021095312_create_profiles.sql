-- Role enum
create type public.user_role as enum ('super_admin', 'admin', 'user');

-- Profiles table
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  username   varchar(64) not null unique,
  role       public.user_role not null default 'user'
);

-- Row Level Security
alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Users may only set their username, never their role
revoke insert, update on public.profiles from authenticated;
grant insert (id, username) on public.profiles to authenticated;
grant update (username) on public.profiles to authenticated;