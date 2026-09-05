-- Takes `service_role` out of radlor.com's public waitlist endpoint.
--
-- ⚠️ RECOVERED FROM PRODUCTION, NOT WRITTEN FRESH. This migration ran against the live project on
-- 2026-09-01 and its file existed in NO repository — it was applied directly and never committed,
-- so for four days the only copy of the fix was the `supabase_migrations.schema_migrations` row in
-- the database it had already changed. The text below is that row, verbatim. If it had been lost,
-- a rebuilt environment would have come back with the previous migration's "add no policies"
-- instruction intact and the signup form broken.
--
-- ⚠️ WHAT THIS IS FIXING. `/api/waitlist` is a PUBLIC, unauthenticated endpoint accepting free
-- input, and it held the project's `service_role` key — which is scoped to the PROJECT and bypasses
-- RLS. Anything that compromised that route read and wrote every table in the database. It is now
-- the anon key plus the narrowest possible write, so a compromise writes a junk row instead.
--
-- ⚠️ COLUMN-LEVEL INSERT ONLY. Not `grant insert on public.waitlist` — the three columns the form
-- actually sends. No SELECT, no UPDATE, no DELETE, so the role cannot read back what it wrote,
-- cannot edit an existing signup, and cannot remove one. `id` and `created_at` are deliberately
-- absent: they are defaulted by the table, so anon has no say in either.
grant insert (email, age_band, source) on public.waitlist to anon;

-- RLS stays ON. This is the only policy, and it only permits the INSERT the grant already scoped.
-- The row's shape is still enforced by the table's own CHECK constraints (email shape, age_band
-- whitelist) rather than by trusting the caller.
create policy waitlist_anon_insert on public.waitlist
  for insert to anon with check (true);

-- ⚠️ AND THE TRADE, WRITTEN DOWN RATHER THAN DISCOVERED LATER. The anon key is designed to be
-- public, so in principle anyone holding it can POST this table directly and bypass the route's
-- per-IP rate limit — the same shape as `diagnostic_leads` in the Milo repo (launch-plan finding
-- #9). Three things bound it here: this project publishes the anon key NOWHERE (neither radlor-site
-- nor the review tool ships a NEXT_PUBLIC_ Supabase variable, so it is not in any bundle), the
-- unique index on `email` makes repeat submissions harmless, and the row can never be read back.
-- The exposure traded away — a public endpoint holding a key that reads every table — is far
-- larger than the one taken on.
--
-- `npm run check:waitlist-rls` asserts this exact posture against the live database: it tries each
-- operation with the anon key, and it also tries an INSERT that names `id` and one that names
-- `created_at` — the only probes that can tell this column-scoped grant apart from a table-wide
-- one, since every other observable behaviour is identical.

notify pgrst, 'reload schema';
