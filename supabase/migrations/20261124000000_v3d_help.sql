-- 3Dlor help pages: one public page per brand product at /help/<brand>/<product> (founder, 23 Nov 2026).
--
-- A product has videos. A video is a 3D model id plus a script of steps (the same step format as the lesson
-- files: dur, view, cut, xray, explode, mt, speed, hi, labels, caption {title, body}), with an optional voice file.
-- A part is a named time range of a video (start_s, end_s, title, keywords) that the search can jump to.
--
-- Who can do what:
--   * `anon` can SELECT, and only the rows of a product with published = true. The page reads with the anon key,
--     so this policy is what keeps a draft product private.
--   * `authenticated` has no grant (a 3Dlor customer session is not needed to read a public help page).
--   * Every write is by the service role: scripts/help-upload.mjs, or the founder in the table editor
--     (the founder sets published = true there).
--
-- ⚠️ Do not `supabase db push` from this repo (see handoff.md). Apply this file by hand.

create table public.v3d_help_products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_id uuid references public.v3d_orders (id) on delete set null,
  brand_slug text not null check (brand_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(brand_slug) <= 60),
  product_slug text not null check (product_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(product_slug) <= 80),
  brand_name text not null check (char_length(brand_name) between 1 and 120),
  product_name text not null check (char_length(product_name) between 1 and 200),
  published boolean not null default false,
  unique (brand_slug, product_slug)
);

create table public.v3d_help_videos (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.v3d_help_products (id) on delete cascade,
  position integer not null default 0,
  title text not null check (char_length(title) between 1 and 200),
  model_id text not null check (model_id ~ '^[a-z0-9]{1,40}$'),
  script jsonb not null check (jsonb_typeof(script -> 'steps') = 'array' and octet_length(script::text) <= 200000),
  duration_s numeric not null check (duration_s > 0 and duration_s <= 3600),
  audio_path text check (char_length(audio_path) <= 300),
  unique (product_id, position)
);
create index v3d_help_videos_product_idx on public.v3d_help_videos (product_id);
create index v3d_help_videos_model_idx on public.v3d_help_videos (model_id);

create table public.v3d_help_parts (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.v3d_help_videos (id) on delete cascade,
  position integer not null default 0,
  title text not null check (char_length(title) between 1 and 200),
  start_s numeric not null check (start_s >= 0),
  end_s numeric not null,
  keywords text[] not null default '{}' check (cardinality(keywords) <= 40),
  still_path text check (char_length(still_path) <= 300),
  check (end_s > start_s),
  unique (video_id, position)
);
create index v3d_help_parts_video_idx on public.v3d_help_parts (video_id);

alter table public.v3d_help_products enable row level security;
alter table public.v3d_help_videos enable row level security;
alter table public.v3d_help_parts enable row level security;

-- Supabase grants every privilege on new public tables to anon and authenticated by default.
revoke all on public.v3d_help_products, public.v3d_help_videos, public.v3d_help_parts from anon, authenticated;
grant select on public.v3d_help_products, public.v3d_help_videos, public.v3d_help_parts to anon;

create policy v3d_help_products_read on public.v3d_help_products
  for select to anon using (published);
create policy v3d_help_videos_read on public.v3d_help_videos
  for select to anon using (exists (
    select 1 from public.v3d_help_products p where p.id = product_id and p.published));
create policy v3d_help_parts_read on public.v3d_help_parts
  for select to anon using (exists (
    select 1 from public.v3d_help_videos v join public.v3d_help_products p on p.id = v.product_id
    where v.id = video_id and p.published));

-- Private bucket: voice files, still pictures and the player files. No policy on storage.objects names it, so only
-- the service role (the /api/help routes, after a published check) can read it.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('v3d-help', 'v3d-help', false, 20971520,
        array['audio/mpeg', 'audio/mp4', 'image/webp', 'image/jpeg', 'image/png', 'text/javascript'])
on conflict (id) do nothing;
