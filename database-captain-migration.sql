-- Add captain column to teams table
-- Run this SQL in your Supabase SQL Editor

-- First, let's check the Players table structure and add columns
ALTER TABLE "teams" ADD COLUMN IF NOT EXISTS "captain_player_id" INTEGER;
ALTER TABLE "teams" ADD COLUMN IF NOT EXISTS "captain_name" VARCHAR(255);

-- Don't add foreign key constraint since Players table may not have proper primary key
-- Instead, we'll rely on application-level validation

-- Create index for faster captain lookups
CREATE INDEX IF NOT EXISTS idx_teams_captain ON "teams"("captain_player_id");

-- Update existing teams with null captain initially
UPDATE "teams" SET captain_player_id = NULL, captain_name = NULL WHERE captain_player_id IS NULL;

-- Optional: If you want to add the foreign key later, first ensure Players has a primary key:
-- ALTER TABLE "Players" ADD CONSTRAINT players_pkey PRIMARY KEY (player_id);
-- Then you can add the foreign key:
-- ALTER TABLE "teams" 
-- ADD CONSTRAINT fk_captain_player 
-- FOREIGN KEY (captain_player_id) 
-- REFERENCES "Players"(player_id) 
-- ON DELETE SET NULL;
