-- Add accessories column to couples table
ALTER TABLE couples 
ADD COLUMN accessories jsonb DEFAULT '[]'::jsonb;

-- Comment
COMMENT ON COLUMN couples.accessories IS 'Array of accessory IDs e.g. ["hat_beanie", "glasses_round"]';
