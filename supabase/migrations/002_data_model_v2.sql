-- ═══════════════════════════════════════════════════════
-- Campus Skill Connect — Data Model V2 Migration
-- Canonical Connections, Blocks, Strict RLS, Audit Immutability,
-- User Roles, Verified Campus Verification, and Skill Endorsements
-- ═══════════════════════════════════════════════════════

-- 1. PROFILES ENHANCEMENTS
-- Add username (unique), avatar_path, and is_campus_verified
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS avatar_path TEXT,
  ADD COLUMN IF NOT EXISTS is_campus_verified BOOLEAN DEFAULT false;

-- Allow 'public' in addition to legacy 'worldwide'
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_profile_visibility_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_profile_visibility_check 
  CHECK (profile_visibility IN ('public', 'worldwide', 'campus', 'connections', 'only_me'));

UPDATE profiles SET profile_visibility = 'public' WHERE profile_visibility = 'worldwide';

-- 2. INSTITUTIONS VIEW & EMAIL-BASED CAMPUS VERIFICATION
CREATE OR REPLACE VIEW institutions AS
  SELECT 
    id, 
    name, 
    domain, 
    description, 
    logo_url, 
    is_verified, 
    created_at
  FROM communities;

-- Campus verification database function
CREATE OR REPLACE FUNCTION verify_user_campus(p_user_id UUID) 
RETURNS BOOLEAN AS $$
DECLARE
  v_user_email TEXT;
  v_email_domain TEXT;
  v_matched_institution_id UUID;
  v_default_campus_id UUID;
BEGIN
  -- Get user email from auth.users
  SELECT email INTO v_user_email 
  FROM auth.users 
  WHERE id = p_user_id;

  IF v_user_email IS NULL THEN
    RETURN false;
  END IF;

  v_email_domain := lower(split_part(v_user_email, '@', 2));

  -- Look up matching verified institution by domain
  SELECT id INTO v_matched_institution_id
  FROM communities
  WHERE is_verified = true
    AND (
      lower(domain) = v_email_domain 
      OR v_email_domain LIKE '%.' || lower(domain)
    )
  LIMIT 1;

  IF v_matched_institution_id IS NOT NULL THEN
    -- Find default campus for this institution if exists
    SELECT id INTO v_default_campus_id
    FROM campuses
    WHERE community_id = v_matched_institution_id
    LIMIT 1;

    UPDATE profiles
    SET 
      institution_id = v_matched_institution_id,
      campus_id = COALESCE(campus_id, v_default_campus_id),
      is_campus_verified = true,
      is_verified = true,
      updated_at = now()
    WHERE id = p_user_id;

    RETURN true;
  ELSE
    -- Email domain does not match any verified university
    UPDATE profiles
    SET 
      is_campus_verified = false,
      updated_at = now()
    WHERE id = p_user_id;

    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. BLOCKS TABLE
CREATE TABLE IF NOT EXISTS blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT no_self_block CHECK (blocker_id != blocked_id),
  UNIQUE (blocker_id, blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocked ON blocks(blocked_id);

ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blocks: users can view their own blocks" ON blocks FOR
SELECT USING (blocker_id = auth.uid());

CREATE POLICY "Blocks: users can block" ON blocks FOR
INSERT WITH CHECK (blocker_id = auth.uid());

CREATE POLICY "Blocks: users can unblock" ON blocks FOR
DELETE USING (blocker_id = auth.uid());

-- Helper: Check if two users have an active block in either direction
CREATE OR REPLACE FUNCTION is_blocked(user_a UUID, user_b UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF user_a IS NULL OR user_b IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 
    FROM blocks 
    WHERE (blocker_id = user_a AND blocked_id = user_b)
       OR (blocker_id = user_b AND blocked_id = user_a)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 4. CANONICAL CONNECTIONS TABLE
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_low UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_high UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'accepted', 'declined', 'withdrawn', 'blocked')
  ),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_pair_order CHECK (user_low < user_high),
  CONSTRAINT requester_in_pair CHECK (requested_by = user_low OR requested_by = user_high),
  UNIQUE (user_low, user_high)
);

