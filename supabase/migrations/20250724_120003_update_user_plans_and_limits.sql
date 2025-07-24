-- Update profiles table for plan management
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'plus')),
ADD COLUMN IF NOT EXISTS daily_generation_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS daily_generation_reset_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS project_count INTEGER DEFAULT 0;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_plan_type ON profiles(plan_type);
CREATE INDEX IF NOT EXISTS idx_profiles_daily_generation_reset_at ON profiles(daily_generation_reset_at);

-- Migrate existing plan data from users table to profiles
UPDATE profiles p
SET plan_type = u.plan_type
FROM users u
WHERE p.user_id = u.id;

-- Update project_count based on existing projects
UPDATE profiles p
SET project_count = (
  SELECT COUNT(*) 
  FROM projects 
  WHERE user_id = p.user_id
);