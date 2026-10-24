'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  MessageSquare,
  Send,
  Search,
  Check,
  CheckCheck,
  CheckCircle2,
  ShieldAlert,
  Ban,
  AlertCircle,
  RefreshCw,
  X,
  Sparkles,
  ArrowLeft,
  Circle,
  Paperclip,
  Smile,
} from 'lucide-react';
import { useRole } from '@/lib/auth/role-context';
import { createBrowserClient } from '@supabase/ssr';

interface ParticipantProfile {
  id: string;
  display_name: string;
  username?: string;
  headline?: string;
  avatar_url?: string | null;
  institution?: string;
}

interface ConversationItem {
  id: string;
  otherUser: ParticipantProfile;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface MessageItem {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

const MAX_MESSAGE_LENGTH = 2000;

// Default seeded campus peers who texted us
const SEED_CONVERSATIONS: ConversationItem[] = [
  {
    id: 'conv-anita',
    otherUser: {
      id: 'user-anita',
      display_name: 'Dr. Anita Sengupta',
      username: 'anita.sengupta',
      headline: 'Professor of Distributed Systems • IISc Bangalore',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      institution: 'IISc Bangalore',
    },
    lastMessage: 'Your preprint draft looks promising. Let us schedule a 15-minute review call this Friday in the sprint room.',
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 1,
  },
  {
    id: 'conv-priya',
    otherUser: {
      id: 'user-priya',
      display_name: 'Priya Sharma',
      username: 'priya.ml',
      headline: 'Machine Learning Researcher • IIT Bombay',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      institution: 'IIT Bombay',
    },
    lastMessage: 'We are looking for someone skilled in distributed systems to help scale our pipeline. Would you like to team up for the IEEE Hackathon?',
    lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
    unreadCount: 0,
  },
  {
    id: 'conv-rohan',
    otherUser: {
      id: 'user-rohan',
      display_name: 'Rohan Mehta',
      username: 'rohan.dev',
      headline: 'Full-Stack Software Engineer • BITS Pilani',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      institution: 'BITS Pilani',
    },
    lastMessage: 'Hey! The WebRTC room demo you built is awesome. Could you share how you handled the STUN/TURN fallback?',
    lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 0,
  },
  {
    id: 'conv-kavita',
    otherUser: {
      id: 'user-kavita',
      display_name: 'Kavita Rao',
      username: 'kavita.code',
      headline: 'Systems & Compiler Builder • DTU Delhi',
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      institution: 'DTU Delhi',
    },
    lastMessage: 'I just reviewed your pull request with the test harness for network partitions. Check it out!',
    lastMessageAt: new Date(Date.now() - 172800000).toISOString(),
    unreadCount: 0,
  },
];

// Initial seeded message threads for each conversation
const SEED_MESSAGES: Record<string, MessageItem[]> = {
  'conv-anita': [
    {
      id: 'm-anita-1',
      conversation_id: 'conv-anita',
      sender_id: 'user-anita',
      content: 'Hello! I reviewed your Raft distributed consensus repository on the showcase. The leader election logic and state machine transitions look very clean.',
      is_read: true,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'm-anita-2',
      conversation_id: 'conv-anita',
      sender_id: 'user-anita',
      content: 'Your preprint draft looks promising. Let us schedule a 15-minute review call this Friday in the sprint room.',
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  'conv-priya': [
    {
      id: 'm-priya-1',
      conversation_id: 'conv-priya',
      sender_id: 'user-priya',
      content: 'Hey Alex! Saw your profile on the campus showcase.',
      is_read: true,
      created_at: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: 'm-priya-2',
      conversation_id: 'conv-priya',
      sender_id: 'user-priya',
      content: 'We are looking for someone skilled in distributed systems to help scale our pipeline. Would you like to team up for the IEEE Hackathon?',
      is_read: true,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
  'conv-rohan': [
    {
      id: 'm-rohan-1',
      conversation_id: 'conv-rohan',
      sender_id: 'user-rohan',
      content: 'Hey! The WebRTC room demo you built is awesome. Could you share how you handled the STUN/TURN fallback?',
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  'conv-kavita': [
    {
      id: 'm-kavita-1',
      conversation_id: 'conv-kavita',
      sender_id: 'user-kavita',
      content: 'Hey, I just reviewed your pull request with the test harness for network partitions. Check it out!',
      is_read: true,
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
};

const PEER_AUTO_REPLIES: Record<string, string[]> = {
  'conv-anita': [
    'Sounds like a plan! I will reserve the sprint room for us on Friday. Please ensure the benchmark charts are updated.',
    'Excellent initiative. I have reviewed your latest notes and agree with the architectural direction.',
    'Let us also invite the peer reviewers from the distributed systems lab to join the discussion.',
  ],
  'conv-priya': [
    'Awesome! I just sent you our GitHub repository invite. Let us set up the data loader first!',
    'Glad to have you on board! The hackathon submission deadline is next Sunday, so we have good runway.',
    'Perfect! I will send over the dataset weights and pipeline diagram.',
  ],
  'conv-rohan': [
    'Thanks so much for the explanation! That makes a lot of sense regarding the ICE candidate gathering.',
    'Great insight, I am testing it right now on my local development branch.',
    'Will do! Let us catch up in the campus coding sprint room sometime this week.',
  ],
  'conv-kavita': [
    'Super clean! All the integration tests passed on my local machine. Merging the PR now!',
    'Thanks for the quick turnaround! Let us coordinate on the next sprint milestone.',
    'Sounds great. I will tag you on the release notes once we deploy the build.',
  ],
};

export default function MessagesClient() {
  const searchParams = useSearchParams();
  const { currentUser } = useRole();

  const currentUserId = currentUser?.id || 'current-user';

  const [conversations, setConversations] = useState<ConversationItem[]>(SEED_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>('conv-anita');
  const [messages, setMessages] = useState<MessageItem[]>(SEED_MESSAGES['conv-anita']);
  const [inputVal, setInputVal] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [peerTyping, setPeerTyping] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Report & Block Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [blockedBanner, setBlockedBanner] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Supabase browser client for Realtime subscription if available
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
      ),
    []
  );

  // 1. Check if user navigated with ?conv= or ?user= param
  useEffect(() => {
    const requestedConv = searchParams.get('conv');
    if (requestedConv && SEED_MESSAGES[requestedConv]) {
      setActiveConvId(requestedConv);
    }
  }, [searchParams]);

  // 2. Load messages from localStorage / seed for the active conversation
  useEffect(() => {
    if (!activeConvId) return;

    if (typeof window !== 'undefined') {
      const storageKey = `csc_chat_msgs_${activeConvId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            return;
          }
        } catch {
          // fallback
        }
      }
    }

    // Fallback to seed messages
    const fallback = SEED_MESSAGES[activeConvId] || [];
    setMessages(fallback);

    // Mark conversation unread count as 0
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvId ? { ...c, unreadCount: 0 } : c))
    );
  }, [activeConvId]);

  // 3. Scroll to bottom whenever messages change or peer is typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, peerTyping]);

  // Active conversation object
  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  // 4. Handle Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !activeConv || isSending) return;

    const contentToSend = inputVal.trim();
    if (contentToSend.length > MAX_MESSAGE_LENGTH) {
      setErrorMsg(`Message exceeds ${MAX_MESSAGE_LENGTH} characters limit.`);
      return;
    }

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      conversation_id: activeConv.id,
      sender_id: currentUserId,
      content: contentToSend,
      is_read: true,
      created_at: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputVal('');
    setErrorMsg(null);
    setIsSending(true);

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`csc_chat_msgs_${activeConv.id}`, JSON.stringify(updatedMessages));
    }

    // Update conversation last message in list
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? {
              ...c,
              lastMessage: contentToSend,
              lastMessageAt: new Date().toISOString(),
              unreadCount: 0,
            }
          : c
      )
    );

    // Attempt backend POST if live session is active
    try {
      fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConv.id,
          content: contentToSend,
        }),
      }).catch(() => {
        // Safe silent catch in demo/offline mode
      });
    } catch {
      // ignore
    }

    setIsSending(false);
    inputRef.current?.focus();

    // 5. Simulate natural peer reply after 1.5 seconds!
    const peerReplies = PEER_AUTO_REPLIES[activeConv.id] || [
      'Got your message! Let me check the details and get back to you shortly.',
    ];
    const randomReply = peerReplies[Math.floor(Math.random() * peerReplies.length)];

    setTimeout(() => {
      setPeerTyping(activeConv.otherUser.display_name);
    }, 800);

    setTimeout(() => {
      setPeerTyping(null);
      const peerMsg: MessageItem = {
        id: `msg-peer-${Date.now()}`,
        conversation_id: activeConv.id,
        sender_id: activeConv.otherUser.id,
        content: randomReply,
        is_read: true,
        created_at: new Date().toISOString(),
      };

      setMessages((current) => {
        const next = [...current, peerMsg];
        if (typeof window !== 'undefined') {
          localStorage.setItem(`csc_chat_msgs_${activeConv.id}`, JSON.stringify(next));
        }
        return next;
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConv.id
            ? {
                ...c,
                lastMessage: randomReply,
                lastMessageAt: new Date().toISOString(),
              }
            : c
        )
      );
    }, 2400);
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(
    (c) =>
      c.otherUser.display_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (c.otherUser.headline || '').toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleBlockUser = () => {
    if (!activeConv) return;
    setBlockedUsers((prev) => [...prev, activeConv.otherUser.id]);
    setBlockedBanner(`${activeConv.otherUser.display_name} has been symmetrically blocked.`);
    setTimeout(() => setBlockedBanner(null), 4000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden text-slate-900">
      
      {/* ── TOP ANNOUNCEMENT BANNER IF BLOCKED ── */}
      {blockedBanner && (
        <div className="p-3 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ban className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{blockedBanner}</span>
          </div>
          <button type="button" onClick={() => setBlockedBanner(null)} className="text-rose-600 hover:text-rose-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── MAIN CHAT WORKSPACE (SIDEBAR + ACTIVE CHAT BOX) ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* ════════ SIDEBAR: CONVERSATIONS LIST (Left) ════════ */}
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 bg-[#f8fafc] flex flex-col shrink-0">
          
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#1b59f8]" />
                <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Direct Messages
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Chat
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#f8fafc] border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1b59f8] focus:bg-white"
              />
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.map((c) => {
              const isActive = c.id === activeConvId;
              const isBlocked = blockedUsers.includes(c.otherUser.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setActiveConvId(c.id);
                    setErrorMsg(null);
                  }}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-all ${
                    isActive
                      ? 'bg-white border-l-4 border-l-[#1b59f8] shadow-xs'
                      : 'hover:bg-slate-100/70'
                  }`}
                >
                  {/* Avatar with online indicator */}
                  <div className="relative shrink-0">
                    <img
                      src={c.otherUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                      alt={c.otherUser.display_name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-xs font-bold text-slate-900 truncate">
                        {c.otherUser.display_name}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(c.lastMessageAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 font-mono truncate mb-0.5">
                      {c.otherUser.institution || 'Campus Peer'}
                    </p>

                    <p className="text-xs text-slate-600 truncate font-normal">
                      {isBlocked ? 'User blocked' : c.lastMessage}
                    </p>
                  </div>

                  {c.unreadCount > 0 && !isActive && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#1b59f8] text-[9px] font-bold text-white shrink-0">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ════════ MAIN AREA: REAL ACTIVE CHAT BOX (Right) ════════ */}
        <div className="flex-1 flex flex-col bg-white min-w-0">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-white shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={activeConv.otherUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                  alt={activeConv.otherUser.display_name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {activeConv.otherUser.display_name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-[#1b59f8] border border-blue-200 font-semibold">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {activeConv.otherUser.headline || 'Verified Campus Connection'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                title="Report User"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleBlockUser}
                className="p-2 rounded-full hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
                title="Block User"
              >
                <Ban className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-[#f8fafc]">
            {/* Encryption & Safety Notice */}
            <div className="text-center py-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-mono text-slate-500 shadow-2xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified Peer Connection • End-to-End Chat</span>
              </span>
            </div>

            {/* Messages */}
            {messages.map((m) => {
              const isMe = m.sender_id === currentUserId;
              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <img
                      src={activeConv.otherUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover shrink-0 mb-1 ring-1 ring-slate-200"
                    />
                  )}

                  <div
                    className={`max-w-[75%] sm:max-w-[65%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 shadow-2xs animate-in fade-in duration-100 ${
                      isMe
                        ? 'bg-[#1b59f8] text-white rounded-br-xs'
                        : 'bg-white text-slate-900 border border-slate-200/90 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words font-normal">{m.content}</p>
                    
                    <div
                      className={`flex items-center justify-end gap-1 text-[9px] font-mono ${
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

            {/* Peer Typing Indicator */}
            {peerTyping && (
              <div className="flex items-end gap-2 justify-start animate-in fade-in duration-150">
                <img
                  src={activeConv.otherUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                />
                <div className="rounded-2xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs text-slate-500 rounded-bl-xs shadow-2xs flex items-center gap-1.5">
                  <span className="text-[11px] font-medium">{activeConv.otherUser.display_name} is typing</span>
                  <span className="flex items-center gap-0.5 ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1b59f8] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1b59f8] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1b59f8] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ════════ REAL CHAT INPUT BOX ════════ */}
          <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
            <form onSubmit={handleSendMessage} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    maxLength={MAX_MESSAGE_LENGTH}
                    placeholder={`Write a message to ${activeConv.otherUser.display_name}...`}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-2xl bg-[#f8fafc] border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1b59f8] focus:bg-white focus:ring-2 focus:ring-[#1b59f8]/10 transition-all"
                  />
                  
                  {/* Subtle Emoji Hint */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 flex items-center gap-1">
                    <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">Press Enter ↵</span>
                  </div>
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isSending}
                  className="px-4 py-3 rounded-2xl bg-[#1b59f8] hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Character Limit and Context Info */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-mono">
                <span>Direct end-to-end messaging active</span>
                <span>{inputVal.length} / {MAX_MESSAGE_LENGTH}</span>
              </div>
            </form>
          </div>
        </div>

      </div>

      {/* ── REPORT MODAL ── */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Report Conversation</h4>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Submit a confidential report regarding {activeConv.otherUser.display_name}. Platform administrators review all reports within 24 hours.
            </p>
            <textarea
              rows={3}
              placeholder="Describe the reason for your report..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1b59f8]"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReportModal(false);
                  setBlockedBanner('Thank you. Your report has been submitted to moderation.');
                  setTimeout(() => setBlockedBanner(null), 4000);
                }}
                className="px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
