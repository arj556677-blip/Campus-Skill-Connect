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

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text-primary)] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <Link
          href="/showcase"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--text-secondary)] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Showcase Feed</span>
        </Link>

        <div className="bento-card p-6 sm:p-10 space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Publish Evidence of Work
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Link-first portfolio submission. Back your self-declared skills with peer-reviewable artifacts.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--danger-bg)] border border-[var(--danger)] text-[var(--danger)] text-xs flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Work Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus Engine in Rust"
                  className="w-full px-3.5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-white text-xs placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Disciplinary Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as WorkCategory)}
                  className="w-full px-3.5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[var(--focus)]"
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                External Artifact / Demonstration URL (HTTPS only)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={externalUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://github.com/org/repo or https://doi.org/..."
                  className={`w-full px-3.5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border text-white text-xs placeholder-[var(--text-muted)] focus:outline-none font-mono ${
                    urlSafe === true
                      ? 'border-[var(--success)] focus:border-[var(--success)]'
                      : urlSafe === false
                      ? 'border-[var(--danger)] focus:border-[var(--danger)]'
                      : 'border-[var(--border)] focus:border-[var(--focus)]'
                  }`}
                />
              </div>

              {/* Safe-Link Preview (No Arbitrary Server-side SSRF Fetch) */}
              {urlSafe === true && urlHostname && (
                <div className="mt-2 p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[var(--success)]">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Safe HTTPS origin verified: <strong className="font-mono text-white">{urlHostname}</strong></span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">Zero SSRF sandbox</span>
                </div>
              )}
              {urlSafe === false && (
                <p className="mt-1 text-[11px] text-[var(--danger)]">
                  Must be a secure address starting with https://
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Description & Engineering Evidence
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the problem solved, architectural decisions, benchmarks, and how this demonstrates your proficiency..."
                className="w-full px-3.5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-white text-xs placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)] resize-none"
              />
            </div>

            {/* Collaborators and Completion Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Collaborators (Text format)
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                  <input
                    type="text"
                    value={collaborators}
                    onChange={(e) => setCollaborators(e.target.value)}
                    placeholder="e.g. Maya Chen, Dr. A. Raman (Faculty Advisor)"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-white text-xs placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Completion / Presentation Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                  <input
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-white text-xs focus:outline-none focus:border-[var(--focus)]"
                  />
                </div>
              </div>
            </div>

            {/* Controlled Skills Vocabulary Search */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Demonstrated Skills (Controlled Vocabulary)
              </label>

              {/* Selected skills tag cloud */}
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {selectedSkills.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-white text-xs"
                    >
                      <span>{s.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s.id)}
                        className="text-[var(--text-secondary)] hover:text-white"
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                <input
                  type="text"
                  value={skillSearchQuery}
                  onChange={(e) => setSkillSearchQuery(e.target.value)}
                  placeholder="Search skills (e.g. React, PostgreSQL, Docker, Academic Writing)..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-white text-xs placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)]"
                />
              </div>

              {/* Autocomplete Suggestions */}
              {skillSearchQuery && availableSkills.length > 0 && (
                <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] max-h-40 overflow-y-auto space-y-1">
                  {availableSkills.map((sk) => (
                    <button
                      key={sk.id}
                      type="button"
                      onClick={() => handleAddSkill(sk)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface-hover)] text-xs text-left text-[var(--text-primary)]"
                    >
                      <span className="font-semibold">{sk.name}</span>
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono">
                        {sk.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Visibility Selector explicitly shown before publishing */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
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
                        onChange={() => setVisibility(opt.id as Visibility)}
                        className="mt-0.5 text-[var(--accent)] focus:ring-[var(--focus)]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                          <span className="text-xs font-semibold text-[var(--text-primary)]">
                            {opt.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Live Preview Card */}
            {title && (
              <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                  Publication Preview
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[var(--accent)] uppercase font-mono">
                      {category}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">•</span>
                    <span className="text-xs text-[var(--text-muted)] font-mono">Visibility: {visibility}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                    {description || 'No description entered yet.'}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
              <Link
                href="/showcase"
                className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:text-white transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
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
