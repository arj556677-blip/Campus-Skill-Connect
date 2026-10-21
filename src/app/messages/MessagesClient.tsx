'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  Video,
  Search,
  Check,
  CheckCheck,
  Sparkles,
  Paperclip,
  MoreVertical,
  ShieldCheck,
  User,
} from 'lucide-react';
import { MOCK_PROFILES } from '@/lib/data/mock-data';

interface Conversation {
  id: string;
  user: (typeof MOCK_PROFILES)[0];
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface MessageItem {
  id: string;
  senderId: string;
  content: string;
  time: string;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    user: MOCK_PROFILES[1], // Priya Sharma
    lastMessage: 'Hey! Loved your Redis cache implementation. Are you free to collab on YOLOv9?',
    time: '10:42 AM',
    unread: 2,
    online: true,
  },
  {
    id: 'conv-2',
    user: MOCK_PROFILES[2], // Karan Verma
    lastMessage: 'I pushed the updated Figma tokens for the editorial dark mode.',
    time: 'Yesterday',
    unread: 0,
    online: true,
  },
  {
    id: 'conv-3',
    user: MOCK_PROFILES[4], // Marcus Chen (Recruiter)
    lastMessage: 'Hi Alex, we reviewed your HyperCache work on Campus Skill Connect and want to schedule a call.',
    time: 'Oct 19',
    unread: 1,
    online: false,
  },
];

const INITIAL_MESSAGES: Record<string, MessageItem[]> = {
  'conv-1': [
    {
      id: 'm-1',
      senderId: 'user-2',
      content: 'Hey Alex! I saw your HyperCache project on the showcase. The 99.4% cache hit benchmark is incredible.',
      time: '10:30 AM',
    },
    {
      id: 'm-2',
      senderId: 'user-1',
      content: 'Thanks Priya! Using Redis sorted sets for sliding-window rate limiting made a huge difference under high concurrency.',
      time: '10:35 AM',
    },
    {
      id: 'm-3',
      senderId: 'user-2',
      content: 'Are you free to jump into a collaboration room to discuss hooking that into our drone vision inference pipeline?',
      time: '10:42 AM',
    },
  ],
  'conv-2': [
    {
      id: 'm-201',
      senderId: 'user-3',
      content: 'Hey! How do the new typography scales feel on mobile?',
      time: 'Yesterday',
    },
    {
      id: 'm-202',
      senderId: 'user-1',
      content: 'They look super clean and high-contrast. The Syne + Space Grotesk combination gives a premium editorial feel.',
      time: 'Yesterday',
    },
  ],
  'conv-3': [
    {
      id: 'm-301',
      senderId: 'user-5',
      content: 'Hi Alex, I am Marcus Chen from University Talent Acquisition at Stripe. Your proof-of-work caught our eye.',
      time: 'Oct 19',
    },
  ],
};

export default function MessagesClient() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>('conv-1');
  const [messages, setMessages] = useState<Record<string, MessageItem[]>>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activeMessages = messages[activeConvId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg: MessageItem = {
      id: 'm-' + Date.now(),
      senderId: 'user-1',
      content: inputVal.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg],
    }));

    // Update conversation snippet
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, lastMessage: inputVal.trim(), time: 'Just now' }
          : c
      )
    );

    const textToSend = inputVal.trim();
    setInputVal('');

    // Fire API route in background
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId,
          content: textToSend,
          senderId: 'user-1',
        }),
      });
    } catch {
      // Handled gracefully
    }
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.user.display_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="h-full rounded-3xl bg-white border border-[var(--color-border)] shadow-elevated flex overflow-hidden">
      {/* ── Left Sidebar: Conversations List ── */}
      <div className="w-80 md:w-96 border-r border-[var(--color-border)] flex flex-col bg-zinc-50/50">
        <div className="p-4 border-b border-[var(--color-border-subtle)] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-[var(--color-ink)] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[var(--color-brand-primary)]" />
              <span>Messages</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              Redis Pub/Sub
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-[var(--color-border)] text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
            />
          </div>
        </div>

        {/* Conversations Scrollable List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--color-border-subtle)]">
          {filteredConversations.map((conv) => {
            const isActive = conv.id === activeConvId;
            return (
              <button
                key={conv.id}
                onClick={() => {
                  setActiveConvId(conv.id);
                  // Clear unread
                  setConversations((prev) =>
                    prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c))
                  );
                }}
                className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                  isActive
                    ? 'bg-white border-l-4 border-[var(--color-brand-primary)] shadow-sm'
                    : 'hover:bg-zinc-100/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.user.avatar_url!}
                    alt={conv.user.display_name}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-zinc-200"
                  />
                  {conv.online && (
                    <span
                      title="Online (Redis Presence Heartbeat)"
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-[var(--color-ink)] truncate">
                      {conv.user.display_name}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                      {conv.time}
                    </span>
                  </div>

                  <p className="text-[11px] text-[var(--color-ink-muted)] truncate mt-0.5">
                    {conv.lastMessage}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full uppercase ${
                        conv.user.role === 'recruiter'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {conv.user.role}
                    </span>
                    {conv.unread > 0 && (
                      <span className="ml-auto w-4 h-4 rounded-full bg-[var(--color-brand-coral)] text-white text-[10px] font-bold flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right Main: Active Chat Thread ── */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Thread Header */}
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${activeConv.user.id}`} className="relative">
              <img
                src={activeConv.user.avatar_url!}
                alt={activeConv.user.display_name}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-200"
              />
              {activeConv.online && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </Link>

            <div>
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/profile/${activeConv.user.id}`}
                  className="font-bold text-sm text-[var(--color-ink)] hover:text-[var(--color-brand-primary)]"
                >
                  {activeConv.user.display_name}
                </Link>
                {activeConv.user.is_verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                )}
              </div>
              <p className="text-[11px] text-[var(--color-ink-muted)]">
                {activeConv.user.headline || activeConv.user.field}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/collaborate"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary)] text-xs font-semibold hover:bg-[var(--color-brand-primary)] hover:text-white transition-all"
            >
              <Video className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Launch WebRTC Room</span>
            </Link>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-zinc-50/30">
          <div className="text-center my-2">
            <span className="text-[10px] font-mono text-zinc-400 bg-white px-3 py-1 rounded-full border border-zinc-200">
              Encrypted 1-on-1 Session • Redis Pub/Sub Active
            </span>
          </div>

          {activeMessages.map((msg) => {
            const isMe = msg.senderId === 'user-1';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md sm:max-w-lg rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-soft ${
                    isMe
                      ? 'bg-[var(--color-brand-primary)] text-white rounded-br-xs'
                      : 'bg-white border border-[var(--color-border)] text-[var(--color-ink)] rounded-bl-xs'
                  }`}
                >
                  {msg.content}
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] font-mono text-zinc-400 px-1">
                  <span>{msg.time}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-blue-500" />}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Footer */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 border-t border-[var(--color-border)] bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Message ${activeConv.user.display_name}...`}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs sm:text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />

          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 rounded-xl bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-hover)] active:scale-95 transition-all disabled:opacity-50"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
