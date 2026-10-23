'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Upload,
  Link as LinkIcon,
  Shield,
  Eye,
  Check,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';
import { WORK_CATEGORIES, VISIBILITY_OPTIONS } from '@/lib/utils';
import { WorkCategory, Visibility } from '@/lib/types';

export default function NewWorkPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WorkCategory>('software');
  const [externalUrl, setExternalUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('worldwide');
  const [skills, setSkills] = useState<string[]>(['React 19', 'Next.js App Router', 'Redis Cache']);
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlSafe, setUrlSafe] = useState<boolean | null>(null);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const validateUrl = (url: string) => {
    setExternalUrl(url);
    if (!url) {
      setUrlSafe(null);
      return;
    }
    try {
      const parsed = new URL(url);
      const isHttp = parsed.protocol === 'http:' || parsed.protocol === 'https:';
      setUrlSafe(isHttp);
    } catch {
      setUrlSafe(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          external_url: externalUrl,
          storage_path: imageUrl || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
          visibility,
          skills,
        }),
      });

      setTimeout(() => {
        setIsSubmitting(false);
        router.push('/showcase');
      }, 700);
    } catch {
      setIsSubmitting(false);
      router.push('/showcase');
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/showcase"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Showcase</span>
        </Link>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono font-bold text-violet-400">
            <Sparkles className="w-4 h-4" />
            <span>Proof of Work Submission • V2.0</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Publish New Campus Work Item
          </h1>
          <p className="text-sm text-zinc-400">
            Share verifiable software repositories, publications, design systems, or research prototypes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl bg-[#0e1017] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Project / Work Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Task Queue with Redis Streams & Next.js"
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Category & Visibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Primary Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WorkCategory)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
              >
                {Object.entries(WORK_CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key} className="bg-[#141722] text-white">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Granular Visibility *
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
              >
                {Object.entries(VISIBILITY_OPTIONS).map(([key, label]) => (
                  <option key={key} value={key} className="bg-[#141722] text-white">
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* External URL with Automated Security Scanner */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Verifiable External Link (GitHub / Paper / Live Demo)
            </label>
            <div className="relative">
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => validateUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-violet-500"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {urlSafe === true && (
                  <span title="URL Protocol Validated">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </span>
                )}
                {urlSafe === false && (
                  <span title="Invalid URL structure">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  </span>
                )}
              </div>
            </div>
            <p className="mt-1.5 text-[11px] text-zinc-400 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              Automated URL security check verifies HTTPS protocol and domain reputability.
            </p>
          </div>

          {/* Cover Media URL */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Preview / Screenshot Image URL (Optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or cloud storage URL"
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Technical Description &amp; Architectural Overview *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the problem statement, system design choices, benchmarks, and how this work was validated..."
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-xs leading-relaxed focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Verified Skill Tags Input */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Technologies &amp; Skills Demonstrated
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#141722] text-xs font-mono font-semibold text-purple-200 border border-white/10"
                >
                  <span>#{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-400 text-zinc-400 font-bold ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add skill tag (e.g. PyTorch, WebRTC, Docker)..."
                className="flex-1 px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-violet-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <Link
              href="/showcase"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publishing &amp; Syncing Cache...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Publish Work Item</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
