-- 1. Memories Table: For storing shared moments
create table if not exists public.memories (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references public.couples not null,
  title text,
  description text,
  image_url text,
  memory_date date default now(),
  type text default 'journal', -- 'journal', 'milestone', 'auto'
  created_at timestamptz default now()
);

-- Enable RLS for Memories
alter table public.memories enable row level security;

create policy "Couples can view own memories"
  on memories for select
  using ( auth.uid() in (
    select partner1_id from couples where id = couple_id
    union
    select partner2_id from couples where id = couple_id
  ));

create policy "Couples can insert own memories"
  on memories for insert
  with check ( auth.uid() in (
    select partner1_id from couples where id = couple_id
    union
    select partner2_id from couples where id = couple_id
  ));

-- 2. Daily Check-ins: For tracking streaks across both partners
create table if not exists public.daily_checkins (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references public.couples not null,
  user_id uuid references auth.users not null,
  checkin_date date default now(),
  created_at timestamptz default now(),
  unique(user_id, checkin_date) -- One checkin per user per day
);

-- Enable RLS for Checkins
alter table public.daily_checkins enable row level security;

create policy "Couples can view checkins"
  on daily_checkins for select
  using ( auth.uid() in (
    select partner1_id from couples where id = couple_id
    union
    select partner2_id from couples where id = couple_id
  ));

create policy "Users can insert own checkin"
  on daily_checkins for insert
  with check ( auth.uid() = user_id );

-- 3. Add 'matched_at' to Couples if missing (to track Days Together start)
alter table public.couples 
add column if not exists matched_at timestamptz default now();

-- Update existing couples to have a matched_at if null
update public.couples 
set matched_at = created_at 
where matched_at is null;
