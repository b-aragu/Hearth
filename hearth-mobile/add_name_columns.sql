-- Add columns for storing each partner's proposed creature name
alter table public.couples 
add column if not exists p1_name_choice text,
add column if not exists p2_name_choice text;

-- Ensure creature_name exists (it should, but just in case)
alter table public.couples 
add column if not exists creature_name text;
