-- ═══════════════════════════════════════════════════════
-- Campus Skill Connect — Master Database Schema
-- 23 Tables + Row Level Security + Triggers + Seed Data
-- ═══════════════════════════════════════════════════════
-- ── Enable UUID extension ──
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ═══════════════════════════════════════════
-- 1. COMMUNITIES (Institutions & Universities)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  domain TEXT,
  description TEXT,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ═══════════════════════════════════════════
-- 2. CAMPUSES (Physical Branches)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS campuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ═══════════════════════════════════════════
-- 3. ZONES (City-based Regions)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ═══════════════════════════════════════════
-- 4. PROFILES
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  headline TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (
    role IN ('student', 'faculty', 'recruiter', 'admin')
  ),
  institution_id UUID REFERENCES communities(id) ON DELETE
  SET NULL,
    campus_id UUID REFERENCES campuses(id) ON DELETE
  SET NULL,
    zone_id UUID REFERENCES zones(id) ON DELETE
  SET NULL,
    field TEXT,
    avatar_url TEXT,
    profile_visibility TEXT NOT NULL DEFAULT 'worldwide' CHECK (
      profile_visibility IN ('worldwide', 'campus', 'connections', 'only_me')
    ),
    is_verified BOOLEAN DEFAULT false,
    github_username TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.profiles (id, display_name, role)
VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.email
    ),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER profiles_updated_at BEFORE
UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- ═══════════════════════════════════════════
-- 5. SKILLS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'software' CHECK (
    category IN (
      'software',
      'research',
      'design',
      'performance',
      'communication',
      'business'
    )
  ),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ═══════════════════════════════════════════
-- 6. USER_SKILLS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  proficiency TEXT DEFAULT 'beginner' CHECK (
    proficiency IN ('beginner', 'intermediate', 'advanced', 'expert')
  ),
  endorsements_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, skill_id)
);
-- ═══════════════════════════════════════════
-- 7. WORKS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS works (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'software' CHECK (
    category IN (
      'software',
      'research',
      'certification',
      'art',
      'photography',
      'music',
      'dance',
      'video',
      'writing'
    )
  ),
  external_url TEXT,
  storage_path TEXT,
  visibility TEXT NOT NULL DEFAULT 'worldwide' CHECK (
    visibility IN (
      'worldwide',
      'campus',
      'connections',
      'selected_users',
      'only_me'
    )
  ),
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER works_updated_at BEFORE
UPDATE ON works FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- ═══════════════════════════════════════════
-- 8. WORK_SKILLS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS work_skills (
  work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (work_id, skill_id)
);
-- ═══════════════════════════════════════════
-- 9. WORK_ACCESS (Fine-grained selected-person access)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS work_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  granted_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(work_id, granted_user_id)
);
-- ═══════════════════════════════════════════
-- 10. CONNECTION_REQUESTS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS connection_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT no_self_connection CHECK (sender_id != receiver_id)
);
CREATE TRIGGER connection_requests_updated_at BEFORE
UPDATE ON connection_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- ═══════════════════════════════════════════
-- 11. CONVERSATIONS (Direct Messaging)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_one UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_two UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT no_self_conversation CHECK (user_one != user_two),
  UNIQUE(user_one, user_two)
);
-- ═══════════════════════════════════════════
-- 12. MESSAGES
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- Update conversation last_message_at on new message
CREATE OR REPLACE FUNCTION update_conversation_last_message() RETURNS TRIGGER AS $$ BEGIN
UPDATE conversations
SET last_message_at = NEW.created_at
WHERE id = NEW.conversation_id;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER messages_update_conversation
AFTER
INSERT ON messages FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();
-- ═══════════════════════════════════════════
-- 13. CV_UPLOADS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS cv_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  extracted_data JSONB,
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (
    status IN ('uploaded', 'parsed', 'reviewed', 'applied')
  ),
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ═══════════════════════════════════════════
-- 14. CV_RESUMES (Interactive CV Builder)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS cv_resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'My Resume',
  template TEXT NOT NULL DEFAULT 'modern' CHECK (
    template IN ('modern', 'minimal', 'technical', 'academic')
  ),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  ats_score INTEGER,
  ats_feedback JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER cv_resumes_updated_at BEFORE
