-- 3D video product: customer orders and uploaded files (founder request, 22 Nov 2026).
--
-- Who can do what:
--   * A signed-in customer (role `authenticated`) can SELECT only their own rows. Nothing else.
--   * `anon` has no grant at all.
--   * Every write goes through the site's API routes with the service role, after the route has
--     checked the session. So a customer cannot set `payment_status`, the video counts or the plan
--     price from outside, even with their own token.
--   * `payment_status = 'paid'` is written only by the Stripe webhook (signature checked).
--   * The founder edits the progress columns in the Supabase table editor (v1 admin).
--
-- ⚠️ Do not `supabase db push` from this repo (see handoff.md). Apply this file by hand.

create table public.v3d_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),

  -- Onboarding form (the API validates the same limits; these checks are the second layer).
  company text not null check (char_length(company) between 1 and 200),
  contact_name text not null check (char_length(contact_name) between 1 and 200),
  phone text check (char_length(phone) <= 40),
  website text check (char_length(website) <= 300),
  product_name text not null check (char_length(product_name) between 1 and 300),
  product_url text check (char_length(product_url) <= 500),
  topics text not null check (char_length(topics) between 1 and 5000),
  languages text check (char_length(languages) <= 200),
  brand_colors text check (char_length(brand_colors) <= 200),
  files_link text check (char_length(files_link) <= 500),
  notes text check (char_length(notes) <= 5000),
  plan text not null check (plan in ('basic', 'growth', 'pro')),
  terms_accepted_at timestamptz,

  -- Payment. Written by the Stripe webhook only.
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'refunded')),
  paid_at timestamptz,
  amount_paid_cents integer check (amount_paid_cents >= 0),
  build_price_cents integer check (build_price_cents >= 0),   -- the price at the time of payment
  balance_paid boolean not null default false,                -- founder sets this when the second part is paid
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_session_id text,
  care_status text,                                            -- Stripe subscription status: trialing, active, past_due, canceled
  care_starts_at timestamptz,                                  -- end of the free months

  -- Progress. The founder edits these in the table editor.
  videos_ordered integer not null default 0 check (videos_ordered >= 0),
  videos_in_work integer not null default 0 check (videos_in_work >= 0),
  videos_delivered integer not null default 0 check (videos_delivered >= 0),
  waiting_on_customer text check (char_length(waiting_on_customer) <= 2000),  -- one item per line
  status_note text check (char_length(status_note) <= 2000)
);
create index v3d_orders_user_idx on public.v3d_orders (user_id);
create index v3d_orders_subscription_idx on public.v3d_orders (stripe_subscription_id);

create table public.v3d_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.v3d_orders (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('photo', 'manual', 'logo')),
  name text not null check (char_length(name) between 1 and 200),
  path text not null unique,
  size_bytes integer not null check (size_bytes between 1 and 4194304),
  mime text not null check (mime in ('image/jpeg', 'image/png', 'image/webp', 'application/pdf'))
);
create index v3d_files_order_idx on public.v3d_files (order_id);

alter table public.v3d_orders enable row level security;
alter table public.v3d_files enable row level security;

-- Supabase grants every privilege on new public tables to anon and authenticated by default.
revoke all on public.v3d_orders, public.v3d_files from anon, authenticated;
grant select on public.v3d_orders, public.v3d_files to authenticated;

create policy v3d_orders_select_own on public.v3d_orders
  for select to authenticated using (user_id = (select auth.uid()));
create policy v3d_files_select_own on public.v3d_files
  for select to authenticated using (user_id = (select auth.uid()));

-- Private bucket. No policy on storage.objects names it, so only the service role (the API routes)
-- can read or write. The limits here are the second layer behind the checks in the upload route.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('v3d-uploads', 'v3d-uploads', false, 4194304,
        array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do nothing;
