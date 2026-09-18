-- The waitlist asks for a GRADE (3–8) instead of an age band — the app teaches by grade since
-- 2026-09-13 (RadlorInc/learn). STEP 1 OF 2, and it is ADDITIVE ON PURPOSE.
--
-- ⚠️ ORDER: apply THIS, then deploy the site, then apply `20260919000100_waitlist_revoke_age_band.sql`.
--   · This before the deploy: the new `/api/waitlist` sends `grade`; without the column every
--     signup is refused (PGRST204) and lands on /waitlist/problem.
--   · The revoke AFTER the deploy: the code live until then sends `age_band` in every insert
--     (null when not picked, and PostgREST still names the column), so revoking first would
--     refuse EVERY signup until the new code is up.
--
-- `age_band` is NOT dropped: it holds what people told us before this change, and data-and-safety
-- says we still have it. Its CHECK stays as it was.
--
-- Applied by hand in the Supabase SQL editor (never `supabase db push` from this repo — see
-- handoff.md). Verify from outside with `npm run check:waitlist-rls`, which inserts a `grade` as anon.

alter table public.waitlist add column if not exists grade smallint;

alter table public.waitlist drop constraint if exists waitlist_grade_known;
alter table public.waitlist add constraint waitlist_grade_known
  check (grade is null or grade between 3 and 8);

-- Column-scoped, like the grant it sits beside in 20260901071510. Never a table-wide grant.
grant insert (grade) on public.waitlist to anon;

comment on column public.waitlist.grade is
  'Optional. The child''s grade, 3-8, from the radlor.com form since 2026-09-19. Null = did not say.';
comment on column public.waitlist.age_band is
  'Optional. The age band the form asked for until 2026-09-19. No longer written by radlor.com.';

notify pgrst, 'reload schema';
