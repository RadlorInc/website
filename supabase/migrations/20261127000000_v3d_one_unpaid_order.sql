-- 3Dlor: at most ONE unpaid order per customer, enforced by the database (27 Nov 2026).
--
-- Why: /api/3dlor/order checks "has an open order?" and then inserts. Two requests at the same moment both pass the
-- check. A local sandbox test sent 30 at once for one new customer and got 8 unpaid orders; a fast double-click can do
-- the same. With this index the second insert fails (PostgREST 409) and the route sends the customer to the account
-- page. Paid and refunded orders are not limited: a customer can still start a new order after paying.
--
-- ⚠️ Do not `supabase db push` from this repo (see handoff.md). Apply this file by hand, after the other v3d files.
-- ⚠️ BEFORE applying, check production for customers who already have two unpaid orders, or the index is not created:
--     select user_id, count(*) from public.v3d_orders where payment_status = 'unpaid' group by user_id having count(*) > 1;
--   For each user, keep the order with a stripe_session_id or files (or the newest) and delete the empty duplicates.
-- Backward compatible: code without the 409 handling still works; a duplicate insert only shows "could not save".

create unique index if not exists v3d_orders_one_unpaid_per_user
  on public.v3d_orders (user_id)
  where payment_status = 'unpaid';