CREATE INDEX IF NOT EXISTS idx_connections_user_low ON connections(user_low);
CREATE INDEX IF NOT EXISTS idx_connections_user_high ON connections(user_high);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);

ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Connections: participants can view" ON connections FOR
SELECT USING (
  (user_low = auth.uid() OR user_high = auth.uid())
  AND NOT is_blocked(user_low, user_high)
);

CREATE POLICY "Connections: participants can insert" ON connections FOR
INSERT WITH CHECK (
  auth.uid() = requested_by
  AND (user_low = auth.uid() OR user_high = auth.uid())
  AND NOT is_blocked(user_low, user_high)
);

CREATE POLICY "Connections: participants can update" ON connections FOR
UPDATE USING (
  (user_low = auth.uid() OR user_high = auth.uid())
);

-- Trigger to auto-cancel connections on block
CREATE OR REPLACE FUNCTION handle_block_created() RETURNS TRIGGER AS $$
DECLARE
  v_low UUID;
  v_high UUID;
BEGIN
  v_low := LEAST(NEW.blocker_id, NEW.blocked_id);
  v_high := GREATEST(NEW.blocker_id, NEW.blocked_id);

  UPDATE connections
  SET status = 'blocked', updated_at = now()
  WHERE user_low = v_low AND user_high = v_high;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_block_cancels_connection ON blocks;
CREATE TRIGGER trg_block_cancels_connection
  AFTER INSERT ON blocks
  FOR EACH ROW EXECUTE FUNCTION handle_block_created();

-- Robust state-transition function for connections
CREATE OR REPLACE FUNCTION transition_connection_status(
  p_other_user_id UUID,
  p_action TEXT,
  p_actor_id UUID DEFAULT auth.uid()
)
RETURNS JSONB AS $$
DECLARE
  v_low UUID;
  v_high UUID;
  v_conn RECORD;
  v_other_party UUID;
