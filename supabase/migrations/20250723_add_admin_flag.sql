-- Add is_admin column to users table for admin authentication
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create index for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_users_is_admin 
  ON public.users(is_admin) 
  WHERE is_admin = true;

-- Update RLS policies to allow admins to view all data if needed
-- (Optional - only if you want admins to see all users' data)

-- Grant admin access to specific user
UPDATE public.users 
SET is_admin = true 
WHERE email = 'shi0104mon@gmail.com';

-- Add comment to document the column
COMMENT ON COLUMN public.users.is_admin IS 'Flag to identify admin users who bypass usage limits';