UPDATE ON cv_resumes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- ═══════════════════════════════════════════
-- 15. AI_COPILOT_CONVERSATIONS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS ai_copilot_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER ai_copilot_updated_at BEFORE
UPDATE ON ai_copilot_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- ═══════════════════════════════════════════
-- 16. COLLABORATION_ROOMS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS collaboration_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  room_slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  meeting_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ═══════════════════════════════════════════
-- 17. REPORTS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('profile', 'work', 'message')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'reviewed', 'resolved', 'dismissed')
  ),
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ═══════════════════════════════════════════
-- 18. MODERATION_ACTIONS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS moderation_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  report_id UUID REFERENCES reports(id) ON DELETE
  SET NULL,
    action_type TEXT NOT NULL CHECK (
      action_type IN (
        'warn',
        'hide_work',
        'suspend_user',
        'ban_user',
        'verify_institution'
      )
    ),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
-- ═══════════════════════════════════════════
-- 19. SUPPORT_TICKETS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'bug' CHECK (
    category IN ('account', 'privacy', 'bug', 'feature')
  ),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER support_tickets_updated_at BEFORE
UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- ═══════════════════════════════════════════
-- 20. SUPPORT_TICKET_MESSAGES
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS support_ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_staff_reply BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ═══════════════════════════════════════════
-- 21. AUDIT_LOGS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_resource TEXT NOT NULL,
  ip_address TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ═══════════════════════════════════════════
