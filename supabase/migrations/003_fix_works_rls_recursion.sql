-- ============================================================================
-- Migration: 003_fix_works_rls_recursion.sql
-- Description: Break mutual RLS recursion between works and work_access
-- ============================================================================

-- 1. Helper function: is_work_owner
-- Executes as SECURITY DEFINER to bypass RLS when checking ownership internally.
CREATE OR REPLACE FUNCTION is_work_owner(p_work_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM works
    WHERE id = p_work_id
      AND owner_id = p_user_id
  );
$$;

-- 2. Helper function: has_work_access
-- Executes as SECURITY DEFINER to bypass RLS when checking permissions internally.
CREATE OR REPLACE FUNCTION has_work_access(p_work_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM work_access
    WHERE work_id = p_work_id
      AND granted_user_id = p_user_id
  );
$$;

-- 3. Replace work_access policies (avoid recursive SELECT calls back into works)
DROP POLICY IF EXISTS "Work Access: work owner can manage" ON work_access;
DROP POLICY IF EXISTS "Work Access: granted user can view" ON work_access;
DROP POLICY IF EXISTS "Work Access: work owner can insert" ON work_access;
DROP POLICY IF EXISTS "Work Access: work owner can update" ON work_access;
DROP POLICY IF EXISTS "Work Access: work owner can delete" ON work_access;

CREATE POLICY "Work Access: granted user can view" ON work_access FOR SELECT
USING (
  granted_user_id = (SELECT auth.uid())
  OR is_work_owner(work_id, (SELECT auth.uid()))
);

CREATE POLICY "Work Access: work owner can insert" ON work_access FOR INSERT
WITH CHECK (is_work_owner(work_id, (SELECT auth.uid())));

CREATE POLICY "Work Access: work owner can update" ON work_access FOR UPDATE
USING (is_work_owner(work_id, (SELECT auth.uid())));

CREATE POLICY "Work Access: work owner can delete" ON work_access FOR DELETE
USING (is_work_owner(work_id, (SELECT auth.uid())));

-- 4. Replace work_skills policies to use SECURITY DEFINER helper
DROP POLICY IF EXISTS "Work Skills: work owner can manage" ON work_skills;
DROP POLICY IF EXISTS "Work Skills: work owner can delete" ON work_skills;

CREATE POLICY "Work Skills: work owner can manage" ON work_skills FOR INSERT
WITH CHECK (is_work_owner(work_id, (SELECT auth.uid())));

CREATE POLICY "Work Skills: work owner can delete" ON work_skills FOR DELETE
USING (is_work_owner(work_id, (SELECT auth.uid())));

-- 5. Replace Works SELECT policy to use has_work_access (breaks mutual recursion loop)
DROP POLICY IF EXISTS "Works: viewable based on visibility" ON works;
CREATE POLICY "Works: viewable based on visibility" ON works FOR SELECT
USING (
  owner_id = (SELECT auth.uid())
  OR (
    NOT is_blocked((SELECT auth.uid()), owner_id)
    AND (
      visibility IN ('public', 'worldwide')
      OR (visibility = 'connections' AND are_connected((SELECT auth.uid()), owner_id))
      OR (visibility = 'campus' AND shares_campus((SELECT auth.uid()), owner_id))
      OR (visibility = 'selected_users' AND has_work_access(works.id, (SELECT auth.uid())))
    )
  )
);
