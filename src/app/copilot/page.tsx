'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  ArrowLeft,
  Bot,
  User,
  CheckCircle2,
  FileText,
  Lightbulb,
  Briefcase,
  Code2,
  RefreshCw,
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          content: 'Here is technical guidance based on your portfolio:\n• Emphasize Redis Cache-Aside hit rate metrics.\n• Ensure GitHub repository has an architecture diagram in README.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[var(--color-paper)] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white border border-[var(--color-border)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--color-ink)]">
                  Campus AI Career Copilot
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold uppercase">
                  Context-Aware
                </span>
              </div>
              <p className="text-xs text-[var(--color-ink-muted)]">
                Intelligent engineering interview simulator, portfolio critic, and ATS advisor.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-brand-primary)] bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Redis Rate Limiter: 10 req/min</span>
          </div>
        </div>

        {/* Chat Container */}
        <div className="rounded-3xl bg-white border border-[var(--color-border)] shadow-elevated flex flex-col h-[600px] overflow-hidden">
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-zinc-50/40">
            {messages.map((msg) => {
              const isBot = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3.5 ${isBot ? '' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isBot
                        ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-soft'
                        : 'bg-zinc-800 text-white'
                    }`}
                  >
                    {isBot ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-soft whitespace-pre-wrap ${
                      isBot
                        ? 'bg-white border border-[var(--color-border)] text-[var(--color-ink)]'
                        : 'bg-[var(--color-brand-primary)] text-white'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3 text-xs text-[var(--color-ink-muted)] font-mono">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <span>Analyzing portfolio evidence & engineering response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Presets */}
          <div className="px-6 py-2.5 bg-white border-t border-[var(--color-border-subtle)] flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              Prompt:
            </span>
            {PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => handleSend(preset)}
                className="px-3 py-1 rounded-lg text-xs font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 hover:text-black whitespace-nowrap transition-colors"
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
            className="p-4 bg-white border-t border-[var(--color-border)] flex items-center gap-3"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask Copilot for interview prep, architecture critique, or ATS review..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs sm:text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className="px-5 py-2.5 rounded-xl bg-[var(--color-brand-primary)] text-white text-xs font-bold shadow-soft hover:bg-[var(--color-brand-primary-hover)] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5"
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
