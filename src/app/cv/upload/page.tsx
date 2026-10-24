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
  LogIn,
} from 'lucide-react';
import { useRole } from '@/lib/auth/role-context';

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
  isGuest?: boolean;
}

export default function CvUploadPage() {
  const { isLoggedIn, currentUser } = useRole();
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
    if (!isLoggedIn) {
      if (confirm('Authentication required to synchronize extracted skills to your profile. Would you like to sign in now?')) {
        window.location.assign('/sign-in?redirect=/cv/upload');
      }
      return;
    }
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/cv"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to CV Studio Hub</span>
          </Link>

          <Link
            href="/cv/builder"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#1b59f8] hover:underline"
          >
            <span>Or use Interactive Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-[#1b59f8]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Server Extraction • Signature Validated</span>
            </div>
            {isLoggedIn && currentUser ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Signed In: <strong>{currentUser.name}</strong> ({currentUser.email})</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600">
                <span>Guest Preview Mode • Sign in to save to profile</span>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Upload &amp; Scan Resume with Rule-Based ATS Checklist
          </h1>
          <p className="text-sm text-slate-600">
            Upload your PDF or DOCX resume (up to 5 MB). The server parses section headings, contact details, date consistency, and optional job description keywords before anything is saved to your profile.
          </p>
        </div>

        {/* Optional Target Job Description */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <label htmlFor="job-desc" className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
            Optional Target Job Description (for keyword alignment checking)
          </label>
          <textarea
            id="job-desc"
            rows={3}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste a job description or list of target requirements to check keyword overlap against your resume..."
            className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1b59f8] transition-colors"
          />
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="rounded-3xl bg-white border-2 border-dashed border-slate-300 hover:border-[#1b59f8] p-10 sm:p-14 text-center shadow-xs transition-all group"
        >
          <input
            type="file"
            id="cv-file"
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="cv-file" className="cursor-pointer space-y-4 block">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-[#1b59f8] flex items-center justify-center mx-auto transition-transform group-hover:scale-105">
              {isParsing ? (
                <RefreshCw className="w-8 h-8 animate-spin" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">
                {isParsing
                  ? 'Validating file signature & parsing document...'
                  : file
                  ? `Selected: ${file.name}`
                  : 'Drag & Drop your resume here, or Browse files'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports PDF and DOCX validated by magic bytes up to 5 MB
              </p>
            </div>
            {!file && !isParsing && (
              <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0f172a] hover:bg-black text-xs font-bold text-white transition-all shadow-sm">
                Select Resume File
              </span>
            )}
          </label>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
            {errorMsg.toLowerCase().includes('sign in') && (
              <Link
                href="/sign-in?redirect=/cv/upload"
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In to Continue</span>
              </Link>
            )}
          </div>
        )}

        {/* Staging & Extraction Results */}
        {parsedData && (
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1b59f8] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                  SERVER PARSING COMPLETE
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">
                  Document: {parsedData.fileName}
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Detected Email: {parsedData.email || 'None detected'} • Size: {(parsedData.fileSize / 1024).toFixed(1)} KB
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRequestDownload}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-mono font-bold transition-all"
                  title="Generate short-lived signed URL"
                >
                  <Download className="w-3.5 h-3.5 text-[#1b59f8]" />
                  <span>Download Signed URL</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeleteCv}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-mono font-bold transition-all"
                  title="Delete CV from storage"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Rule-Based ATS Checklist */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1b59f8] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Rule-Based ATS Checklist (No unverified parser score claimed)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {parsedData.checklist.map((rule) => (
                  <div
                    key={rule.id}
                    className={`p-3.5 rounded-2xl border ${
                      rule.passed
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-amber-50/50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        {rule.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                        <span>{rule.title}</span>
                      </span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          rule.passed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rule.passed ? 'PASSED' : 'ATTENTION'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {rule.description}
                    </p>
                    {rule.detail && (
                      <p className="text-[10px] text-slate-500 font-mono mt-1">
                        {rule.detail}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Skills Review Step */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                    Review Extracted Skills Before Saving to Profile ({selectedSkills.size} selected)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Nothing is saved automatically. Select only the skills you wish to add as self-declared skills.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleApproveAndSync}
                  disabled={isSyncing || selectedSkills.size === 0}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold shadow-sm disabled:opacity-50 transition-all"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : syncSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Approved &amp; Saved!</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                      <span>Approve &amp; Save Selected</span>
                    </>
                  )}
                </button>
              </div>

              {parsedData.extractedSkills.length === 0 ? (
                <p className="text-xs text-slate-400 font-mono py-2">
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
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold border transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-300 text-[#1b59f8]'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-[#1b59f8]' : 'text-slate-400'}`} />
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Link to CV Builder */}
            <div className="pt-2 flex justify-end border-t border-slate-100">
              <Link
                href="/cv/builder"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#1b59f8] hover:underline"
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
