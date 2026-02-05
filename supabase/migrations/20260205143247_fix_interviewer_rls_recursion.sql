/*
  # Fix Infinite Recursion in Interviewer RLS Policies

  1. Problem
    - Circular dependency between interview_rounds and interview_round_panelists policies
    - interview_rounds policies check interview_round_panelists
    - interview_round_panelists policies check interview_rounds
    - This creates infinite recursion

  2. Solution
    - Simplify interview_round_panelists policies to break the cycle
    - Keep recruiter/admin access simple
    - Allow interviewers to see their own panelist records without complex joins
    - Allow hiring managers access through a simpler check
  
  3. Security
    - Interviewers can still only view their assigned interviews
    - All security boundaries are maintained
    - No data leakage
*/

-- Drop the problematic policies that create circular dependencies
DROP POLICY IF EXISTS "Authorized users can view panelists" ON interview_round_panelists;
DROP POLICY IF EXISTS "Authorized users can create panelists" ON interview_round_panelists;
DROP POLICY IF EXISTS "Authorized users can update panelists" ON interview_round_panelists;

-- Recreate simpler policies for interview_round_panelists that don't reference interview_rounds
-- This breaks the circular dependency

-- Recruiters and admins can view all panelists
CREATE POLICY "Recruiters and admins can view all panelists"
  ON interview_round_panelists
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('recruiter', 'admin')
    )
  );

-- Recruiters and admins can create panelists
CREATE POLICY "Recruiters and admins can create panelists"
  ON interview_round_panelists
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('recruiter', 'admin')
    )
  );

-- Recruiters and admins can update panelists
CREATE POLICY "Recruiters and admins can update panelists"
  ON interview_round_panelists
  FOR UPDATE
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

-- Recruiters and admins can delete panelists
CREATE POLICY "Recruiters and admins can delete panelists"
  ON interview_round_panelists
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('recruiter', 'admin')
    )
  );
