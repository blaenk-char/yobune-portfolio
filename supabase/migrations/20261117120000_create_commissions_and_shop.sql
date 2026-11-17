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
