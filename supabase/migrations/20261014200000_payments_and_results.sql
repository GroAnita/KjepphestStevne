-- Competition-wide settings (one row): entry fee and the club's Vipps number.
create table public.settings (
  id boolean primary key default true check (id),
  entry_fee_nok integer not null default 100 check (entry_fee_nok >= 0),
  vipps_number text
);
insert into public.settings default values;

alter table public.settings enable row level security;
revoke all on public.settings from anon;
grant select, update on public.settings to authenticated;

create policy "Logged-in users can read settings"
  on public.settings for select to authenticated using (true);

create policy "Admins update settings"
  on public.settings for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Payment status on entries:
--   not paid → payment_reported_at set by the user ("Jeg har betalt")
--   → paid_at set by an admin after checking Vipps.
alter table public.entries
  add column fee_nok integer not null default 0,
  add column payment_reported_at timestamptz,
  add column paid_at timestamptz,
  -- Lets the admin pages show who registered an entry.
  add constraint entries_user_profile_fkey
    foreign key (user_id) references public.profiles (id) on delete cascade;

-- Existing entries count as paid.
update public.entries set paid_at = created_at where paid_at is null;

-- New entries get today's fee. Entries an admin makes (for example on the
-- day of the event) count as paid straight away.
create function public.prepare_entry()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.fee_nok := (select entry_fee_nok from public.settings);
  new.payment_reported_at := null;
  new.paid_at := case when public.is_admin() then now() end;
  return new;
end;
$$;

create trigger before_entry_insert
  before insert on public.entries
  for each row execute function public.prepare_entry();

-- Users can withdraw their own entries only until they are paid.
drop policy "Withdraw own entries, admins remove any" on public.entries;
create policy "Withdraw own unpaid entries, admins remove any"
  on public.entries for delete to authenticated
  using (
    (user_id = (select auth.uid()) and paid_at is null)
    or (select public.is_admin())
  );

-- "Jeg har betalt": marks the user's own unpaid entries as reported.
create function public.report_payment(entry_ids uuid[])
returns void
language sql
security definer
set search_path = ''
as $$
  update public.entries
  set payment_reported_at = now()
  where id = any (entry_ids)
    and user_id = (select auth.uid())
    and paid_at is null;
$$;

revoke execute on function public.report_payment(uuid[]) from public, anon;
grant execute on function public.report_payment(uuid[]) to authenticated;

-- Start lists and results for everyone logged in: only paid entries, and
-- only rider name, hobby horse and results (no ages, accounts or comments).
create function public.class_overview()
returns table (
  entry_id uuid,
  class_id uuid,
  rider_name text,
  horse_name text,
  jumping_faults smallint[],
  jumping_time numeric,
  dressage_scores smallint[],
  dressage_errors boolean[],
  dressage_collective smallint[],
  dressage_time numeric
)
language sql
stable
security definer
set search_path = ''
as $$
  select e.id, e.class_id, e.rider_name, e.horse_name,
         j.faults, j.time_seconds,
         d.scores, d.errors, d.collective, d.time_seconds
  from public.entries e
  left join public.jumping_results j on j.entry_id = e.id
  left join public.dressage_results d on d.entry_id = e.id
  where e.paid_at is not null
    and (select auth.uid()) is not null
  order by e.created_at;
$$;

revoke execute on function public.class_overview() from public, anon;
grant execute on function public.class_overview() to authenticated;
