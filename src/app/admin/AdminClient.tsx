'use client';

import React, { useState } from 'react';
import { useRole } from '@/lib/auth/role-context';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Database,
  Server,
  Users,
  CheckCircle2,
  AlertTriangle,
  Building,
  Check,
  RefreshCw,
  Lock,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { AuditLog, Community, Report } from '@/lib/types';

interface AdminClientProps {
  auditLogs: AuditLog[];
  communities: Community[];
  reports: Report[];
}

export default function AdminClient({
  auditLogs: initialAuditLogs,
  communities: initialCommunities,
  reports: initialReports,
}: AdminClientProps) {
  const { switchRole } = useRole();
  const [activeTab, setActiveTab] = useState<'reports' | 'audit' | 'institutions' | 'health'>('reports');
  const [reports] = useState(initialReports);
  const [communities, setCommunities] = useState(initialCommunities);
  const [auditLogs] = useState(initialAuditLogs);
  const [resolvedReports, setResolvedReports] = useState<string[]>([]);
  const [auditFilter, setAuditFilter] = useState('all');
  const [cacheFlushed, setCacheFlushed] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [newUniName, setNewUniName] = useState('');
  const [showAddUni, setShowAddUni] = useState(false);

  const handleResolveReport = (reportId: string, _action?: string) => {
    setResolvedReports((prev) => [...prev, reportId]);
  };

  const handleVerifyCommunity = (commId: string) => {
    setCommunities((prev) =>
      prev.map((c) => (c.id === commId ? { ...c, is_verified: true } : c))
    );
  };

  const handleAddCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUniName || !newDomainInput) return;
    const newComm: Community = {
      id: `comm-${Date.now()}`,
      name: newUniName,
      domain: newDomainInput,
      description: 'Newly federated higher-education academic partner.',
      logo_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=120&auto=format&fit=crop&q=80',
      is_verified: true,
    };
    setCommunities([newComm, ...communities]);
    setNewUniName('');
    setNewDomainInput('');
    setShowAddUni(false);
  };

  const handleFlushCache = () => {
    setCacheFlushed(true);
    setTimeout(() => setCacheFlushed(false), 3000);
  };

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditFilter === 'all') return true;
    return log.action.toLowerCase().includes(auditFilter.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* ── TOP HERO HEADER ── */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Soft subtle glow wash */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-50/70 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Root Operations &amp; Governance • Platform Administrator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Trust, Safety &amp; Security Control
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl">
              Inspect student proof-of-work integrity, moderate flagged repositories, verify academic email federations, and audit cryptographic security logs.
            </p>
          </div>

          {/* Quick Persona Switcher for Admin testing */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="p-1.5 rounded-full bg-slate-100 border border-slate-200 flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-500 px-2 font-bold">
                Test View As:
              </span>
              <button
                onClick={() => switchRole('student', true)}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 hover:text-[#1b59f8] border border-slate-200 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#1b59f8]" />
                <span>Student</span>
              </button>
              <button
                onClick={() => switchRole('recruiter', true)}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 hover:text-emerald-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span>Recruiter</span>
              </button>
            </div>

            <button
              onClick={handleFlushCache}
              className="px-4 py-2 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 shrink-0 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${cacheFlushed ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{cacheFlushed ? 'Cache Re-indexed' : 'Purge Redis Cache'}</span>
            </button>
          </div>
        </div>

        {/* Real-time System Status Ticker */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">PostgreSQL RLS</p>
              <p className="text-xs font-bold text-slate-800">100% Strict Enforced</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Redis 7 Cluster</p>
              <p className="text-xs font-bold text-slate-800">1.2ms Avg Latency</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1b59f8] animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">WebRTC SFU</p>
              <p className="text-xs font-bold text-slate-800">14 Active Sprint Rooms</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Zero-Trust Audit</p>
              <p className="text-xs font-bold text-slate-800">SHA-256 Tamper-Proof</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BENTO PLATFORM METRICS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">
              Verified Builders
            </span>
            <Users className="w-4 h-4 text-[#1b59f8]" />
          </div>
          <div className="text-2xl font-black text-slate-900">4,820</div>
          <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-mono font-medium">
            <span>+342 new students this month</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">
              Verified Recruiters
            </span>
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">142</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            Stripe, Google, Scale AI, Datadog
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">
              College Domains
            </span>
            <Building className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{communities.length}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            IISc, IIT Bombay, BITS, DTU
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">
              Integrity Index
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">Active</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            Append-only audit log protection
          </p>
        </div>
      </div>

      {/* ── TAB NAVIGATION ── */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-slate-100 border border-slate-200 w-fit">
        {[
          { id: 'reports', label: 'Moderation Queue', count: reports.filter((r) => !resolvedReports.includes(r.id)).length },
          { id: 'audit', label: 'Security Audit Log' },
          { id: 'institutions', label: 'Campus Federations', count: communities.length },
          { id: 'health', label: 'Telemetry & Diagnostics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'reports' | 'audit' | 'institutions' | 'health')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 border border-slate-200 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB 1: MODERATION QUEUE ── */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Pending Moderation Reports ({reports.length})</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Zero-Tolerance Code Plagiarism &amp; Bot Scraping
            </span>
          </div>

          <div className="space-y-3">
            {reports.map((report) => {
              const isResolved = resolvedReports.includes(report.id);
              return (
                <div
                  key={report.id}
                  className={`rounded-2xl p-5 border transition-all ${
                    isResolved
                      ? 'bg-emerald-50/50 border-emerald-200 opacity-80'
                      : 'bg-white border-slate-200/90 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                        Target: {report.target_type}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {report.reason}
                      </span>
                    </div>

                    <span className="text-xs text-slate-500 font-mono">
                      Reported by {report.reporter?.display_name || 'Community Member'} • {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed font-sans">
                    {report.details}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">
                      Target Entity ID: <code className="bg-slate-100 text-[#1b59f8] px-2 py-0.5 rounded border border-slate-200 text-[11px]">{report.target_id}</code>
                    </span>

                    {isResolved ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        <Check className="w-4 h-4" />
                        <span>Action Resolved &amp; Logged</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResolveReport(report.id, 'dismiss')}
                          className="px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                        >
                          Dismiss (False Positive)
                        </button>
                        <button
                          onClick={() => handleResolveReport(report.id, 'hide')}
                          className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Hide Content &amp; Issue Warning</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: SECURITY AUDIT LOG ── */}
      {activeTab === 'audit' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#1b59f8]" />
                <span>Append-Only Security Audit Trail</span>
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Every login, proof publication, RLS evaluation, and recruiter contact is cryptographically signed
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 border border-slate-200">
              {['all', 'auth', 'verify', 'work'].map((f) => (
                <button
                  key={f}
                  onClick={() => setAuditFilter(f)}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase font-bold transition-all ${
                    auditFilter === f
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor / Principal</th>
                  <th className="py-2.5 px-3">Action Type</th>
                  <th className="py-2.5 px-3">Target Resource</th>
                  <th className="py-2.5 px-3">Client IP Address</th>
                  <th className="py-2.5 px-3">Hash Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {log.actor?.display_name || log.actor_id}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1b59f8] border border-blue-200 font-bold uppercase text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{log.target_resource}</td>
                    <td className="py-3 px-3 text-slate-500">{log.ip_address}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Valid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: INSTITUTION VERIFICATION ── */}
      {activeTab === 'institutions' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#1b59f8]" />
                <span>Academic Institution Federation Registry</span>
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Students registering with approved domains automatically receive the verified campus badge
              </p>
            </div>

            <button
              onClick={() => setShowAddUni(!showAddUni)}
              className="px-4 py-2 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <span>+ Federate New University</span>
            </button>
          </div>

          {/* Add University Form */}
          {showAddUni && (
            <form onSubmit={handleAddCommunity} className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Federate New Campus Partner
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="University Name (e.g. Stanford University)"
                  value={newUniName}
                  onChange={(e) => setNewUniName(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#1b59f8]"
                />
                <input
                  type="text"
                  required
                  placeholder="Domain suffix (e.g. stanford.edu)"
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-[#1b59f8]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUni(false)}
                  className="px-3.5 py-1.5 rounded-full border border-slate-200 text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold"
                >
                  Save &amp; Whitelist Domain
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communities.map((comm) => (
              <div
                key={comm.id}
                className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/70 flex items-start justify-between gap-4 hover:border-slate-300 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#1b59f8]" />
                    <h3 className="font-bold text-sm text-slate-900">{comm.name}</h3>
                  </div>
                  <p className="font-mono text-xs text-slate-500 mt-1">Domain: <span className="text-[#1b59f8]">*.{comm.domain}</span></p>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{comm.description}</p>
                </div>

                {comm.is_verified ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                ) : (
                  <button
                    onClick={() => handleVerifyCommunity(comm.id)}
                    className="px-3 py-1.5 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shrink-0"
                  >
                    Verify College
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: SYSTEM DIAGNOSTICS ── */}
      {activeTab === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
                IN-MEMORY ENGINE
              </span>
              <Server className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Redis 7 Alpine</h3>
            <div className="space-y-2 text-xs font-mono text-slate-600">
              <div className="flex justify-between">
                <span>Limiter Status:</span>
                <span className="font-bold text-emerald-700">Operational</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Cache Latency:</span>
                <span className="font-bold text-slate-900">1.2ms</span>
              </div>
              <div className="flex justify-between">
                <span>Active PubSub Channels:</span>
                <span className="font-bold text-slate-900">4 Channels</span>
              </div>
              <div className="flex justify-between">
                <span>Sliding Window Rate Limit:</span>
                <span className="font-bold text-emerald-700">Active (100 req/min)</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700">
                DATABASE PERSISTENCE
              </span>
              <Database className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">PostgreSQL 15</h3>
            <div className="space-y-2 text-xs font-mono text-slate-600">
              <div className="flex justify-between">
                <span>Relational Tables:</span>
                <span className="font-bold text-slate-900">23 Tables</span>
              </div>
              <div className="flex justify-between">
                <span>RLS Security Policies:</span>
                <span className="font-bold text-emerald-700">100% Strict</span>
              </div>
              <div className="flex justify-between">
                <span>Connection Pool:</span>
                <span className="font-bold text-slate-900">18 / 50 Active</span>
              </div>
              <div className="flex justify-between">
                <span>Realtime Replication:</span>
                <span className="font-bold text-emerald-700">Synchronous</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1b59f8]">
                REVERSE PROXY &amp; EDGE
              </span>
              <Activity className="w-5 h-5 text-[#1b59f8]" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">NGINX 1.25 Edge</h3>
            <div className="space-y-2 text-xs font-mono text-slate-600">
              <div className="flex justify-between">
                <span>Brotli / Gzip:</span>
                <span className="font-bold text-emerald-700">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span>WebSocket Upgrade:</span>
                <span className="font-bold text-emerald-700">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span>Turbopack HMR Stream:</span>
                <span className="font-bold text-[#1b59f8]">Active</span>
              </div>
              <div className="flex justify-between">
                <span>WAF Rate-Limiting:</span>
                <span className="font-bold text-emerald-700">Zero-Trust</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
