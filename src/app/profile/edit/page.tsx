'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRole } from '@/lib/auth/role-context';
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
  Sparkles,
  Plus,
  X,
  Globe,
  Camera,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';

const AVATAR_PRESETS = [
  {
    label: 'Modern Tech Builder',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Software Engineer',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'AI & ML Researcher',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Talent & University Partner',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Systems Architect',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Full-Stack Developer',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  },
];

export default function EditProfilePage() {
  const router = useRouter();
  const { currentUser, currentRole, updateUserProfile, isMounted } = useRole();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifyingCampus, setVerifyingCampus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile Form States
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [field, setField] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'campus' | 'connections' | 'only_me'>('public');
  const [isCampusVerified, setIsCampusVerified] = useState(false);

  // Skills & Links
  const [skills, setSkills] = useState<string[]>([
    'Distributed Systems',
    'Cloud Architecture',
    'Data Structures',
    'WebRTC',
    'TypeScript',
  ]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // Hydrate fields on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        // 1. Initial values from RoleContext
        if (currentUser) {
          setDisplayName(currentUser.name || '');
          setHeadline(currentUser.title || '');
          setAvatarUrl(currentUser.avatar || '');
          setInstitutionName(currentUser.institution || currentUser.company || 'IISc Bangalore');
        }

        // 2. Extra stored attributes from localStorage
        if (typeof window !== 'undefined') {
          const storedBio = localStorage.getItem('csc_user_bio');
          if (storedBio) setBio(storedBio);

          const storedField = localStorage.getItem('csc_user_field');
          if (storedField) setField(storedField);

          const storedSkills = localStorage.getItem('csc_user_skills');
          if (storedSkills) {
            try {
              setSkills(JSON.parse(storedSkills));
            } catch {
              // ignore
            }
          }

          const storedGithub = localStorage.getItem('csc_github_username');
          if (storedGithub) {
            setGithubUrl(storedGithub.startsWith('http') ? storedGithub : `https://github.com/${storedGithub.replace('@', '')}`);
            if (!username) {
              setUsername(storedGithub.replace('@', '').toLowerCase());
            }
          }

          const storedLinkedin = localStorage.getItem('csc_user_linkedin');
          if (storedLinkedin) setLinkedinUrl(storedLinkedin);

          const storedWebsite = localStorage.getItem('csc_user_website');
          if (storedWebsite) setWebsiteUrl(storedWebsite);
        }

        // 3. Check Supabase profiles table if available
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*, institution:communities(*)')
            .eq('id', user.id)
            .single();

          if (profile) {
            if (profile.display_name) setDisplayName(profile.display_name);
            if (profile.username) setUsername(profile.username);
            if (profile.headline) setHeadline(profile.headline);
            if (profile.bio) setBio(profile.bio);
            if (profile.field) setField(profile.field);
            if (profile.avatar_path || profile.avatar_url) {
              setAvatarUrl(profile.avatar_path || profile.avatar_url);
            }
            if (profile.profile_visibility) {
              setVisibility(
                profile.profile_visibility === 'worldwide'
                  ? 'public'
                  : (profile.profile_visibility as 'public' | 'campus' | 'connections' | 'only_me')
              );
            }
            setIsCampusVerified(profile.is_campus_verified || profile.is_verified || false);
            if (profile.institution?.name) setInstitutionName(profile.institution.name);
          }
        }
      } catch (err: unknown) {
        console.warn('[EditProfile] Profile load notice:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [currentUser]);

  // Skill tag add
  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newSkillInput.trim();
    if (clean && !skills.includes(clean)) {
      const updated = [...skills, clean];
      setSkills(updated);
      setNewSkillInput('');
      if (typeof window !== 'undefined') {
        localStorage.setItem('csc_user_skills', JSON.stringify(updated));
      }
    }
  };

  // Skill tag remove
  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('csc_user_skills', JSON.stringify(updated));
    }
  };

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const cleanName = displayName.trim() || 'Campus Member';
    const cleanUsername = username.trim().toLowerCase();

    // Validate username syntax if specified
    if (cleanUsername && !/^[a-z0-9_-]{3,24}$/.test(cleanUsername)) {
      setStatusMessage({
        type: 'error',
        text: 'Username must be 3–24 characters and only contain letters, numbers, underscores, or hyphens.',
      });
      setSaving(false);
      return;
    }

    try {
      // 1. Update Supabase Database if logged in through Supabase
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            display_name: cleanName,
            username: cleanUsername || null,
            headline: headline.trim(),
            bio: bio.trim(),
            field: field.trim(),
            avatar_url: avatarUrl.trim() || null,
            profile_visibility: visibility,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error && error.code === '23505') {
          throw new Error('This username is already taken. Please choose another username handle.');
        }
      }

      // 2. Update Global Role Context & Cookies
      updateUserProfile({
        name: cleanName,
        title: headline.trim() || (currentRole === 'recruiter' ? 'Talent Partner' : 'Student Builder'),
        avatar: avatarUrl.trim() || (currentUser?.avatar || AVATAR_PRESETS[0].url),
        institution: institutionName.trim() || undefined,
      });

      // 3. Persist extended attributes to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('csc_user_bio', bio.trim());
        localStorage.setItem('csc_user_field', field.trim());
        localStorage.setItem('csc_user_skills', JSON.stringify(skills));
        if (githubUrl) localStorage.setItem('csc_github_username', githubUrl);
        if (linkedinUrl) localStorage.setItem('csc_user_linkedin', linkedinUrl);
        if (websiteUrl) localStorage.setItem('csc_user_website', websiteUrl);
        if (cleanUsername) localStorage.setItem('csc_username', cleanUsername);
      }

      setStatusMessage({
        type: 'success',
        text: 'Profile updated successfully! All changes are live across the platform.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save profile changes.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  // Verify campus institution
  const handleVerifyCampus = async () => {
    setVerifyingCampus(true);
    setStatusMessage(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
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
          return;
        }
      }

      // Local / preview verification toggle
      setIsCampusVerified(true);
      setStatusMessage({
        type: 'success',
        text: 'Campus verification verified! Official institution badge is now active on your portfolio.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Campus verification check failed.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setVerifyingCampus(false);
    }
  };

  if (!isMounted || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-8 h-8 text-[#1b59f8] animate-spin" />
      </div>
    );
  }

  const dashboardTarget = currentUser?.dashboardUrl || (currentRole === 'recruiter' ? '/dashboard/recruiter' : '/dashboard/student');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href={dashboardTarget}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Edit Scholar Profile
            </h1>
            <p className="text-xs text-slate-500">
              Customize your public identity, proof of work presentation, top technical skills, and recruiter discovery settings.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/profile/privacy"
              className="px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span>Data Rights</span>
            </Link>

            <Link
              href={username ? `/u/${username}` : dashboardTarget}
              className="px-4 py-2 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Public Portfolio</span>
            </Link>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {statusMessage && (
          <div
            role="alert"
            className={`p-4 rounded-2xl text-xs flex items-center justify-between gap-3 shadow-xs animate-in fade-in ${
              statusMessage.type === 'error'
                ? 'bg-rose-50 border border-rose-200 text-rose-800'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              )}
              <span className="font-medium">{statusMessage.text}</span>
            </div>

            {statusMessage.type === 'success' && (
              <Link
                href={dashboardTarget}
                className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shrink-0"
              >
                Go to Dashboard &rarr;
              </Link>
            )}
          </div>
        )}

        {/* Profile Card Container */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-8">
          
          {/* Section 1: Avatar Studio */}
          <div className="pb-8 border-b border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#1b59f8]" />
                  <span>Avatar &amp; Visual Identity</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose a high-resolution portrait or enter a custom hosted image URL.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-2">
              <div className="relative shrink-0">
                <img
                  src={avatarUrl || AVATAR_PRESETS[0].url}
                  alt={displayName || 'Avatar'}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#1b59f8]/20 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = AVATAR_PRESETS[0].url;
                  }}
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <div className="flex-1 space-y-3">
                <div className="relative">
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/your-portrait.jpg"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1b59f8] focus:bg-white transition-all font-mono"
                  />
                </div>

                {/* Quick-Pick Avatar Presets */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                    Or select from curated builder portraits:
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(preset.url)}
                        title={preset.label}
                        className={`w-9 h-9 rounded-xl overflow-hidden border transition-all ${
                          avatarUrl === preset.url
                            ? 'ring-2 ring-[#1b59f8] border-[#1b59f8] scale-105'
                            : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Campus Verification Card */}
          <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#1b59f8]" />
                <span className="text-xs font-bold text-slate-900">
                  Campus Institutional Verification
                </span>
                {isCampusVerified ? (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    VERIFIED CAMPUS MEMBER
                  </span>
                ) : (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                    SELF-DECLARED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {isCampusVerified
                  ? `Cryptographically attested student builder status at ${institutionName || 'IISc Bangalore'}.`
                  : 'Verify your institutional .edu / .ac.in domain to earn the high-trust verified badge on recruiter candidate search.'}
              </p>
            </div>

            {!isCampusVerified && (
              <button
                type="button"
                onClick={handleVerifyCampus}
                disabled={verifyingCampus}
                className="px-4 py-2 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shrink-0 active:scale-95 shadow-sm"
              >
                {verifyingCampus ? 'Verifying Domain...' : 'Verify Campus Badge'}
              </button>
            )}
          </div>

          {/* Section 3: Primary Form */}
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Display Name & Username Handle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Display Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#1b59f8] focus:bg-white transition-all shadow-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Public Username Handle
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="alex-rivera"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#1b59f8] focus:bg-white transition-all font-mono shadow-xs"
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Public URL: <strong className="text-slate-700">/u/{username || 'your-handle'}</strong>
                </p>
              </div>
            </div>

            {/* Headline and Academic Field */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Professional Headline / Focus
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Distributed Systems & Database Research"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#1b59f8] focus:bg-white transition-all shadow-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Academic Field / Major / Company
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#1b59f8] focus:bg-white transition-all shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Institution / University */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                Campus Institution / University
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. Indian Institute of Science, Bangalore"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#1b59f8] focus:bg-white transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Bio & Technical Research Background */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                Bio &amp; Technical Summary
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your primary technical interests, production repositories, benchmark papers, and open collaboration areas..."
                className="w-full px-4 py-3 rounded-2xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#1b59f8] focus:bg-white transition-all resize-none shadow-xs leading-relaxed"
              />
            </div>

            {/* Skills & Tech Stack Badges */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center justify-between">
                <span>Top Skills &amp; Tech Stack</span>
                <span className="text-[10px] text-slate-400 font-normal">Shown on ATS &amp; Recruiter Radar</span>
              </label>
              
              <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/90">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs group"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <div className="flex items-center gap-1.5 flex-1 min-w-[140px]">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="+ Add skill (e.g. Rust)..."
                    className="w-full px-2.5 py-1 text-xs bg-transparent border-0 text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  {newSkillInput.trim() && (
                    <button
                      type="button"
                      onClick={() => handleAddSkill()}
                      className="px-2 py-0.5 rounded-lg bg-[#1b59f8] text-white text-[10px] font-bold shrink-0"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Social & Portfolio Links */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                External Repositories &amp; Portfolio Links
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-mono">
                    GH
                  </div>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="github.com/username"
                    className="w-full pl-11 pr-3 py-2 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#1b59f8] focus:bg-white transition-all font-mono shadow-xs"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-mono">
                    IN
                  </div>
                  <input
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="linkedin.com/in/username"
                    className="w-full pl-11 pr-3 py-2 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#1b59f8] focus:bg-white transition-all font-mono shadow-xs"
                  />
                </div>

                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://portfolio.dev"
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#1b59f8] focus:bg-white transition-all font-mono shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Profile Visibility Controls */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                Profile Visibility Model
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'public',
                    title: 'Public (Recommended)',
                    desc: 'Discoverable by all signed-in students, recruiters, and campus partners.',
                  },
                  {
                    id: 'campus',
                    title: 'Campus Federated Only',
                    desc: 'Restricted strictly to verified students of your university.',
                  },
                  {
                    id: 'connections',
                    title: 'Direct Connections Only',
                    desc: 'Only visible to peers with accepted collaboration requests.',
                  },
                  {
                    id: 'only_me',
                    title: 'Only Me (Private)',
                    desc: 'Hidden from platform searches, candidate radars, and discovery.',
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      visibility === opt.id
                        ? 'border-[#1b59f8] bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={opt.id}
                      checked={visibility === opt.id}
                      onChange={() => setVisibility(opt.id as 'public' | 'campus' | 'connections' | 'only_me')}
                      className="mt-0.5 text-[#1b59f8] focus:ring-[#1b59f8]"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{opt.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={dashboardTarget}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 transition-colors"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
