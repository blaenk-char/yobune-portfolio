-- Commission field & modifier enums
create type public.commission_field_type as enum ('text', 'file', 'checkbox', 'radio');
create type public.commission_modifier_type as enum ('none', 'flat', 'multiplier');
create type public.commission_order_status as enum ('pending', 'in_queue', 'in_progress', 'completed', 'declined', 'cancelled');

-- Commission Services
create table public.commission_services (
  id          uuid primary key default gen_random_uuid(),
  title       varchar(128) not null,
  description text not null,
  base_price  numeric(10, 2) not null,
  slots_total integer not null default 0,
  is_nsfw     boolean not null default false,
  is_active   boolean not null default true,
  created_at  timestamptz(6) not null default now(),
  updated_at  timestamptz(6) not null default now()
);

-- Commission Service Previews
create table public.commission_service_previews (
  id         uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.commission_services (id) on delete cascade,
  url        text not null,
  sort_order integer not null default 0
);
create index commission_service_previews_service_id_idx on public.commission_service_previews (service_id);

-- Commission Forms (1-to-1 with commission_services)
create table public.commission_forms (
  id          uuid primary key default gen_random_uuid(),
  service_id  uuid not null unique references public.commission_services (id) on delete cascade,
  title       varchar(128) not null,
  description text
);

-- Commission Form Sections
create table public.commission_form_sections (
  id          uuid primary key default gen_random_uuid(),
  form_id     uuid not null references public.commission_forms (id) on delete cascade,
  title       varchar(128) not null,
  description text,
  sort_order  integer not null default 0
);
create index commission_form_sections_form_id_idx on public.commission_form_sections (form_id);

-- Commission Form Fields
create table public.commission_form_fields (
  id          uuid primary key default gen_random_uuid(),
  section_id  uuid not null references public.commission_form_sections (id) on delete cascade,
  type        public.commission_field_type not null,
  label       varchar(255) not null,
  placeholder varchar(255),
  is_required boolean not null default false,
  sort_order  integer not null default 0
);
create index commission_form_fields_section_id_idx on public.commission_form_fields (section_id);

-- Commission Form Field Options (for checkbox & radio fields)
create table public.commission_form_field_options (
  id             uuid primary key default gen_random_uuid(),
  field_id       uuid not null references public.commission_form_fields (id) on delete cascade,
  label          varchar(255) not null,
  modifier_type  public.commission_modifier_type not null default 'none',
  modifier_value numeric(10, 2) not null default 0,
  sort_order     integer not null default 0
);
create index commission_form_field_options_field_id_idx on public.commission_form_field_options (field_id);

-- Commission Orders
create table public.commission_orders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  service_id  uuid not null references public.commission_services (id) on delete restrict,
  status      public.commission_order_status not null default 'pending',
  total_price numeric(10, 2) not null,
  created_at  timestamptz(6) not null default now(),
  updated_at  timestamptz(6) not null default now()
);
create index commission_orders_user_id_idx on public.commission_orders (user_id);
create index commission_orders_service_id_idx on public.commission_orders (service_id);
create index commission_orders_status_idx on public.commission_orders (status);

-- Commission Order Answers
create table public.commission_order_answers (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.commission_orders (id) on delete cascade,
  field_id   uuid not null references public.commission_form_fields (id) on delete restrict,
  option_id  uuid references public.commission_form_field_options (id) on delete restrict,
  text_value text,
  file_path  text
);
create index commission_order_answers_order_id_idx on public.commission_order_answers (order_id);
create index commission_order_answers_field_id_idx on public.commission_order_answers (field_id);
create index commission_order_answers_option_id_idx on public.commission_order_answers (option_id);

-- Commission Order Deliverables
create table public.commission_order_deliverables (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.commission_orders (id) on delete cascade,
  file_path  text not null,
  created_at timestamptz(6) not null default now()
);
create index commission_order_deliverables_order_id_idx on public.commission_order_deliverables (order_id);

-- Shop Products
create table public.shop_products (
  id           uuid primary key default gen_random_uuid(),
  title        varchar(128) not null,
  description  text not null,
  price        numeric(10, 2) not null,
  is_nsfw      boolean not null default false,
  is_published boolean not null default false,
  file_path    text not null,
  created_at   timestamptz(6) not null default now(),
  updated_at   timestamptz(6) not null default now()
);

