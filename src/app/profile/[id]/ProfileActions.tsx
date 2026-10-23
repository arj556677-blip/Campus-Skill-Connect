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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius-sm)] text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
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
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium bg-[var(--surface-sunken)] border border-[var(--border)] text-[var(--text-secondary)]">
              Pending
            </span>
            <button
              onClick={() => performAction('withdraw')}
              disabled={loadingAction !== null}
              className="px-2.5 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium text-[var(--danger)] hover:bg-[var(--danger-bg)] border border-[var(--danger)]/30 transition-colors"
            >
              Withdraw
            </button>
          </div>
        ) : status === 'pending' && isIncoming ? (
          <div className="inline-flex items-center gap-1.5">
            <button
              onClick={() => performAction('accept')}
              disabled={loadingAction !== null}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
            >
              <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Accept</span>
            </button>
            <button
              onClick={() => performAction('decline')}
              disabled={loadingAction !== null}
              className="px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium text-[var(--danger)] hover:bg-[var(--danger-bg)] border border-[var(--border)]"
            >
              Decline
            </button>
          </div>
        ) : status === 'accepted' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/40">
            <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Connected</span>
          </span>
        ) : status === 'blocked' ? (
          <div className="inline-flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium bg-[var(--danger-bg)] text-[var(--danger)]">
              <Ban className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Blocked</span>
            </span>
            <button
              onClick={() => performAction('unblock')}
              disabled={loadingAction !== null}
              className="text-xs text-[var(--text-muted)] hover:text-white underline ml-1"
            >
              Unblock
            </button>
          </div>
        ) : null}

        {/* Message Link (only if connected or public messaging permitted) */}
        {status === 'accepted' && (
          <Link
            href={`/messages?recipientId=${profileId}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-white text-xs font-semibold hover:bg-[var(--surface-hover)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[var(--text-secondary)]" aria-hidden="true" />
            <span>Message</span>
          </Link>
        )}

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-sm)] text-xs font-medium bg-[var(--surface-sunken)] text-[var(--text-secondary)] border border-[var(--border)] hover:text-white hover:border-[var(--border-hover)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
          title="Share profile link"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--success)]" aria-hidden="true" />
              <span className="text-[var(--success)] font-medium">Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
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
            className="p-2 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)] transition-colors"
          >
            <UserX className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="sr-only">Block user</span>
          </button>
        )}
      </div>

      {/* Inline Rollback Error Message */}
      {errorMessage && (
        <div role="alert" className="text-xs text-[var(--danger)] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
