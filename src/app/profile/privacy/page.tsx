'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Download,
  Trash2,
  Lock,
  Globe,
  Building,
  Users,
  ArrowLeft,
  AlertTriangle,
  FileText,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function PrivacyDashboardPage() {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/user/export');
      if (!res.ok) {
        throw new Error('Failed to generate data export');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `campus_skill_connect_data_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Export failed';
      alert(msg);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmation !== 'DELETE MY ACCOUNT') {
      setDeleteError('Please type "DELETE MY ACCOUNT" exactly to confirm.');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation: deleteConfirmation }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to erase account');
      }

      alert('Your account and personal data have been permanently erased.');
      router.push('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Deletion failed';
      setDeleteError(msg);
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/profile/edit"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Profile Settings</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/privacy"
              className="text-xs font-bold text-[#1b59f8] hover:underline"
            >
              Full Legal Privacy Policy ↗
            </Link>
            <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              DPDPA 2023 Compliant
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1b59f8]">
            <ShieldCheck className="w-4 h-4 text-[#1b59f8]" />
            <span>Data Sovereignty &amp; Privacy Control</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy Dashboard &amp; Visibility Controls
          </h1>
          <p className="text-sm text-slate-500">
            Inspect exactly what data is visible to peers, campus members, and the public. Export your complete data bundle or request account erasure.
          </p>
        </div>

        {/* ── VISIBILITY LEVEL EXPOSURE MATRIX ── */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#1b59f8]" />
            <span>What Each Visibility Level Exposes</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Public */}
            <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase">
                <Globe className="w-4 h-4" />
                <span>Public (Worldwide)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accessible to any signed-in viewer and external visitors on <code className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">/u/[username]</code>.
              </p>
              <ul className="text-[11px] space-y-1 text-slate-500 list-disc list-inside">
                <li>Display Name &amp; Username</li>
                <li>Headline &amp; Bio</li>
                <li>Self-Declared &amp; Endorsed Skills</li>
                <li>Works marked as Public</li>
              </ul>
            </div>

            {/* Campus */}
            <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase">
                <Building className="w-4 h-4" />
                <span>Verified Campus Only</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visible only to students and faculty whose verified university email domain matches yours.
              </p>
              <ul className="text-[11px] space-y-1 text-slate-500 list-disc list-inside">
                <li>Verified Institution &amp; Campus Badge</li>
                <li>Works marked with Campus visibility</li>
                <li>Campus-specific peer collaboration invites</li>
              </ul>
            </div>

            {/* Connections */}
            <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase">
                <Users className="w-4 h-4" />
                <span>Accepted Connections</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visible only to peers with whom you have an accepted, unblocked connection request.
              </p>
              <ul className="text-[11px] space-y-1 text-slate-500 list-disc list-inside">
                <li>Direct Realtime Messaging Access</li>
                <li>Works marked as Connections Only</li>
                <li>Permission to endorse technical skills</li>
              </ul>
            </div>

            {/* Only Me */}
            <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase">
                <Lock className="w-4 h-4" />
                <span>Only Me (Private)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enforced by cryptographically isolated tenant security. Never readable by any other user or search query.
              </p>
              <ul className="text-[11px] space-y-1 text-slate-500 list-disc list-inside">
                <li>Draft projects and unpublished works</li>
                <li>Uploaded CV files and parsed documents</li>
                <li>Account settings and audit logs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── DATA RIGHTS & COMPLIANCE SECTION ── */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Digital Personal Data Protection Act, 2023 (India) Notice</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              We process personal data solely for skill showcase, peer networking, and student employment opportunities. You retain complete ownership and sovereignty over your uploaded content. Note: Formal legal review is required before public commercial launch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            {/* Export */}
            <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-xs text-slate-900">Right to Data Portability</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Download a machine-readable JSON archive of your profile, skills, published works, connections, and CV metadata.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportData}
                disabled={isExporting}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-[#1b59f8]" />
                <span>{isExporting ? 'Generating JSON Bundle...' : 'Export My Data (JSON)'}</span>
              </button>
            </div>

            {/* Delete Account */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/80 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-xs text-rose-800">Right to Erasure</h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Permanently delete your works, skill endorsements, connection relations, CV documents, and anonymize your profile identity.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account &amp; Erase Data</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── DELETE ACCOUNT CONFIRMATION MODAL ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Confirm Permanent Data Erasure</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                  setDeleteError(null);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This action cannot be undone. All your published works, CV files, connection requests, and endorsements will be purged. Type <strong className="text-rose-600 font-mono">DELETE MY ACCOUNT</strong> below to proceed:
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <input
                type="text"
                required
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE MY ACCOUNT"
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-rose-500"
              />

              {deleteError && (
                <p className="text-xs text-rose-600">{deleteError}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeleting || deleteConfirmation !== 'DELETE MY ACCOUNT'}
                  className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50 transition-all shadow-xs"
                >
                  {isDeleting ? 'Erasing...' : 'Confirm Permanent Deletion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
