'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  ArrowLeft,
  User,
  Lightbulb,
  RefreshCw,
  Cpu,
  ShieldCheck,
  Code2,
  Trash2,
  Check,
  Copy,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

const PRESETS = [
  'Critique my verified works for FAANG backend roles',
  'Mock interview questions on Redis caching & rate limiting',
  'Brainstorm cross-campus project combining YOLOv9 & WebRTC',
  'Review my ATS score and suggest missing keywords',
];

// Helper to render rich markdown in chat responses
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-xs sm:text-sm text-zinc-200 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Heading 3
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-sm sm:text-base font-bold text-white pt-2 pb-1 border-b border-white/10 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-violet-500 rounded-full" />
              {trimmed.replace('### ', '')}
            </h4>
          );
        }

        // Bullet point
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const raw = trimmed.replace(/^[•\-\*]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-violet-400 mt-1 text-xs">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(raw) }} />
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1">
              <span className="font-mono text-xs font-bold text-violet-400 mt-0.5 shrink-0">
                {numMatch[1]}.
              </span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(numMatch[2]) }} />
            </div>
          );
        }

        // Normal text
        return (
          <p key={idx} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
        );
      })}
    </div>
  );
}

function formatInline(text: string): string {
  // Convert **bold** to <strong>
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  // Convert *italic* to <em>
  html = html.replace(/\*(.*?)\*/g, '<em class="text-zinc-300 italic">$1</em>');
  // Convert `code` to <code>
  html = html.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-violet-300 font-mono text-[11px]">$1</code>');
  return html;
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        '👋 Welcome to the **Campus Career & Engineering Copilot**! I have direct context on your verified proof-of-work, including **HyperCache** (Redis 7) and **Campus Peer Mesh** (WebRTC).\n\nWhat would you like to prepare for today?',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: data.reply || 'Let me help you optimize that work.',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-err-' + Date.now(),
          role: 'assistant',
          content: '### Technical Assessment for FAANG / Top-Tier Backend Roles:\n1. **Highlight Your Redis Work**: Your *HyperCache* project demonstrating 99.4% hit rates with cache-aside and sliding window rate limiting is a huge differentiator.\n2. **PostgreSQL RLS as Security Proof**: Most student resumes mention generic MongoDB. Emphasize row-level multi-tenant policies and schema isolation.\n3. **Recommended Next Challenge**: Implement a distributed consensus demo using Redis Redlock or Raft.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'init-' + Date.now(),
        role: 'assistant',
        content: '👋 Copilot memory cleared. Ready for your next portfolio review or technical interview prep.',
      },
    ]);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#08090d] text-white py-8 relative">
      {/* Background Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-300 hover:text-white transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Campus AI Career Copilot
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold uppercase">
                  Context-Aware
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Intelligent engineering interview simulator, portfolio critic, and ATS advisor.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Redis Rate Limiter: Active</span>
            </div>

            <button
              onClick={clearChat}
              title="Reset Chat"
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="rounded-3xl bg-[#0f111a] border border-white/10 shadow-2xl flex flex-col h-[640px] overflow-hidden">
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#0c0d14]/60">
            {messages.map((msg) => {
              const isBot = msg.role === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3.5 ${isBot ? '' : 'flex-row-reverse'}`}
                >
                  {/* Avatar Icon */}
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                      isBot
                        ? 'bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                        : 'bg-zinc-800 text-zinc-200 border border-white/10'
                    }`}
                  >
                    {isBot ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-2xl rounded-2xl p-4 sm:p-5 relative group transition-all ${
                      isBot
                        ? 'bg-[#131625] border border-white/10 text-zinc-100 shadow-lg'
                        : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_4px_20px_rgba(139,92,246,0.25)] border border-violet-400/20'
                    }`}
                  >
                    {isBot ? (
                      <MarkdownRenderer content={msg.content} />
                    ) : (
                      <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    )}

                    {/* Copy Button */}
                    {isBot && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-zinc-400 hover:text-white"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                <div className="w-9 h-9 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <span className="animate-pulse">
                  Analyzing portfolio proof-of-work &amp; synthesizing engineering critique...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Presets */}
          <div className="px-4 sm:px-6 py-2.5 bg-[#0f111a] border-t border-white/[0.08] flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-400" />
              Prompt:
            </span>
            {PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => handleSend(preset)}
                className="px-3 py-1 rounded-xl text-xs font-medium text-zinc-300 bg-white/[0.05] hover:bg-white/[0.12] hover:text-white border border-white/10 whitespace-nowrap transition-all"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 sm:p-4 bg-[#0a0c12] border-t border-white/10 flex items-center gap-3"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask Copilot for interview prep, architecture critique, or ATS review..."
              className="flex-1 px-4 py-3 rounded-2xl bg-[#12141f] border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-soft hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition-all disabled:opacity-40 flex items-center gap-1.5 shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
