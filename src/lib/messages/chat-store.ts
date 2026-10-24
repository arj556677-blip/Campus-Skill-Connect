'use client';

export interface ParticipantProfile {
  id: string;
  display_name: string;
  username?: string;
  headline?: string;
  avatar_url?: string | null;
  avatar_path?: string | null;
  role?: string;
  institution?: string;
}

export interface ConversationItem {
  id: string;
  otherUser: ParticipantProfile;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatMessageItem {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

import { getConnection } from '@/lib/connections/connection-store';

// Known directory contacts for profile resolution
export const KNOWN_CONTACTS: Record<string, ParticipantProfile> = {
  'user-5': {
    id: 'user-5',
    display_name: 'Marcus Chen',
    username: 'marcus_chen',
    headline: 'Senior Talent Partner @ Stripe • Distributed Systems Lead',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    role: 'recruiter',
    institution: 'Bangalore Silicon Valley',
  },
  'marcus-chen-recruiter': {
    id: 'marcus-chen-recruiter',
    display_name: 'Marcus Chen',
    username: 'marcus_chen',
    headline: 'Senior Talent Partner @ Stripe • Distributed Systems Lead',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    role: 'recruiter',
    institution: 'Bangalore Silicon Valley',
  },
  'sarah-jenkins-recruiter': {
    id: 'sarah-jenkins-recruiter',
    display_name: 'Sarah Jenkins',
    username: 'sarah_j',
    headline: 'Senior Technical Recruiter @ Atlassian',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    role: 'recruiter',
    institution: 'Bangalore Silicon Valley',
  },
  'f5bbefd5-972a-4ba9-95f6-ad651e55bb07': {
    id: 'f5bbefd5-972a-4ba9-95f6-ad651e55bb07',
    display_name: 'Neha Reddy',
    username: 'neha_reddy',
    headline: 'Cloud Infrastructure & High-Performance Go Backend',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'student',
    institution: 'BITS Pilani',
  },
  'user-1': {
    id: 'user-1',
    display_name: 'Alex Rivera',
    username: 'alex_rivera',
    headline: 'Full-Stack Engineer & Distributed Systems Explorer',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    role: 'student',
    institution: 'Indian Institute of Science (IISc)',
  },
  'user-2': {
    id: 'user-2',
    display_name: 'Priya Sharma',
    username: 'priya_ml',
    headline: 'Machine Learning Researcher & Computer Vision Enthusiast',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    role: 'student',
    institution: 'Indian Institute of Technology Bombay (IITB)',
  },
};

// Default rich conversation history for Marcus Chen
const DEFAULT_MARCUS_MESSAGES: ChatMessageItem[] = [
  {
    id: 'msg-mc-1',
    conversation_id: 'conv_marcus-chen-recruiter',
    sender_id: 'marcus-chen-recruiter',
    content: 'Hi Ragav! I reviewed your verified Proof-of-Work repositories on Campus Skill Connect, especially the Redis Cache-Aside layer and WebRTC low-latency audio transmission.',
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'msg-mc-2',
    conversation_id: 'conv_marcus-chen-recruiter',
    sender_id: 'marcus-chen-recruiter',
    content: "We're actively recruiting for our Distributed Systems & Cloud Infrastructure Engineering team for upcoming graduates. Are you open to discussing potential project alignment?",
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 23.5).toISOString(),
  },
  {
    id: 'msg-mc-3',
    conversation_id: 'conv_marcus-chen-recruiter',
    sender_id: 'user-student',
    content: "Hello Marcus! Thanks for reaching out. Yes, I'd love to discuss that! The Redis caching benchmarks and eBPF observability tools were exciting projects to build.",
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: 'msg-mc-4',
    conversation_id: 'conv_marcus-chen-recruiter',
    sender_id: 'marcus-chen-recruiter',
    content: "That's fantastic. I've scheduled your profile for fast-track recruiter review. Could you share your preferred time for a quick 15-minute technical sync this week?",
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'msg-mc-5',
    conversation_id: 'conv_marcus-chen-recruiter',
    sender_id: 'user-student',
    content: 'Thursday or Friday afternoon works great for me. Looking forward to connecting!',
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 16).toISOString(),
  },
  {
    id: 'msg-mc-6',
    conversation_id: 'conv_marcus-chen-recruiter',
    sender_id: 'marcus-chen-recruiter',
    content: 'Perfect! Looking forward to our chat. Feel free to ping me here anytime if you publish new benchmarks or updates to your repositories.',
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

// Default message history for Neha Reddy
const DEFAULT_NEHA_MESSAGES: ChatMessageItem[] = [
  {
    id: 'msg-nr-1',
    conversation_id: 'conv_f5bbefd5-972a-4ba9-95f6-ad651e55bb07',
    sender_id: 'f5bbefd5-972a-4ba9-95f6-ad651e55bb07',
    content: "Hey Ragav! Saw your deep learning research on autonomous robotics. We're building an eBPF cluster monitor at BITS Pilani and would love to collaborate on the pipeline telemetry!",
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'msg-nr-2',
    conversation_id: 'conv_f5bbefd5-972a-4ba9-95f6-ad651e55bb07',
    sender_id: 'user-student',
    content: 'Hey Neha! That sounds awesome. I have been experimenting with kernel probes and Go runtime metrics. Happy to team up on this sprint!',
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
];

function getStorageKey(convId: string): string {
  return `csc_msgs_${convId}`;
}

export function resolveContactProfile(contactId: string): ParticipantProfile {
  if (KNOWN_CONTACTS[contactId]) {
    return KNOWN_CONTACTS[contactId];
  }

  // Check connection-store in localStorage
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`csc_conn_${contactId}`);
      if (raw) {
        const item = JSON.parse(raw);
        return {
          id: contactId,
          display_name: item.name || 'Campus Peer',
          headline: item.headline || 'Verified Campus Connection',
          avatar_url: item.avatar || null,
          role: item.role || 'student',
          institution: item.institution,
        };
      }
    } catch {}
  }

