-- Create generation_usage table to track daily API usage
CREATE TABLE IF NOT EXISTS public.generation_usage (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  generated_at timestamp WITH TIME ZONE DEFAULT now(),
  success boolean DEFAULT true,
  error_message text,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- Create index for fast lookups
CREATE INDEX idx_generation_usage_user_date 
  ON public.generation_usage(user_id, generated_at DESC);

-- Enable Row Level Security
ALTER TABLE public.generation_usage ENABLE ROW LEVEL SECURITY;

-- Users can only see their own usage
CREATE POLICY "Users can view own usage" 
  ON public.generation_usage
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

-- Only service role can insert (Edge Functions use service role)
CREATE POLICY "Service role can insert usage" 
  ON public.generation_usage
  FOR INSERT 
  TO service_role
  WITH CHECK (true);

-- Create a view for easy daily usage checking
CREATE OR REPLACE VIEW public.user_daily_usage AS
SELECT 
  user_id,
  DATE(generated_at AT TIME ZONE 'UTC') as usage_date,
  COUNT(*) FILTER (WHERE success = true) as successful_generations,
  COUNT(*) as total_attempts
FROM public.generation_usage
GROUP BY user_id, DATE(generated_at AT TIME ZONE 'UTC');

-- Grant access to the view
GRANT SELECT ON public.user_daily_usage TO authenticated;