'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  AtSign,
  Briefcase,
  FileText,
  Shield,
  Eye,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Building,
  Save,
  Loader2,
} from 'lucide-react';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifyingCampus, setVerifyingCampus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [field, setField] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'campus' | 'connections' | 'only_me'>('public');
  const [isCampusVerified, setIsCampusVerified] = useState(false);
  const [institutionName, setInstitutionName] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/sign-in?redirect=/profile/edit');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*, institution:communities(*)')
          .eq('id', user.id)
          .single();

        if (profile) {
          setDisplayName(profile.display_name || '');
          setUsername(profile.username || '');
          setHeadline(profile.headline || '');
          setBio(profile.bio || '');
          setField(profile.field || '');
          setVisibility(profile.profile_visibility === 'worldwide' ? 'public' : profile.profile_visibility || 'public');
          setIsCampusVerified(profile.is_campus_verified || profile.is_verified || false);
          setInstitutionName(profile.institution?.name || null);
        }
      } catch (err: unknown) {
        setStatusMessage({ type: 'error', text: 'Failed to load profile data.' });
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    // Validate username syntax
    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername && !/^[a-z0-9_-]{3,24}$/.test(cleanUsername)) {
      setStatusMessage({
        type: 'error',
        text: 'Username must be 3–24 characters and only contain letters, numbers, underscores, or hyphens.',
      });
      setSaving(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName.trim(),
          username: cleanUsername || null,
          headline: headline.trim(),
          bio: bio.trim(),
          field: field.trim(),
          profile_visibility: visibility,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        if (error.code === '23505') {
          throw new Error('This username is already taken. Please choose another.');
        }
        throw error;
      }

      setStatusMessage({ type: 'success', text: 'Profile changes saved successfully.' });
      setTimeout(() => {
        router.push(cleanUsername ? `/u/${cleanUsername}` : `/u/${user.id}`);
      }, 800);
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save changes.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyCampus = async () => {
    setVerifyingCampus(true);
    setStatusMessage(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');

      // Call database function verify_user_campus
      const { data, error } = await supabase.rpc('verify_user_campus', {
        p_user_id: user.id,
      });

      if (error) throw error;

      if (data === true) {
        setIsCampusVerified(true);
        setStatusMessage({
          type: 'success',
          text: 'Campus email verified! Verified institution badge is now activated on your profile.',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Verification failed: Your sign-up email domain does not match any recognized university campus registry.',
        });
      }
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Campus verification failed.',
      });
    } finally {
      setVerifyingCampus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text-primary)] py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/profile/me"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Profile View</span>
          </Link>

          <Link
            href="/profile/privacy"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-xs font-mono font-bold text-[var(--accent-fg)] hover:border-[var(--accent)] transition-all"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy &amp; Data Rights</span>
          </Link>
        </div>

        <div className="bento-card p-6 sm:p-10 space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Edit Scholar Profile
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Control your public portfolio presentation, username handle, and strict privacy boundaries.
            </p>
          </div>

          {statusMessage && (
            <div
              role="alert"
              className={`p-3.5 rounded-[var(--radius-sm)] text-xs flex items-center gap-2.5 ${
                statusMessage.type === 'error'
                  ? 'bg-[var(--danger-bg)] border border-[var(--danger)] text-[var(--danger)]'
                  : 'bg-[var(--success-bg)] border border-[var(--success)] text-[var(--success)]'
              }`}
            >
              {statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Campus Verification Banner */}
          <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  University Verification Status
                </span>
                {isCampusVerified ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] font-semibold border border-[var(--accent)]/30">
                    Verified
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-raised)] text-[var(--text-muted)] border border-[var(--border)]">
                    Self-Declared
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {isCampusVerified
                  ? `Verified institutional membership at ${institutionName || 'your university'}.`
                  : 'Verify your institutional email domain to earn the verified university badge.'}
              </p>
            </div>

            {!isCampusVerified && (
              <button
                type="button"
                onClick={handleVerifyCampus}
                disabled={verifyingCampus}
                className="px-3.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold transition-colors shrink-0"
              >
                {verifyingCampus ? 'Checking Domain...' : 'Verify Campus Domain'}
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Display Name & Handle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-white text-xs placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Unique Username Handle
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="alex-rivera"
                    className="w-full pl-9 pr-3.5 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-white text-xs placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)] font-mono"
                  />
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">
                  Public profile URL: /u/{username || 'username'}
                </p>
              </div>
            </div>

            {/* Headline and Field */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Headline / Focus
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Distributed Systems & Database Research"
                    className="w-full pl-9 pr-3.5 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-white text-xs placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Academic Field
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                  <input
                    type="text"
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    placeholder="Computer Science & Engineering"
                    className="w-full pl-9 pr-3.5 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-white text-xs placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)]"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Bio & Research Background
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your technical interests, projects, and collaboration interests..."
                className="w-full px-3.5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-white text-xs placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)] resize-none"
              />
            </div>

            {/* Visibility Settings */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Profile Visibility Model
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'public',
                    title: 'Public',
                    desc: 'Discoverable by all signed-in students, faculty, and recruiters.',
                  },
                  {
                    id: 'campus',
                    title: 'Campus Only',
                    desc: 'Restricted to verified members of your institution.',
                  },
                  {
                    id: 'connections',
                    title: 'Connections Only',
                    desc: 'Only visible to peers you have accepted connection requests with.',
                  },
                  {
                    id: 'only_me',
                    title: 'Only Me (Private)',
                    desc: 'Hidden from search, discovery, and direct profile navigation.',
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-3 rounded-[var(--radius-sm)] border cursor-pointer transition-colors ${
                      visibility === opt.id
                        ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                        : 'border-[var(--border)] bg-[var(--surface-sunken)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={opt.id}
                      checked={visibility === opt.id}
                      onChange={() => setVisibility(opt.id as 'public' | 'campus' | 'connections' | 'only_me')}
                      className="mt-0.5 text-[var(--accent)] focus:ring-[var(--focus)]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)]">{opt.title}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
              <Link
                href="/profile/me"
                className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:text-white transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Save className="w-4 h-4" aria-hidden="true" />
                )}
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
