'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRole } from '@/lib/auth/role-context';
import { ArrowLeft, Mail, Lock, User, Building, ArrowRight, Sparkles, GraduationCap, Briefcase } from 'lucide-react';
import { MOCK_COMMUNITIES } from '@/lib/data/mock-data';

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useRole();

  const [accountType, setAccountType] = useState<'student' | 'recruiter'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [communityId, setCommunityId] = useState(MOCK_COMMUNITIES[0].id);
  const [companyName, setCompanyName] = useState('Stripe');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
            institution_id: accountType === 'student' ? communityId : null,
            role: accountType,
          },
        },
      });
    } catch {
      // Offline fallback
    }

    // Persist role & authenticate
    login(accountType);
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#08090d]">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-violet-600/15 via-indigo-600/10 to-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Already have an account? Sign In</span>
        </Link>

        <div className="rounded-3xl bg-[#10121a]/90 border border-white/10 p-6 sm:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-[0_0_25px_rgba(139,92,246,0.5)]">
              CS
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Create Campus Account
            </h1>
            <p className="text-xs text-zinc-400">
              Join the high-trust proof-of-skill network to showcase work and hire verified talent.
            </p>
          </div>

          {/* Account Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setAccountType('student')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                accountType === 'student'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-violet-400" />
              <span>Student Builder</span>
            </button>
            <button
              type="button"
              onClick={() => setAccountType('recruiter')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                accountType === 'recruiter'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Tech Recruiter</span>
            </button>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/50 transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                {accountType === 'student'
                  ? 'Institutional Email (.edu or .ac.in)'
                  : 'Company Work Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    accountType === 'student'
                      ? 'alex.rivera@iisc.ac.in'
                      : 'marcus.chen@stripe.com'
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/50 transition-all font-mono"
                />
              </div>
            </div>

            {accountType === 'student' ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Campus Institution
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <select
                    value={communityId}
                    onChange={(e) => setCommunityId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141724] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/50 transition-all font-sans"
                  >
                    {MOCK_COMMUNITIES.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#141724] text-white">
                        {c.name} ({c.domain})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Company / Agency Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Stripe, Google, Datadog"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/50 transition-all font-sans"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a strong passkey"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/50 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white text-xs font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
                accountType === 'student'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-900/40'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/40'
              }`}
            >
              <span>{loading ? 'Creating Account...' : `Register as ${accountType === 'student' ? 'Student' : 'Recruiter'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-white/[0.08] text-center">
            <p className="text-xs text-zinc-400">
              Already verified?{' '}
              <Link href="/sign-in" className="font-bold text-violet-400 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
