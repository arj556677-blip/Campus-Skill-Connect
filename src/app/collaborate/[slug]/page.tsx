'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Video,
  Copy,
  Check,
  Users,
  ShieldCheck,
  Maximize2,
  ExternalLink,
} from 'lucide-react';

export default function RoomLivePage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'general-sprint';
  const [copied, setCopied] = useState(false);

  const jitsiUrl = `https://meet.jit.si/CampusSkillConnect-${slug}#config.prejoinConfig.enabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false`;

  const copyInvite = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-zinc-950 text-white flex flex-col">
      {/* Top Session Bar */}
      <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/collaborate"
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-sm font-bold text-white tracking-tight">
                Live WebRTC Room: <span className="font-mono text-emerald-400">#{slug}</span>
              </h1>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              Encrypted Peer Mesh • Zero-Plugin WebRTC Standard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyInvite}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Link Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Invite</span>
              </>
            )}
          </button>

          <a
            href={jitsiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            title="Pop out in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Embedded WebRTC Frame */}
      <div className="flex-1 w-full h-[calc(100vh-140px)] bg-black relative">
        <iframe
          src={jitsiUrl}
          allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
          className="w-full h-full border-0"
          title={`Collaboration Room - ${slug}`}
        />
      </div>
    </div>
  );
}
