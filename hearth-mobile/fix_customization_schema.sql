-- Fix missing columns in couples table for customization features

DO $$ 
BEGIN 
  -- 1. Add room_id if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'couples' AND column_name = 'room_id') THEN
    ALTER TABLE couples ADD COLUMN room_id TEXT DEFAULT 'cozy';
  END IF;

  -- 2. Add accessories if it doesn't exist (Array of strings)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'couples' AND column_name = 'accessories') THEN
    ALTER TABLE couples ADD COLUMN accessories TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;

  -- 3. Add accessory_colors if it doesn't exist (JSONB for key-value pairs)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'couples' AND column_name = 'accessory_colors') THEN
    ALTER TABLE couples ADD COLUMN accessory_colors JSONB DEFAULT '{}'::jsonb;
  END IF;

END $$;
