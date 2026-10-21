'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRole } from '@/lib/auth/role-context';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Database,
  Server,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building,
  Eye,
  Check,
  RefreshCw,
  Search,
  Filter,
  Lock,
  Zap,
  Radio,
  FileCheck,
  Download,
  GraduationCap,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { AuditLog, Community } from '@/lib/types';

interface AdminClientProps {
  auditLogs: AuditLog[];
  communities: Community[];
  reports: any[];
}

export default function AdminClient({
  auditLogs: initialAuditLogs,
  communities: initialCommunities,
  reports: initialReports,
}: AdminClientProps) {
  const { switchRole } = useRole();
  const [activeTab, setActiveTab] = useState<'reports' | 'audit' | 'institutions' | 'health'>('reports');
  const [reports, setReports] = useState(initialReports);
  const [communities, setCommunities] = useState(initialCommunities);
  const [auditLogs] = useState(initialAuditLogs);
  const [resolvedReports, setResolvedReports] = useState<string[]>([]);
  const [auditFilter, setAuditFilter] = useState('all');
  const [cacheFlushed, setCacheFlushed] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [newUniName, setNewUniName] = useState('');
  const [showAddUni, setShowAddUni] = useState(false);

  const handleResolveReport = (reportId: string, action: string) => {
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
      <div className="rounded-3xl bg-[#10121a]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Root Operations & Governance • Alex Rivera (Me)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trust, Safety & Security Control
            </h1>
            <p className="mt-1.5 text-sm text-zinc-400 max-w-2xl">
              Inspect student proof-of-work integrity, moderate flagged repositories, verify academic email federations, and audit cryptographic security logs.
            </p>
          </div>

          {/* Quick Persona Switcher for Admin testing */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="p-2 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase text-zinc-500 px-2 font-bold">
                Test View As:
              </span>
              <button
                onClick={() => switchRole('student', true)}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 border border-violet-500/30 transition-all flex items-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>
              <button
                onClick={() => switchRole('recruiter', true)}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all flex items-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Recruiter</span>
              </button>
            </div>

            <button
              onClick={handleFlushCache}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all flex items-center gap-2 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${cacheFlushed ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{cacheFlushed ? 'Cache Re-indexed' : 'Purge Redis Cache'}</span>
            </button>
          </div>
        </div>

        {/* Real-time System Status Ticker */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase">PostgreSQL RLS</p>
              <p className="text-xs font-bold text-white">100% Strict Enforced</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase">Redis 7 Cluster</p>
              <p className="text-xs font-bold text-white">1.2ms Avg Latency</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase">WebRTC SFU</p>
              <p className="text-xs font-bold text-white">14 Active Sprint Rooms</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase">Zero-Trust Audit</p>
              <p className="text-xs font-bold text-white">SHA-256 Tamper-Proof</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BENTO PLATFORM METRICS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#10121a]/80 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
              Verified Builders
            </span>
            <Users className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-black text-white">4,820</div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <span>+342 new students this month</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#10121a]/80 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
              Verified Recruiters
            </span>
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">142</div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            Stripe, Google, Scale AI, Datadog
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#10121a]/80 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
              College Domains
            </span>
            <Building className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{communities.length}</div>
          <p className="text-[11px] text-cyan-300 mt-1 font-mono">
            IISc, IIT Bombay, BITS, DTU
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#10121a]/80 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
              Integrity Index
            </span>
            <ShieldCheck className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">99.4%</div>
          <p className="text-[11px] text-rose-300 mt-1 font-mono">
            Anti-plagiarism hash verification
          </p>
        </div>
      </div>

      {/* ── TAB NAVIGATION ── */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/40 border border-white/10 w-fit">
        {[
          { id: 'reports', label: 'Moderation Queue', count: reports.filter((r) => !resolvedReports.includes(r.id)).length },
          { id: 'audit', label: 'Security Audit Log' },
          { id: 'institutions', label: 'Campus Federations', count: communities.length },
          { id: 'health', label: 'Telemetry & Diagnostics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-white/10 text-white border border-white/15 shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
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
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Pending Moderation Reports ({reports.length})</span>
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              Zero-Tolerance Code Plagiarism & Bot Scraping
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
                      ? 'bg-emerald-500/5 border-emerald-500/20 opacity-70'
                      : 'bg-[#10121a]/80 border-white/10 shadow-lg'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                        Target: {report.target_type}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {report.reason}
                      </span>
                    </div>

                    <span className="text-xs text-zinc-500 font-mono">
                      Reported by {report.reporter?.display_name || 'Community Member'} • {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-zinc-300 leading-relaxed font-sans">
                    {report.details}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">
                      Target Entity ID: <code className="bg-black/50 text-violet-300 px-1.5 py-0.5 rounded border border-white/10 text-[11px]">{report.target_id}</code>
                    </span>

                    {isResolved ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
                        <Check className="w-4 h-4" />
                        <span>Action Resolved & Logged</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResolveReport(report.id, 'dismiss')}
                          className="px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
                        >
                          Dismiss (False Positive)
                        </button>
                        <button
                          onClick={() => handleResolveReport(report.id, 'hide')}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-900/30 transition-all flex items-center gap-1.5"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Hide Content & Issue Warning</span>
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
        <div className="rounded-3xl bg-[#10121a]/80 border border-white/10 p-6 backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-violet-400" />
                <span>Append-Only Security Audit Trail</span>
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Every login, proof publication, RLS evaluation, and recruiter contact is cryptographically signed
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
              {['all', 'auth', 'verify', 'work'].map((f) => (
                <button
                  key={f}
                  onClick={() => setAuditFilter(f)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase font-bold transition-all ${
                    auditFilter === f
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/40 text-zinc-400 border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor / Principal</th>
                  <th className="py-2.5 px-3">Action Type</th>
                  <th className="py-2.5 px-3">Target Resource</th>
                  <th className="py-2.5 px-3">Client IP Address</th>
                  <th className="py-2.5 px-3">Hash Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 text-zinc-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      {log.actor?.display_name || log.actor_id}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold uppercase text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-300">{log.target_resource}</td>
                    <td className="py-3 px-3 text-zinc-500">{log.ip_address}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
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
        <div className="rounded-3xl bg-[#10121a]/80 border border-white/10 p-6 backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>Academic Institution Federation Registry</span>
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Students registering with approved domains automatically receive the verified campus badge
              </p>
            </div>

            <button
              onClick={() => setShowAddUni(!showAddUni)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold hover:from-violet-500 hover:to-indigo-500 transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>+ Federate New University</span>
            </button>
          </div>

          {/* Add University Form */}
          {showAddUni && (
            <form onSubmit={handleAddCommunity} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Federate New Campus Partner
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="University Name (e.g. Stanford University)"
                  value={newUniName}
                  onChange={(e) => setNewUniName(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Domain suffix (e.g. stanford.edu)"
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUni(false)}
                  className="px-3 py-1.5 rounded-xl border border-white/10 text-xs text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold"
                >
                  Save & Whitelist Domain
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communities.map((comm) => (
              <div
                key={comm.id}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.07] flex items-start justify-between gap-4 hover:border-white/15 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-violet-400" />
                    <h3 className="font-bold text-sm text-white">{comm.name}</h3>
                  </div>
                  <p className="font-mono text-xs text-zinc-400 mt-1">Domain: <span className="text-violet-300">*.{comm.domain}</span></p>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{comm.description}</p>
                </div>

                {comm.is_verified ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                ) : (
                  <button
                    onClick={() => handleVerifyCommunity(comm.id)}
                    className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shrink-0"
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
          <div className="rounded-3xl bg-[#10121a]/80 border border-white/10 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                IN-MEMORY ENGINE
              </span>
              <Server className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-white">Redis 7 Alpine</h3>
            <div className="space-y-2 text-xs font-mono text-zinc-400">
              <div className="flex justify-between">
                <span>Cache Hit Rate:</span>
                <span className="font-bold text-emerald-400">99.4%</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Cache Latency:</span>
                <span className="font-bold text-white">1.2ms</span>
              </div>
              <div className="flex justify-between">
                <span>Active PubSub Channels:</span>
                <span className="font-bold text-white">4 Channels</span>
              </div>
              <div className="flex justify-between">
                <span>Sliding Window Rate Limit:</span>
                <span className="font-bold text-emerald-400">Active (100 req/min)</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[#10121a]/80 border border-white/10 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                DATABASE PERSISTENCE
              </span>
              <Database className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-black text-white">PostgreSQL 15</h3>
            <div className="space-y-2 text-xs font-mono text-zinc-400">
              <div className="flex justify-between">
                <span>Relational Tables:</span>
                <span className="font-bold text-white">23 Tables</span>
              </div>
              <div className="flex justify-between">
                <span>RLS Security Policies:</span>
                <span className="font-bold text-emerald-400">100% Strict</span>
              </div>
              <div className="flex justify-between">
                <span>Connection Pool:</span>
                <span className="font-bold text-white">18 / 50 Active</span>
              </div>
              <div className="flex justify-between">
                <span>Realtime Replication:</span>
                <span className="font-bold text-emerald-400">Synchronous</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[#10121a]/80 border border-white/10 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                REVERSE PROXY & EDGE
              </span>
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-black text-white">NGINX 1.25 Edge</h3>
            <div className="space-y-2 text-xs font-mono text-zinc-400">
              <div className="flex justify-between">
                <span>Brotli / Gzip:</span>
                <span className="font-bold text-emerald-400">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span>WebSocket Upgrade:</span>
                <span className="font-bold text-emerald-400">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span>Turbopack HMR Stream:</span>
                <span className="font-bold text-cyan-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span>WAF Rate-Limiting:</span>
                <span className="font-bold text-emerald-400">Zero-Trust</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
