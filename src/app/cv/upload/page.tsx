'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Check,
  ArrowRight,
  ShieldCheck,
  Download,
  Trash2,
  XCircle,
} from 'lucide-react';

interface AtsRuleCheck {
  id: string;
  category: 'headings' | 'contact' | 'dates' | 'keywords';
  title: string;
  passed: boolean;
  description: string;
  detail?: string;
}

interface ParsedCvResponse {
  fileName: string;
  fileSize: number;
  mimeType?: string;
  storagePath?: string | null;
  email?: string | null;
  phone?: string | null;
  extractedSkills: string[];
  checklist: AtsRuleCheck[];
  keywordCoverage?: { matched: string[]; missing: string[] } | null;
}

export default function CvUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedCvResponse | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setErrorMsg(null);
    setIsParsing(true);
    setParsedData(null);
    setSyncSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription.trim());
      }

      const res = await fetch('/api/cv/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process CV');
      }

      setUploadId(data.uploadId);
      setParsedData(data.extractedData);
      setSelectedSkills(new Set(data.extractedData.extractedSkills || []));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setErrorMsg(msg);
    } finally {
      setIsParsing(false);
    }
  };

  const toggleSkill = (skill: string) => {
    const next = new Set(selectedSkills);
    if (next.has(skill)) {
      next.delete(skill);
    } else {
      next.add(skill);
    }
    setSelectedSkills(next);
  };

  const handleApproveAndSync = async () => {
    if (!uploadId) return;
    setIsSyncing(true);
    try {
      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId,
          approvedSkills: Array.from(selectedSkills),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sync to profile');
      }

      setSyncSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sync failed';
      alert(msg);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRequestDownload = async () => {
    try {
      const res = await fetch('/api/cv?download=true');
      const data = await res.json();
      if (data.downloadUrl) {
        setDownloadUrl(data.downloadUrl);
        window.open(data.downloadUrl, '_blank');
      } else {
        alert(data.error || 'Download URL unavailable');
      }
    } catch {
      alert('Error fetching signed download URL');
    }
  };

  const handleDeleteCv = async () => {
    if (!confirm('Are you sure you want to delete this CV file? This action is permanent.')) return;
    try {
      const res = await fetch('/api/cv', { method: 'DELETE' });
      if (res.ok) {
        setFile(null);
        setParsedData(null);
        setUploadId(null);
        setDownloadUrl(null);
        alert('CV removed from private storage.');
      }
    } catch {
      alert('Failed to delete CV');
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/cv"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to CV Studio Hub</span>
          </Link>

          <Link
            href="/cv/builder"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-violet-400 hover:text-violet-300"
          >
            <span>Or use Interactive Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-bold text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Server Extraction • Signature Validated</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Upload &amp; Scan Resume with Rule-Based ATS Checklist
          </h1>
          <p className="text-sm text-zinc-400">
            Upload your PDF or DOCX resume (up to 5 MB). The server parses section headings, contact details, date consistency, and optional job description keywords before anything is saved to your profile.
          </p>
        </div>

        {/* Optional Target Job Description */}
        <div className="p-4 rounded-2xl bg-[#0e1017] border border-white/10 space-y-2">
          <label htmlFor="job-desc" className="block text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
            Optional Target Job Description (for keyword alignment checking)
          </label>
          <textarea
            id="job-desc"
            rows={3}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste a job description or list of target requirements to check keyword overlap against your resume..."
            className="w-full bg-[#141722] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="rounded-3xl bg-[#0e1017] border-2 border-dashed border-white/10 hover:border-cyan-500/50 p-10 sm:p-14 text-center shadow-2xl transition-all group"
        >
          <input
            type="file"
            id="cv-file"
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="cv-file" className="cursor-pointer space-y-4 block">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto transition-transform group-hover:scale-105">
              {isParsing ? (
                <RefreshCw className="w-8 h-8 animate-spin" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>
            <div>
              <p className="text-base font-bold text-white">
                {isParsing
                  ? 'Validating file signature & parsing document...'
                  : file
                  ? `Selected: ${file.name}`
                  : 'Drag & Drop your resume here, or Browse files'}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Supports PDF and DOCX validated by magic bytes up to 5 MB
              </p>
            </div>
            {!file && !isParsing && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-bold text-zinc-200 transition-all">
                Select Resume File
              </span>
            )}
          </label>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Staging & Extraction Results */}
        {parsedData && (
          <div className="rounded-3xl bg-[#0e1017] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  SERVER PARSING COMPLETE
                </span>
                <h2 className="text-xl font-bold text-white mt-2">
                  Document: {parsedData.fileName}
                </h2>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Detected Email: {parsedData.email || 'None detected'} • Size: {(parsedData.fileSize / 1024).toFixed(1)} KB
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRequestDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-mono font-bold transition-all"
                  title="Generate short-lived signed URL"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download Signed URL</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeleteCv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-mono font-bold transition-all"
                  title="Delete CV from storage"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Rule-Based ATS Checklist */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Rule-Based ATS Checklist (No unverified parser score claimed)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {parsedData.checklist.map((rule) => (
                  <div
                    key={rule.id}
                    className={`p-3.5 rounded-xl border ${
                      rule.passed
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-amber-500/5 border-amber-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {rule.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                        <span>{rule.title}</span>
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          rule.passed
                            ? 'bg-emerald-500/10 text-emerald-300'
                            : 'bg-amber-500/10 text-amber-300'
                        }`}
                      >
                        {rule.passed ? 'PASSED' : 'ATTENTION'}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {rule.description}
                    </p>
                    {rule.detail && (
                      <p className="text-[10px] text-zinc-500 font-mono mt-1">
                        {rule.detail}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Skills Review Step */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                    Review Extracted Skills Before Saving to Profile ({selectedSkills.size} selected)
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Nothing is saved automatically. Select only the skills you wish to add as self-declared skills.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleApproveAndSync}
                  disabled={isSyncing || selectedSkills.size === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-lg hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 transition-all"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : syncSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Approved &amp; Saved!</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Approve &amp; Save Selected</span>
                    </>
                  )}
                </button>
              </div>

              {parsedData.extractedSkills.length === 0 ? (
                <p className="text-xs text-zinc-500 font-mono py-2">
                  No vocabulary skills automatically matched. Use the profile editor to add skills manually.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {parsedData.extractedSkills.map((skill) => {
                    const isSelected = selectedSkills.has(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                          isSelected
                            ? 'bg-violet-600/20 border-violet-500 text-violet-200'
                            : 'bg-white/[0.03] border-white/10 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-violet-400' : 'text-zinc-600'}`} />
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Link to CV Builder */}
            <div className="pt-2 flex justify-end border-t border-white/10">
              <Link
                href="/cv/builder"
                className="inline-flex items-center gap-2 text-xs font-bold text-violet-400 hover:text-violet-300"
              >
                <span>Export &amp; Customize in Interactive CV Builder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