BEGIN
  IF p_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to modify connection';
  END IF;

  IF p_other_user_id = p_actor_id THEN
    RAISE EXCEPTION 'Cannot connect with self';
  END IF;

  IF is_blocked(p_actor_id, p_other_user_id) THEN
    RAISE EXCEPTION 'Action forbidden: user is blocked';
  END IF;

  v_low := LEAST(p_actor_id, p_other_user_id);
  v_high := GREATEST(p_actor_id, p_other_user_id);

  SELECT * INTO v_conn 
  FROM connections 
  WHERE user_low = v_low AND user_high = v_high;

  CASE p_action
    WHEN 'request' THEN
      IF v_conn.id IS NULL THEN
        INSERT INTO connections (user_low, user_high, requested_by, status)
        VALUES (v_low, v_high, p_actor_id, 'pending');
      ELSIF v_conn.status IN ('declined', 'withdrawn') THEN
        UPDATE connections
        SET status = 'pending', requested_by = p_actor_id, updated_at = now()
        WHERE id = v_conn.id;
      ELSIF v_conn.status = 'pending' THEN
        RAISE EXCEPTION 'A connection request is already pending';
      ELSIF v_conn.status = 'accepted' THEN
        RAISE EXCEPTION 'Already connected';
      ELSIF v_conn.status = 'blocked' THEN
        RAISE EXCEPTION 'Cannot request connection: relation is blocked';
      END IF;

    WHEN 'accept' THEN
      IF v_conn.id IS NULL OR v_conn.status != 'pending' THEN
        RAISE EXCEPTION 'No pending connection request to accept';
      END IF;
      -- Only the recipient can accept, not the original requester
      IF v_conn.requested_by = p_actor_id THEN
        RAISE EXCEPTION 'Cannot accept your own connection request';
      END IF;
      UPDATE connections SET status = 'accepted', updated_at = now() WHERE id = v_conn.id;

    WHEN 'decline' THEN
      IF v_conn.id IS NULL OR v_conn.status != 'pending' THEN
        RAISE EXCEPTION 'No pending connection request to decline';
      END IF;
      IF v_conn.requested_by = p_actor_id THEN
        RAISE EXCEPTION 'Cannot decline your own connection request; use withdraw';
      END IF;
      UPDATE connections SET status = 'declined', updated_at = now() WHERE id = v_conn.id;

    WHEN 'withdraw' THEN
      IF v_conn.id IS NULL OR v_conn.status != 'pending' THEN
        RAISE EXCEPTION 'No pending connection request to withdraw';
      END IF;
      IF v_conn.requested_by != p_actor_id THEN
        RAISE EXCEPTION 'Only the requester can withdraw a pending connection request';
      END IF;
      UPDATE connections SET status = 'withdrawn', updated_at = now() WHERE id = v_conn.id;

    WHEN 'block' THEN
      INSERT INTO blocks (blocker_id, blocked_id)
      VALUES (p_actor_id, p_other_user_id)
      ON CONFLICT DO NOTHING;
      IF v_conn.id IS NOT NULL THEN
        UPDATE connections SET status = 'blocked', updated_at = now() WHERE id = v_conn.id;
      END IF;

    ELSE
      RAISE EXCEPTION 'Invalid connection action: %', p_action;
  END CASE;

  RETURN jsonb_build_object(
    'success', true, 
    'action', p_action, 
    'user_low', v_low, 
    'user_high', v_high
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update are_connected helper function to query canonical connections and respect blocks
CREATE OR REPLACE FUNCTION are_connected(user_a UUID, user_b UUID) 
RETURNS BOOLEAN AS $$
DECLARE
  v_low UUID;
  v_high UUID;
BEGIN
  IF user_a IS NULL OR user_b IS NULL OR user_a = user_b THEN
    RETURN false;
  END IF;

  IF is_blocked(user_a, user_b) THEN
    RETURN false;
  END IF;

  v_low := LEAST(user_a, user_b);
  v_high := GREATEST(user_a, user_b);

  RETURN EXISTS (
    SELECT 1
    FROM connections
    WHERE user_low = v_low
      AND user_high = v_high
      AND status = 'accepted'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 5. SKILLS & USER_SKILLS ENHANCEMENTS
ALTER TABLE user_skills
  ADD COLUMN IF NOT EXISTS is_self_declared BOOLEAN DEFAULT true;

-- SKILL_ENDORSEMENTS TABLE
CREATE TABLE IF NOT EXISTS skill_endorsements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_skill_id UUID NOT NULL REFERENCES user_skills(id) ON DELETE CASCADE,
  endorser_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_skill_id, endorser_id)
);

