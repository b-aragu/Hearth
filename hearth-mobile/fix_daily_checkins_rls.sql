-- Ensure daily_checkins table exists
create table if not exists daily_checkins (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references couples(id) not null,
  user_id uuid references profiles(id) not null,
  checkin_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, checkin_date)
);

-- Enable RLS
alter table daily_checkins enable row level security;

-- Drop existing policies to prevent conflicts/duplicates
drop policy if exists "Users can insert their own checkins" on daily_checkins;
drop policy if exists "Users can view checkins for their couple" on daily_checkins;
drop policy if exists "Users can update their own checkins" on daily_checkins;

-- INSERT Policy: Users can only check in for themselves
create policy "Users can insert their own checkins" on daily_checkins
  for insert with check (auth.uid() = user_id);

-- UPDATE Policy: Users can update their own checkins
create policy "Users can update their own checkins" on daily_checkins
  for update using (auth.uid() = user_id);

-- SELECT Policy: Users can view checkins if they belong to the couple
create policy "Users can view checkins for their couple" on daily_checkins
  for select using (
    couple_id in (
      select id from couples 
      where partner1_id = auth.uid() or partner2_id = auth.uid()
    )
  );
