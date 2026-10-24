'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRole, ROLE_PERSONAS } from '@/lib/auth/role-context';
import {
  FileText,
  ExternalLink,
  Plus,
  Video,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  UserCog,
  Users,
  MessageSquare,
  Sparkles,
  Check,
  CheckCheck,
  X,
  Send,
  Building,
  ChevronRight,
  Maximize2,
  Award,
  Trophy,
  Briefcase,
} from 'lucide-react';
import { Work, Profile } from '@/lib/types';

interface CollaborationRole {
  id: string;
  projectTitle: string;
  roleNeeded: string;
  campus: string;
  teamSize: string;
  description: string;
  requiredSkills: string[];
  category: 'frontend' | 'backend' | 'ai' | 'systems' | 'design' | 'fullstack';
  postedAt: string;
}

const COLLABORATION_OPPORTUNITIES: CollaborationRole[] = [
  {
    id: 'collab-1',
    projectTitle: 'Real-Time Edge Mesh Network',
    roleNeeded: 'Systems & Networking Engineer',
    campus: 'IISc Bangalore',
    teamSize: '2 / 4 Members',
    description: 'Building a decentralized peer-to-peer campus mesh using WebRTC data channels and Rust. Looking for someone with low-level systems or networking interest.',
    requiredSkills: ['Rust', 'Distributed Systems', 'WebRTC', 'Networking'],
    category: 'systems',
    postedAt: '2 hours ago',
  },
  {
    id: 'collab-2',
    projectTitle: 'Multimodal Radiology Diagnostic Copilot',
    roleNeeded: 'Machine Learning Researcher',
    campus: 'IIT Bombay',
    teamSize: '3 / 4 Members',
    description: 'Fine-tuning vision-language models for chest X-ray segmentation and diagnostic explanation generation for our upcoming IEEE submission.',
    requiredSkills: ['PyTorch', 'Python', 'Computer Vision', 'Deep Learning'],
    category: 'ai',
    postedAt: '5 hours ago',
  },
  {
    id: 'collab-3',
    projectTitle: 'Campus Skill Connect Mobile & Web UI',
    roleNeeded: 'Frontend Developer (React / Next.js)',
    campus: 'BITS Pilani',
    teamSize: '2 / 3 Members',
    description: 'Creating accessible, responsive components for student portfolios and proof-of-work link validation. Need someone proficient with TypeScript and Tailwind/CSS.',
    requiredSkills: ['React', 'TypeScript', 'Next.js', 'Frontend Architecture'],
    category: 'frontend',
    postedAt: '1 day ago',
  },
  {
    id: 'collab-4',
    projectTitle: 'Decentralized Research Artifact Vault',
    roleNeeded: 'Backend & Security Architect',
    campus: 'DTU Delhi',
    teamSize: '1 / 3 Members',
    description: 'Architecting cryptographic hash verification and secure storage for student research manuscripts before preprint submission.',
    requiredSkills: ['Cloud Infrastructure', 'Data Security & Storage', 'TypeScript', 'Node.js'],
    category: 'backend',
    postedAt: '2 days ago',
  },
  {
    id: 'collab-5',
    projectTitle: 'Smart Campus Shuttle & EV Fleet Tracker',
    roleNeeded: 'UI/UX Product Designer & Mobile Lead',
    campus: 'IISc Bangalore',
    teamSize: '2 / 4 Members',
    description: 'Designing intuitive transit maps and live ETA displays for students and faculty across main campus. Creating Figma design system and mobile prototypes.',
    requiredSkills: ['Figma System Design', 'UI/UX Design', 'Design Systems', 'Mobile'],
    category: 'design',
    postedAt: '3 days ago',
  },
];

interface PendingRequest {
  id: string;
  name: string;
  avatar: string;
  campus: string;
  headline: string;
  note: string;
  time: string;
}

const INITIAL_REQUESTS: PendingRequest[] = [
  {
    id: 'req-1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    campus: 'IIT Bombay • AI & ML',
    headline: 'Machine Learning Researcher',
    note: 'Hi! Saw your distributed systems work. Would love to connect and team up for the upcoming hackathon!',
    time: '35m ago',
  },
  {
    id: 'req-2',
    name: 'Rohan Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    campus: 'BITS Pilani • Computer Science',
    headline: 'Full-Stack Software Engineer',
    note: 'Connecting to exchange feedback on your open-source WebRTC repository.',
    time: '2h ago',
  },
];

