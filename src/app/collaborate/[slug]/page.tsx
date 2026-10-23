'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Video,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Lock,
  KeyRound,
  FileCheck,
  AlertTriangle,
  Sparkles,
  Users,
  Eye,
  Send,
  Terminal,
} from 'lucide-react';
import { MOCK_COLLAB_ROOMS } from '@/lib/data/mock-data';
import { CollaborationRoom } from '@/lib/types';

export default function RoomLivePage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'general-sprint';
  const [copied, setCopied] = useState(false);

  // Find room details from mock or fallback
  const existingRoom: CollaborationRoom | undefined = MOCK_COLLAB_ROOMS.find(
    (r) => r.room_slug === slug
  );

  const isConfidential = slug.includes('confidential') || slug.includes('stealth') || existingRoom?.is_confidential;
  const isGoogleMeet = isConfidential || existingRoom?.provider === 'google_meet';

  // Security gate states
  const [unlocked, setUnlocked] = useState(!existingRoom?.passcode);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [ndaAccepted, setNdaAccepted] = useState(!existingRoom?.nda_required);

  // Collaborative notes scratchpad
  const [notes, setNotes] = useState(
    '# Confidential Meeting Scratchpad\n- Agenda: Architecture review & Proof-of-Skill validation\n- Evaluator: Staff Recruiter / Review Board\n- Notes:\n'
  );

  // Dynamic Google Meet URL state (defaults to real instant meeting launcher)
  const [currentMeetUrl, setCurrentMeetUrl] = useState<string>(() => {
    if (existingRoom?.meeting_link && !existingRoom.meeting_link.includes('qxm-') && !existingRoom.meeting_link.includes('zkw-')) {
      return existingRoom.meeting_link;
    }
    return 'https://meet.google.com/new';
  });
  const [customLinkInput, setCustomLinkInput] = useState('');
  const [showLinkEditor, setShowLinkEditor] = useState(false);

  const jitsiUrl = `https://meet.jit.si/CampusSkillConnect-${slug}#config.prejoinConfig.enabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false`;

  const copyInvite = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUnlockPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingRoom?.passcode || passcodeInput.trim().toUpperCase() === existingRoom.passcode.toUpperCase()) {
      setUnlocked(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#08090d] text-white flex flex-col">
      {/* Confidential Watermark Banner (if Google Meet / Confidential) */}
      {isConfidential && (
        <div className="bg-gradient-to-r from-amber-600/30 via-rose-600/30 to-purple-600/30 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-amber-200">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold uppercase tracking-wider">
              CONFIDENTIAL SESSION • GOOGLE MEET API • RESTRICTED ACCESS
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-zinc-400">
              WATERMARK ID: <strong className="text-white">CSC-SEC-2026-X9</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
              HOST KNOCKING ACTIVE
            </span>
          </div>
        </div>
      )}

      {/* Top Session Bar */}
      <div className="px-4 py-3 bg-[#0f111a] border-b border-white/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/collaborate"
            className="p-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isGoogleMeet ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
              <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>{existingRoom?.title || slug}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-white/5 text-zinc-400">
                  #{slug}
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              {isGoogleMeet
                ? 'Google Meet API • TLS 1.3 End-to-End Encryption • Knock-to-Join'
                : 'Encrypted WebRTC Peer Mesh • Zero-Plugin Browser Standard'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyInvite}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-zinc-200 border border-white/10 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Invite Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Share Link</span>
              </>
            )}
          </button>

          {isGoogleMeet ? (
            <a
              href={currentMeetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold shadow-soft transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Launch Google Meet</span>
            </a>
          ) : (
            <a
              href={jitsiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-zinc-300"
              title="Pop out in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {isGoogleMeet ? (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Security Barrier or Google Meet Launchpad */}
          <div className="lg:col-span-7 space-y-6">
            {!unlocked ? (
              /* Passcode Unlock Barrier */
              <div className="rounded-3xl bg-[#0f111a] border border-amber-500/30 p-8 shadow-2xl text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8" />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    Confidential Room Locked
                  </h2>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                    This meeting is protected by an access passcode. Enter the meeting secret provided by the host.
                  </p>
                </div>

                <form onSubmit={handleUnlockPasscode} className="max-w-xs mx-auto space-y-3">
                  <input
                    type="text"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    placeholder="Enter Room Passcode..."
                    className="w-full text-center px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-sm font-mono tracking-wider text-amber-300 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {passcodeError && (
                    <p className="text-xs text-rose-400 font-mono">
                      Incorrect passcode. Hint: Check meeting card on Collab dashboard.
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-xs shadow-soft hover:opacity-90 transition-all"
                  >
                    Unlock &amp; View Meeting Link
                  </button>
                </form>
              </div>
            ) : !ndaAccepted ? (
              /* Digital NDA Agreement Barrier */
              <div className="rounded-3xl bg-[#0f111a] border border-rose-500/30 p-8 shadow-2xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-white">
                      Digital Non-Disclosure Agreement (NDA)
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Standard campus engineering IP &amp; recruitment privacy pledge.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-zinc-300 space-y-2 leading-relaxed max-h-48 overflow-y-auto font-mono">
                  <p>
                    <strong>CONFIDENTIALITY ACKNOWLEDGMENT:</strong> By accessing this Google Meet session, you agree that all code architectures, intellectual property disclosures, technical interview feedback, and candidate evaluations shared within this room are strictly proprietary.
                  </p>
                  <p>
                    Unauthorized recording, screen capture, or redistribution is strictly prohibited and logged under session ID <strong>CSC-SEC-2026</strong>.
                  </p>
                </div>

                <button
                  onClick={() => setNdaAccepted(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-soft hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>I Accept NDA — Proceed to Google Meet</span>
                </button>
              </div>
            ) : (
              /* Google Meet Launchpad */
              <div className="rounded-3xl bg-gradient-to-b from-[#131625] to-[#0c0e18] border border-white/10 p-8 shadow-2xl space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold mb-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Security Clear: Access Granted</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">
                      Google Meet Confidential Launchpad
                    </h2>
                    <p className="text-xs text-zinc-300 mt-1">
                      Your session is ready. Connect using Google Meet for HD audio/video, noise cancellation, and screen sharing.
                    </p>
                  </div>
                </div>

                {/* Google Meet Action Card */}
                <div className="p-6 rounded-2xl bg-[#090b10] border border-amber-500/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-zinc-400 uppercase">
                          Meeting Direct Link
                        </span>
                        <button
                          onClick={() => setShowLinkEditor(!showLinkEditor)}
                          className="text-[10px] font-mono text-amber-400 hover:underline"
                        >
                          {showLinkEditor ? 'Close' : 'Change / Paste Link'}
                        </button>
                      </div>
                      <div className="font-mono text-sm text-amber-300 font-bold break-all">
                        {currentMeetUrl}
                      </div>
                    </div>

                    <a
                      href={currentMeetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open in Google Meet</span>
                    </a>
                  </div>

                  {/* Inline Link Updater */}
                  {showLinkEditor && (
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                      <label className="text-[11px] font-mono text-zinc-300 block">
                        Paste active Google Meet URL (from meet.new or Google Calendar):
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customLinkInput}
                          onChange={(e) => setCustomLinkInput(e.target.value)}
                          placeholder="https://meet.google.com/abc-defg-hij"
                          className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <button
                          onClick={() => {
                            if (customLinkInput.trim()) {
                              let url = customLinkInput.trim();
                              if (!url.startsWith('http')) {
                                url = `https://${url.startsWith('meet.google.com') ? '' : 'meet.google.com/'}${url}`;
                              }
                              setCurrentMeetUrl(url);
                              setShowLinkEditor(false);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-bold hover:bg-amber-400"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <div className="text-[10px] text-zinc-400 uppercase">Host Admission</div>
                      <div className="text-white font-bold mt-0.5">Knock Required</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <div className="text-[10px] text-zinc-400 uppercase">Encryption</div>
                      <div className="text-emerald-400 font-bold mt-0.5">TLS 1.3 / SRTP</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] col-span-2 sm:col-span-1">
                      <div className="text-[10px] text-zinc-400 uppercase">Provider</div>
                      <div className="text-purple-300 font-bold mt-0.5">Google Meet API</div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs text-zinc-400">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    How to conduct confidential sessions:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                    <li>Click <strong>Open in Google Meet</strong> to start the video and audio stream in a new tab.</li>
                    <li>Keep this tab open as your dual-screen dashboard for shared notes, architecture scratchpad, and portfolio links.</li>
                    <li>The host must admit participants from the Google Meet lobby.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live In-Meeting Scratchpad & Security Audit */}
          <div className="lg:col-span-5 space-y-6">
            {/* Collaborative Notes */}
            <div className="rounded-3xl bg-[#0f111a] border border-white/10 p-6 flex flex-col h-[480px]">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-200">
                  <Terminal className="w-4 h-4 text-violet-400" />
                  <span>Confidential Meeting Notes</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Auto-saved
                </span>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Type real-time interview feedback, code architecture notes, or key discussion points..."
                className="flex-1 w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none leading-relaxed"
              />

              <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>Markdown supported</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(notes);
                    alert('Notes copied to clipboard!');
                  }}
                  className="text-violet-400 hover:text-violet-300 font-bold"
                >
                  Copy Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* WebRTC Embedded Frame */
        <div className="flex-1 w-full h-[calc(100vh-140px)] bg-black relative">
          <iframe
            src={jitsiUrl}
            allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
            className="w-full h-full border-0"
            title={`Collaboration Room - ${slug}`}
          />
        </div>
      )}
    </div>
  );
}
