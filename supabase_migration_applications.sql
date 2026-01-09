-- =====================================================
-- JAT v2 - Phase 2: Applications Table Migration
-- =====================================================
-- This migration creates the applications table with RLS policies
-- All queries are automatically scoped to auth.uid() for security

-- Create status enum type
CREATE TYPE application_status AS ENUM (
  'applied',
  'interviewing',
  'offer',
  'rejected',
  'withdrawn'
);

-- Create applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  status application_status NOT NULL DEFAULT 'applied',
  application_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX idx_applications_user_id_created_at ON applications(user_id, created_at DESC);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to applications table
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Row Level Security (RLS) Configuration
-- =====================================================

-- Enable RLS on applications table
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own applications
CREATE POLICY "Users can view their own applications"
  ON applications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own applications
CREATE POLICY "Users can insert their own applications"
  ON applications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own applications
CREATE POLICY "Users can update their own applications"
  ON applications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own applications
CREATE POLICY "Users can delete their own applications"
  ON applications
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- Verification Queries (Comment out before running)
-- =====================================================

-- VERIFICATION CHECKLIST:
-- 
-- 1. Verify table structure:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'applications'
-- ORDER BY ordinal_position;
--
-- 2. Verify RLS is enabled:
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE tablename = 'applications';
--
-- 3. Verify RLS policies exist:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename = 'applications';
--
-- 4. Verify indexes:
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'applications';
--
-- 5. Test RLS enforcement (as authenticated user):
-- -- Insert test data for your user
-- INSERT INTO applications (user_id, company_name, position_title, status, application_date, notes)
-- VALUES (auth.uid(), 'Test Company', 'Test Position', 'applied', CURRENT_DATE, 'Test notes');
--
-- -- Should return only your applications
-- SELECT * FROM applications;
--
-- -- Attempt to insert as another user (should fail)
-- INSERT INTO applications (user_id, company_name, position_title, status, application_date)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'Hack Company', 'Hacker', 'applied', CURRENT_DATE);
--
-- -- Attempt to view another user's data (should return empty)
-- SELECT * FROM applications WHERE user_id != auth.uid();
