-- Migration: 006_add_last_viewed_to_saved_searches.sql
-- Purpose: Track when user last viewed properties for each persona/saved search
-- This enables "new matches" badge showing count of properties added since last view

-- Add last_viewed_at column to saved_searches table
ALTER TABLE saved_searches 
ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ DEFAULT NOW();

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_saved_searches_last_viewed 
ON saved_searches(user_id, last_viewed_at);

-- Add comment for documentation
COMMENT ON COLUMN saved_searches.last_viewed_at IS 'Timestamp when user last viewed the feed for this saved search/persona. Used to calculate "new matches" count.';

-- Backfill existing records with current timestamp
UPDATE saved_searches 
SET last_viewed_at = updated_at 
WHERE last_viewed_at IS NULL;
