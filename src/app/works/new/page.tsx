'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Globe,
  Users,
  Building,
  Lock,
  Calendar,
  Loader2,
} from 'lucide-react';
import { WorkCategory, Visibility } from '@/lib/types';
import { useRole } from '@/lib/auth/role-context';

interface ControlledSkill {
  id: string;
  name: string;
  category: string;
}

const CATEGORIES: { id: WorkCategory; label: string }[] = [
  { id: 'software', label: 'Software Engineering' },
  { id: 'research', label: 'Academic & Applied Research' },
  { id: 'certification', label: 'Industry Certification' },
  { id: 'art', label: 'Visual Art & 3D' },
  { id: 'photography', label: 'Photography' },
  { id: 'music', label: 'Music & Audio' },
  { id: 'dance', label: 'Dance & Performance' },
  { id: 'writing', label: 'Writing & Publication' },
  { id: 'video', label: 'Video & Cinema' },
  { id: 'other', label: 'Interdisciplinary' },
];

export default function NewWorkPage() {
  const router = useRouter();
  const { currentRole, isMounted } = useRole();

  useEffect(() => {
    if (isMounted && currentRole === 'admin') {
      router.replace('/admin');
    }
  }, [isMounted, currentRole, router]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WorkCategory>('software');
  const [externalUrl, setExternalUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [collaborators, setCollaborators] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('public');

  // Controlled skills search & selection
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [availableSkills, setAvailableSkills] = useState<ControlledSkill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<{ id: string; name: string }[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  // Validation & Submission States
  const [urlSafe, setUrlSafe] = useState<boolean | null>(null);
  const [urlHostname, setUrlHostname] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search controlled vocabulary
  useEffect(() => {
    async function searchSkills() {
      try {
        setLoadingSkills(true);
        const res = await fetch(`/api/skills?q=${encodeURIComponent(skillSearchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setAvailableSkills(data.skills || []);
        }
      } catch {
        // Fallback
      } finally {
        setLoadingSkills(false);
      }
    }

    const timer = setTimeout(searchSkills, 200);
    return () => clearTimeout(timer);
  }, [skillSearchQuery]);

  const handleUrlChange = (value: string) => {
    setExternalUrl(value);
    if (!value.trim()) {
      setUrlSafe(null);
      setUrlHostname(null);
      return;
    }

    try {
      const parsed = new URL(value.trim());
      // Strict rule: must be https
      if (parsed.protocol === 'https:') {
        setUrlSafe(true);
        setUrlHostname(parsed.hostname);
      } else {
        setUrlSafe(false);
        setUrlHostname(null);
      }
    } catch {
      setUrlSafe(false);
      setUrlHostname(null);
    }
  };

  const handleAddSkill = (skill: ControlledSkill) => {
    if (!selectedSkills.some((s) => s.id === skill.id)) {
      setSelectedSkills([...selectedSkills, { id: skill.id, name: skill.name }]);
      setSkillSearchQuery('');
    }
  };

  const handleRemoveSkill = (id: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (externalUrl && urlSafe === false) {
      setErrorMessage('External URL must be a valid HTTPS address (e.g. https://github.com/...)');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          external_url: externalUrl.trim() || null,
          storage_path: imageUrl.trim() || null,
          visibility,
          collaborators: collaborators.trim() || null,
          completion_date: completionDate || null,
          skills: selectedSkills.map((s) => s.id),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish work');
      }

      router.push(`/works/${data.work.id}`);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to publish work');
      setIsSubmitting(false);
    }
  };

  if (isMounted && currentRole === 'admin') {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" aria-hidden="true" />
          <p className="text-sm text-slate-600 font-medium">
            Administrators manage platform governance and do not share work items. Redirecting to Admin Console...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <Link
          href="/showcase"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Showcase Feed</span>
        </Link>

        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs p-6 sm:p-10 space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Publish Evidence of Work
            </h1>
            <p className="text-xs text-slate-500">
              Link-first portfolio submission. Back your self-declared skills with peer-reviewable artifacts.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Work Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus Engine in Rust"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-[#1b59f8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Disciplinary Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as WorkCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#1b59f8]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* External URL (Link-First with Safe-Link Validation) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                External Artifact / Demonstration URL (HTTPS only)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={externalUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://github.com/org/repo or https://doi.org/..."
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border text-slate-900 text-xs placeholder-slate-400 focus:outline-none font-mono ${
                    urlSafe === true
                      ? 'border-emerald-500 focus:border-emerald-500'
                      : urlSafe === false
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-200 focus:border-[#1b59f8]'
                  }`}
                />
              </div>

              {/* Safe-Link Preview */}
              {urlSafe === true && urlHostname && (
                <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                    <span>Safe HTTPS origin verified: <strong className="font-mono text-slate-900">{urlHostname}</strong></span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Zero SSRF sandbox</span>
                </div>
              )}
              {urlSafe === false && (
                <p className="mt-1 text-[11px] text-rose-600">
                  Must be a secure address starting with https://
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Description &amp; Engineering Evidence
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the problem solved, architectural decisions, benchmarks, and how this demonstrates your proficiency..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-[#1b59f8] resize-none"
              />
            </div>

            {/* Collaborators and Completion Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Collaborators (Text format)
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                  <input
                    type="text"
                    value={collaborators}
                    onChange={(e) => setCollaborators(e.target.value)}
                    placeholder="e.g. Maya Chen, Dr. A. Raman (Faculty Advisor)"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-[#1b59f8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Completion / Presentation Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                  <input
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-[#1b59f8]"
                  />
                </div>
              </div>
            </div>

            {/* Controlled Skills Vocabulary Search */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Demonstrated Skills (Controlled Vocabulary)
              </label>

              {/* Selected skills tag cloud */}
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {selectedSkills.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1b59f8] text-xs font-medium"
                    >
                      <span>{s.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s.id)}
                        className="text-slate-400 hover:text-slate-800"
                        aria-label={`Remove skill ${s.name}`}
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Search box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                <input
                  type="text"
                  value={skillSearchQuery}
                  onChange={(e) => setSkillSearchQuery(e.target.value)}
                  placeholder="Search skills (e.g. Data Analytics, Machine Learning, Research, Academic Writing)..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-[#1b59f8]"
                />
              </div>

              {/* Autocomplete Suggestions */}
              {skillSearchQuery && availableSkills.length > 0 && (
                <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-sm max-h-40 overflow-y-auto space-y-1">
                  {availableSkills.map((sk) => (
                    <button
                      key={sk.id}
                      type="button"
                      onClick={() => handleAddSkill(sk)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-xs text-left text-slate-800"
                    >
                      <span className="font-semibold">{sk.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {sk.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Visibility Selector explicitly shown before publishing */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Visibility Model (Strict Server Enforcement)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'public',
                    title: 'Public',
                    desc: 'Visible in global showcase to signed-in students and verified recruiters.',
                    icon: Globe,
                  },
                  {
                    id: 'campus',
                    title: 'Campus Only',
                    desc: 'Exclusive to verified scholars and faculty of your institution.',
                    icon: Building,
                  },
                  {
                    id: 'connections',
                    title: 'Connections Only',
                    desc: 'Only visible to scholars you have accepted connection requests with.',
                    icon: Users,
                  },
                  {
                    id: 'only_me',
                    title: 'Only Me (Draft / Private)',
                    desc: 'Private archive item visible only to you on your profile.',
                    icon: Lock,
                  },
                ].map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-colors ${
                        visibility === opt.id
                          ? 'border-[#1b59f8] bg-blue-50/50'
                          : 'border-slate-200 bg-[#f8fafc] hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value={opt.id}
                        checked={visibility === opt.id}
                        onChange={() => setVisibility(opt.id as Visibility)}
                        className="mt-0.5 text-[#1b59f8] focus:ring-[#1b59f8]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-[#1b59f8]" aria-hidden="true" />
                          <span className="text-xs font-semibold text-slate-900">
                            {opt.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Live Preview Card */}
            {title && (
              <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Publication Preview
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#1b59f8] uppercase font-mono">
                      {category}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-mono">Visibility: {visibility}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {description || 'No description entered yet.'}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                href="/showcase"
                className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                )}
                <span>{isSubmitting ? 'Publishing...' : 'Publish Evidence'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
