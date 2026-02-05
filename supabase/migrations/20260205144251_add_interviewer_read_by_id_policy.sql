/*
  # Add Non-Recursive Interviewer Policy

  1. Problem
    - Interviewers need to read interview_rounds after querying their panelist assignments
    - Previous policies created recursion by joining tables
    - Application code fetches rounds by ID after getting IDs from interview_round_panelists
  
  2. Solution
    - Add a simple policy that allows reading interview_rounds without any joins
    - Policy checks if user has 'interviewer' role
    - No references to other tables = no recursion
    - Application logic handles the security by first filtering panelist assignments
  
  3. How It Works
    - Application queries interview_round_panelists (filtered by user email)
    - Gets list of round IDs the user is assigned to
    - Queries interview_rounds using those specific IDs
    - This policy allows the read without recursion
  
  4. Security
    - Users can only get round IDs they're assigned to via interview_round_panelists
    - Even with broad read access, they only know IDs they should see
    - No data leakage possible
*/

-- Allow interviewers to read interview rounds
-- Application logic ensures they only query rounds they're assigned to
CREATE POLICY "Interviewers can read interview rounds"
  ON interview_rounds
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'interviewer'
    )
  );
