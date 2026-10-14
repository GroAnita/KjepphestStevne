-- Dressage program settings. Exercises follow NRYF's kjepphest score sheets:
-- every exercise and every general impression mark is scored 0–10 and
-- multiplied by its coefficient.
alter table public.classes
  add column program_name text,
  add column ideal_time_seconds numeric(6, 1) check (ideal_time_seconds > 0),
  add column program_url text,
  add column drawing_url text,
  -- [{ "point": "AC · X", "text": "Innridning i trav · Holdt", "coefficient"?: 2 }]
  add column exercises jsonb not null default '[]',
  -- General impression ("Allment inntrykk") marks.
  add column collective_marks jsonb not null default '[
    {"name": "Presisjon", "text": "Presisjon ved gjennomridning av programmet", "coefficient": 2},
    {"name": "Gangarter", "text": "Visning av korrekte «gangarter»", "coefficient": 2},
    {"name": "Helhetsinntrykk", "text": "Påkledning og kjepphestens kreative uttrykk", "coefficient": 2}
  ]';

insert into public.classes
  (discipline, name, program_name, min_age, max_age, ranked, sort_order,
   ideal_time_seconds, program_url, drawing_url, exercises)
values
  ('dressage', 'LC', 'Kjepphest LC1', 4, 7, false, 1, 140,
   '/programs/kjepphest-lc1.pdf', '/programs/tegning-lc1.pdf',
   '[{"point":"AC · X · (C)","text":"Innridning i trav · Holdt-urørlig-hilsning"},{"point":"(C)M · M-X-K · K-A","text":"Arbeidstrav · Arbeidstrav · Arbeidstrav"},{"point":"A","text":"Volte, 8 m i diameter"},{"point":"Ca. ved A","text":"Arbeidsgalopp til venstre"},{"point":"A","text":"Volte, 8 m i diameter"},{"point":"Mellom A og F · (F) BM (C) · Mellom M og C","text":"Arbeidstrav · Arbeidstrav · Skritt"},{"point":"C","text":"Volte, 8 m i diameter"},{"point":"Mellom C og H · HXF · FA","text":"Arbeidstrav · Arbeidstrav · Arbeidstrav"},{"point":"A","text":"Volte, 8 m i diameter"},{"point":"Ca. ved A","text":"Arbeidsgalopp til høyre"},{"point":"A","text":"Volte, 8 m i diameter"},{"point":"Ca. ved A · (A)C","text":"Arbeidstrav · Serpentin 2 buer"},{"point":"CHEKA · Ved A","text":"Arbeidstrav · Ved opp midtlinjen"},{"point":"X","text":"Holdt-hilsning · Utridning i skritt"}]'),
  ('dressage', 'MB', 'Kjepphest MB:0', 8, 12, false, 2, 145,
   '/programs/kjepphest-mb0.pdf', '/programs/tegning-mb0.pdf',
   '[{"point":"A · X · (C)","text":"Innridning i trav · Holdt-hilsen-arbeidstrav · Høyre volte"},{"point":"(C)M · M-X-K · K-A-F-B","text":"Arbeidstrav · Økt trav · Arbeidstrav"},{"point":"B","text":"Volte, 4 m i diameter"},{"point":"B-C skrått mot midtlinjen","text":"Travers til venstre"},{"point":"C","text":"Venstre volte"},{"point":"HXF · F-A-K-E","text":"Arbeidstrav · Økt trav"},{"point":"E","text":"Volte, 4 m i diameter"},{"point":"E-C skrått mot midtlinjen","text":"Travers til høyre"},{"point":"C","text":"Høyre volte · Overgang til skritt"},{"point":"M-X-K-A","text":"Skritt"},{"point":"Mellom A og F · Mellom A og K","text":"½ piruett til venstre · ½ piruett til høyre"},{"point":"Ved A","text":"Galoppfatning til venstre"},{"point":"F-B-M","text":"Økt galopp"},{"point":"M-C-H-E","text":"Arbeidsgalopp"},{"point":"Ved E · Ca. ved X · Ved B","text":"Venstre om · Changement · Høyre volte"},{"point":"B-F-A-K","text":"Arbeidsgalopp"},{"point":"K-E-H","text":"Økt galopp"},{"point":"H-C-M-B","text":"Arbeidsgalopp"},{"point":"Ved B · Ca. ved X · Ved E","text":"Høyre om · Changement · Venstre volte"},{"point":"E-K-A","text":"Arbeidsgalopp"},{"point":"A","text":"Vend opp midtlinjen"},{"point":"X","text":"Holdt-hilsning · Utridning i skritt"}]'),
  ('dressage', 'Grand Prix', 'Kjepphest Grand Prix', 13, 16, true, 3, 130,
   '/programs/kjepphest-grand-prix.pdf', '/programs/tegning-grand-prix.pdf',
   '[{"point":"A · X · (C)","text":"Innridning i arbeidstrav · Holdt-hilsen-arbeidstrav · Venstre volte"},{"point":"(C)H · H-X-F · F-A-K","text":"Arbeidstrav · Økt trav · Arbeidstrav"},{"point":"K-B","text":"Travers til høyre"},{"point":"B-H","text":"Travers til venstre"},{"point":"C","text":"Holdt-stå stille · Rygg 5 skritt – ri frem i arbeidstrav"},{"point":"M-X-K","text":"Økt trav"},{"point":"Mellom K og A","text":"Passage"},{"point":"Ca. ved A","text":"12–15 piaffesteg"},{"point":"Mellom A og F · Ved F","text":"Passage · Overgang til skritt"},{"point":"F-X-H","text":"Skritt"},{"point":"H · (H)-C-M","text":"Overgang til arbeidstrav · Arbeidstrav"},{"point":"M-X-K","text":"Økt trav"},{"point":"Ved K","text":"Venstre galoppfatning"},{"point":"K-A-F","text":"Arbeidsgalopp"},{"point":"F-X-H · (H)-C-M","text":"Changementer for hvert 2. galoppsteg · Arbeidsgalopp"},{"point":"M-X-K · (K)-A-F","text":"Økt galopp · Arbeidsgalopp"},{"point":"F-X-H","text":"Changementer for hvert galoppsteg"},{"point":"(H)-C · C-(X)-A","text":"Arbeidsgalopp · Serpentiner med 2 buer i changement ved X"},{"point":"A · Litt før X","text":"Ved opp midtlinjen · Galopp-piruett til venstre"},{"point":"Ved X","text":"Changement"},{"point":"Litt etter X","text":"Galopp-piruett til høyre"},{"point":"G","text":"Holdt-hilsning · Utridning i skritt"}]');

-- Dressage result for one entry: marks per exercise and general impression,
-- whether the rider went off course in each exercise, time and comment.
create table public.dressage_results (
  entry_id uuid primary key references public.entries (id) on delete cascade,
  scores smallint[] not null default '{}'
    check (cardinality(scores) <= 40 and 0 <= all (scores) and 10 >= all (scores)),
  errors boolean[] not null default '{}',
  collective smallint[] not null default '{}'
    check (cardinality(collective) <= 10 and 0 <= all (collective) and 10 >= all (collective)),
  time_seconds numeric(6, 2) check (time_seconds > 0),
  comment text check (length(comment) <= 2000),
  updated_at timestamptz not null default now(),
  check (cardinality(errors) = cardinality(scores))
);

alter table public.dressage_results enable row level security;
revoke all on public.dressage_results from anon;
grant select, insert, update, delete on public.dressage_results to authenticated;

create policy "See own results, admins see all"
  on public.dressage_results for select to authenticated
  using (
    (select public.is_admin())
    or exists (
      select 1 from public.entries e
      where e.id = entry_id and e.user_id = (select auth.uid())
    )
  );

create policy "Admins record results"
  on public.dressage_results for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
