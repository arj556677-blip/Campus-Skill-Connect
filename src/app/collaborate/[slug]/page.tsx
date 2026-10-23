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
    <div className="min-h-[calc(100vh-65px)] bg-[#f8fafc] text-slate-900 flex flex-col">
      {/* Confidential Watermark Banner (if Google Meet / Confidential) */}
      {isConfidential && (
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 flex items-center justify-between text-[11px] font-semibold text-amber-900">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span className="uppercase tracking-wider">
              CONFIDENTIAL SESSION • GOOGLE MEET API • RESTRICTED ACCESS
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-slate-500 font-normal">
              WATERMARK ID: <strong className="text-slate-800">CSC-SEC-2026-X9</strong>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
              HOST KNOCKING ACTIVE
            </span>
          </div>
        </div>
      )}

      {/* Top Session Bar */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/collaborate"
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isGoogleMeet ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              />
              <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>{existingRoom?.title || slug}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-normal">
                  #{slug}
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              {isGoogleMeet
                ? 'Google Meet API • TLS 1.3 End-to-End Encryption • Knock-to-Join'
                : 'Encrypted WebRTC Peer Mesh • Zero-Plugin Browser Standard'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyInvite}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Invite Copied</span>
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
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold shadow-xs transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Launch Google Meet</span>
            </a>
          ) : (
            <a
              href={jitsiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
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
              <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-xs text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8" />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Confidential Room Locked
                  </h2>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    This meeting is protected by an access passcode. Enter the meeting secret provided by the host.
                  </p>
                </div>

                <form onSubmit={handleUnlockPasscode} className="max-w-xs mx-auto space-y-3">
                  <input
                    type="text"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    placeholder="Enter Room Passcode..."
                    className="w-full text-center px-4 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-sm font-mono tracking-wider text-slate-900 uppercase focus:outline-none focus:border-amber-500"
                  />
                  {passcodeError && (
                    <p className="text-xs text-rose-600">
                      Incorrect passcode. Hint: Check meeting card on Collab dashboard.
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-full bg-[#0f172a] hover:bg-black text-white font-bold text-xs shadow-xs transition-all"
                  >
                    Unlock &amp; View Meeting Link
                  </button>
                </form>
              </div>
            ) : !ndaAccepted ? (
              /* Digital NDA Agreement Barrier */
              <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-xs space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      Digital Non-Disclosure Agreement (NDA)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Standard campus engineering IP &amp; recruitment privacy pledge.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed max-h-48 overflow-y-auto">
                  <p>
                    <strong>CONFIDENTIALITY ACKNOWLEDGMENT:</strong> By accessing this Google Meet session, you agree that all code architectures, intellectual property disclosures, technical interview feedback, and candidate evaluations shared within this room are strictly proprietary.
                  </p>
                  <p>
                    Unauthorized recording, screen capture, or redistribution is strictly prohibited and logged under session ID <strong>CSC-SEC-2026</strong>.
                  </p>
                </div>

                <button
                  onClick={() => setNdaAccepted(true)}
                  className="w-full py-3 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>I Accept NDA — Proceed to Google Meet</span>
                </button>
              </div>
            ) : (
              /* Google Meet Launchpad */
              <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-xs space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Security Clear: Access Granted</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900">
                      Google Meet Confidential Launchpad
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Your session is ready. Connect using Google Meet for HD audio/video, noise cancellation, and screen sharing.
                    </p>
                  </div>
                </div>

                {/* Google Meet Action Card */}
                <div className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Meeting Direct Link
                        </span>
                        <button
                          onClick={() => setShowLinkEditor(!showLinkEditor)}
                          className="text-[10px] text-[#1b59f8] hover:underline font-semibold"
                        >
                          {showLinkEditor ? 'Close' : 'Change / Paste Link'}
                        </button>
                      </div>
                      <div className="font-mono text-sm text-slate-900 font-bold break-all">
                        {currentMeetUrl}
                      </div>
                    </div>

                    <a
                      href={currentMeetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open in Google Meet</span>
                    </a>
                  </div>

                  {/* Inline Link Updater */}
                  {showLinkEditor && (
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                      <label className="text-[11px] font-semibold text-slate-700 block">
                        Paste active Google Meet URL (from meet.new or Google Calendar):
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customLinkInput}
                          onChange={(e) => setCustomLinkInput(e.target.value)}
                          placeholder="https://meet.google.com/abc-defg-hij"
                          className="flex-1 px-3 py-1.5 rounded-lg bg-[#f8fafc] border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#1b59f8]"
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
                          className="px-4 py-1.5 rounded-full bg-[#0f172a] text-white text-xs font-bold hover:bg-black"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Host Admission</div>
                      <div className="text-slate-900 font-bold mt-0.5">Knock Required</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Encryption</div>
                      <div className="text-emerald-700 font-bold mt-0.5">TLS 1.3 / SRTP</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200 col-span-2 sm:col-span-1">
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Provider</div>
                      <div className="text-blue-700 font-bold mt-0.5">Google Meet API</div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-2 text-xs text-slate-600">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
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
            <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col h-[480px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Terminal className="w-4 h-4 text-[#1b59f8]" />
                  <span>Confidential Meeting Notes</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                  Auto-saved
                </span>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Type real-time interview feedback, code architecture notes, or key discussion points..."
                className="flex-1 w-full bg-[#f8fafc] border border-slate-200 rounded-2xl p-4 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#1b59f8] resize-none leading-relaxed"
              />

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>Markdown supported</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(notes);
                    alert('Notes copied to clipboard!');
                  }}
                  className="text-[#1b59f8] hover:underline font-bold"
                >
                  Copy Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* WebRTC Embedded Frame */
        <div className="flex-1 w-full h-[calc(100vh-140px)] bg-slate-900 relative">
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
