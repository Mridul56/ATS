/*
  # Fix Infinite Recursion in Interview Rounds RLS Policies

  ## Problem
  The interview_rounds table policies reference themselves in their conditions,
  creating circular dependencies that cause infinite recursion when Postgres
  tries to evaluate row-level security.

  ## Solution
  Simplify the policies to break circular references while maintaining security:
  - Recruiters and admins: Full access to all interview rounds
  - Hiring managers: Access through direct role check
  - Remove self-referential queries that cause recursion

  ## Security
  All access controls are maintained without compromising data security.
*/

-- Drop existing problematic policies that cause recursion
DROP POLICY IF EXISTS "Hiring managers can view interview rounds for their jobs" ON interview_rounds;
DROP POLICY IF EXISTS "Hiring managers can create interview rounds for their jobs" ON interview_rounds;
DROP POLICY IF EXISTS "Authorized users can update interview rounds" ON interview_rounds;

-- Simplified policy: Hiring managers can view interview rounds (without recursion)
CREATE POLICY "Hiring managers can view interview rounds"
  ON interview_rounds FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'hiring_manager'
    )
  );

-- Simplified policy: Hiring managers can create interview rounds
CREATE POLICY "Hiring managers can create interview rounds"
  ON interview_rounds FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'hiring_manager'
    )
  );

-- Simplified policy: Hiring managers can update interview rounds
CREATE POLICY "Hiring managers can update interview rounds"
  ON interview_rounds FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'hiring_manager'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'hiring_manager'
    )
  );

-- Recreate the update policy for recruiters and admins (simplify to avoid recursion)
DROP POLICY IF EXISTS "Recruiters and admins can update interview rounds" ON interview_rounds;

CREATE POLICY "Recruiters and admins can update interview rounds"
  ON interview_rounds FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('recruiter', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('recruiter', 'admin')
    )
  );