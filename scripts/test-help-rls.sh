#!/bin/sh
# Applies the 3Dlor migrations to a THROWAWAY local Supabase Postgres in Docker and runs the help-page RLS checks.
# It never touches a real project. Needs Docker. Run: npm run test:help-rls
set -e
cd "$(dirname "$0")/.."
NAME=v3dhelp-rls-$$
docker run -d --rm --name "$NAME" -e POSTGRES_PASSWORD=pw public.ecr.aws/supabase/postgres:17.6.1.165 >/dev/null
trap 'docker rm -f "$NAME" >/dev/null 2>&1' EXIT
i=0; until docker exec "$NAME" psql -U supabase_admin -d postgres -tAc 'select 1' >/dev/null 2>&1; do i=$((i+1)); [ $i -gt 60 ] && exit 1; sleep 1; done
sleep 2
q() { docker exec -i "$NAME" psql -q -v ON_ERROR_STOP=1 -U supabase_admin -d postgres "$@"; }
# the storage service makes this table in a real project; a stub is enough here
echo "create schema if not exists storage; create table if not exists storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);" | q
for f in supabase/migrations/20261122000000_v3d_orders.sql supabase/migrations/20261123000000_v3d_topics_optional.sql supabase/migrations/20261124000000_v3d_help.sql; do q < "$f"; done
q < supabase/tests/v3d_help_rls.sql
