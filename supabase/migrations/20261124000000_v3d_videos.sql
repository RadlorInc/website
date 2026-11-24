-- 3Dlor: one row for each video of an order, so the customer can follow it and approve it (founder, 24 Nov 2026).
--
-- Who can do what (the same rules as v3d_orders):
--   * A signed-in customer can SELECT only their own rows. `anon` has no grant. No customer can write.
--   * The customer's "approve" / "ask for a change" goes through /api/3dlor/videos with the service role, which checks the
--     session, the owner and the present status in one UPDATE.
--   * The founder adds the rows and moves them on in the table editor, and puts the files in the private bucket v3d-videos.
--     `user_id` is set from the order by a trigger, so a wrong id typed in the editor cannot show a video to another customer.
--
-- How the founder uses it: add a row for each video (order_id, position, title). Then:
--   status script_review + script text  → the customer approves (→ in_work) or asks (→ script_changes)
--   status video_review + video_path    → the customer approves (→ approved) or asks (→ video_changes, one round used)
--   final_path (the clean file) shows as a download only when the order's balance_paid is true.
--
-- ⚠️ Do not `supabase db push` from this repo (see handoff.md). Apply this file by hand, after the first two v3d files.
-- Backward compatible: code without this table keeps working, and the account page treats a missing table as "no videos".

create table public.v3d_videos (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.v3d_orders (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  position integer not null default 0,
  title text not null check (char_length(title) between 1 and 200),
  status text not null default 'planned'
    check (status in ('planned', 'script_review', 'script_changes', 'in_work', 'video_review', 'video_changes', 'approved')),
  script text check (char_length(script) <= 8000),
  video_path text check (char_length(video_path) <= 300 and video_path !~ '\.\.' and video_path ~ '\.mp4$'),
  final_path text check (char_length(final_path) <= 300 and final_path !~ '\.\.' and final_path ~ '\.mp4$'),
  rounds_used integer not null default 0 check (rounds_used between 0 and 50),
  customer_note text check (char_length(customer_note) <= 2000),
  script_approved_at timestamptz,
  video_approved_at timestamptz
);
create index v3d_videos_order_idx on public.v3d_videos (order_id, position);
create index v3d_videos_user_idx on public.v3d_videos (user_id);

create function public.v3d_videos_guard() returns trigger
  language plpgsql security definer set search_path = '' as $$
begin
  select o.user_id into new.user_id from public.v3d_orders o where o.id = new.order_id;
  new.updated_at := now();
  return new;
end $$;
revoke all on function public.v3d_videos_guard() from public, anon, authenticated;
create trigger v3d_videos_guard before insert or update on public.v3d_videos
  for each row execute function public.v3d_videos_guard();

alter table public.v3d_videos enable row level security;
revoke all on public.v3d_videos from anon, authenticated;
grant select on public.v3d_videos to authenticated;
create policy v3d_videos_select_own on public.v3d_videos
  for select to authenticated using (user_id = (select auth.uid()));

-- Private: no policy on storage.objects names it, so only the service role (the API routes) reads it.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('v3d-videos', 'v3d-videos', false, 52428800, array['video/mp4'])
on conflict (id) do nothing;
