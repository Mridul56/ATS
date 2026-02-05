/*
  # Remove Circular Interviewer Policies from Interview Rounds

  1. Problem
    - interview_rounds policies that check interview_round_panelists create recursion
    - When an interviewer queries interview_rounds, it checks interview_round_panelists
    - This can trigger policies on interview_round_panelists that might need interview_rounds data
    - Creates infinite recursion loop

  2. Solution
    - Remove interviewer-specific policies from interview_rounds that reference interview_round_panelists
    - Interviewers will access their interviews through application logic instead
    - Keep recruiter, admin, and hiring manager policies (they don't create recursion)
  
  3. Access for Interviewers
    - Interviewers will query interview_round_panelists first (no recursion there)
    - Then fetch specific interview_rounds by ID
    - Application layer handles the join, not RLS policies
  
  4. Security
    - All other access controls remain intact
    - No data leakage
    - Recruiters and admins still have full access
    - Hiring managers can still access their job interviews
*/

-- Drop the problematic interviewer policies that create circular dependencies
DROP POLICY IF EXISTS "Interviewers can view their assigned interview rounds" ON interview_rounds;
DROP POLICY IF EXISTS "Interviewers can update their assigned interview rounds" ON interview_rounds;

-- Note: Interviewers will access their interviews via application logic:
-- 1. Query interview_round_panelists to get their assigned round IDs
-- 2. Use those IDs to fetch specific interview_rounds
-- This approach avoids RLS recursion while maintaining security
