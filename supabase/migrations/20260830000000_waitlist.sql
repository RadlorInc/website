-- The waitlist behind /waitlist on radlor.com.
--
-- ⚠️ THIS TABLE IS WRITTEN ONLY BY THE SERVICE ROLE, FROM A ROUTE HANDLER ON radlor.com.
-- The browser never holds a Supabase key and never contacts supabase.co — /privacy states as a
-- checkable claim that every request a visitor makes goes to radlor.com, and a browser-side
-- Supabase call would break it. See app/api/waitlist/route.ts.
--
-- ⚠️ RLS IS ON AND THERE ARE DELIBERATELY NO POLICIES. A policy-less table with RLS enabled is
-- deny-all for `anon` and `authenticated`; the service role bypasses RLS entirely. Adding an
-- INSERT policy "so the form works" would make the table world-writable from any browser with
-- the anon key. The form does not need one. Do not add one.

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
  'Waitlist signups from radlor.com. Service-role writes only; RLS on with no policies by design.';

alter table public.waitlist enable row level security;

-- Belt and braces: even if a policy is added by accident later, the grants are not there.
revoke all on public.waitlist from anon, authenticated;

create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

-- PostgREST caches the schema; a table created by hand in the SQL editor may not appear on the
-- REST API until this runs. If GET /rest/v1/waitlist 404s with PGRST205 right after creating it,
-- this is the fix rather than re-running the migration.
notify pgrst, 'reload schema';
