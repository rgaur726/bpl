-- Add PIN column to teams table for captain authentication
ALTER TABLE teams ADD COLUMN captain_pin TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN teams.captain_pin IS '6-digit PIN for captain authentication, generated when auction is reset';