CREATE INDEX IF NOT EXISTS idx_skill_endorsements_skill ON skill_endorsements(user_skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_endorsements_endorser ON skill_endorsements(endorser_id);

ALTER TABLE skill_endorsements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skill Endorsements: viewable by all" ON skill_endorsements FOR
SELECT USING (true);

-- Endorsements allowed only from accepted, unblocked connections
CREATE POLICY "Skill Endorsements: accepted connections can endorse" ON skill_endorsements FOR
INSERT WITH CHECK (
  auth.uid() = endorser_id
  AND EXISTS (
    SELECT 1 
    FROM user_skills us
    WHERE us.id = user_skill_id
      AND us.user_id != auth.uid()
      AND are_connected(auth.uid(), us.user_id)
  )
);

CREATE POLICY "Skill Endorsements: endorser can delete" ON skill_endorsements FOR
DELETE USING (endorser_id = auth.uid());

-- Trigger to sync user_skills.endorsements_count
CREATE OR REPLACE FUNCTION sync_endorsements_count() RETURNS TRIGGER AS $$
DECLARE
  v_skill_id UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_skill_id := NEW.user_skill_id;
  ELSE
    v_skill_id := OLD.user_skill_id;
  END IF;

  UPDATE user_skills
  SET endorsements_count = (
    SELECT count(*) 
    FROM skill_endorsements 
    WHERE user_skill_id = v_skill_id
  )
  WHERE id = v_skill_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_endorsements_count ON skill_endorsements;
CREATE TRIGGER trg_sync_endorsements_count
  AFTER INSERT OR DELETE ON skill_endorsements
  FOR EACH ROW EXECUTE FUNCTION sync_endorsements_count();

-- 6. WORKS TABLE ENHANCEMENTS
-- Add 'other' to category check
ALTER TABLE works DROP CONSTRAINT IF EXISTS works_category_check;
ALTER TABLE works ADD CONSTRAINT works_category_check 
  CHECK (category IN (
    'software', 'research', 'certification', 'art', 
    'photography', 'music', 'dance', 'video', 'writing', 'other'
  ));

-- Add 'public' to visibility check and map worldwide -> public
ALTER TABLE works DROP CONSTRAINT IF EXISTS works_visibility_check;
ALTER TABLE works ADD CONSTRAINT works_visibility_check 
  CHECK (visibility IN ('public', 'worldwide', 'campus', 'connections', 'selected_users', 'only_me'));

UPDATE works SET visibility = 'public' WHERE visibility = 'worldwide';

-- 7. AUDIT_LOGS APPEND-ONLY SECURITY
-- RLS: No UPDATE and No DELETE policy exists.
-- Trigger raises exception on any UPDATE or DELETE attempt.
CREATE OR REPLACE FUNCTION prevent_audit_log_modification() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Security violation: audit_logs is append-only and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_logs_immutable ON audit_logs;
CREATE TRIGGER trg_audit_logs_immutable
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();

-- 8. USER_ROLES TABLE (Admin and Moderator Grants)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'recruiter', 'staff')),
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Users can only select their own roles. No insert/update/delete for authenticated role (service_role only).
CREATE POLICY "User Roles: users can view own roles" ON user_roles FOR
SELECT USING (user_id = auth.uid());

-- Helper: Check if user has a specific role
CREATE OR REPLACE FUNCTION has_role(p_user_id UUID, p_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  IF p_user_id IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = p_user_id AND role = p_role
  ) OR EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = p_user_id AND role = p_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 9. STRICT RLS POLICIES FOR WORKS AND PROFILES RESPECTING BLOCKS
-- Drop legacy profile policies to reinstall hardened policies
DROP POLICY IF EXISTS "Profiles: viewable based on visibility" ON profiles;
CREATE POLICY "Profiles: viewable based on visibility" ON profiles FOR
SELECT USING (
  -- Owner can always view own profile
  id = auth.uid()
  OR (
    -- Neither party is blocked
    NOT is_blocked(auth.uid(), id)
    AND (
      profile_visibility IN ('public', 'worldwide')
      OR (profile_visibility = 'connections' AND are_connected(auth.uid(), id))
      OR (profile_visibility = 'campus' AND shares_campus(auth.uid(), id))
    )
  )
);

-- Drop legacy works policy to reinstall hardened policy
DROP POLICY IF EXISTS "Works: viewable based on visibility" ON works FOR
SELECT USING (
  -- Owner can always view own works
  owner_id = auth.uid()
  OR (
    -- Neither party is blocked
    NOT is_blocked(auth.uid(), owner_id)
    AND (
      visibility IN ('public', 'worldwide')
      OR (visibility = 'connections' AND are_connected(auth.uid(), owner_id))
      OR (visibility = 'campus' AND shares_campus(auth.uid(), owner_id))
      OR (
        visibility = 'selected_users'
        AND EXISTS (
          SELECT 1
          FROM work_access
          WHERE work_id = works.id
            AND granted_user_id = auth.uid()
        )
      )
    )
  )
);
