-- Fix daily usage reset system and clean up old data
-- This migration addresses the daily limit reset timing issues

-- 1. Reset all users' daily generation count to 0
UPDATE profiles 
SET daily_generation_count = 0
WHERE daily_generation_count > 0;

-- 2. Set all users' reset date to today (UTC) to sync everyone
UPDATE profiles 
SET daily_generation_reset_at = CURRENT_DATE::text
WHERE daily_generation_reset_at IS NULL 
   OR daily_generation_reset_at != CURRENT_DATE::text;

-- 3. Create a cron job to automatically reset daily usage at UTC midnight
-- This needs to be set up in Supabase Dashboard under Database > Cron Jobs
-- Schedule: 0 0 * * * (daily at UTC midnight)
-- Function: reset-daily-usage

-- 4. Add comment to track the migration purpose
COMMENT ON COLUMN profiles.daily_generation_reset_at IS 
'Stores the date (YYYY-MM-DD) when daily usage was last reset. Reset occurs daily at UTC midnight.';

COMMENT ON COLUMN profiles.daily_generation_count IS 
'Current count of generations used today. Resets to 0 daily at UTC midnight.';