-- Competition classes, e.g. "Sprang 40 cm" for ages 8–12.
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  discipline text not null check (discipline in ('jumping', 'dressage')),
  name text not null,
  min_age smallint not null,
  max_age smallint not null,
  -- Ranked classes get a winner (fewest faults, then fastest time).
  ranked boolean not null default false,
  sort_order smallint not null default 0,
  check (min_age <= max_age)
);

alter table public.classes enable row level security;
revoke all on public.classes from anon;
grant select, insert, update, delete on public.classes to authenticated;

create policy "Logged-in users can see classes"
  on public.classes for select to authenticated using (true);

create policy "Admins manage classes"
  on public.classes for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

insert into public.classes (discipline, name, min_age, max_age, ranked, sort_order) values
  ('jumping', '20 cm', 4, 7, false, 1),
  ('jumping', '40 cm', 8, 12, false, 2),
  ('jumping', '60 cm', 13, 16, true, 3);

-- A rider and their hobby horse entered in one class.
-- user_id is the account that registered them (often a parent).
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  rider_name text not null check (length(trim(rider_name)) > 0),
  rider_age smallint not null,
  horse_name text not null check (length(trim(horse_name)) > 0),
  created_at timestamptz not null default now()
);

create index entries_class_id_idx on public.entries (class_id);
create index entries_user_id_idx on public.entries (user_id);

alter table public.entries enable row level security;
revoke all on public.entries from anon;
grant select, insert, update, delete on public.entries to authenticated;

create policy "See own entries, admins see all"
  on public.entries for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

-- Anyone logged in can enter riders, but only in the class that fits the age.
create policy "Enter riders in the right class"
  on public.entries for insert to authenticated
  with check (
    (user_id = (select auth.uid()) or (select public.is_admin()))
    and exists (
      select 1 from public.classes c
      where c.id = class_id and rider_age between c.min_age and c.max_age
    )
  );

create policy "Admins update entries"
  on public.entries for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Withdraw own entries, admins remove any"
  on public.entries for delete to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

-- Jumping result for one entry: fault points per obstacle (up to 9) and time.
create table public.jumping_results (
  entry_id uuid primary key references public.entries (id) on delete cascade,
  faults smallint[] not null default '{}'
    check (cardinality(faults) <= 9 and 0 <= all (faults)),
  time_seconds numeric(6, 2) check (time_seconds > 0),
  updated_at timestamptz not null default now()
);

alter table public.jumping_results enable row level security;
revoke all on public.jumping_results from anon;
grant select, insert, update, delete on public.jumping_results to authenticated;

create policy "See own results, admins see all"
  on public.jumping_results for select to authenticated
  using (
    (select public.is_admin())
    or exists (
      select 1 from public.entries e
      where e.id = entry_id and e.user_id = (select auth.uid())
    )
  );

create policy "Admins record results"
  on public.jumping_results for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
