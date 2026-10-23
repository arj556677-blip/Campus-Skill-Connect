'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  ArrowLeft,
  User,
  Lightbulb,
  ShieldCheck,
  Trash2,
  Check,
  Copy,
} from 'lucide-react';
import LatticeLoader, { LatticePattern } from '@/components/ui/LatticeLoader';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

const PRESETS = [
  'Critique my verified works for backend engineering roles',
  'Mock interview questions on caching & sliding window rate limiting',
  'Brainstorm cross-campus project combining Computer Vision & WebRTC',
  'Review my resume checklist and suggest missing keywords',
];

let messageSequence = 0;
function createMessageId(prefix: string): string {
  messageSequence += 1;
  return `${prefix}-${messageSequence}`;
}

/**
 * Safe inline markdown tokenizer that renders pure React nodes.
 * Eliminates dangerouslySetInnerHTML entirely, neutralizing any XSS attack payload (SEC-004).
 */
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Tokenize bold (**text**), italic (*text*), and code (`text`)
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);

  parts.forEach((part, index) => {
    if (!part) return;

    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      nodes.push(
        <strong key={index} className="text-slate-900 font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    } else if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      nodes.push(
        <em key={index} className="text-slate-600 italic">
          {part.slice(1, -1)}
        </em>
      );
    } else if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      nodes.push(
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[#1b59f8] font-mono text-[11px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    } else {
      nodes.push(part);
    }
  });

  return nodes;
}

/** Helper to render structured markdown safely in chat responses */
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Heading 3
        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={idx}
              className="text-sm sm:text-base font-bold text-slate-900 pt-2 pb-1 border-b border-slate-100 flex items-center gap-2"
            >
              <span className="w-1.5 h-3.5 bg-[#1b59f8] rounded-full" />
              {trimmed.replace('### ', '')}
            </h4>
          );
        }

        // Bullet point
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const raw = trimmed.replace(/^[•\-\*]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-[#1b59f8] mt-1 text-xs">•</span>
              <span>{renderInline(raw)}</span>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1">
              <span className="font-mono text-xs font-bold text-[#1b59f8] mt-0.5 shrink-0">
                {numMatch[1]}.
              </span>
              <span>{renderInline(numMatch[2])}</span>
            </div>
          );
        }

        // Normal text
        return <p key={idx}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        '👋 Welcome to **Campus AI Copilot**! I can help you validate engineering project architecture, prep for technical recruiter screens, or review your ATS resume checklist. What are you working on today?',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [thinkingVerb, setThinkingVerb] = useState('Thinking');
  const [pattern, setPattern] = useState<LatticePattern>('orbit');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (contentToSend?: string) => {
    const text = contentToSend || inputVal;
    if (!text.trim() || isLoading) return;

    const lower = text.toLowerCase();
    if (lower.includes('interview') || lower.includes('mock') || lower.includes('question')) {
      setThinkingVerb('Simulating interview scenario');
    } else if (lower.includes('resume') || lower.includes('ats') || lower.includes('keyword') || lower.includes('cv')) {
      setThinkingVerb('Scanning ATS checklist');
    } else if (lower.includes('architecture') || lower.includes('system') || lower.includes('design') || lower.includes('critique')) {
      setThinkingVerb('Evaluating architecture');
    } else {
      setThinkingVerb('Thinking');
    }

    const userMsgId = createMessageId('user');
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMsgId, role: 'user', content: text },
    ];
    setMessages(newMessages);
    setInputVal('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      let data: { reply?: string; error?: string } = {};

      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text.slice(0, 100) || `Server error (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate copilot critique');
      }

      const botMsgId = createMessageId('assistant');
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: 'assistant',
          content: data.reply || "I've reviewed your request. Let's dig deeper into the technical architecture.",
        },
      ]);
    } catch (err: unknown) {
      const errorReply = err instanceof Error ? err.message : 'Error reaching copilot service';
      const botMsgId = createMessageId('error');
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: 'assistant',
          content: `⚠️ ${errorReply}. Please verify your network connection or try again.`,
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
    const clearId = createMessageId('reset');
    setMessages([
      {
        id: clearId,
        role: 'assistant',
        content: '👋 Copilot memory cleared. Ready for your next portfolio review or technical interview prep.',
      },
    ]);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#f8fafc] text-slate-900 py-8 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Campus AI Career Copilot
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1b59f8] border border-blue-200 font-bold uppercase">
                  Context-Aware
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Engineering interview simulator, portfolio review assistant, and ATS checklist advisor.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs text-slate-600 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400">Thinking Wave:</span>
              <select
                value={pattern as string}
                onChange={(e) => setPattern(e.target.value as LatticePattern)}
                className="bg-transparent border-none text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                title="Select LatticeLoader thinking wave pattern"
              >
                <option value="orbit">Orbit</option>
                <option value="ripple">Ripple</option>
                <option value="snake">Snake</option>
                <option value="spiral">Spiral</option>
                <option value="arrow">Arrow</option>
                <option value="dots">Dots</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rate Limiter: Active</span>
            </div>

            <button
              onClick={clearChat}
              title="Reset Chat"
              className="p-2.5 rounded-full bg-white hover:bg-rose-50 border border-slate-200 text-slate-500 hover:text-rose-600 transition-colors shadow-xs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col h-[640px] overflow-hidden">
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#f8fafc]">
            {messages.map((msg) => {
              const isBot = msg.role === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3.5 ${isBot ? '' : 'flex-row-reverse'}`}
                >
                  {/* Avatar Icon */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      isBot
                        ? 'bg-[#1b59f8] text-white shadow-xs'
                        : 'bg-[#0f172a] text-white'
                    }`}
                  >
                    {isBot ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-2xl rounded-2xl p-4 sm:p-5 relative group transition-all shadow-xs ${
                      isBot
                        ? 'bg-white border border-slate-200 text-slate-800'
                        : 'bg-[#0f172a] text-white'
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
                        className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
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
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#1b59f8] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="rounded-2xl px-5 py-3.5 bg-white border border-slate-200/90 text-slate-800 shadow-xs inline-flex items-center">
                  <LatticeLoader
                    status="working"
                    label={thinkingVerb}
                    doneLabel="Done in"
                    errorLabel="Failed after"
                    pattern={pattern}
                    grid={3}
                    shape="round"
                    color="#1b59f8"
                    doneColor="#10b981"
                    errorColor="#ef4444"
                    cellSize={6}
                    gap={2.5}
                    fontSize={13}
                    step={90}
                    idleOpacity={0.18}
                    glow={true}
                    glowColor="rgba(27, 89, 248, 0.4)"
                    showTimer={true}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Presets */}
          <div className="px-4 sm:px-6 py-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              Prompt:
            </span>
            {PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => handleSend(preset)}
                className="px-3.5 py-1 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 whitespace-nowrap transition-all shadow-xs"
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
            className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-3"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask Copilot for interview prep, architecture critique, or ATS review..."
              className="flex-1 px-5 py-3 rounded-full bg-[#f8fafc] border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1b59f8] transition-all"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className="px-6 py-3 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold shadow-xs active:scale-95 transition-all disabled:opacity-40 flex items-center gap-1.5 shrink-0"
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
