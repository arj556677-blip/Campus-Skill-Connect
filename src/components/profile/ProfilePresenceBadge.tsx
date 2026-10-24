'use client';

import React, { useState, useEffect } from 'react';

interface ProfilePresenceBadgeProps {
  profileId: string;
  initialOnline?: boolean;
  isCurrentUser?: boolean;
}

export default function ProfilePresenceBadge({
  profileId,
  initialOnline = false,
  isCurrentUser = false,
}: ProfilePresenceBadgeProps) {
  const [online, setOnline] = useState<boolean>(isCurrentUser ? true : initialOnline);

  useEffect(() => {
    // If viewing own profile, pulse presence heartbeat into Redis
    if (isCurrentUser) {
      setOnline(true);
      fetch('/api/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profileId }),
      }).catch(() => {});

      const interval = setInterval(() => {
        fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: profileId }),
        }).catch(() => {});
      }, 30000);

      return () => clearInterval(interval);
    }

    // Otherwise check presence status of other user
    let isSubscribed = true;
    fetch(`/api/presence?userId=${encodeURIComponent(profileId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isSubscribed && typeof data.isOnline === 'boolean') {
          setOnline(data.isOnline);
        }
      })
      .catch(() => {});

    return () => {
      isSubscribed = false;
    };
  }, [profileId, isCurrentUser]);

  if (online) {
    return (
      <span
        title="Active in Redis Presence Store (Connected)"
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs animate-in fade-in duration-200"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Online (Redis Active)</span>
      </span>
    );
  }

  return (
    <span
      title="User is currently offline (no active Redis session heartbeat)"
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full shadow-2xs animate-in fade-in duration-200"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      <span>Offline</span>
    </span>
  );
}
