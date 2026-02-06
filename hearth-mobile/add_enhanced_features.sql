-- Enhanced Features Schema for Hearth Mobile
-- Run this after the main supabase_schema.sql

-- ============================================================================
-- DECORATIONS & CUSTOMIZATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS decorations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'accessory', 'room_item', 'background'
  item_id TEXT NOT NULL, -- e.g., 'hat_party', 'plant_monstera', 'bg_sunset'
  position JSONB, -- {x: number, y: number} for room items
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for decorations
ALTER TABLE decorations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couples can view their decorations" ON decorations
  FOR SELECT USING (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
  );

CREATE POLICY "Couples can add decorations" ON decorations
  FOR INSERT WITH CHECK (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
  );

CREATE POLICY "Couples can update their decorations" ON decorations
  FOR UPDATE USING (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
  );

CREATE POLICY "Couples can delete their decorations" ON decorations
  FOR DELETE USING (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
  );

-- ============================================================================
-- DAILY RITUALS & CHALLENGES
-- ============================================================================

CREATE TABLE IF NOT EXISTS daily_rituals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  ritual_type TEXT NOT NULL, -- 'morning_message', 'daily_question', 'compliment', 'date_idea'
  prompt TEXT, -- The question or prompt text
  partner1_response JSONB, -- {text: string, timestamp: string, user_id: string}
  partner2_response JSONB,
  completed_at TIMESTAMPTZ, -- When both partners responded
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(couple_id, date, ritual_type)
);

-- RLS for daily rituals
ALTER TABLE daily_rituals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couples can view their rituals" ON daily_rituals
  FOR SELECT USING (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
  );

CREATE POLICY "Couples can create rituals" ON daily_rituals
  FOR INSERT WITH CHECK (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
  );

CREATE POLICY "Couples can update their rituals" ON daily_rituals
  FOR UPDATE USING (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
  );

-- ============================================================================
-- SHARED PHOTOS & RICH MEMORIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS shared_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES profiles(id) NOT NULL,
  photo_url TEXT NOT NULL, -- Supabase Storage URL
  caption TEXT,
  tags TEXT[], -- ['date', 'food', 'travel']
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for shared photos
ALTER TABLE shared_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couples can view their photos" ON shared_photos
  FOR SELECT USING (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
  );

CREATE POLICY "Couples can upload photos" ON shared_photos
  FOR INSERT WITH CHECK (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
    AND uploaded_by = auth.uid()
  );

CREATE POLICY "Couples can update their photos" ON shared_photos
  FOR UPDATE USING (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
  );

CREATE POLICY "Couples can delete their photos" ON shared_photos
  FOR DELETE USING (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
  );

-- ============================================================================
-- RELATIONSHIP INSIGHTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
  insight_type TEXT NOT NULL, -- 'weekly_summary', 'milestone', 'streak_achievement'
  title TEXT NOT NULL,
  description TEXT,
  data JSONB, -- {charts: [], stats: {}, messages: []}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for insights
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couples can view their insights" ON insights
  FOR SELECT USING (
    couple_id IN (
      SELECT id FROM couples WHERE auth.uid() = partner1_id OR auth.uid() = partner2_id
    )
  );

-- Only system/functions create insights (no INSERT policy for users)

-- ============================================================================
-- ENHANCE EXISTING TABLES
-- ============================================================================

-- Add columns to couples table if they don't exist
DO $$ 
BEGIN
  -- creature_mood
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'couples' AND column_name = 'creature_mood'
  ) THEN
    ALTER TABLE couples ADD COLUMN creature_mood TEXT DEFAULT 'happy';
  END IF;

  -- room_theme
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'couples' AND column_name = 'room_theme'
  ) THEN
    ALTER TABLE couples ADD COLUMN room_theme TEXT DEFAULT 'cozy';
  END IF;

  -- decoration_data
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'couples' AND column_name = 'decoration_data'
  ) THEN
    ALTER TABLE couples ADD COLUMN decoration_data JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Add columns to memories table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'memories') THEN
    
    -- photo_urls
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'memories' AND column_name = 'photo_urls'
    ) THEN
      ALTER TABLE memories ADD COLUMN photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;

    -- mood
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'memories' AND column_name = 'mood'
    ) THEN
      ALTER TABLE memories ADD COLUMN mood TEXT;
    END IF;

    -- reactions
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'memories' AND column_name = 'reactions'
    ) THEN
      ALTER TABLE memories ADD COLUMN reactions JSONB DEFAULT '{}'::jsonb;
    END IF;

  END IF;
END $$;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_decorations_couple_id ON decorations(couple_id);
CREATE INDEX IF NOT EXISTS idx_daily_rituals_couple_date ON daily_rituals(couple_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_shared_photos_couple_created ON shared_photos(couple_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_insights_couple_created ON insights(couple_id, created_at DESC);

-- ============================================================================
-- SAMPLE DATA / STARTER CONTENT
-- ============================================================================

-- Function to create starter decorations for a new couple
CREATE OR REPLACE FUNCTION create_starter_decorations(p_couple_id UUID)
RETURNS void AS $$
BEGIN
  -- Add a few free starter decorations
  INSERT INTO decorations (couple_id, type, item_id, is_active)
  VALUES 
    (p_couple_id, 'accessory', 'scarf_red', false),
    (p_couple_id, 'room_item', 'plant_small', false),
    (p_couple_id, 'background', 'bg_default', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create daily ritual for today
CREATE OR REPLACE FUNCTION create_daily_ritual(p_couple_id UUID)
RETURNS UUID AS $$
DECLARE
  v_ritual_id UUID;
  v_prompts TEXT[] := ARRAY[
    'What made you smile today?',
    'Share one thing you''re grateful for.',
    'What''s one thing I did this week that made you happy?',
    'Describe your partner in three words today.',
    'What''s a random act of kindness we could do together?'
  ];
  v_random_prompt TEXT;
BEGIN
  -- Pick random prompt
  v_random_prompt := v_prompts[floor(random() * array_length(v_prompts, 1) + 1)];
  
  -- Insert ritual
  INSERT INTO daily_rituals (couple_id, date, ritual_type, prompt)
  VALUES (p_couple_id, CURRENT_DATE, 'daily_question', v_random_prompt)
  ON CONFLICT (couple_id, date, ritual_type) DO NOTHING
  RETURNING id INTO v_ritual_id;
  
  RETURN v_ritual_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE decorations IS 'Stores unlocked creature accessories and room decorations';
COMMENT ON TABLE daily_rituals IS 'Daily interactive prompts for couples to engage with';
COMMENT ON TABLE shared_photos IS 'Visual memories timeline (future phase)';
COMMENT ON TABLE insights IS 'AI-generated relationship reflections and stats';