-- 22. NOTIFICATIONS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (
    type IN (
      'connection_request',
      'connection_accepted',
      'new_message',
      'room_invite',
      'report_update'
    )
  ),
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ═══════════════════════════════════════════
-- 23. USER_SETTINGS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  message_privacy TEXT DEFAULT 'connections_only' CHECK (message_privacy IN ('connections_only', 'all')),
  allow_recruiter_indexing BOOLEAN DEFAULT true,
  show_activity_status BOOLEAN DEFAULT true
);
-- Auto-create user_settings on profile creation
CREATE OR REPLACE FUNCTION create_user_settings() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO user_settings (user_id)
VALUES (NEW.id) ON CONFLICT DO NOTHING;
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_profile_created_settings
AFTER
INSERT ON profiles FOR EACH ROW EXECUTE FUNCTION create_user_settings();
-- ═══════════════════════════════════════════════════════
-- ROW LEVEL SECURITY POLICIES
-- ═══════════════════════════════════════════════════════
-- Helper: check if two users are connected
CREATE OR REPLACE FUNCTION are_connected(user_a UUID, user_b UUID) RETURNS BOOLEAN AS $$ BEGIN RETURN EXISTS (
    SELECT 1
    FROM connection_requests
    WHERE status = 'accepted'
      AND (
        (
          sender_id = user_a
          AND receiver_id = user_b
        )
        OR (
          sender_id = user_b
          AND receiver_id = user_a
        )
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
-- Helper: check if user shares campus with target
CREATE OR REPLACE FUNCTION shares_campus(viewer_id UUID, target_id UUID) RETURNS BOOLEAN AS $$ BEGIN RETURN EXISTS (
    SELECT 1
    FROM profiles p1
      JOIN profiles p2 ON p1.campus_id = p2.campus_id
    WHERE p1.id = viewer_id
      AND p2.id = target_id
      AND p1.campus_id IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
-- ── PROFILES ──
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles: viewable based on visibility" ON profiles FOR
SELECT USING (
    profile_visibility = 'worldwide'
    OR id = auth.uid()
    OR (
      profile_visibility = 'connections'
      AND are_connected(auth.uid(), id)
    )
    OR (
      profile_visibility = 'campus'
      AND shares_campus(auth.uid(), id)
    )
  );
CREATE POLICY "Profiles: users can update own" ON profiles FOR
UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Profiles: insert own" ON profiles FOR
INSERT WITH CHECK (id = auth.uid());
-- ── SKILLS ──
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Skills: viewable by all" ON skills FOR
SELECT USING (true);
CREATE POLICY "Skills: authenticated can insert" ON skills FOR
INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- ── USER_SKILLS ──
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User Skills: viewable by all" ON user_skills FOR
SELECT USING (true);
CREATE POLICY "User Skills: own only" ON user_skills FOR
INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "User Skills: delete own only" ON user_skills FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "User Skills: update own only" ON user_skills FOR
UPDATE USING (user_id = auth.uid());
-- ── WORKS ──
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Works: viewable based on visibility" ON works FOR
SELECT USING (
    visibility = 'worldwide'
    OR owner_id = auth.uid()
    OR (
      visibility = 'connections'
      AND are_connected(auth.uid(), owner_id)
    )
    OR (
      visibility = 'campus'
      AND shares_campus(auth.uid(), owner_id)
    )
    OR (
      visibility = 'selected_users'
      AND EXISTS (
        SELECT 1
        FROM work_access
        WHERE work_id = works.id
          AND granted_user_id = auth.uid()
      )
    )
  );
CREATE POLICY "Works: owner can insert" ON works FOR
INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Works: owner can update" ON works FOR
UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Works: owner can delete" ON works FOR DELETE USING (owner_id = auth.uid());
-- ── WORK_SKILLS ──
ALTER TABLE work_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Work Skills: viewable by all" ON work_skills FOR
SELECT USING (true);
CREATE POLICY "Work Skills: work owner can manage" ON work_skills FOR
INSERT WITH CHECK (
    EXISTS (
      SELECT 1
      FROM works
      WHERE id = work_id
        AND owner_id = auth.uid()
    )
  );
CREATE POLICY "Work Skills: work owner can delete" ON work_skills FOR DELETE USING (
  EXISTS (
    SELECT 1
    FROM works
    WHERE id = work_id
      AND owner_id = auth.uid()
  )
);
-- ── WORK_ACCESS ──
ALTER TABLE work_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Work Access: work owner can manage" ON work_access FOR ALL USING (
  EXISTS (
    SELECT 1
    FROM works
    WHERE id = work_id
      AND owner_id = auth.uid()
  )
);
CREATE POLICY "Work Access: granted user can view" ON work_access FOR
SELECT USING (granted_user_id = auth.uid());
-- ── CONNECTION_REQUESTS ──
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Connections: involved users can view" ON connection_requests FOR
SELECT USING (
    sender_id = auth.uid()
    OR receiver_id = auth.uid()
  );
CREATE POLICY "Connections: authenticated can send" ON connection_requests FOR
INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Connections: receiver can update status" ON connection_requests FOR
UPDATE USING (receiver_id = auth.uid());
-- ── CONVERSATIONS ──
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Conversations: participants can view" ON conversations FOR
SELECT USING (
    user_one = auth.uid()
    OR user_two = auth.uid()
  );
CREATE POLICY "Conversations: authenticated can create" ON conversations FOR
INSERT WITH CHECK (
    user_one = auth.uid()
    OR user_two = auth.uid()
  );
-- ── MESSAGES ──
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Messages: conversation participants can view" ON messages FOR
SELECT USING (
    EXISTS (
      SELECT 1
      FROM conversations c
      WHERE c.id = conversation_id
        AND (
          c.user_one = auth.uid()
          OR c.user_two = auth.uid()
        )
    )
  );
CREATE POLICY "Messages: sender can insert" ON messages FOR
INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Messages: recipient can mark read" ON messages FOR
UPDATE USING (
    sender_id != auth.uid()
    AND EXISTS (
      SELECT 1
      FROM conversations c
      WHERE c.id = conversation_id
        AND (
          c.user_one = auth.uid()
          OR c.user_two = auth.uid()
        )
    )
  );
-- ── CV_UPLOADS ──
ALTER TABLE cv_uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CV Uploads: own only" ON cv_uploads FOR ALL USING (user_id = auth.uid());
-- ── CV_RESUMES ──
ALTER TABLE cv_resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CV Resumes: own only" ON cv_resumes FOR ALL USING (user_id = auth.uid());
-- ── AI_COPILOT_CONVERSATIONS ──
ALTER TABLE ai_copilot_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AI Copilot: own only" ON ai_copilot_conversations FOR ALL USING (user_id = auth.uid());
-- ── COLLABORATION_ROOMS ──
ALTER TABLE collaboration_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rooms: viewable by all authenticated" ON collaboration_rooms FOR
SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Rooms: creator can manage" ON collaboration_rooms FOR
INSERT WITH CHECK (creator_id = auth.uid());
CREATE POLICY "Rooms: creator can update" ON collaboration_rooms FOR
UPDATE USING (creator_id = auth.uid());
CREATE POLICY "Rooms: creator can delete" ON collaboration_rooms FOR DELETE USING (creator_id = auth.uid());
-- ── REPORTS ──
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reports: reporter can view own" ON reports FOR
SELECT USING (reporter_id = auth.uid());
CREATE POLICY "Reports: authenticated can submit" ON reports FOR
INSERT WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "Reports: admin can view all" ON reports FOR
SELECT USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  );
CREATE POLICY "Reports: admin can update" ON reports FOR
UPDATE USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  );
-- ── MODERATION_ACTIONS ──
ALTER TABLE moderation_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Moderation: admin only" ON moderation_actions FOR ALL USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
);
-- ── SUPPORT_TICKETS ──
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tickets: own or admin" ON support_tickets FOR
SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM profiles
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  );
CREATE POLICY "Tickets: user can create" ON support_tickets FOR
INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Tickets: admin can update" ON support_tickets FOR
UPDATE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM profiles
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  );
-- ── SUPPORT_TICKET_MESSAGES ──
ALTER TABLE support_ticket_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ticket Messages: participants and admin" ON support_ticket_messages FOR
SELECT USING (
    sender_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM support_tickets
      WHERE id = ticket_id
        AND user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1
      FROM profiles
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  );
CREATE POLICY "Ticket Messages: authenticated can insert" ON support_ticket_messages FOR
INSERT WITH CHECK (sender_id = auth.uid());
-- ── AUDIT_LOGS ──
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Audit Logs: admin only" ON audit_logs FOR
SELECT USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  );
CREATE POLICY "Audit Logs: system can insert" ON audit_logs FOR
INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- ── NOTIFICATIONS ──
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notifications: own only" ON notifications FOR
SELECT USING (user_id = auth.uid());
CREATE POLICY "Notifications: system can insert" ON notifications FOR
INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Notifications: own can update" ON notifications FOR
UPDATE USING (user_id = auth.uid());
-- ── USER_SETTINGS ──
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings: own only" ON user_settings FOR ALL USING (user_id = auth.uid());
-- ── COMMUNITIES ──
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Communities: viewable by all" ON communities FOR
SELECT USING (true);
CREATE POLICY "Communities: admin can manage" ON communities FOR ALL USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
);
-- ── CAMPUSES ──
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Campuses: viewable by all" ON campuses FOR
SELECT USING (true);
CREATE POLICY "Campuses: admin can manage" ON campuses FOR ALL USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
);
-- ── ZONES ──
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Zones: viewable by all" ON zones FOR
SELECT USING (true);
CREATE POLICY "Zones: admin can manage" ON zones FOR ALL USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
);
-- ═══════════════════════════════════════════════════════
-- INDEXES for Performance
-- ═══════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_profiles_institution ON profiles(institution_id);
CREATE INDEX IF NOT EXISTS idx_profiles_campus ON profiles(campus_id);
CREATE INDEX IF NOT EXISTS idx_profiles_zone ON profiles(zone_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_visibility ON profiles(profile_visibility);
CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_works_owner ON works(owner_id);
CREATE INDEX IF NOT EXISTS idx_works_category ON works(category);
CREATE INDEX IF NOT EXISTS idx_works_visibility ON works(visibility);
CREATE INDEX IF NOT EXISTS idx_works_published ON works(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_work_skills_work ON work_skills(work_id);
CREATE INDEX IF NOT EXISTS idx_work_skills_skill ON work_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_connections_sender ON connection_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_connections_receiver ON connection_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connection_requests(status);
CREATE INDEX IF NOT EXISTS idx_conversations_users ON conversations(user_one, user_two);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id, created_at DESC);
-- ═══════════════════════════════════════════════════════
-- SEED DATA (Demo-ready sample data)
-- ═══════════════════════════════════════════════════════
-- Communities
INSERT INTO communities (id, name, domain, description, is_verified)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'Indian Institute of Technology Bombay',
    'iitb.ac.in',
    'Premier engineering and technology institute in Mumbai',
    true
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'National Institute of Design Ahmedabad',
    'nid.edu',
    'India''s premier design school',
    true
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'Jawaharlal Nehru University',
    'jnu.ac.in',
    'Leading research university in New Delhi',
    true
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    'Indian Institute of Management Bangalore',
    'iimb.ac.in',
    'Top business school in India',
    true
  ) ON CONFLICT (name) DO NOTHING;
