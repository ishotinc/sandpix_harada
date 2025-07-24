-- Update generation_usage table
ALTER TABLE generation_usage
ADD COLUMN IF NOT EXISTS plan_type TEXT,
ADD COLUMN IF NOT EXISTS daily_count INTEGER DEFAULT 1;

-- Update the existing index name if it conflicts
DROP INDEX IF EXISTS idx_generation_usage_user_date;

-- Add composite index with a unique name
CREATE INDEX IF NOT EXISTS idx_generation_usage_user_date_enhanced ON generation_usage(user_id, created_at);

-- Update the view to include new fields
CREATE OR REPLACE VIEW public.user_daily_usage AS
SELECT 
  user_id,
  DATE(generated_at AT TIME ZONE 'UTC') as usage_date,
  COUNT(*) FILTER (WHERE success = true) as successful_generations,
  COUNT(*) as total_attempts,
  MAX(plan_type) as plan_type
FROM public.generation_usage
GROUP BY user_id, DATE(generated_at AT TIME ZONE 'UTC');

-- Grant access to the view
GRANT SELECT ON public.user_daily_usage TO authenticated;