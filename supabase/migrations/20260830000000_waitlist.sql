-- The waitlist behind /waitlist on radlor.com.
--
-- ⚠️ THIS FILE DESCRIBES THE TABLE AS IT WAS CREATED. IT IS NOT THE CURRENT POSTURE.
-- `20260901071510_waitlist_anon_narrow_insert.sql` supersedes the access model below: the route
-- no longer holds `service_role`, and anon HAS a column-level INSERT grant and one policy. Read
-- that file for what production actually has. The paragraph that used to sit here said "RLS is on
-- and there are deliberately no policies … do not add one" — which stopped being true on
-- 2026-09-01 and would, if obeyed, revoke the grant the live signup form depends on and hand the
-- public endpoint back its project-wide key. It is corrected rather than deleted because the
-- reasoning it got wrong is worth seeing.
--
-- ⚠️ WHAT IS STILL TRUE, AND IS THE POINT OF THE WHOLE DESIGN. The browser never holds a Supabase
-- key and never contacts supabase.co — /privacy states as a checkable claim that every request a
-- visitor makes goes to radlor.com, and a browser-side Supabase call would break it. The anon key
-- lives on the SERVER, in a route handler. Do not add a NEXT_PUBLIC_ Supabase variable to either
-- repo. See app/api/waitlist/route.ts.
--
-- ⚠️ AND WHAT MUST NEVER BE GRANTED: SELECT. That is the assertion protecting every signup's email
-- address, and it is the one somebody loosens at 11pm to make a dashboard work.
-- `npm run check:waitlist-rls` fails if it ever appears.

-- ⚠️ `citext` GOES IN THE `extensions` SCHEMA, NOT `public`. Supabase's own security advisor
-- flags extensions installed in public (extension_in_public): objects there are exposed through
-- PostgREST's API surface and share a namespace with application tables. `extensions` already
-- exists on a Supabase project and is on the default search_path — the column type below is
-- schema-qualified anyway so this does not depend on that.
create extension if not exists citext with schema extensions;

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  -- citext so Ada@example.com and ada@example.com cannot both take a seat.
  email       extensions.citext not null unique,
  -- Optional, and one of AGE_BANDS in site.ts. Null means they did not say.
  age_band    text,
  source      text        not null default 'website',
  created_at  timestamptz not null default now(),

  constraint waitlist_email_shape
    check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint waitlist_age_band_known
    check (age_band is null or age_band in ('3-5','6-8','9-11','12-14','15-16','17-18'))
);

comment on table public.waitlist is
  'Waitlist signups from radlor.com. RLS on. anon may INSERT (email, age_band, source) and nothing '
  'else - no SELECT, ever. See migration 20260901071510.';

alter table public.waitlist enable row level security;

-- Belt and braces: even if a policy is added by accident later, the grants are not there.
-- ⚠️ `anon` WAS IN THIS LIST AND IS NOT ANY MORE — the later migration grants it INSERT on three
-- named columns. Revoking all from anon here is still correct AT THIS POINT IN HISTORY: the grant
-- comes afterwards, so a replay produces the narrow grant and not a wider one. Do not "tidy" this
-- by adding anon back below the grant.
revoke all on public.waitlist from anon, authenticated;

create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

-- PostgREST caches the schema; a table created by hand in the SQL editor may not appear on the
-- REST API until this runs. If GET /rest/v1/waitlist 404s with PGRST205 right after creating it,
-- this is the fix rather than re-running the migration.
notify pgrst, 'reload schema';
