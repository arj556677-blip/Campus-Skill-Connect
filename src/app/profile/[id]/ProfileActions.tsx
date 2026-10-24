'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UserPlus,
  UserCheck,
  UserX,
  MessageSquare,
  Share2,
  Check,
  Ban,
  Clock,
  RotateCcw,
  Loader2,
  Sparkles,
} from 'lucide-react';

import {
  getConnection,
  sendConnectionRequest,
  revokeConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
  unfollowConnection,
  CONNECTIONS_EVENT,
} from '@/lib/connections/connection-store';

interface ProfileActionsProps {
  profileId: string;
  initialStatus?: 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'blocked' | 'none';
  isIncoming?: boolean;
}

export default function ProfileActions({
  profileId,
  initialStatus = 'none',
  isIncoming: initialIsIncoming = false,
}: ProfileActionsProps) {
  const [status, setStatus] = useState<string>(initialStatus);
  const [isIncoming, setIsIncoming] = useState<boolean>(initialIsIncoming);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSimulateActions, setShowSimulateActions] = useState(false);

  // Synchronize with persistent connection-store & events
  useEffect(() => {
    const syncStatus = () => {
      const item = getConnection(profileId);
      if (item) {
        setStatus(item.status);
        setIsIncoming(item.isIncoming);
      } else {
        setStatus('none');
        setIsIncoming(false);
      }
    };

    syncStatus();
    window.addEventListener(CONNECTIONS_EVENT, syncStatus);
    window.addEventListener('storage', syncStatus);
    return () => {
      window.removeEventListener(CONNECTIONS_EVENT, syncStatus);
      window.removeEventListener('storage', syncStatus);
    };
  }, [profileId]);

  const performAction = async (action: 'request' | 'accept' | 'decline' | 'withdraw' | 'block' | 'unblock') => {
    setLoadingAction(action);

    try {
      if (action === 'request') {
        await sendConnectionRequest({
          id: profileId,
          name: 'Campus Connection',
        });
        setStatus('pending');
        setIsIncoming(false);
      } else if (action === 'accept') {
        await acceptConnectionRequest(profileId);
        setStatus('accepted');
        setIsIncoming(false);
      } else if (action === 'decline') {
        await declineConnectionRequest(profileId);
        setStatus('none');
        setIsIncoming(false);
      } else if (action === 'withdraw') {
        if (status === 'accepted') {
          await unfollowConnection(profileId);
        } else {
          await revokeConnectionRequest(profileId);
        }
        setStatus('none');
        setIsIncoming(false);
      } else if (action === 'block') {
        await unfollowConnection(profileId);
        setStatus('blocked');
      } else if (action === 'unblock') {
        setStatus('none');
      }
    } finally {
      setLoadingAction(null);
    }
  };


  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center gap-2">
        {/* State 1: No request active -> Connect button */}
        {status === 'none' || status === 'withdrawn' || status === 'declined' ? (
          <button
            onClick={() => performAction('request')}
            disabled={loadingAction !== null}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold bg-[#0f172a] hover:bg-black text-white shadow-xs transition-all active:scale-95"
          >
            {loadingAction === 'request' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>Connect</span>
          </button>
        ) : status === 'pending' && !isIncoming ? (
          /* State 2: Request sent by user -> 'Request Sent' badge + Revoke Request button */
          <div className="inline-flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-amber-50 border border-amber-300/80 text-amber-800 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Request Sent</span>
            </span>

            {/* Revoke button: allows user self to cancel */}
            <button
              onClick={() => performAction('withdraw')}
              disabled={loadingAction !== null}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-rose-700 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 transition-colors shadow-2xs active:scale-95"
              title="Revoke sent connection request"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
              <span>Revoke Request</span>
            </button>

            {/* Recipient Action Simulator Toggle */}
            <button
              onClick={() => setShowSimulateActions(!showSimulateActions)}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-slate-700 px-2 py-1 rounded border border-dashed border-slate-200"
              title="Test recipient actions (Accept or Decline)"
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>Test Recipient Action</span>
            </button>
          </div>
        ) : status === 'pending' && isIncoming ? (
          /* State 3: Incoming request from target -> Accept or Decline */
          <div className="inline-flex items-center gap-1.5">
            <button
              onClick={() => performAction('accept')}
              disabled={loadingAction !== null}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#1b59f8] hover:bg-[#174ed8] text-white shadow-xs active:scale-95"
            >
              <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Accept</span>
            </button>
            <button
              onClick={() => performAction('decline')}
              disabled={loadingAction !== null}
              className="px-3.5 py-2 rounded-full text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 active:scale-95"
            >
              Decline
            </button>
          </div>
        ) : status === 'accepted' ? (
          /* State 4: Collab Accepted -> Unfollow button with Chat button directly adjacent */
          <div className="inline-flex items-center gap-2">
            <button
              onClick={() => performAction('withdraw')}
              disabled={loadingAction !== null}
              title="Click to unfollow / disconnect"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors shadow-2xs active:scale-95"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>Unfollow</span>
            </button>

            <Link
              href={`/messages?recipientId=${encodeURIComponent(profileId)}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
              title="Chat with accepted collaborator"
            >
              <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Chat</span>
            </Link>
          </div>
        ) : status === 'blocked' ? (
          /* State 5: Blocked */
          <div className="inline-flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <Ban className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Blocked</span>
            </span>
            <button
              onClick={() => performAction('unblock')}
              disabled={loadingAction !== null}
              className="text-xs text-slate-500 hover:text-slate-900 underline ml-1"
            >
              Unblock
            </button>
          </div>
        ) : null}

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors"
          title="Share profile link"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span className="text-emerald-700 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span>Share</span>
            </>
          )}
        </button>

        {/* Block Action Option */}
        {status !== 'blocked' && (
          <button
            onClick={() => performAction('block')}
            disabled={loadingAction !== null}
            title="Block this user"
            className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <UserX className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="sr-only">Block user</span>
          </button>
        )}
      </div>

      {/* Recipient Action Simulation Drawer (Test Accept / Decline) */}
      {showSimulateActions && status === 'pending' && !isIncoming && (
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-150">
          <div className="text-slate-600">
            <span className="font-semibold text-slate-800">Simulate Recipient Action:</span>{' '}
            Test when Marcus Chen responds:
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                performAction('accept');
                setShowSimulateActions(false);
              }}
              className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-colors"
            >
              ✓ Accept Request
            </button>
            <button
              onClick={() => {
                performAction('decline');
                setShowSimulateActions(false);
              }}
              className="px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-2xs transition-colors"
            >
              ✕ Decline Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