  return {
    id: contactId,
    display_name: contactId.includes('marcus') ? 'Marcus Chen' : 'Campus Peer',
    headline: 'Verified Campus Connection',
    avatar_url: null,
  };
}

export function getStoredMessages(convId: string): ChatMessageItem[] {
  if (typeof window === 'undefined') return [];

  // Special-case initial seed histories
  try {
    const raw = localStorage.getItem(getStorageKey(convId));
    if (raw) {
      return JSON.parse(raw) as ChatMessageItem[];
    }
  } catch {}

  // If uninitialized, seed defaults
  if (convId.includes('marcus-chen') || convId.includes('user-5')) {
    saveStoredMessages(convId, DEFAULT_MARCUS_MESSAGES);
    return DEFAULT_MARCUS_MESSAGES;
  }

  if (convId.includes('f5bbefd5-972a-4ba9-95f6-ad651e55bb07') || convId.includes('neha')) {
    saveStoredMessages(convId, DEFAULT_NEHA_MESSAGES);
    return DEFAULT_NEHA_MESSAGES;
  }

  return [];
}

export function saveStoredMessages(convId: string, messages: ChatMessageItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(convId), JSON.stringify(messages));
    window.dispatchEvent(new CustomEvent('csc-chat-updated', { detail: { convId } }));
  } catch (err) {
    console.warn('[chat-store] Save error:', err);
  }
}

export function addMessageToConversation(
  convId: string,
  message: ChatMessageItem
): ChatMessageItem[] {
  const current = getStoredMessages(convId);
  const updated = [...current, message];
  saveStoredMessages(convId, updated);
  return updated;
}

export function getInitialConversations(): ConversationItem[] {
  const convs: ConversationItem[] = [];

  // Check if Marcus Chen is an accepted collaborator
  const mcConn = getConnection('user-5') || getConnection('marcus-chen-recruiter');
  const isMcAccepted = mcConn ? mcConn.status === 'accepted' : true;

  if (isMcAccepted) {
    const mcMsgs = getStoredMessages('conv_marcus-chen-recruiter');
    const lastMc = mcMsgs[mcMsgs.length - 1];
    convs.push({
      id: 'conv_marcus-chen-recruiter',
      otherUser: KNOWN_CONTACTS['marcus-chen-recruiter'],
      lastMessage: lastMc?.content || 'Perfect! Looking forward to our chat.',
      lastMessageAt: lastMc?.created_at || new Date().toISOString(),
      unreadCount: 0,
    });
  }

  // Check other accepted connections in localStorage
  if (typeof window !== 'undefined') {
    try {
      const rawIndex = localStorage.getItem('csc_all_connections');
      const ids: string[] = rawIndex ? JSON.parse(rawIndex) : [];
      const seenIds = new Set<string>(['marcus-chen-recruiter', 'user-5']);

      for (const id of ids) {
        if (seenIds.has(id)) continue;
        seenIds.add(id);

        const raw = localStorage.getItem(`csc_conn_${id}`);
        if (raw) {
          const item = JSON.parse(raw);
          if (item && item.status === 'accepted') {
            const convId = `conv_${id}`;
            const msgs = getStoredMessages(convId);
            const lastMsg = msgs[msgs.length - 1];
            convs.push({
              id: convId,
              otherUser: {
                id,
                display_name: item.name || 'Campus Peer',
                headline: item.headline || 'Verified Campus Collaborator',
                avatar_url: item.avatar || null,
                role: item.role,
                institution: item.institution,
              },
              lastMessage: lastMsg?.content || 'Collaboration accepted. Ready to message.',
              lastMessageAt: lastMsg?.created_at || item.updatedAt || new Date().toISOString(),
              unreadCount: 0,
            });
          }
        }
      }
    } catch {}
  }

  return convs;
}

export function getOrCreateConversation(recipientId: string): ConversationItem {
  const convId = `conv_${recipientId}`;
  const profile = resolveContactProfile(recipientId);
  const msgs = getStoredMessages(convId);
  const lastMsg = msgs[msgs.length - 1];

  return {
    id: convId,
    otherUser: profile,
    lastMessage: lastMsg?.content || 'Collaboration session ready',
    lastMessageAt: lastMsg?.created_at || new Date().toISOString(),
    unreadCount: 0,
  };
}
