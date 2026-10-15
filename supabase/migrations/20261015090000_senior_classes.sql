-- Senior classes for adults (17–80 years). Adults choose height/program
-- themselves, so these overlap in age. Ranking follows the junior classes:
-- only the 60 cm and Grand Prix classes get a winner.
insert into public.classes
  (discipline, name, min_age, max_age, ranked, sort_order)
values
  ('jumping', 'Senior 20 cm', 17, 80, false, 4),
  ('jumping', 'Senior 40 cm', 17, 80, false, 5),
  ('jumping', 'Senior 60 cm', 17, 80, true, 6);

-- Senior dressage rides the same programs as the junior classes.
insert into public.classes
  (discipline, name, min_age, max_age, ranked, sort_order, program_name,
   ideal_time_seconds, program_url, drawing_url, exercises, collective_marks)
select 'dressage', 'Senior ' || name, 17, 80, ranked, sort_order + 3,
       program_name, ideal_time_seconds, program_url, drawing_url,
       exercises, collective_marks
from public.classes
where discipline = 'dressage' and max_age < 17;
