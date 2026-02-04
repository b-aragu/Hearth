-- Add last_active_at to profiles table to track online status
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT now();

-- Update RLS policies to allow updating own lasts_active_at
CREATE POLICY "Users can update their own last_active_at" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);
