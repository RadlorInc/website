-- RLS check for the help tables. Run on a throwaway local database only: scripts/test-help-rls.sh
-- Every failed expectation raises, so psql -v ON_ERROR_STOP=1 exits non-zero.
\set ON_ERROR_STOP 1
begin;
insert into public.v3d_help_products (id, brand_slug, product_slug, brand_name, product_name, published) values
  ('00000000-0000-0000-0000-00000000000a', 'acme', 'pub', 'Acme', 'Published', true),
  ('00000000-0000-0000-0000-00000000000b', 'acme', 'draft', 'Acme', 'Draft', false);
insert into public.v3d_help_videos (id, product_id, title, model_id, script, duration_s) values
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-00000000000a', 'V pub', 'washer', '{"steps":[]}', 10),
  ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-00000000000b', 'V draft', 'secret', '{"steps":[]}', 10);
insert into public.v3d_help_parts (video_id, title, start_s, end_s) values
  ('00000000-0000-0000-0000-0000000000a1', 'P pub', 0, 5),
  ('00000000-0000-0000-0000-0000000000b1', 'P draft', 0, 5);

set local role anon;
do $$ begin
  if (select count(*) from public.v3d_help_products) <> 1 then raise exception 'anon sees a draft product'; end if;
  if (select count(*) from public.v3d_help_videos) <> 1 then raise exception 'anon sees a draft video'; end if;
  if (select count(*) from public.v3d_help_parts) <> 1 then raise exception 'anon sees a draft part'; end if;
  if exists (select 1 from public.v3d_help_videos where model_id = 'secret') then raise exception 'draft model id leaks'; end if;
end $$;
do $$ begin
  begin insert into public.v3d_help_products (brand_slug, product_slug, brand_name, product_name) values ('x','y','x','y');
    raise exception 'anon INSERT worked'; exception when insufficient_privilege then null; end;
  begin update public.v3d_help_products set published = true;
    raise exception 'anon UPDATE worked'; exception when insufficient_privilege then null; end;
  begin delete from public.v3d_help_parts;
    raise exception 'anon DELETE worked'; exception when insufficient_privilege then null; end;
end $$;
reset role;

set local role authenticated;
do $$ begin
  begin perform 1 from public.v3d_help_products;
    raise exception 'authenticated can read'; exception when insufficient_privilege then null; end;
end $$;
reset role;

-- table checks are the second layer behind the upload script
do $$ begin
  begin insert into public.v3d_help_parts (video_id, title, start_s, end_s) values ('00000000-0000-0000-0000-0000000000a1', 'bad', 5, 5);
    raise exception 'end_s = start_s accepted'; exception when check_violation then null; end;
  begin insert into public.v3d_help_products (brand_slug, product_slug, brand_name, product_name) values ('../x','y','x','y');
    raise exception 'bad slug accepted'; exception when check_violation then null; end;
  begin insert into public.v3d_help_videos (product_id, title, model_id, script, duration_s) values ('00000000-0000-0000-0000-00000000000a', 't', '../core', '{"steps":[]}', 1);
    raise exception 'bad model id accepted'; exception when check_violation then null; end;
end $$;
rollback;
\echo 'v3d_help RLS: all checks passed'
