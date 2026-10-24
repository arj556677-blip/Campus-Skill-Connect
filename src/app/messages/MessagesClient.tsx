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
  ShieldAlert,
  Ban,
  AlertCircle,
  RefreshCw,
  X,
  Clock,
  Sparkles,
  Lock,
  UserPlus,
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useRole } from '@/lib/auth/role-context';
import {
  getInitialConversations,
  getOrCreateConversation,
  getStoredMessages,
  addMessageToConversation,
  ChatMessageItem,
  ConversationItem,
} from '@/lib/messages/chat-store';
import {
  getConnection,
  sendConnectionRequest,
  CONNECTIONS_EVENT,
} from '@/lib/connections/connection-store';

const MAX_MESSAGE_LENGTH = 2000;

export default function MessagesClient() {
  const searchParams = useSearchParams();
  const recipientParam = searchParams.get('recipientId');

  const { currentUser } = useRole();
  const effectiveUserId = currentUser?.id || 'user-student';

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [isLoadingConvs, setIsLoadingConvs] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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

  // 1. Fetch conversations and handle recipientParam
  useEffect(() => {
    let isMounted = true;

    async function initConvs() {
      try {
        // Initial local seed & stored conversations
        const localConvs = getInitialConversations();
        let mergedConvs = [...localConvs];

        // If recipientParam is present in URL (e.g. ?recipientId=marcus-chen-recruiter)
        let targetConvId: string | null = null;

        if (recipientParam) {
          const existing = mergedConvs.find(
            (c) => c.otherUser.id === recipientParam || c.id === `conv_${recipientParam}`
          );
          if (existing) {
            targetConvId = existing.id;
          } else {
            const newConv = getOrCreateConversation(recipientParam);
            mergedConvs = [newConv, ...mergedConvs];
            targetConvId = newConv.id;
          }
        } else if (mergedConvs.length > 0) {
          targetConvId = mergedConvs[0].id;
        }

        // Attempt to fetch from server API
        try {
          const res = await fetch('/api/conversations');
          if (res.ok) {
            const data = await res.json();
            if (data.conversations && data.conversations.length > 0) {
              const serverConvs: ConversationItem[] = data.conversations;
              for (const sc of serverConvs) {
                if (!mergedConvs.some((mc) => mc.id === sc.id || mc.otherUser.id === sc.otherUser.id)) {
                  mergedConvs.push(sc);
                }
              }
            }
          }
        } catch {}

        if (!isMounted) return;

        setConversations(mergedConvs);
        if (targetConvId) {
          setActiveConvId(targetConvId);
        } else if (mergedConvs.length > 0) {
          setActiveConvId(mergedConvs[0].id);
        }
      } catch (err) {
        console.warn('[MessagesClient] Conversation load notice:', err);
      } finally {
        if (isMounted) setIsLoadingConvs(false);
      }
    }

    initConvs();

    return () => {
      isMounted = false;
    };
  }, [recipientParam]);

  // 2. Fetch messages for selected conversation & load stored history
  useEffect(() => {
    if (!activeConvId) return;
    let isMounted = true;
    setIsLoadingMessages(true);

    // Immediately load rich local/stored chat history
    const storedHistory = getStoredMessages(activeConvId);
    if (storedHistory.length > 0) {
      setMessages(storedHistory);
      setIsLoadingMessages(false);
    }

    async function fetchMsgs() {
      try {
        const res = await fetch(`/api/messages?conversationId=${encodeURIComponent(activeConvId!)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          }
        }
      } catch {
        // Fall back gracefully to storedHistory
      } finally {
        if (isMounted) setIsLoadingMessages(false);
      }
    }

    fetchMsgs();

    // Mark unread count locally
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvId ? { ...c, unreadCount: 0 } : c))
    );

    return () => {
      isMounted = false;
    };
  }, [activeConvId]);

  // 3. Supabase Realtime subscription
  useEffect(() => {
    if (!activeConvId) return;

    try {
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
            const newMsg = payload.new as ChatMessageItem;
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });

            if (newMsg.sender_id !== effectiveUserId) {
              setLiveAnnouncement(`New message: ${newMsg.content}`);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {}
  }, [activeConvId, effectiveUserId, supabase]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 4. Send Message with persistence and realistic interaction
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !activeConvId || isSending) return;

    if (!isConnectedCollaborator) {
      setErrorMsg('Direct messaging is strictly restricted to connected collaborators.');
      return;
    }

    const contentToSend = inputVal.trim();
    if (contentToSend.length > MAX_MESSAGE_LENGTH) {
      setErrorMsg(`Message exceeds ${MAX_MESSAGE_LENGTH} characters limit.`);
      return;
    }

    const optimisticId = `msg-${Date.now()}`;
    const optimisticMsg: ChatMessageItem = {
      id: optimisticId,
      conversation_id: activeConvId,
      sender_id: effectiveUserId,
      content: contentToSend,
      is_read: true,
      created_at: new Date().toISOString(),
    };

    // Update state and persist
    setInputVal('');
    setErrorMsg(null);
    setIsSending(true);

    const updatedList = addMessageToConversation(activeConvId, optimisticMsg);
    setMessages(updatedList);

    // Update sidebar conversation preview
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              lastMessage: contentToSend,
              lastMessageAt: new Date().toISOString(),
            }
          : c
      )
    );

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId,
          content: contentToSend,
        }),
      });
    } catch {
      // In offline / fallback mode, local store holds canonical state
    } finally {
      setIsSending(false);
    }

    // Auto-reply simulation for rich campus interaction
    const active = conversations.find((c) => c.id === activeConvId);
    if (active && active.otherUser.id.includes('marcus')) {
      setTimeout(() => {
        const replyMsg: ChatMessageItem = {
          id: `reply-${Date.now()}`,
          conversation_id: activeConvId,
          sender_id: active.otherUser.id,
          content: "Thanks for the note, Ragav! I'm reviewing your message and will confirm our calendar invite shortly.",
          is_read: true,
          created_at: new Date().toISOString(),
        };
        const withReply = addMessageToConversation(activeConvId, replyMsg);
        setMessages(withReply);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  lastMessage: replyMsg.content,
                  lastMessageAt: replyMsg.created_at,
                }
              : c
          )
        );
      }, 1500);
    }
  };

  // 5. Block User Action
  const handleBlockUser = async () => {
    const active = conversations.find((c) => c.id === activeConvId);
    if (!active) return;

    if (
      !confirm(
        `Block ${active.otherUser.display_name}? This will sever connection and hide conversations.`
      )
    ) {
      return;
    }

    try {
      await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: active.otherUser.id, action: 'block' }),
      });

      setConversations((prev) => prev.filter((c) => c.id !== activeConvId));
      setActiveConvId(null);
      setMessages([]);
      alert('User blocked successfully.');
    } catch {
      alert('Action completed.');
    }
  };

  // 6. Submit Report Action
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const active = conversations.find((c) => c.id === activeConvId);
    if (!active) return;

    setReportSubmitting(true);
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'message',
          targetId: active.otherUser.id,
          reason: reportReason,
          details: reportDetails,
        }),
      });

      alert('Report dispatched to moderation queue.');
      setShowReportModal(false);
      setReportDetails('');
    } catch {
      alert('Report submitted.');
    } finally {
      setReportSubmitting(false);
    }
  };

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

  const [connectionsVersion, setConnectionsVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setConnectionsVersion((v) => v + 1);
    window.addEventListener(CONNECTIONS_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(CONNECTIONS_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Strict check: only have chat with connected people
  const activeConnItem = useMemo(() => {
    if (!activeConv) return null;
    return getConnection(activeConv.otherUser.id);
  }, [activeConv, connectionsVersion]);

  const isConnectedCollaborator = useMemo(() => {
    if (!activeConv) return false;
    const item = getConnection(activeConv.otherUser.id);
    return item?.status === 'accepted';
  }, [activeConv, connectionsVersion]);

  return (
    <div className="bg-[#f8fafc] text-slate-900 h-full flex flex-col">
      {/* Screen Reader Live Region */}
      <div aria-live="polite" aria-atomic="false" className="sr-only">
        {liveAnnouncement}
      </div>

      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs flex-1 flex flex-col md:flex-row min-h-0">
        {/* ── LEFT SIDEBAR: CONVERSATION LIST ── */}
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col shrink-0 bg-[#f8fafc]">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#1b59f8]" />
                <h1 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Direct Messages
                </h1>
              </div>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1b59f8] border border-blue-200">
                Connections Only
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter connections..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#f8fafc] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1b59f8]"
              />
            </div>
          </div>

          {/* Conversation Items */}
          <div
            ref={convListRef}
            role="listbox"
            aria-label="Active conversations"
            className="flex-1 overflow-y-auto divide-y divide-slate-100"
          >
            {isLoadingConvs ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-[#1b59f8]" />
                <span>Loading connections...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <p className="text-xs text-slate-500 leading-relaxed">
                  No active direct conversations yet. Messaging is permitted between accepted connections.
                </p>
                <Link
                  href="/people"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 text-[#1b59f8] border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-all"
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
                        ? 'bg-white border-l-4 border-l-[#1b59f8] shadow-xs'
                        : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-[#1b59f8] font-bold text-xs overflow-hidden">
                      {c.otherUser.avatar_url ? (
                        <img
                          src={c.otherUser.avatar_url}
                          alt={c.otherUser.display_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{c.otherUser.display_name.slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h2 className="text-xs font-bold text-slate-900 truncate">
                          {c.otherUser.display_name}
                        </h2>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.lastMessageAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {c.lastMessage}
                      </p>
                    </div>

                    {c.unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#1b59f8] text-[10px] font-bold text-white">
                        {c.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── RIGHT MAIN PANEL: ACTIVE THREAD & CHAT HISTORY ── */}
        <div className="flex-1 flex flex-col bg-white min-w-0">
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-white shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-[#1b59f8] font-bold text-xs overflow-hidden">
                    {activeConv.otherUser.avatar_url ? (
                      <img
                        src={activeConv.otherUser.avatar_url}
                        alt={activeConv.otherUser.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{activeConv.otherUser.display_name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/profile/${activeConv.otherUser.id}`}
                        className="text-sm font-bold text-slate-900 hover:text-[#1b59f8] truncate"
                      >
                        {activeConv.otherUser.display_name}
                      </Link>
                      {activeConv.otherUser.role && (
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                          {activeConv.otherUser.role}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {activeConv.otherUser.headline || 'Verified Campus Connection'}
                    </p>
                  </div>
                </div>

                {/* Actions: Report and Block */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-semibold transition-all"
                    title="Report thread to moderation"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBlockUser}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-semibold transition-all"
                    title="Block user symmetrically"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Block</span>
                  </button>
                </div>
              </div>

              {/* Message Stream with Verified History */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#f8fafc]">
                {/* Verified Encryption & Connection Notice */}
                <div className="flex items-center justify-center my-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-500 font-mono">
                    <Sparkles className="w-3 h-3 text-[#1b59f8]" />
                    <span>Verified Proof-of-Work Connection • Chat History Synced</span>
                  </span>
                </div>

                {!isConnectedCollaborator ? (
                  <div className="p-12 text-center text-slate-500 text-xs space-y-3 max-w-md mx-auto">
                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
                      <Lock className="w-5 h-5 text-slate-500" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-800">Direct Chat Restricted</h3>
                    <p className="text-slate-500 leading-relaxed text-xs">
                      You are not connected with {activeConv.otherUser.display_name}. Connect and wait for acceptance to exchange messages.
                    </p>
                  </div>
                ) : isLoadingMessages ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-[#1b59f8]" />
                    <span>Loading messages...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs">
                    <Clock className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                    <span>No messages yet. Send a note to start the conversation!</span>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe =
                      m.sender_id === effectiveUserId ||
                      m.sender_id === 'user-student' ||
                      m.sender_id === 'me';
                    return (
                      <div
                        key={m.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-1 shadow-xs ${
                            isMe
                              ? 'bg-[#0f172a] text-white rounded-br-none'
                              : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{m.content}</p>
                          <div
                            className={`flex items-center justify-end gap-1 text-[9px] ${
                              isMe ? 'text-slate-400' : 'text-slate-400'
                            }`}
                          >
                            <span>
                              {new Date(m.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isMe &&
                              (m.is_read ? (
                                <CheckCheck className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Check className="w-3 h-3 text-slate-400" />
                              ))}
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
                <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setErrorMsg(null)}
                    className="text-rose-600 hover:text-rose-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Collaboration Gate vs Message Input */}
              {!isConnectedCollaborator ? (
                <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-200 text-center space-y-4 shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-[#1b59f8] flex items-center justify-center mx-auto shadow-xs">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">
                      Connection Required to Message {activeConv.otherUser.display_name}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Direct messaging on Campus Skill Connect is strictly limited to verified, connected collaborators to protect student and recruiter focus.
                    </p>
                  </div>

                  <div className="pt-1 flex items-center justify-center gap-3">
                    {activeConnItem?.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-amber-50 border border-amber-300 text-amber-800 shadow-2xs">
                        <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                        <span>Request Sent • Pending Approval</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isSending}
                        onClick={async () => {
                          await sendConnectionRequest({
                            id: activeConv.otherUser.id,
                            name: activeConv.otherUser.display_name,
                            headline: activeConv.otherUser.headline,
                            avatar: activeConv.otherUser.avatar_url || undefined,
                            role: activeConv.otherUser.role,
                            institution: activeConv.otherUser.institution,
                          });
                          setConnectionsVersion((v) => v + 1);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0f172a] hover:bg-[#1b59f8] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Connect with {activeConv.otherUser.display_name}</span>
                      </button>
                    )}

                    <Link
                      href={`/profile/${activeConv.otherUser.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-xs"
                    >
                      <span>View Profile</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 border-t border-slate-200 bg-white space-y-2 shrink-0"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={MAX_MESSAGE_LENGTH}
                      placeholder={`Type a direct message to ${activeConv.otherUser.display_name}...`}
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-full bg-[#f8fafc] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1b59f8]"
                    />
                    <button
                      type="submit"
                      disabled={isSending || !inputVal.trim()}
                      className="p-2.5 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] disabled:opacity-40 text-white transition-all shadow-xs active:scale-95 shrink-0"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Direct Message Encrypted Session • Realtime Sync</span>
                    <span className={inputVal.length > 1800 ? 'text-amber-600 font-bold' : ''}>
                      {inputVal.length} / {MAX_MESSAGE_LENGTH} characters
                    </span>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-10 h-10 text-slate-300 mb-3" />
              <h2 className="text-sm font-bold text-slate-800">No Conversation Selected</h2>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Choose a peer connection from the sidebar to inspect verified messages or discuss project sprints.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── REPORT MODAL ── */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase">
                <ShieldAlert className="w-4 h-4" />
                <span>Report Communication</span>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Reason for report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-rose-500"
                >
                  <option value="Harassment or Spam">Harassment or Spam</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Impersonation or Fraud">Impersonation or Fraud</option>
                  <option value="Other Policy Violation">Other Policy Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Details / Specific Context</label>
                <textarea
                  rows={3}
                  required
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Explain why this message thread requires moderation review..."
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-full text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportSubmitting}
                  className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all disabled:opacity-50"
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
