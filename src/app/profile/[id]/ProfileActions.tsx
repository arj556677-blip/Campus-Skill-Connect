'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserPlus, UserCheck, UserX, MessageSquare, Share2, Check, Ban, AlertCircle, Loader2 } from 'lucide-react';

interface ProfileActionsProps {
  profileId: string;
  initialStatus?: 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'blocked' | 'none';
  isIncoming?: boolean;
}

export default function ProfileActions({
  profileId,
  initialStatus = 'none',
  isIncoming = false,
}: ProfileActionsProps) {
  const [status, setStatus] = useState<string>(initialStatus);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const performAction = async (action: 'request' | 'accept' | 'decline' | 'withdraw' | 'block' | 'unblock') => {
    const previousStatus = status;
    setErrorMessage(null);
    setLoadingAction(action);

    // Optimistic UI updates
    if (action === 'request') setStatus('pending');
    else if (action === 'accept') setStatus('accepted');
    else if (action === 'decline') setStatus('declined');
    else if (action === 'withdraw') setStatus('withdrawn');
    else if (action === 'block') setStatus('blocked');
    else if (action === 'unblock') setStatus('none');

    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: profileId, action }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to ${action} connection`);
      }
    } catch (err: unknown) {
      // Rollback on error
      setStatus(previousStatus);
      setErrorMessage(err instanceof Error ? err.message : 'Action failed');
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
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {/* Connection Action Buttons based on canonical state */}
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
          <div className="inline-flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700">
              Pending
            </span>
            <button
              onClick={() => performAction('withdraw')}
              disabled={loadingAction !== null}
              className="px-3 py-2 rounded-full text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
            >
              Withdraw
            </button>
          </div>
        ) : status === 'pending' && isIncoming ? (
          <div className="inline-flex items-center gap-1.5">
            <button
              onClick={() => performAction('accept')}
              disabled={loadingAction !== null}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-[#1b59f8] hover:bg-[#174ed8] text-white shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Accept</span>
            </button>
            <button
              onClick={() => performAction('decline')}
              disabled={loadingAction !== null}
              className="px-3.5 py-2 rounded-full text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200"
            >
              Decline
            </button>
          </div>
        ) : status === 'accepted' ? (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Connected</span>
          </span>
        ) : status === 'blocked' ? (
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

        {/* Message Link (only if connected or public messaging permitted) */}
        {status === 'accepted' && (
          <Link
            href={`/messages?recipientId=${profileId}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-semibold transition-colors shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
            <span>Message</span>
          </Link>
        )}

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

      {/* Inline Rollback Error Message */}
      {errorMessage && (
        <div role="alert" className="text-xs text-rose-600 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