-- Campuses
INSERT INTO campuses (id, community_id, name, location)
VALUES (
    'b1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'Powai Campus',
    'Mumbai, Maharashtra'
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'a2222222-2222-2222-2222-222222222222',
    'Paldi Campus',
    'Ahmedabad, Gujarat'
  ),
  (
    'b3333333-3333-3333-3333-333333333333',
    'a3333333-3333-3333-3333-333333333333',
    'New Mehrauli Road Campus',
    'New Delhi'
  ),
  (
    'b4444444-4444-4444-4444-444444444444',
    'a4444444-4444-4444-4444-444444444444',
    'Bannerghatta Road Campus',
    'Bangalore, Karnataka'
  ) ON CONFLICT DO NOTHING;
-- Zones
INSERT INTO zones (id, name, city, state)
VALUES (
    'c1111111-1111-1111-1111-111111111111',
    'Mumbai Tech Hub',
    'Mumbai',
    'Maharashtra'
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    'Bangalore Silicon Valley',
    'Bangalore',
    'Karnataka'
  ),
  (
    'c3333333-3333-3333-3333-333333333333',
    'Delhi NCR Innovation Corridor',
    'New Delhi',
    'Delhi'
  ),
  (
    'c4444444-4444-4444-4444-444444444444',
    'Hyderabad Tech City',
    'Hyderabad',
    'Telangana'
  ),
  (
    'c5555555-5555-5555-5555-555555555555',
    'Pune IT Park',
    'Pune',
    'Maharashtra'
  ) ON CONFLICT DO NOTHING;
