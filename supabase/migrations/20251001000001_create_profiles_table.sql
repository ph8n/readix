-- Create profiles table
-- Purpose: Store additional user metadata beyond Supabase auth.users
-- Relations: auth.users (1:1)

CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment for documentation
COMMENT ON TABLE profiles IS 'Extended user profile information';
COMMENT ON COLUMN profiles.id IS 'References auth.users.id';
