-- Database Migration for BPL Team Structure
-- Run this in your Supabase SQL Editor

-- Add player_count column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'teams' AND column_name = 'player_count'
  ) THEN
    ALTER TABLE teams ADD COLUMN player_count INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Update existing teams or do nothing if they don't exist
UPDATE teams SET purse = 50000, player_count = 0 WHERE team_name = 'Thakur XI';
UPDATE teams SET purse = 50000, player_count = 0 WHERE team_name = 'Gabbar XI';

-- Insert teams only if they don't exist (using INSERT ... ON CONFLICT DO NOTHING)
DO $$
DECLARE
  next_id INTEGER;
BEGIN
  -- Try to insert Thakur XI, do nothing if it exists
  BEGIN
    SELECT COALESCE(MAX(id), 0) + 1 INTO next_id FROM teams;
    INSERT INTO teams (id, team_name, purse, player_count) VALUES (next_id, 'Thakur XI', 50000, 0);
  EXCEPTION 
    WHEN unique_violation THEN
      -- Team already exists, just update it
      UPDATE teams SET purse = 50000, player_count = 0 WHERE team_name = 'Thakur XI';
  END;
  
  -- Try to insert Gabbar XI, do nothing if it exists
  BEGIN
    SELECT COALESCE(MAX(id), 0) + 1 INTO next_id FROM teams;
    INSERT INTO teams (id, team_name, purse, player_count) VALUES (next_id, 'Gabbar XI', 50000, 0);
  EXCEPTION 
    WHEN unique_violation THEN
      -- Team already exists, just update it
      UPDATE teams SET purse = 50000, player_count = 0 WHERE team_name = 'Gabbar XI';
  END;
END $$;

-- Update any existing teams that might have old names
UPDATE teams SET team_name = 'Thakur XI' WHERE team_name = 'Thakur';
UPDATE teams SET team_name = 'Gabbar XI' WHERE team_name = 'Gabbar';

-- Optional: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_team_name ON teams(team_name);

-- Optional: Update any existing players with old team names
UPDATE "Players" SET team = 'Thakur XI' WHERE team = 'Thakur';
UPDATE "Players" SET team = 'Gabbar XI' WHERE team = 'Gabbar';

-- Optional: Recalculate player counts based on existing data
UPDATE teams 
SET player_count = (
  SELECT COUNT(*) 
  FROM "Players" 
  WHERE "Players".team = teams.team_name AND "Players".sold = true
);
