'use client';

import React, { useState } from 'react';
import {
  CircleHelp as HelpCircle,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  Send,
  X,
} from 'lucide-react';
import { SupportTicket, TicketCategory, TicketPriority } from '@/lib/types';

interface SupportClientProps {
  initialTickets: SupportTicket[];
}

export default function SupportClient({ initialTickets }: SupportClientProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [showNewModal, setShowNewModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('account');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [message, setMessage] = useState('');
  const [activeTicketId, setActiveTicketId] = useState<string>(initialTickets[0]?.id || '');
  const [replyText, setReplyText] = useState('');

  const [replies, setReplies] = useState<Record<string, Array<{ text: string; isStaff: boolean; time: string }>>>({
    'tick-1': [
      {
        text: 'Hello Alex, our campus verification team has received your request to whitelist the @iisc.ac.in domain for automated student badge assignment. We are currently verifying the SPF/DKIM DNS records.',
        isStaff: true,
        time: 'Yesterday at 3:15 PM',
      },
    ],
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const newTicket: SupportTicket = {
      id: 'tick-' + Date.now(),
      user_id: 'user-1',
      subject: subject.trim(),
      category,
      status: 'open',
      priority,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTickets([newTicket, ...tickets]);
    setActiveTicketId(newTicket.id);
    if (message.trim()) {
      setReplies((prev) => ({
        ...prev,
        [newTicket.id]: [{ text: message.trim(), isStaff: false, time: 'Just now' }],
      }));
    }

    setSubject('');
    setMessage('');
    setShowNewModal(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicketId) return;

    setReplies((prev) => ({
      ...prev,
      [activeTicketId]: [
        ...(prev[activeTicketId] || []),
        { text: replyText.trim(), isStaff: false, time: 'Just now' },
      ],
    }));
    setReplyText('');
  };

  const activeTicket = tickets.find((t) => t.id === activeTicketId) || tickets[0];
  const activeReplies = activeTicket ? replies[activeTicket.id] || [] : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-violet-400 font-bold mb-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>Campus Member Helpdesk • V2.0</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Support &amp; Inquiry Tickets
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-xl">
            Submit questions regarding campus whitelisting, privacy preferences, or platform bug reports directly to staff.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition-all self-start md:self-end"
        >
          <Plus className="w-4 h-4 text-emerald-300" />
          <span>Open New Ticket</span>
        </button>
      </div>

      {/* 2-Column Ticket Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-400 mb-2">
            Your Active Tickets ({tickets.length})
          </h2>

          {tickets.map((t) => {
            const isSelected = t.id === activeTicketId;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTicketId(t.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#141722] border-violet-500/80 shadow-[0_0_20px_rgba(139,92,246,0.25)] ring-1 ring-violet-500/50'
                    : 'bg-[#0e1017] border-white/10 hover:border-white/20 hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                      t.priority === 'high'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : t.priority === 'medium'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30'
                    }`}
                  >
                    {t.priority} priority
                  </span>

                  <span className="text-[10px] font-mono text-zinc-500">
                    {new Date(t.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-xs text-white line-clamp-1">{t.subject}</h3>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06] text-[11px] text-zinc-400 font-mono">
                  <span className="capitalize">{t.category}</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-400">
                    <Clock className="w-3 h-3" />
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Thread Detail */}
        <div className="lg:col-span-7">
          {activeTicket ? (
            <div className="rounded-3xl bg-[#0e1017] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="pb-4 border-b border-white/10 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/10">
                    #{activeTicket.id}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    Status: <strong className="text-emerald-400">{activeTicket.status}</strong>
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  {activeTicket.subject}
                </h2>
              </div>

              {/* Discussion Thread */}
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                <div className="p-4 rounded-2xl bg-[#141722] border border-white/10 text-xs text-zinc-200 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                    <span>You (Ticket Opener)</span>
                    <span>{new Date(activeTicket.created_at).toLocaleString()}</span>
                  </div>
                  <p className="leading-relaxed">
                    Ticket opened regarding: <strong>{activeTicket.subject}</strong> under category {activeTicket.category}.
                  </p>
                </div>

                {activeReplies.map((r, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl text-xs space-y-1 border ${
                      r.isStaff
                        ? 'bg-violet-950/40 border-violet-500/30 text-violet-100'
                        : 'bg-[#141722] border-white/10 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className={r.isStaff ? 'font-bold text-violet-300 flex items-center gap-1' : 'text-zinc-400'}>
                        {r.isStaff ? '🛡️ Campus Skill Connect Staff' : 'You'}
                      </span>
                      <span className="text-zinc-500">{r.time}</span>
                    </div>
                    <p className="leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="flex items-center gap-2 pt-2 border-t border-white/10">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your message or followup question..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-3xl bg-[#0e1017] border border-dashed border-white/10 p-12 text-center">
              <p className="text-xs text-zinc-400">Select a ticket to view the discussion.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="rounded-3xl bg-[#12141f] border border-white/10 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-violet-400">
                  <HelpCircle className="w-4 h-4" />
                  <span>SUPPORT INQUIRY</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">Open Support Ticket</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your inquiry..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="account">Account &amp; Domain</option>
                    <option value="privacy">Privacy &amp; Visibility</option>
                    <option value="bug">Technical Bug</option>
                    <option value="feature">Feature Proposal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide context or reproduction steps..."
                  className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-soft hover:from-violet-500 hover:to-indigo-500 transition-all"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