-- Shop Product Previews
create table public.shop_product_previews (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.shop_products (id) on delete cascade,
  url        text not null,
  sort_order integer not null default 0
);
create index shop_product_previews_product_id_idx on public.shop_product_previews (product_id);

-- Shop Orders
create table public.shop_orders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.shop_products (id) on delete restrict,
  claimed_at timestamptz(6) not null default now(),
  unique (user_id, product_id)
);
create index shop_orders_user_id_idx on public.shop_orders (user_id);
create index shop_orders_product_id_idx on public.shop_orders (product_id);

-- Storage Buckets
insert into storage.buckets (id, name, public, file_size_limit)
values
  ('public-previews', 'public-previews', true, 52428800),
  ('commission-references', 'commission-references', false, 52428800),
  ('digital-deliverables', 'digital-deliverables', false, 52428800)
on conflict (id) do nothing;

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

alter table public.commission_services enable row level security;
alter table public.commission_service_previews enable row level security;
alter table public.commission_forms enable row level security;
alter table public.commission_form_sections enable row level security;
alter table public.commission_form_fields enable row level security;
alter table public.commission_form_field_options enable row level security;
alter table public.commission_orders enable row level security;
alter table public.commission_order_answers enable row level security;
alter table public.commission_order_deliverables enable row level security;
alter table public.shop_products enable row level security;
alter table public.shop_product_previews enable row level security;
alter table public.shop_orders enable row level security;

-- Helper function to check if the current user is an admin or super_admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'super_admin')
  );
$$;

-- 1. Commission Services & Form Structure (Public Read for Active, Admin Full Access)
create policy "Anyone can read active commission services"
  on public.commission_services for select
  using (is_active = true or public.is_admin());

create policy "Admins can manage commission services"
  on public.commission_services for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can read commission service previews"
  on public.commission_service_previews for select
  using (true);

create policy "Admins can manage commission service previews"
  on public.commission_service_previews for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can read commission forms"
  on public.commission_forms for select
  using (true);

create policy "Admins can manage commission forms"
  on public.commission_forms for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can read commission form sections"
  on public.commission_form_sections for select
  using (true);

create policy "Admins can manage commission form sections"
  on public.commission_form_sections for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can read commission form fields"
  on public.commission_form_fields for select
  using (true);

create policy "Admins can manage commission form fields"
  on public.commission_form_fields for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can read commission form field options"
  on public.commission_form_field_options for select
  using (true);

create policy "Admins can manage commission form field options"
  on public.commission_form_field_options for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 2. Commission Orders, Answers & Deliverables (Owner or Admin Access)
create policy "Users can read their own commission orders"
  on public.commission_orders for select
  to authenticated
  using ((select auth.uid()) = user_id or public.is_admin());

create policy "Users can create their own commission orders"
  on public.commission_orders for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Admins can update or delete commission orders"
  on public.commission_orders for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Users can read their own commission order answers"
  on public.commission_order_answers for select
  to authenticated
  using (
    exists (
      select 1 from public.commission_orders o
      where o.id = order_id and o.user_id = (select auth.uid())
    )
    or public.is_admin()
  );

create policy "Users can create answers for their own commission orders"
  on public.commission_order_answers for insert
  to authenticated
  with check (
    exists (
      select 1 from public.commission_orders o
      where o.id = order_id and o.user_id = (select auth.uid())
    )
  );

create policy "Admins can manage commission order answers"
  on public.commission_order_answers for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Users can read deliverables for their own commission orders"
  on public.commission_order_deliverables for select
  to authenticated
  using (
    exists (
      select 1 from public.commission_orders o
      where o.id = order_id and o.user_id = (select auth.uid())
    )
    or public.is_admin()
  );

create policy "Admins can manage commission order deliverables"
  on public.commission_order_deliverables for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 3. Shop Products, Previews & Orders
create policy "Anyone can read published shop products"
  on public.shop_products for select
  using (is_published = true or public.is_admin());

create policy "Admins can manage shop products"
  on public.shop_products for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can read shop product previews"
  on public.shop_product_previews for select
  using (true);

create policy "Admins can manage shop product previews"
  on public.shop_product_previews for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Users can read their own shop orders"
  on public.shop_orders for select
  to authenticated
  using ((select auth.uid()) = user_id or public.is_admin());

create policy "Users can create their own shop orders"
  on public.shop_orders for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Admins can manage shop orders"
  on public.shop_orders for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