-- Skills
INSERT INTO skills (name, category, is_verified)
VALUES ('React', 'software', true),
  ('Next.js', 'software', true),
  ('TypeScript', 'software', true),
  ('Python', 'software', true),
  ('Machine Learning', 'software', true),
  ('Node.js', 'software', true),
  ('PostgreSQL', 'software', true),
  ('Docker', 'software', true),
  ('Figma', 'design', true),
  ('UI/UX Design', 'design', true),
  ('Adobe Photoshop', 'design', true),
  ('3D Modeling', 'design', true),
  ('Academic Writing', 'research', true),
  ('Data Analysis', 'research', true),
  ('Quantitative Research', 'research', true),
  ('Literature Review', 'research', true),
  ('Classical Dance', 'performance', true),
  ('Western Vocals', 'performance', true),
  ('Theatre Acting', 'performance', true),
  ('Guitar', 'performance', true),
  ('Public Speaking', 'communication', true),
  ('Technical Writing', 'communication', true),
  ('Content Strategy', 'communication', true),
  ('Business Development', 'business', true),
  ('Product Management', 'business', true),
  ('Financial Analysis', 'business', true),
  ('Rust', 'software', true),
  ('Go', 'software', true),
  ('Kubernetes', 'software', true),
  ('AWS', 'software', true),
  ('TensorFlow', 'software', true),
  ('Photography', 'design', true),
  ('Video Editing', 'design', true),
  ('Animation', 'design', true),
  ('Creative Writing', 'communication', true) ON CONFLICT (name) DO NOTHING;