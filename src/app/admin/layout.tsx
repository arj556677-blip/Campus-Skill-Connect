import React from 'react';
import DashboardSessionGuard from '@/components/auth/DashboardSessionGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Session Security Guard: Disables browser back/previous button on admin dashboard */}
      <DashboardSessionGuard />
      {children}
    </>
  );
}
