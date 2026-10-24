import React from 'react';
import DashboardSessionGuard from '@/components/auth/DashboardSessionGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Session Security Guard: Locks previous page / browser back navigation only on authenticated dashboards */}
      <DashboardSessionGuard />
      {children}
    </>
  );
}
