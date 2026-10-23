'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  Search,
  Check,
  CheckCheck,
  ShieldAlert,
  Ban,
  AlertCircle,
  RefreshCw,
  X,
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface ParticipantProfile {
  id: string;
  display_name: string;
  username?: string;
  headline?: string;
  avatar_url?: string | null;
  avatar_path?: string | null;
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

export default function MessagesClient() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [isLoadingConvs, setIsLoadingConvs] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Report & Block Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Harassment or Spam');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const convListRef = useRef<HTMLDivElement>(null);

  // Initialize Supabase browser client for Realtime subscription
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
      ),
    []
  );

  // 1. Fetch current user and conversations on mount
  useEffect(() => {
    let isMounted = true;

    async function initConvs() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!isMounted) return;
        if (user) {
          setCurrentUserId(user.id);
        }

        const res = await fetch('/api/conversations');
        const data = await res.json();
        if (!isMounted) return;
        if (res.ok && data.conversations) {
          setConversations(data.conversations);
          if (data.conversations.length > 0) {
            setActiveConvId((curr) => curr || data.conversations[0].id);
          }
        }
      } catch {
        if (isMounted) setErrorMsg('Failed to load conversations.');
      } finally {
        if (isMounted) setIsLoadingConvs(false);
      }
    }

    initConvs();
    return () => {
      isMounted = false;
    };
  }, [supabase]);

  // 2. Fetch messages for selected conversation
  useEffect(() => {
    if (!activeConvId) return;
    let isMounted = true;

    async function fetchMsgs() {
      try {
        const res = await fetch(`/api/messages?conversationId=${encodeURIComponent(activeConvId!)}`);
        const data = await res.json();
        if (!isMounted) return;
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load messages');
        }
        setMessages(data.messages || []);

        // Decrement unread count locally
        setConversations((prev) =>
          prev.map((c) => (c.id === activeConvId ? { ...c, unreadCount: 0 } : c))
        );
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Error fetching messages';
        setErrorMsg(msg);
      } finally {
        if (isMounted) setIsLoadingMessages(false);
      }
    }

    fetchMsgs();
    return () => {
      isMounted = false;
    };
  }, [activeConvId]);

  // 3. Setup Supabase Realtime subscription filtered by conversation_id
  useEffect(() => {
    if (!activeConvId) return;

    const channel = supabase
      .channel(`chat:${activeConvId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConvId}`,
        },
        (payload) => {
          const newMsg = payload.new as MessageItem;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          // Accessible screen reader live region announcement
          if (newMsg.sender_id !== currentUserId) {
            setLiveAnnouncement(`New message: ${newMsg.content}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConvId, currentUserId, supabase]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 4. Send Message with Optimistic Update and Rate Limit Error Handling
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !activeConvId || !currentUserId || isSending) return;

    const contentToSend = inputVal.trim();
    if (contentToSend.length > MAX_MESSAGE_LENGTH) {
      setErrorMsg(`Message exceeds ${MAX_MESSAGE_LENGTH} characters limit.`);
      return;
    }

    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticMsg: MessageItem = {
      id: optimisticId,
      conversation_id: activeConvId,
      sender_id: currentUserId,
      content: contentToSend,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    // Optimistic UI append
    setMessages((prev) => [...prev, optimisticMsg]);
    setInputVal('');
    setErrorMsg(null);
    setIsSending(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId,
          content: contentToSend,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        // Rollback optimistic message on error (e.g. 429 rate limit exceeded)
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        setInputVal(contentToSend);
        throw new Error(data.error || 'Failed to send message');
      }

      // Replace optimistic message with actual persisted record
      if (data.message) {
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticId ? data.message : m))
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error sending message';
      setErrorMsg(msg);
    } finally {
      setIsSending(false);
    }
  };

  // 5. Block User Action
  const handleBlockUser = async () => {
    const active = conversations.find((c) => c.id === activeConvId);
    if (!active) return;

    if (!confirm(`Block ${active.otherUser.display_name}? This will immediately hide conversations and cancel connections.`)) {
      return;
    }

    try {
      const res = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: active.otherUser.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to block user');
      }

      alert('User blocked. All connections and conversations have been severed.');
      // Remove conversation locally
      setConversations((prev) => prev.filter((c) => c.id !== activeConvId));
      setActiveConvId(null);
      setMessages([]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error blocking user';
      alert(msg);
    }
  };

  // 6. Submit Report Action
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const active = conversations.find((c) => c.id === activeConvId);
    if (!active) return;

    setReportSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'message',
          targetId: active.otherUser.id,
          reason: reportReason,
          details: reportDetails,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      alert('Report dispatched to moderation queue.');
      setShowReportModal(false);
      setReportDetails('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Report failed';
      alert(msg);
    } finally {
      setReportSubmitting(false);
    }
  };

  // 7. Keyboard Navigation across Conversation List
  const handleKeyDownList = (e: React.KeyboardEvent, currentIndex: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.min(conversations.length - 1, currentIndex + 1);
      setActiveConvId(conversations[nextIndex].id);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = Math.max(0, currentIndex - 1);
      setActiveConvId(conversations[prevIndex].id);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.otherUser.display_name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <div className="min-h-screen bg-[#08090d] text-white py-6">
      {/* Screen Reader Accessible Live Region for New Messages */}
      <div aria-live="polite" aria-atomic="false" className="sr-only">
        {liveAnnouncement}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0e1017] border border-white/10 overflow-hidden shadow-2xl h-[calc(100vh-8rem)] flex flex-col md:flex-row">
          
          {/* ── LEFT SIDEBAR: CONVERSATION LIST ── */}
          <div className="w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col shrink-0 bg-[#0b0c12]">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-violet-400" />
                  <h1 className="text-sm font-extrabold uppercase tracking-wider text-white">
                    Direct Messages
                  </h1>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-bold">
                  Connections Only
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter connections..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* Conversation Items */}
            <div
              ref={convListRef}
              role="listbox"
              aria-label="Active conversations"
              className="flex-1 overflow-y-auto divide-y divide-white/[0.04]"
            >
              {isLoadingConvs ? (
                <div className="p-8 text-center text-zinc-500 text-xs font-mono">
                  <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-violet-400" />
                  <span>Loading connections...</span>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    No active direct conversations. Messaging is permitted between accepted, unblocked connections.
                  </p>
                  <Link
                    href="/showcase"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30 text-xs font-bold hover:bg-violet-600/30 transition-all"
                  >
                    <span>Discover Peers</span>
                  </Link>
                </div>
              ) : (
                filteredConversations.map((c, idx) => {
                  const isActive = c.id === activeConvId;
                  return (
                    <button
                      key={c.id}
                      role="option"
                      aria-selected={isActive}
                      tabIndex={0}
                      onClick={() => setActiveConvId(c.id)}
                      onKeyDown={(e) => handleKeyDownList(e, idx)}
                      className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                        isActive
                          ? 'bg-violet-600/15 border-l-4 border-l-violet-500'
                          : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0 text-violet-300 font-bold text-xs">
                        {c.otherUser.avatar_url ? (
                          <img
                            src={c.otherUser.avatar_url}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span>{c.otherUser.display_name.slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h2 className="text-xs font-bold text-white truncate">
                            {c.otherUser.display_name}
                          </h2>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {new Date(c.lastMessageAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {c.lastMessage}
                        </p>
                      </div>

                      {c.unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-violet-600 text-[10px] font-bold text-white font-mono">
                          {c.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ── RIGHT MAIN PANEL: ACTIVE THREAD ── */}
          <div className="flex-1 flex flex-col bg-[#0e1017] min-w-0">
            {activeConv ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0 text-violet-300 font-bold text-xs">
                      {activeConv.otherUser.avatar_url ? (
                        <img
                          src={activeConv.otherUser.avatar_url}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span>{activeConv.otherUser.display_name.slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/profile/${activeConv.otherUser.id}`}
                          className="text-sm font-bold text-white hover:underline truncate"
                        >
                          {activeConv.otherUser.display_name}
                        </Link>
                        {activeConv.otherUser.username && (
                          <span className="text-[10px] font-mono text-zinc-500">
                            @{activeConv.otherUser.username}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {activeConv.otherUser.headline || 'Verified Campus Connection'}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Report and Block */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReportModal(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/20 text-xs font-mono transition-all"
                      title="Report thread to moderation"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Report</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBlockUser}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/15 text-zinc-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 text-xs font-mono transition-all"
                      title="Block user symmetrically"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Block</span>
                    </button>
                  </div>
                </div>

                {/* Message Stream */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {isLoadingMessages ? (
                    <div className="p-8 text-center text-zinc-500 text-xs font-mono">
                      <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-violet-400" />
                      <span>Loading messages...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500 text-xs font-mono">
                      <span>No messages yet. Send a note to start the conversation!</span>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.sender_id === currentUserId;
                      return (
                        <div
                          key={m.id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-1 shadow-md ${
                              isMe
                                ? 'bg-violet-600 text-white rounded-br-none'
                                : 'bg-[#141722] text-zinc-200 border border-white/10 rounded-bl-none'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{m.content}</p>
                            <div
                              className={`flex items-center justify-end gap-1 text-[9px] font-mono ${
                                isMe ? 'text-violet-200' : 'text-zinc-500'
                              }`}
                            >
                              <span>
                                {new Date(m.created_at).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {isMe && (
                                m.is_read ? (
                                  <CheckCheck className="w-3 h-3 text-emerald-300" />
                                ) : (
                                  <Check className="w-3 h-3 text-violet-300" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="px-4 py-2 bg-rose-500/10 border-t border-rose-500/20 text-rose-300 text-xs font-mono flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setErrorMsg(null)}
                      className="text-rose-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Message Input & Character Counter */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 border-t border-white/10 bg-[#0b0c12] space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={MAX_MESSAGE_LENGTH}
                      placeholder="Type a direct message to your connection (Enter to send)..."
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                    />
                    <button
                      type="submit"
                      disabled={isSending || !inputVal.trim()}
                      className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white transition-all shadow-md active:scale-95 shrink-0"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>Direct Message Encrypted Session • Realtime Sync</span>
                    <span className={inputVal.length > 1800 ? 'text-amber-400 font-bold' : ''}>
                      {inputVal.length} / {MAX_MESSAGE_LENGTH} characters
                    </span>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
                <MessageSquare className="w-10 h-10 text-zinc-600 mb-3" />
                <h2 className="text-sm font-bold text-zinc-300">No Conversation Selected</h2>
                <p className="text-xs text-zinc-500 max-w-sm mt-1">
                  Choose a peer connection from the sidebar to inspect verified messages or discuss project sprints.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── REPORT MODAL ── */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1017] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase font-mono">
                <ShieldAlert className="w-4 h-4" />
                <span>Report Communication</span>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">Reason for report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-[#141722] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Harassment or Spam">Harassment or Spam</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Impersonation or Fraud">Impersonation or Fraud</option>
                  <option value="Other Policy Violation">Other Policy Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Details / Specific Context</label>
                <textarea
                  rows={3}
                  required
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Explain why this message thread requires moderation review..."
                  className="w-full bg-[#141722] border border-white/10 rounded-xl p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all disabled:opacity-50"
                >
                  {reportSubmitting ? 'Submitting...' : 'Send to Moderation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
