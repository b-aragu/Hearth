-- 1. PROFILES Table
-- Holds public user data (linked to auth.users)
create table profiles (
  id uuid references auth.users not null primary key,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- 2. COUPLES Table
-- Links two users together and stores shared pet data
create table couples (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  invite_code text unique not null, -- Simple 6-char code for pairing
  partner1_id uuid references profiles(id) not null,
  partner2_id uuid references profiles(id), -- Nullable until partner joins
  creature_type text not null, -- 'bear', 'fox', etc.
  creature_name text,
  start_date date default CURRENT_DATE
);

-- Enable RLS
alter table couples enable row level security;

-- Policies for Couples
create policy "Couples are viewable by partners." on couples
  for select using (auth.uid() = partner1_id or auth.uid() = partner2_id);

create policy "Users can create a couple (as partner1)." on couples
  for insert with check (auth.uid() = partner1_id);

create policy "Partners can join (update) a couple." on couples
  for update using (auth.uid() = partner1_id or partner2_id is null); 
  -- Note: This is a simplified policy for the MVP.

-- 3. AUTOMATIC PROFILE CREATION (Trigger)
-- Automatically creates a row in public.profiles when a user signs up via auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
