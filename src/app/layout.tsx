import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#08090d',
};

export const metadata: Metadata = {
  title: 'Campus Skill Connect — Proof-of-Skill Campus Network & Portfolio',
  description:
    'A high-trust campus platform where students showcase verified proof of work, connect across disciplines and campuses, build ATS-optimized CVs, and get matched with recruiters.',
  keywords: [
    'campus portfolio',
    'student skills',
    'ATS resume builder',
    'peer collaboration',
    'university talent',
    'proof of work',
    'recruiter search',
  ],
  authors: [{ name: 'Campus Skill Connect Team' }],
};

import { RoleProvider } from '@/lib/auth/role-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("h-full antialiased scroll-smooth dark", "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-[var(--surface)] text-[var(--text-primary)] selection:bg-[#3855d9]/30 selection:text-white">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <RoleProvider>
          <Navbar />
          <main id="main-content" className="flex-1 flex flex-col w-full" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </RoleProvider>
      </body>
    </html>
  );
}
