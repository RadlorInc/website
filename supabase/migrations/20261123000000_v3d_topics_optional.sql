-- 3Dlor: the sign-up form no longer asks for the video topics (founder, 23 Nov 2026). We read the
-- customer's manual and send the list of videos instead. The column stays for old rows; new rows leave it empty.
-- The CHECK (char_length between 1 and 5000) still holds for any value that is set: a NULL passes a CHECK.
-- Backward compatible: code that still sends topics keeps working, so apply this BEFORE the new code deploys.
alter table public.v3d_orders alter column topics drop not null;
