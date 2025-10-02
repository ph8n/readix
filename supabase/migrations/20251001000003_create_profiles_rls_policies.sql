-- Enable Row Level Security on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile" 
  ON profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add policy comments
COMMENT ON POLICY "Users can view own profile" ON profiles IS 'Users can only view their own profile data';
COMMENT ON POLICY "Users can insert own profile" ON profiles IS 'Users can create their own profile on signup';
COMMENT ON POLICY "Users can update own profile" ON profiles IS 'Users can update their own profile information';
