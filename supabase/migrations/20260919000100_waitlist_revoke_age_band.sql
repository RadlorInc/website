-- STEP 2 OF 2 — apply ONLY AFTER the site that sends `grade` is live on radlor.com.
-- (See 20260919000000_waitlist_grade.sql for why the order matters: the older code sends
-- `age_band` in every insert, so running this before the deploy refuses every signup.)
--
-- After this, anon may INSERT exactly (email, grade, source) — `npm run check:waitlist-rls` asserts
-- that, including that an insert naming `age_band` is REFUSED.

revoke insert (age_band) on public.waitlist from anon;

comment on table public.waitlist is
  'Waitlist signups from radlor.com. RLS on. anon may INSERT (email, grade, source) and nothing '
  'else - no SELECT, ever. See migrations 20260901071510 and 20260919000000/000100.';

notify pgrst, 'reload schema';
