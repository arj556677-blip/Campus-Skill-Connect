/* ─────────────────────────────────────────────────────
 * Campus Skill Connect — Core TypeScript Types
 * All database entities, enums, and shared interfaces
 * ───────────────────────────────────────────────────── */

// ── Enums ──

export type UserRole = 'student' | 'faculty' | 'recruiter' | 'admin';

export type Visibility = 'public' | 'worldwide' | 'campus' | 'connections' | 'selected_users' | 'only_me';

export type WorkCategory =
  | 'software'
  | 'research'
  | 'certification'
  | 'art'
  | 'photography'
  | 'music'
  | 'dance'
  | 'video'
  | 'writing'
  | 'other';

export type SkillCategory =
  | 'software'
  | 'research'
  | 'design'
  | 'performance'
  | 'communication'
  | 'business';

export type Proficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type ConnectionStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'blocked' | 'rejected';

export type ReportTargetType = 'profile' | 'work' | 'message';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export type ModerationActionType =
  | 'warn'
  | 'hide_work'
  | 'suspend_user'
  | 'ban_user'
  | 'verify_institution';

export type TicketCategory = 'account' | 'privacy' | 'bug' | 'feature';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export type NotificationType =
  | 'connection_request'
  | 'connection_accepted'
  | 'new_message'
  | 'room_invite'
  | 'report_update';

export type CvTemplate = 'modern' | 'minimal' | 'technical' | 'academic';
export type CvUploadStatus = 'uploaded' | 'parsed' | 'reviewed' | 'applied';

export type MessagePrivacy = 'connections_only' | 'all';

// ── Database Entities ──

export interface Profile {
  id: string;
  username?: string | null;
  display_name: string;
  headline: string | null;
  bio: string | null;
  role: UserRole;
  institution_id: string | null;
  campus_id: string | null;
  zone_id: string | null;
  field: string | null;
  avatar_url: string | null;
  avatar_path?: string | null;
  profile_visibility: Visibility;
  is_verified: boolean;
  is_campus_verified?: boolean;
  github_username: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  institution?: Community | null;
  campus?: Campus | null;
  zone?: Zone | null;
  skills?: UserSkillWithSkill[];
  works?: Work[];
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  is_verified: boolean;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency: Proficiency;
  endorsements_count: number;
}

export interface UserSkillWithSkill extends UserSkill {
  skill: Skill;
}

export interface Work {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  category: WorkCategory;
  external_url: string | null;
  storage_path: string | null;
  visibility: Visibility;
  likes_count: number;
  views_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  owner?: Profile;
  skills?: Skill[];
}

export interface WorkAccess {
  id: string;
  work_id: string;
  granted_user_id: string;
  granted_at: string;
}

export interface ConnectionRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: ConnectionStatus;
  note: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  sender?: Profile;
  receiver?: Profile;
}

export interface Conversation {
  id: string;
  user_one: string;
  user_two: string;
  last_message_at: string | null;
  created_at: string;
  // Joined data
  other_user?: Profile;
  last_message?: Message;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  // Joined
  sender?: Profile;
}

export interface Community {
  id: string;
  name: string;
  domain: string | null;
  description: string | null;
  logo_url: string | null;
  is_verified: boolean;
}

export interface Campus {
  id: string;
  community_id: string;
  name: string;
  location: string | null;
  community?: Community;
}

export interface Zone {
  id: string;
  name: string;
  city: string;
  state: string | null;
}

export interface CvUpload {
  id: string;
  user_id: string;
  file_url: string;
  extracted_data: Record<string, unknown> | null;
  status: CvUploadStatus;
  created_at: string;
}

export interface CvResume {
  id: string;
  user_id: string;
  title: string;
  template: CvTemplate;
  content: CvResumeContent;
  ats_score: number | null;
  ats_feedback: Record<string, unknown> | null;
  updated_at: string;
}

export interface CvResumeContent {
  personal: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary?: string;
  };
  experience: {
    title: string;
    company: string;
    location?: string;
    start_date: string;
    end_date?: string;
    current?: boolean;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    location?: string;
    start_date: string;
    end_date?: string;
    gpa?: string;
    description?: string;
  }[];
  skills: string[];
  projects: {
    name: string;
    description: string;
    url?: string;
    technologies?: string[];
  }[];
  certifications: {
    name: string;
    issuer: string;
    date?: string;
    url?: string;
  }[];
}

export interface AiCopilotConversation {
  id: string;
  user_id: string;
  messages: AiCopilotMessage[];
  updated_at: string;
}

export interface AiCopilotMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type MeetingProvider = 'webrtc_jitsi' | 'google_meet';
export type ConfidentialityLevel = 'public' | 'confidential' | 'restricted_nda' | 'recruiter_private';

export interface CollaborationRoom {
  id: string;
  title: string;
  description: string | null;
  creator_id: string;
  room_slug: string;
  is_active: boolean;
  meeting_link: string | null;
  created_at: string;
  creator?: Profile;
  provider?: MeetingProvider;
  is_confidential?: boolean;
  confidentiality_level?: ConfidentialityLevel;
  google_meet_code?: string | null;
  passcode?: string | null;
  host_approval_required?: boolean;
  nda_required?: boolean;
  authorized_roles?: Array<'admin' | 'recruiter' | 'student'>;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason: string;
  details: string | null;
  status: ReportStatus;
  created_at: string;
  reporter?: Profile;
}

export interface ModerationAction {
  id: string;
  admin_id: string;
  report_id: string | null;
  action_type: ModerationActionType;
  notes: string | null;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
  user?: Profile;
  messages?: SupportTicketMessage[];
}

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  is_staff_reply: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  target_resource: string;
  ip_address: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  actor?: Profile;
}

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface UserSettings {
  user_id: string;
  email_notifications: boolean;
  message_privacy: MessagePrivacy;
  allow_recruiter_indexing: boolean;
  show_activity_status: boolean;
}

// ── Search & Filter Params ──

export interface DiscoverFilters {
  query?: string;
  skills?: string[];
  field?: string;
  institution?: string;
  zone?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
}

export interface WorkFilters {
  query?: string;
  category?: WorkCategory;
  skills?: string[];
  owner_id?: string;
  page?: number;
  limit?: number;
}

export interface RecruiterFilters extends DiscoverFilters {
  experience_level?: 'fresher' | 'experienced';
  has_verified_work?: boolean;
  min_skills_match?: number;
}

// ── API Response Types ──

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