interface DashboardMessagePreview {
  id: string;
  convId: string;
  sender: string;
  avatar: string;
  headline: string;
  text: string;
  time: string;
  unread: boolean;
}

const INITIAL_MESSAGES: DashboardMessagePreview[] = [
  {
    id: 'msg-1',
    convId: 'conv-anita',
    sender: 'Dr. Anita Sengupta',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    headline: 'Faculty Mentor • IISc Bangalore',
    text: 'Your preprint draft looks promising. Let us schedule a 15-minute review call this Friday in the sprint room.',
    time: '1h ago',
    unread: true,
  },
  {
    id: 'msg-2',
    convId: 'conv-kavita',
    sender: 'Kavita Rao',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    headline: 'Systems Builder • DTU Delhi',
    text: 'Hey Alex, I just submitted a PR to your Raft implementation with the test harness for network partitions.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 'msg-3',
    convId: 'conv-priya',
    sender: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    headline: 'Machine Learning Researcher • IIT Bombay',
    text: 'We are looking for someone skilled in distributed systems to help scale our pipeline. Would you like to team up for the IEEE Hackathon?',
    time: '2h ago',
    unread: false,
  },
];

interface ChatMessage {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

const PEER_REPLIES: Record<string, string[]> = {
  'conv-anita': [
    'Sounds great! I will reserve the sprint room for us on Friday. Looking forward to our review.',
    'Understood. Let us review the benchmark graphs and leader election tests.',
  ],
  'conv-kavita': [
    'Super clean! The test harness passed on my machine too. Merging it in now!',
    'Thanks for the quick response. Let us sync up on the next milestone.',
  ],
  'conv-priya': [
    'Awesome! I just sent you the GitHub repository link. Let us start on the model loader.',
    'Sounds like a solid plan. I will prepare the dataset preprocessing script.',
  ],
};

interface StudentDashboardClientProps {
  myWorks: Work[];
  profiles?: Profile[];
}

export default function StudentDashboardClient({
  myWorks: initialWorks,
}: StudentDashboardClientProps) {
  const { currentUser: authUser } = useRole();
  const currentUser = authUser || ROLE_PERSONAS.student;

  // Filter skills state
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [appliedRoleIds, setAppliedRoleIds] = useState<string[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<PendingRequest[]>(INITIAL_REQUESTS);
  const [acceptedRequests, setAcceptedRequests] = useState<string[]>([]);
  const [messagesList, setMessagesList] = useState<DashboardMessagePreview[]>(INITIAL_MESSAGES);
  const [userSkills, setUserSkills] = useState<string[]>([
    'Distributed Systems',
    'Rust',
    'TypeScript',
    'React',
    'Cloud Infrastructure',
  ]);
  const [bioText, setBioText] = useState<string>(
    'Student builder passionate about distributed systems, link-first verification, and real-time collaboration.'
  );

  // Floating Live Chat Box State
  const [activeChatPeer, setActiveChatPeer] = useState<DashboardMessagePreview | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Hydrate custom user skills & bio from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSkills = localStorage.getItem('csc_user_skills');
      if (storedSkills) {
        try {
          const parsed = JSON.parse(storedSkills);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setUserSkills(parsed);
          }
        } catch {
          // fallback
        }
      }
      const storedBio = localStorage.getItem('csc_user_bio');
      if (storedBio && storedBio.trim().length > 0) {
        setBioText(storedBio);
      }
    }
  }, []);

  // When activeChatPeer changes, load its message thread
  useEffect(() => {
    if (!activeChatPeer) return;

    if (typeof window !== 'undefined') {
      const storageKey = `csc_chat_msgs_${activeChatPeer.convId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setChatMessages(parsed);
            return;
          }
        } catch {
          // fallback
        }
      }
    }

    // Default seed thread for this person
    setChatMessages([
      {
        id: `init-${activeChatPeer.id}`,
        sender_id: activeChatPeer.convId,
        content: activeChatPeer.text,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ]);
  }, [activeChatPeer]);

  // Auto-scroll chat box to bottom
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isPeerTyping]);

  const handleApplyRole = (roleId: string) => {
    if (appliedRoleIds.includes(roleId)) return;
    setAppliedRoleIds((prev) => [...prev, roleId]);
  };

  const handleAcceptConnection = (requestId: string) => {
    setAcceptedRequests((prev) => [...prev, requestId]);
    setConnectionRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const handleDeclineConnection = (requestId: string) => {
    setConnectionRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  // Open Live Chat Box
  const handleOpenChat = (msg: DashboardMessagePreview) => {
    setActiveChatPeer(msg);
    // Mark as read in local list
    setMessagesList((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, unread: false } : m))
    );
  };

  // Handle Send in Live Chat Box
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatPeer) return;

    const text = chatInput.trim();
    const userMsg: ChatMessage = {
      id: `dash-msg-${Date.now()}`,
      sender_id: currentUser.id || 'current-user',
      content: text,
      created_at: new Date().toISOString(),
    };

    const nextMessages = [...chatMessages, userMsg];
    setChatMessages(nextMessages);
    setChatInput('');

    // Save to localStorage so /messages sees it too
    if (typeof window !== 'undefined') {
      localStorage.setItem(`csc_chat_msgs_${activeChatPeer.convId}`, JSON.stringify(nextMessages));
    }

    // Update message preview snippet
    setMessagesList((prev) =>
      prev.map((m) =>
        m.convId === activeChatPeer.convId
          ? { ...m, text, time: 'Just now', unread: false }
          : m
      )
    );

    // Simulate realistic reply from the person after 1.8s
    setTimeout(() => {
      setIsPeerTyping(true);
    }, 700);

    setTimeout(() => {
      setIsPeerTyping(false);
      const peerOptions = PEER_REPLIES[activeChatPeer.convId] || [
        'Got your message! I will review and get back to you shortly.',
      ];
      const reply = peerOptions[Math.floor(Math.random() * peerOptions.length)];

      const peerMsg: ChatMessage = {
        id: `peer-msg-${Date.now()}`,
        sender_id: activeChatPeer.convId,
        content: reply,
        created_at: new Date().toISOString(),
      };

      setChatMessages((cur) => {
        const withPeer = [...cur, peerMsg];
        if (typeof window !== 'undefined') {
          localStorage.setItem(`csc_chat_msgs_${activeChatPeer.convId}`, JSON.stringify(withPeer));
        }
        return withPeer;
      });

      setMessagesList((prev) =>
        prev.map((m) =>
          m.convId === activeChatPeer.convId
            ? { ...m, text: reply, time: 'Just now' }
            : m
        )
      );
    }, 2200);
  };

  // Filter collaboration roles
  const filteredRoles = COLLABORATION_OPPORTUNITIES.filter((role) => {
    if (selectedSkillFilter === 'all') return true;
    if (selectedSkillFilter === 'matched') {
      return role.requiredSkills.some((skill) =>
        userSkills.some((us) => us.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(us.toLowerCase()))
      );
    }
    return (
      role.category === selectedSkillFilter ||
      role.requiredSkills.some((s) => s.toLowerCase().includes(selectedSkillFilter.toLowerCase()))
    );
  });

  return (
    <div className="space-y-8 relative">
      {/* ── TOP HERO BANNER (MATCHING REFERENCE DESIGN) ── */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#1b59f8]/20 shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1b59f8] border border-blue-200/80">
                  VERIFIED STUDENT BUILDER
                </span>
                <span className="text-xs font-mono text-slate-500">
                  @iisc.ac.in • IISc Bangalore
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {currentUser.name}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl">
                Your proof of work and accredited badges are verified across campus. 3 Tier-1 recruiters inspected your repositories this week.
              </p>
            </div>
          </div>

          {/* Action Buttons Cluster */}
          <div className="flex flex-col items-start lg:items-end gap-2.5 shrink-0">
            {/* Row 1 */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/works/new"
                className="px-4 py-2 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Proof</span>
              </Link>
              <Link
                href="/profile/edit"
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>Add Certificate</span>
              </Link>
              <Link
                href="/works/new"
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Post Achievement</span>
              </Link>
              <a
                href="#collab-section"
                className="px-4 py-2 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Collab Requests</span>
              </a>
            </div>

            {/* Row 2 */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/cv"
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#1b59f8]" />
                <span>ATS CV Studio</span>
              </Link>
              <Link
                href="/profile/me"
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>View Profile</span>
              </Link>
              <Link
                href="/profile/edit"
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <UserCog className="w-3.5 h-3.5 text-[#1b59f8]" />
                <span>Edit Profile</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Status Indicators */}
        <div className="mt-8 pt-5 border-t border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">PORTFOLIO STATUS</p>
              <p className="text-xs font-bold text-slate-800">Live &amp; Recruiter-Discoverable</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">LICENSES &amp; BADGES</p>
              <p className="text-xs font-bold text-slate-800">2 Verified Credentials</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">MILESTONE POSTS</p>
              <p className="text-xs font-bold text-slate-800">1 Photo Achievements</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">COLLAB REQUESTS</p>
              <p className="text-xs font-bold text-slate-800">{connectionRequests.length} Incoming • 0 Sent</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BENTO TILES ROW: ATS CHECKLIST STATUS & RECRUITER INQUIRIES ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TILE 1: ATS SCORE GAUGE (Span 4) */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1b59f8] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>ATS Checklist Status</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                CHECKLIST PASSING
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700 font-medium">Standard Section Headings</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 font-bold">Present</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700 font-medium">Contact Information &amp; Links</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 font-bold">Validated</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700 font-medium">Date Format Consistency</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 font-bold">Standard</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700 font-medium">Verified Campus Works Attached</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 font-bold">Linked</span>
              </div>
            </div>
          </div>

          <p className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            Rule-based checks confirm your resume uses standard headings and single-column formatting without unverified text.
          </p>
        </div>

        {/* TILE 2: RECRUITER VIEWS & INQUIRIES (Span 8) */}
        <div className="lg:col-span-8 rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Recruiter Inquiries &amp; Portfolio Activity
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold">
                Verified Portfolio
              </span>
            </div>

            <div className="mt-4 p-8 rounded-2xl bg-[#f8fafc] border border-slate-200/70 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1b59f8] flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="max-w-md">
                <h3 className="text-sm font-bold text-slate-900">Direct Inquiries from Recruiter Searches</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  When verified recruiters or university faculty reach out regarding your published proof-of-work repositories, their inquiries and meeting invitations will appear here.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/works/new"
                  className="px-5 py-2 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  Publish New Proof
                </Link>
                <Link
                  href="/messages"
                  className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs"
                >
                  Open Messages
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
            <span>Matched competencies: <strong className="text-slate-800">Systems Architecture, Distributed Systems, Cloud Infrastructure</strong></span>
            <Link href="/showcase" className="text-[#1b59f8] font-semibold hover:underline shrink-0">
              See what recruiters see &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN 2-COLUMN LAYOUT: Content on Left, Profile on Right ── */}
      <div id="collab-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ════════════════ LEFT COLUMN: Collaborations, Connections, Messages ════════════════ */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. REQUIRED COLLABORATIONS & ROLES MATCHED TO SKILLS */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1b59f8]" />
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    Required Collaborations &amp; Open Roles
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Campus projects seeking team members matching your skills and preferences
                </p>
              </div>

              <Link
                href="/collaborate"
                className="text-xs font-bold text-[#1b59f8] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Live Sprint Rooms</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedSkillFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSkillFilter === 'all'
                    ? 'bg-[#0f172a] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                All Roles ({COLLABORATION_OPPORTUNITIES.length})
              </button>

              <button
                type="button"
                onClick={() => setSelectedSkillFilter('matched')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedSkillFilter === 'matched'
                    ? 'bg-[#1b59f8] text-white shadow-xs'
                    : 'bg-blue-50 text-[#1b59f8] border border-blue-200/80 hover:bg-blue-100'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Matched to My Skills</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSkillFilter('systems')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSkillFilter === 'systems'
                    ? 'bg-[#0f172a] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Systems &amp; Rust
              </button>

              <button
                type="button"
                onClick={() => setSelectedSkillFilter('ai')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSkillFilter === 'ai'
                    ? 'bg-[#0f172a] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                AI &amp; PyTorch
              </button>

              <button
                type="button"
                onClick={() => setSelectedSkillFilter('frontend')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSkillFilter === 'frontend'
                    ? 'bg-[#0f172a] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Frontend &amp; React
              </button>

              <button
                type="button"
                onClick={() => setSelectedSkillFilter('design')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSkillFilter === 'design'
                    ? 'bg-[#0f172a] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                UI/UX Design
              </button>
            </div>

            {/* Role Cards List */}
            <div className="space-y-4">
              {filteredRoles.map((role) => {
                const isApplied = appliedRoleIds.includes(role.id);
                return (
                  <div
                    key={role.id}
                    className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200 hover:border-[#1b59f8]/40 transition-all space-y-3.5 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1b59f8] border border-blue-200">
                            {role.roleNeeded}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500">
                            {role.campus} • {role.teamSize}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1b59f8] transition-colors">
                          {role.projectTitle}
                        </h3>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400 shrink-0">
                        {role.postedAt}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {role.description}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {role.requiredSkills.map((skill, sIdx) => {
                        const isMatched = userSkills.some(
                          (us) => us.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(us.toLowerCase())
                        );
                        return (
                          <span
                            key={sIdx}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                              isMatched
                                ? 'bg-blue-50 text-[#1b59f8] border-blue-200 font-bold'
                                : 'bg-white text-slate-600 border-slate-200 font-normal'
                            }`}
                          >
                            {isMatched ? '✓ ' : ''}{skill}
                          </span>
                        );
                      })}
                    </div>

                    {/* Card Actions */}
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Open for campus collaboration
                      </span>

                      <div className="flex items-center gap-2">
                        <Link
                          href="/collaborate"
                          className="px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                        >
                          Join Sprint
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleApplyRole(role.id)}
                          disabled={isApplied}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1 ${
                            isApplied
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-[#0f172a] hover:bg-slate-800 text-white active:scale-95'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Interest Sent</span>
                            </>
                          ) : (
                            <>
                              <span>Express Interest</span>
                              <ArrowRight className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. CONNECTION REQUESTS SECTION */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Connection Requests ({connectionRequests.length})
                </h2>
              </div>
              <Link
                href="/connections"
                className="text-xs font-bold text-[#1b59f8] hover:underline"
              >
                View Network &rarr;
              </Link>
            </div>

            {acceptedRequests.length > 0 && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Connected! You can now send direct messages and view contact links.</span>
              </div>
            )}

            {connectionRequests.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#f8fafc] text-center space-y-1">
                <p className="text-xs font-bold text-slate-700">No pending connection requests</p>
                <p className="text-[11px] text-slate-500">
                  When peers from your campus send invitations to connect, they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {connectionRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={req.avatar}
                        alt={req.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-white shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{req.name}</h4>
                          <span className="text-[10px] font-mono text-slate-400">• {req.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">{req.campus}</p>
                        <p className="text-xs text-slate-700 mt-1 bg-white p-2 rounded-lg border border-slate-200/60 leading-relaxed">
                          &ldquo;{req.note}&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAcceptConnection(req.id)}
                        className="px-3.5 py-1.5 rounded-full bg-[#1b59f8] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeclineConnection(req.id)}
                        className="px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. RECENT MESSAGES & REAL CHAT BOX TRIGGER */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Recent Messages
                </h2>
              </div>
              <Link
                href="/messages"
                className="text-xs font-bold text-[#1b59f8] hover:underline"
              >
                Open Full Inbox &rarr;
              </Link>
            </div>

            <div className="space-y-2.5">
              {messagesList.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleOpenChat(msg)}
                  className="p-3.5 rounded-2xl bg-[#f8fafc] hover:bg-slate-100 border border-slate-200 transition-all flex items-start justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={msg.avatar}
                      alt={msg.sender}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-[#1b59f8] transition-colors">
                          {msg.sender}
                        </span>
                        {msg.unread && (
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                        <span className="text-[10px] font-mono text-slate-400">
                          {msg.headline}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1 leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">
                      {msg.time}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenChat(msg);
                      }}
                      className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 border border-slate-200 text-[#1b59f8] text-[11px] font-bold shadow-2xs transition-colors flex items-center gap-1"
                    >
                      <span>Chat</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. YOUR PUBLISHED PROOFS OF WORK */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1b59f8]" />
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Your Published Proofs of Work ({initialWorks.length})
                </h2>
              </div>
              <Link
                href="/works/new"
                className="px-3.5 py-1.5 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish New</span>
              </Link>
            </div>

            {initialWorks.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#f8fafc] text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1b59f8] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Publish your first verified project</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm mx-auto">
                    Add your GitHub repository, research PDF, or architecture blueprint to make it discoverable to peers and recruiters.
                  </p>
                </div>
                <Link
                  href="/works/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1b59f8] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Work Now</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {initialWorks.map((work) => (
                  <div
                    key={work.id}
                    className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-50 text-[#1b59f8] font-bold">
                        {work.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">{work.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{work.description}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                      <Link href={`/works/${work.id}`} className="text-[#1b59f8] font-semibold hover:underline">
                        Inspect &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ════════════════ RIGHT COLUMN: User Profile Sidebar ════════════════ */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* USER PROFILE CARD */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 text-center sm:text-left">
            {/* Header: Avatar & Verified Badge */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#1b59f8]/10 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified Builder</span>
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  {currentUser.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {currentUser.email}
                </p>
              </div>
            </div>

            {/* Institution / Campus */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <Building className="w-4 h-4 text-[#1b59f8] shrink-0" />
              <span>{currentUser.institution || 'Indian Institute of Science (IISc)'}</span>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold text-left">
                Bio &amp; Research Focus
              </p>
              <p className="text-xs text-slate-600 leading-relaxed text-left">
                {bioText}
              </p>
            </div>

            {/* Edit Profile Action Button */}
            <Link
              href="/profile/edit"
              className="w-full py-2.5 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95"
            >
              <UserCog className="w-4 h-4" />
              <span>Edit Profile Details</span>
            </Link>

            {/* Active Skills & Preferences */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-left">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  My Active Skills
                </span>
                <Link href="/profile/edit" className="text-[10px] font-bold text-[#1b59f8] hover:underline">
                  + Add Skills
                </Link>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {userSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg bg-blue-50/80 text-[#1b59f8] border border-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-base font-extrabold text-slate-900">14</p>
                <p className="text-[10px] text-slate-500 font-medium">Peers</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-base font-extrabold text-slate-900">{initialWorks.length || 3}</p>
                <p className="text-[10px] text-slate-500 font-medium">Proofs</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-base font-extrabold text-slate-900">2</p>
                <p className="text-[10px] text-slate-500 font-medium">Unread</p>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-left">
              <Link
                href="/messages"
                className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <span>Direct Messages</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/connections"
                className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>Connection Network</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/cv"
                className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>ATS Resume Studio</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/showcase"
                className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                  <span>Explore Public Showcase</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* ════════════════ REAL FLOATING CHAT BOX (Dashboard Pop-up) ════════════════ */}
      {activeChatPeer && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[92vw] sm:w-96 rounded-3xl bg-white border border-slate-300 shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Chat Window Header */}
          <div className="p-3.5 bg-[#0f172a] text-white flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <img
                  src={activeChatPeer.avatar}
                  alt={activeChatPeer.sender}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-slate-900" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">
                  {activeChatPeer.sender}
                </h4>
                <p className="text-[10px] text-slate-300 truncate">
                  {activeChatPeer.headline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href={`/messages?conv=${activeChatPeer.convId}`}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Open in full screen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setActiveChatPeer(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Close chat box"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Message Stream */}
          <div className="h-72 overflow-y-auto p-4 bg-[#f8fafc] space-y-3">
            {chatMessages.map((m) => {
              const isMe = m.sender_id === (currentUser.id || 'current-user');
              return (
                <div
                  key={m.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-2.5 text-xs leading-relaxed space-y-1 shadow-2xs ${
                      isMe
                        ? 'bg-[#1b59f8] text-white rounded-br-xs'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.content}</p>
                    <div
                      className={`flex items-center justify-end gap-1 text-[9px] ${
                        isMe ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      <span>
                        {new Date(m.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isMe && <CheckCheck className="w-3 h-3 text-blue-200" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Peer is Typing animation */}
            {isPeerTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white border border-slate-200 px-3 py-2 text-[11px] text-slate-500 rounded-bl-xs shadow-2xs flex items-center gap-1.5">
                  <span>{activeChatPeer.sender.split(' ')[0]} is typing</span>
                  <span className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1b59f8] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1b59f8] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1b59f8] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}

            <div ref={chatScrollRef} />
          </div>

          {/* Real Chat Input Form */}
          <form onSubmit={handleSendChatMessage} className="p-3 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Reply to ${activeChatPeer.sender.split(' ')[0]}...`}
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1b59f8] focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2 rounded-xl bg-[#1b59f8] hover:bg-blue-700 disabled:opacity-40 text-white transition-all shadow-xs flex items-center justify-center shrink-0 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

        </div>
      )}

    </div>
  );
}
