-- Production Sync Features Migration
-- Run this in Supabase SQL Editor after the main schema

-- ============================================================================
-- MESSAGES TABLE (Real-time messaging between partners)
-- ============================================================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'emoji', 'love_tap'
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view their messages" ON messages
  FOR SELECT USING (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
  );

CREATE POLICY "Partners can send messages" ON messages
  FOR INSERT WITH CHECK (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
    AND sender_id = auth.uid()
  );

CREATE POLICY "Partners can update (mark read) messages" ON messages
  FOR UPDATE USING (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
  );

-- Index for fast message loading
CREATE INDEX IF NOT EXISTS idx_messages_couple_created ON messages(couple_id, created_at DESC);

-- ============================================================================
-- SURPRISES TABLE (Virtual gifts between partners)
-- ============================================================================

CREATE TABLE IF NOT EXISTS surprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  surprise_type TEXT NOT NULL, -- 'heart_burst', 'sparkle_shower', 'cozy_hug', etc.
  message TEXT,
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for surprises
ALTER TABLE surprises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view their surprises" ON surprises
  FOR SELECT USING (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
  );

CREATE POLICY "Partners can send surprises" ON surprises
  FOR INSERT WITH CHECK (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
    AND sender_id = auth.uid()
  );

CREATE POLICY "Partners can update (open) surprises" ON surprises
  FOR UPDATE USING (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
  );

-- Index for surprises
CREATE INDEX IF NOT EXISTS idx_surprises_couple_created ON surprises(couple_id, created_at DESC);

-- ============================================================================
-- ENHANCE PROFILES TABLE
-- ============================================================================

DO $$ 
BEGIN
  -- push_token for notifications
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'push_token'
  ) THEN
    ALTER TABLE profiles ADD COLUMN push_token TEXT;
  END IF;

  -- last_active_at for online presence
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'last_active_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_active_at TIMESTAMPTZ;
  END IF;
END $$;

-- ============================================================================
-- ENABLE REALTIME FOR NEW TABLES
-- ============================================================================

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable realtime for surprises
ALTER PUBLICATION supabase_realtime ADD TABLE surprises;

-- Enable realtime for daily_rituals (if not already)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE daily_rituals;
EXCEPTION WHEN OTHERS THEN
  -- Table might already be in publication
  NULL;
END $$;

-- ============================================================================
-- DAILY RITUALS IMPROVEMENTS
-- ============================================================================

-- Add notification tracking columns
DO $$ 
BEGIN
  -- Track if partner1 was notified
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'daily_rituals' AND column_name = 'partner1_notified'
  ) THEN
    ALTER TABLE daily_rituals ADD COLUMN partner1_notified BOOLEAN DEFAULT FALSE;
  END IF;

  -- Track if partner2 was notified
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'daily_rituals' AND column_name = 'partner2_notified'
  ) THEN
    ALTER TABLE daily_rituals ADD COLUMN partner2_notified BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Function to get or create today's ritual
CREATE OR REPLACE FUNCTION get_or_create_daily_ritual(
  p_couple_id UUID,
  p_prompt TEXT
)
RETURNS UUID AS $$
DECLARE
  v_ritual_id UUID;
BEGIN
  -- Try to get existing ritual for today
  SELECT id INTO v_ritual_id
  FROM daily_rituals
  WHERE couple_id = p_couple_id 
    AND date = CURRENT_DATE 
    AND ritual_type = 'daily_question';
  
  -- If not found, create it
  IF v_ritual_id IS NULL THEN
    INSERT INTO daily_rituals (couple_id, date, ritual_type, prompt)
    VALUES (p_couple_id, CURRENT_DATE, 'daily_question', p_prompt)
    RETURNING id INTO v_ritual_id;
  END IF;
  
  RETURN v_ritual_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles(last_active_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_rituals_today ON daily_rituals(couple_id, date);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE messages IS 'Real-time messages between partners';
COMMENT ON TABLE surprises IS 'Virtual gifts/surprises sent between partners';
COMMENT ON COLUMN profiles.push_token IS 'Expo push notification token';
COMMENT ON COLUMN profiles.last_active_at IS 'Last time user was active (for online status)';
