/*
  # Fix profile foreign key constraint

  1. Changes
    - Drop existing foreign key constraint that references auth.users
    - Add new foreign key constraint that references public.users
    - This aligns with our application logic that uses public.users table

  2. Security
    - Maintain existing RLS policies
    - No changes to security model
*/

-- Drop the existing foreign key constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Add new foreign key constraint referencing public.users
ALTER TABLE profiles 
ADD CONSTRAINT profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;