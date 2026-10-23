'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Database,
  ArrowLeft,
  Eye,
  Server,
  FileText,
  Download,
  Printer,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Building,
  Users,
  Globe,
  HelpCircle,
  Copy,
  ChevronRight,
  Sparkles,
  UserCheck,
  Scale,
  RefreshCw,
  Mail,
} from 'lucide-react';

interface PolicySection {
  id: string;
  title: string;
  badge?: string;
  icon: React.ElementType;
  content: React.ReactNode;
  summary: string;
}

export default function PrivacyClient() {
  const [activeSection, setActiveSection] = useState<string>('executive-summary');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const sections: PolicySection[] = useMemo(
    () => [
      {
        id: 'executive-summary',
        title: 'Executive Summary & Plain-English Commitments',
        badge: 'At a Glance',
        icon: Sparkles,
        summary:
          'Our core promise: zero data selling, 4-tier cryptographic Row-Level Security, 1-click JSON export, and full DPDP Act 2023 alignment.',
        content: (
          <div className="space-y-6">
            <p className="text-slate-600 text-sm leading-relaxed">
              Campus Skill Connect (&quot;CSC&quot;) is founded on a straightforward principle: <strong className="text-slate-900 font-semibold">Proof Over Claims, Privacy by Default</strong>. Unlike advertising-driven networks that monetize student credentials and engagement, our platform is built strictly to provide high-trust showcase and collaboration infrastructure for verified university students, researchers, faculty, and accredited campus recruiters.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Zero Data Selling</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    We will never sell, lease, monetize, or trade student profiles, resumes, code repositories, or personal data to advertising networks or data brokers.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Cryptographic RLS Boundary</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Privacy is enforced at the PostgreSQL database Row-Level Security layer. Private drafts and connections-only work cannot be leaked via API or client-side tampering.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-600 text-white shrink-0 mt-0.5">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">1-Click Full Portability</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Download an unencumbered, machine-readable JSON archive of all your published projects, skills, connection graphs, and CV metadata anytime.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-600 text-white shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Permanent Right to Erasure</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Permanently delete your account, purge uploaded CV files, and delete peer relations with immediate database cascading deletion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'scope-and-identity',
        title: '1. Scope, Applicability & Data Fiduciary Identity',
        icon: Building,
        summary: 'Details regarding the operating entity, Data Fiduciary role under the DPDP Act 2023, and covered individuals.',
        content: (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              This Privacy Policy describes how <strong className="text-slate-900">Campus Skill Connect</strong> (&quot;CSC&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, processes, and safeguards personal data when you access or interact with our web application, tools, APIs, and associated services (collectively, the &quot;Platform&quot;).
            </p>
            <p>
              For the purposes of the <strong className="text-slate-900">Digital Personal Data Protection Act, 2023 (DPDP Act, India)</strong>, Campus Skill Connect acts as the <strong className="text-slate-900">Data Fiduciary</strong> responsible for determining the purpose and means of processing your personal data. For individuals accessing our services from the European Economic Area (EEA) or the United Kingdom, we operate as a <strong className="text-slate-900">Data Controller</strong> under the General Data Protection Regulation (GDPR / UK GDPR).
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-xs mb-1">Applicability:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li><strong className="text-slate-800">Student &amp; Alumni Creators:</strong> Enrolled in recognized higher education institutions who register using personal or institutional email addresses.</li>
                <li><strong className="text-slate-800">Faculty Mentors:</strong> Academic advisors verifying student research or guiding collaborative work.</li>
                <li><strong className="text-slate-800">Verified Corporate Recruiters:</strong> Talent scouts querying public student portfolios under strict domain authorization.</li>
                <li><strong className="text-slate-800">Visitors:</strong> Individuals inspecting public student portfolios at canonical paths like <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded">/u/[username]</code>.</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: 'information-collected',
        title: '2. Information We Collect (And What We NEVER Collect)',
        icon: FileText,
        summary: 'Specific categorization of directly provided details, automatically captured telemetry, and explicit exclusions.',
        content: (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              We adhere strictly to the principle of <strong className="text-slate-900">Data Minimization</strong> under Section 6 of the DPDP Act 2023. We collect only the data necessary to provide high-trust portfolio verification and campus discovery.
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[#1b59f8]">
                A. Information You Provide Directly
              </h4>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                <li>
                  <strong className="text-slate-900">Account Credentials:</strong> Full name, display name, institutional or personal email, password hash (salted using bcrypt/Argon2 via Supabase Auth), and role preference.
                </li>
                <li>
                  <strong className="text-slate-900">Institutional Affiliation:</strong> University/college name, accredited campus domain matching (e.g., <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded">.ac.in</code>, <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded">.edu</code>), graduation batch year, and major.
                </li>
                <li>
                  <strong className="text-slate-900">Proof-of-Work Artifacts:</strong> External HTTPS URLs (GitHub, GitLab, ArXiv, Figma, live demo URLs), project descriptions, media attachments, and repository metadata.
                </li>
                <li>
                  <strong className="text-slate-900">CV &amp; Career Documents:</strong> Uploaded resume files (PDF/DOCX) submitted for deterministic, rule-based ATS analysis, and form fields filled within our Interactive CV Builder.
                </li>
                <li>
                  <strong className="text-slate-900">Collaboration &amp; Messaging Data:</strong> Messages exchanged between mutually connected peers, sprint room session titles, and skill endorsement interactions.
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-600">
                B. Automatically Collected Technical &amp; Security Data
              </h4>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                <li>
                  <strong className="text-slate-900">Network &amp; Device Identifiers:</strong> IP address (utilized solely for rate limiting, DDoS mitigation, and server-side SSRF protection against malicious artifact URLs), browser user-agent, operating system, and screen resolution.
                </li>
                <li>
                  <strong className="text-slate-900">Append-Only Audit Logs:</strong> Cryptographically logged records of sensitive security actions, including permission changes, login timestamps, and recruiter search queries for anti-scraping enforcement.
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>What We Explicitly NEVER Collect</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                <li>National biometric identifiers, Aadhaar numbers, or passport records.</li>
                <li>Credit/debit card numbers or personal bank credentials.</li>
                <li>Off-platform browsing history or commercial purchase tracking.</li>
                <li>Real-time background GPS tracking of student physical locations.</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: 'legal-bases',
        title: '3. Legal Bases & Purposes for Processing Personal Data',
        icon: Scale,
        summary: 'Lawful processing frameworks under India DPDP Act 2023, GDPR Article 6, and FERPA confidentiality guidelines.',
        content: (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              We process personal data only when an explicit, lawful basis exists under applicable data protection legislation:
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3">Processing Purpose</th>
                    <th className="p-3">DPDP Act 2023 Basis</th>
                    <th className="p-3">GDPR Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  <tr>
                    <td className="p-3 font-sans font-medium text-slate-900">Authentication &amp; Account Operations</td>
                    <td className="p-3 font-sans">Explicit Consent (Section 6)</td>
                    <td className="p-3 font-sans">Performance of Contract (Art. 6(1)(b))</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-medium text-slate-900">Institutional Domain Verification</td>
                    <td className="p-3 font-sans">Specified Purpose (Section 4)</td>
                    <td className="p-3 font-sans">Legitimate Interests (Art. 6(1)(f))</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-medium text-slate-900">Portfolio Visibility &amp; Peer Messaging</td>
                    <td className="p-3 font-sans">Granular User Consent (Section 6)</td>
                    <td className="p-3 font-sans">Consent (Art. 6(1)(a))</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-medium text-slate-900">Anti-Scraping, SSRF Defense &amp; Security Audits</td>
                    <td className="p-3 font-sans">Legitimate Uses / Prevention of Fraud</td>
                    <td className="p-3 font-sans">Legitimate Interests &amp; Legal Obligation</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-medium text-slate-900">Rule-Based ATS Resume Verification</td>
                    <td className="p-3 font-sans">Explicit User Request &amp; Consent</td>
                    <td className="p-3 font-sans">Performance of Contract</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-slate-500 italic">
              Notice on ATS Analysis: Our resume scanner relies entirely on deterministic, structural rule validation (contact information, standard sections, date ordering, keyword relevance). We do not feed uploaded resumes into unvetted public generative models or fabricate arbitrary match scores.
            </p>
          </div>
        ),
      },
      {
        id: 'visibility-and-rls',
        title: '4. 4-Tier Granular Visibility Architecture & Row Level Security (RLS)',
        badge: 'Core Architectural Guardrail',
        icon: Lock,
        summary: 'How our database guarantees that private student data cannot leak across authorization tiers.',
        content: (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              In traditional web platforms, privacy is often simulated using superficial frontend display toggles (e.g., hiding a DOM element while still exposing the underlying JSON via REST/GraphQL endpoints). <strong className="text-slate-900">Campus Skill Connect treats the database as the primary security boundary.</strong>
            </p>
            <p>
              Every database query executed against student portfolios, CVs, and connection relations is subject to strict <strong className="text-slate-900">PostgreSQL Row-Level Security (RLS)</strong> policies evaluated at the database kernel level:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tier 1: Only Me (Draft &amp; Confidential)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enforces strict tenant isolation: <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded font-mono">auth.uid() = owner_id</code>. Never exposed to search engines, peers, or recruiters.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>Tier 2: Connections Only</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Gated on our single-row canonical graph: <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded font-mono">status = &apos;accepted&apos;</code>. Accessible exclusively to mutual peer connections.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Building className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tier 3: Verified Campus Only</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Requires cryptographic proof of institutional domain match. Cross-campus visitors cannot query these records without verified domain equivalence.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tier 4: Worldwide (Public)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Indexed for search engines and authorized corporate recruiters. Students retain full control to demote or elevate any work item at will.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'recruiter-boundaries',
        title: '5. Recruiter Gating, Employer Queries & Anti-Scraping Defenses',
        icon: UserCheck,
        summary: 'Rigorous domain validation rules for recruiters, prohibition of bulk scraping, and candidate safety safeguards.',
        content: (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              Student safety and protection against predatory headhunting or automated scraping are central commitments of Campus Skill Connect:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-600">
              <li>
                <strong className="text-slate-900">Mandatory Corporate Domain Validation:</strong> Recruiters cannot register with generic free webmail accounts (e.g. Gmail, Yahoo). Corporate email domains are verified before talent search privileges are unlocked.
              </li>
              <li>
                <strong className="text-slate-900">Zero Access to Private Student Records:</strong> Recruiters are strictly bounded by RLS. They cannot query &quot;Only Me&quot; or &quot;Connections Only&quot; projects, personal phone numbers, or private direct messages.
              </li>
              <li>
                <strong className="text-slate-900">Anti-Scraping Sliding-Window Rate Limits:</strong> All recruiter search endpoints enforce Redis-backed sliding-window rate limiting. Automated crawling, headless browser scraping, and bulk talent extraction trigger immediate IP bans and security escalations.
              </li>
              <li>
                <strong className="text-slate-900">Explicit Student Inquiries:</strong> Recruiters must initiate mutual connection requests or reach out via official campus recruitment channels; blind mass cold-emailing is structurally prohibited.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: 'subprocessors',
        title: '6. Third-Party Sub-Processors & Infrastructure Providers',
        icon: Server,
        summary: 'Transparent enumeration of cloud infrastructure providers and data residency standards.',
        content: (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              We partner with industry-leading infrastructure providers that maintain rigorous SOC 2 Type II, ISO 27001, and GDPR certifications:
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3">Sub-Processor</th>
                    <th className="p-3">Role &amp; Activity</th>
                    <th className="p-3">Data Location</th>
                    <th className="p-3">Security Standards</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Supabase Inc.</td>
                    <td className="p-3">Managed PostgreSQL, Auth, Realtime &amp; File Storage</td>
                    <td className="p-3 font-mono">India / APAC / Global Edge</td>
                    <td className="p-3">AES-256, SOC 2, HIPAA/GDPR</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Vercel Inc.</td>
                    <td className="p-3">Next.js Edge Deployment, CDN &amp; WAF</td>
                    <td className="p-3 font-mono">Global Anycast Network</td>
                    <td className="p-3">TLS 1.3, DDoS Shield</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Upstash / Redis</td>
                    <td className="p-3">Sliding-Window Rate Limiting &amp; Telemetry Caching</td>
                    <td className="p-3 font-mono">APAC Regional Clusters</td>
                    <td className="p-3">In-Memory Encryption</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Google Cloud / Firebase</td>
                    <td className="p-3">Optional OAuth Federated Sign-In Provider</td>
                    <td className="p-3 font-mono">Global / India</td>
                    <td className="p-3">OAuth 2.0 / OpenID Connect</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-slate-500">
              Contractual Safeguards: All sub-processors are bound by strict Data Processing Addenda (DPAs) stipulating that customer data may never be used for AI model training or unauthorized third-party commercial enrichment.
            </p>
          </div>
        ),
      },
      {
        id: 'retention-and-purging',
        title: '7. Data Retention & Automated Purge Lifecycles',
        icon: RefreshCw,
        summary: 'How long personal data is maintained and our commitment to permanent, unrecoverable data erasure.',
        content: (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              We retain personal data only for as long as necessary to fulfill the purposes set out in this Policy or as required by statutory law:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-600">
              <li>
                <strong className="text-slate-900">Active Account Data:</strong> Retained for the duration of your active student membership or until you request account deletion.
              </li>
              <li>
                <strong className="text-slate-900">CV &amp; Resume Files:</strong> Stored securely in your private tenant storage bucket. When you delete a CV file from your dashboard, the physical object is expunged from object storage within 1 hour.
              </li>
              <li>
                <strong className="text-slate-900">Ephemeral ATS Parsing Buffers:</strong> Resumes submitted for instant ATS scoring are processed in volatile memory. Unstructured document text is discarded immediately after rule metrics are synthesized.
              </li>
              <li>
                <strong className="text-slate-900">Account Erasure Execution:</strong> Initiating account erasure via <Link href="/profile/privacy" className="text-[#1b59f8] font-semibold hover:underline">/profile/privacy</Link> triggers atomic deletion of your profile, projects, skill endorsements, and connections. Encrypted database backup snapshots expire and roll off within 30 days.
              </li>
              <li>
                <strong className="text-slate-900">Security Audit Logs:</strong> Access logs, IP records, and security telemetry are retained for 90 days for forensic intrusion detection before scheduled automatic deletion.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: 'user-rights',
        title: '8. Your Rights & Data Sovereignty (DPDPA 2023, GDPR & CCPA)',
        badge: 'Enforceable Statutory Rights',
        icon: ShieldCheck,
        summary: 'Practical guide to exercising your right to access, portability, correction, erasure, and grievance redressal.',
        content: (
          <div className="space-y-5 text-xs text-slate-600 leading-relaxed">
            <p>
              Under Chapter III of the Digital Personal Data Protection Act, 2023, the General Data Protection Regulation (GDPR), and applicable international standards, you hold enforceable rights over your digital persona:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">Right to Access &amp; Portability</h4>
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Sec. 11 DPDPA</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Request a complete summary of personal data being processed. You can instantly download a standardized, machine-readable JSON archive.
                </p>
                <Link
                  href="/api/user/export"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b59f8] hover:underline pt-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Execute 1-Click JSON Data Export</span>
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">Right to Correction &amp; Updating</h4>
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Sec. 12 DPDPA</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Correct inaccurate, misleading, or outdated personal information, update institution proof, or modify project titles at any time.
                </p>
                <Link
                  href="/profile/edit"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b59f8] hover:underline pt-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Update Profile Data in Settings</span>
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-rose-700 text-xs">Right to Erasure (&quot;Be Forgotten&quot;)</h4>
                  <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Sec. 12 DPDPA</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Permanently erase your personal data, published works, skill endorsements, and connections when no longer needed for platform operation.
                </p>
                <Link
                  href="/profile/privacy"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:underline pt-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Manage Erasure on Privacy Dashboard</span>
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">Right to Grievance Redressal</h4>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Sec. 13 DPDPA</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Register concerns or complaints regarding your personal data directly with our appointed Grievance Officer, with guaranteed statutory turnaround times.
                </p>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b59f8] hover:underline pt-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Submit Privacy Ticket to Helpdesk</span>
                </Link>
              </div>
            </div>

            <p className="text-slate-500 pt-2">
              <strong className="text-slate-700">Right to Nominate (DPDP Act Sec. 14):</strong> You hold the right to nominate any individual who, in the event of death or incapacity, may exercise your data principal rights on your behalf. To file a nomination, contact our Data Protection Officer.
            </p>
          </div>
        ),
      },
      {
        id: 'cookies-and-tracking',
        title: '9. Cookies, Local Storage & Session Telemetry',
        icon: Database,
        summary: 'Essential cookies only, zero commercial tracking pixels, and clear browser control guidance.',
        content: (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              We believe intrusive behavioral tracking has no place in education and peer software. <strong className="text-slate-900">Campus Skill Connect operates ZERO third-party advertising cookies, zero Meta/TikTok pixels, and zero cross-site marketing beacons.</strong>
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3">Cookie / Storage Key</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Purpose &amp; Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  <tr>
                    <td className="p-3 text-slate-900">sb-*-auth-token</td>
                    <td className="p-3 font-sans font-bold text-blue-600">Strictly Necessary</td>
                    <td className="p-3 font-sans">Maintains secure authenticated session with Supabase. HttpOnly, Secure, SameSite=Lax. Active session.</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-900">csc_role</td>
                    <td className="p-3 font-sans font-medium text-slate-700">Functional / UI</td>
                    <td className="p-3 font-sans">Remembers active dashboard persona (student / recruiter / admin) for view switching. Persistent (30 days).</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-900">csc_telemetry</td>
                    <td className="p-3 font-sans font-medium text-slate-700">Performance</td>
                    <td className="p-3 font-sans">Aggregated, non-identifiable client performance and error metrics. Opt-out supported.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-slate-500">
              Managing Cookies: Because our cookies are strictly operational, blocking session cookies via browser settings will disable login and dashboard capabilities.
            </p>
          </div>
        ),
      },
      {
        id: 'minors-and-academics',
        title: '10. Protection of Minors & Academic Policy',
        icon: Users,
        summary: 'Age restrictions, university student status verification, and parental consent frameworks.',
        content: (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              Campus Skill Connect is designed for students enrolled in college, university, polytechnic, or vocational degree programs, as well as alumni and higher-education faculty.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-600">
              <li>
                <strong className="text-slate-900">Minimum Age Requirement:</strong> You must be at least 18 years of age, or at least 16 years of age and enrolled in an accredited secondary/post-secondary academic program with valid institutional credentials.
              </li>
              <li>
                <strong className="text-slate-900">No Child Data Processing (Sec. 9 DPDP Act):</strong> We do not knowingly collect personal data from individuals under 16 years of age, nor do we track student behaviors for targeted advertising or commercial profiling.
              </li>
              <li>
                If you suspect a minor has registered without academic entitlement or requisite guardian consent, notify our team immediately at <a href="mailto:privacy@campusskillconnect.edu" className="text-[#1b59f8] font-semibold underline">privacy@campusskillconnect.edu</a> for prompt account investigation and deletion.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: 'security-standards',
        title: '11. Technical Security Safeguards & Breach Protocols',
        icon: Server,
        summary: 'Cryptographic defenses, TLS 1.3 encryption, SSRF protection, and incident notification commitments.',
        content: (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              We implement comprehensive physical, organizational, and technological security measures compliant with Section 8(5) of the DPDP Act 2023:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs">Encryption in Transit</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enforced TLS 1.3 encryption across all inbound HTTPS endpoints with strict HSTS preloading.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs">Encryption at Rest</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Database storage, object buckets, and automated backups are encrypted using hardware AES-256.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs">Server-Side SSRF Protection</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Project repository and demo URLs are filtered against private IPv4/IPv6 ranges before fetching metadata.
                </p>
              </div>
            </div>

            <p className="text-slate-600 pt-1">
              <strong className="text-slate-900">Breach Notification Protocol:</strong> In the unlikely event of a security compromise impacting personal data, Campus Skill Connect will notify the <strong className="text-slate-900">Data Protection Board of India</strong> and all affected data principals without undue delay, outlining the nature of the breach, estimated consequences, and immediate remediation steps taken.
            </p>
          </div>
        ),
      },
      {
        id: 'grievance-and-dpo',
        title: '12. Statutory Grievance Redressal & Data Protection Officer (DPO)',
        badge: 'Statutory Contact Notice',
        icon: Mail,
        summary: 'Direct contact coordinates for our Grievance Officer under Rule 3(2) of IT Rules 2021 & Section 8 DPDP Act 2023.',
        content: (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              In compliance with <strong className="text-slate-900">Section 8 of the Digital Personal Data Protection Act, 2023</strong> and <strong className="text-slate-900">Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, we have designated a dedicated Data Protection Officer and Grievance Officer:
            </p>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs">
                    GO
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Grievance &amp; Data Protection Officer</h4>
                    <p className="text-[11px] text-slate-500">Trust, Safety &amp; Legal Compliance Division</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                  Statutory Office
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-mono text-[10px] uppercase">Officer Name &amp; Title</p>
                  <p className="font-bold text-slate-900 mt-0.5">Aditya R. Sharma, Advocate &amp; CIPP/A</p>
                  <p className="text-slate-500 text-[11px]">Chief Data Privacy &amp; Compliance Officer</p>
                </div>

                <div>
                  <p className="text-slate-400 font-mono text-[10px] uppercase">Official Grievance Email</p>
                  <p className="font-bold text-[#1b59f8] mt-0.5">
                    <a href="mailto:privacy@campusskillconnect.edu" className="hover:underline">
                      privacy@campusskillconnect.edu
                    </a>
                  </p>
                  <p className="text-slate-500 text-[11px]">cc: <a href="mailto:grievance@campusskillconnect.edu" className="hover:underline">grievance@campusskillconnect.edu</a></p>
                </div>

                <div>
                  <p className="text-slate-400 font-mono text-[10px] uppercase">Service-Level Agreement (SLA)</p>
                  <p className="font-semibold text-slate-800 mt-0.5">Acknowledgment within 24 hours</p>
                  <p className="text-slate-500 text-[11px]">Final resolution within 15 calendar days</p>
                </div>

                <div>
                  <p className="text-slate-400 font-mono text-[10px] uppercase">Postal / Registered Office</p>
                  <p className="font-medium text-slate-800 mt-0.5">Campus Skill Connect Foundation</p>
                  <p className="text-slate-500 text-[11px]">Tower 4, Campus Technology Hub, Koramangala, Bengaluru, KA 560095, India</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-[11px]">
                <span className="text-slate-500">Need to report an urgent visibility bug or security issue?</span>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0f172a] hover:bg-black text-white font-bold transition-all"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Open Support Ticket</span>
                </Link>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'revision-history',
        title: '13. Policy Versioning & Notification of Changes',
        icon: RefreshCw,
        summary: 'Schedule of updates, 30-day advance notice for material revisions, and historical log.',
        content: (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              We periodically review and update this Privacy Policy to reflect changing technical architecture, regulatory enhancements (including rules notified under the DPDP Act 2023), and new collaborative tools:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>
                <strong className="text-slate-900">Material Changes:</strong> If we make changes that meaningfully alter your data rights or visibility tiers, we will notify you at least <strong className="text-slate-900">30 days in advance</strong> via prominent in-app notification and institutional email broadcast.
              </li>
              <li>
                <strong className="text-slate-900">Continuous Availability:</strong> The current active policy version will always be accessible at <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">/privacy</code>, with permanent historical archives available upon request.
              </li>
            </ul>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 mt-2 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">Version History Log:</h4>
              <div className="space-y-1 text-[11px] font-mono text-slate-600">
                <div className="flex items-center justify-between">
                  <span>v2.4 (Current) — October 2026</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full font-bold">Active</span>
                </div>
                <p className="text-slate-500 font-sans text-[11px]">
                  Formalized DPDP Act 2023 statutory disclosures, detailed 4-tier PostgreSQL RLS architecture, integrated 1-click JSON data export and account erasure flows.
                </p>
                <div className="border-t border-slate-100 pt-1 mt-1 flex items-center justify-between text-slate-400">
                  <span>v2.0 — January 2026</span>
                  <span>Superseded</span>
                </div>
                <p className="text-slate-400 font-sans text-[11px]">
                  Initial multi-campus release with academic email domain validation and ATS resume analyzer guidelines.
                </p>
              </div>
            </div>
          </div>
        ),
      },
    ],
    []
  );

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
    );
  }, [searchQuery, sections]);

  // Handle smooth scroll to section
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Copy link to anchor
  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/privacy#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Scroll spy to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 selection:bg-[#1b59f8]/20 selection:text-[#1b59f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Campus Skill Connect</span>
          </Link>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
              DPDP Act 2023 Aligned
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold text-[#1b59f8]">
              GDPR &amp; CCPA Compliant
            </span>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold shadow-xs transition-colors"
              title="Print or save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Hero Header Card */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-50 via-indigo-50/20 to-transparent rounded-full -translate-y-24 translate-x-24 pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#1b59f8]">
              <ShieldCheck className="w-4 h-4 text-[#1b59f8]" />
              <span>OFFICIAL DATA PROTECTION &amp; PRIVACY POLICY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Privacy by Default.<br />
              <span className="text-[#1b59f8]">Proof Over Claims.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We engineered Campus Skill Connect to eliminate predatory resume scraping, unverified credential inflation, and unauthorized commercial data broker monetization. Learn how our cryptographic 4-tier visibility model and the Digital Personal Data Protection Act, 2023 protect student talent.
            </p>

            {/* Quick Metadata Ribbon */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Version 2.4 (Production Standard)
              </span>
              <span>•</span>
              <span>Effective Date: October 2026</span>
              <span>•</span>
              <span>Estimated Reading Time: 12 minutes</span>
            </div>
          </div>

          {/* Quick Action Ribbon */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/profile/privacy"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Go to Privacy Dashboard</span>
              </Link>
              <Link
                href="/api/user/export"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#1b59f8]" />
                <span>Export My Data (JSON)</span>
              </Link>
            </div>

            <div className="text-xs text-slate-500">
              Questions? Contact our DPO at{' '}
              <a href="mailto:privacy@campusskillconnect.edu" className="font-bold text-[#1b59f8] hover:underline">
                privacy@campusskillconnect.edu
              </a>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clauses (e.g. cookies, RLS, recruiter, delete, export, DPDP, retention)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1b59f8] shadow-xs transition-all font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Main Content Layout: Sidebar + Policy Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Table of Contents
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {sections.length} Sections
                </span>
              </div>

              <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-all ${
                        isActive
                          ? 'bg-blue-50 text-[#1b59f8] font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#1b59f8]' : 'text-slate-400'}`} />
                      <span className="truncate">{section.title}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#1b59f8] shrink-0" />}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Legal Help Box */}
              <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200 mt-4 space-y-2">
                <p className="text-[11px] font-bold text-slate-900">Need specific legal documentation?</p>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Review our system architecture policies or report an institutional security inquiry.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href="/terms"
                    className="text-[11px] font-bold text-[#1b59f8] hover:underline"
                  >
                    Terms of Service ↗
                  </Link>
                  <span className="text-slate-300">•</span>
                  <Link
                    href="/support"
                    className="text-[11px] font-bold text-[#1b59f8] hover:underline"
                  >
                    Helpdesk ↗
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Primary Clauses Flow */}
          <main className="lg:col-span-8 space-y-8">
            {filteredSections.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-900">No matching privacy clauses found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try searching for keywords like &quot;cookies&quot;, &quot;RLS&quot;, &quot;export&quot;, or &quot;erasure&quot;.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                >
                  Reset Search Filter
                </button>
              </div>
            ) : (
              filteredSections.map((section) => {
                const Icon = section.icon;
                const isCopied = copiedSection === section.id;

                return (
                  <article
                    key={section.id}
                    id={section.id}
                    className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs scroll-mt-24 space-y-4 hover:border-slate-300 transition-colors"
                  >
                    {/* Clause Header */}
                    <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-blue-50 text-[#1b59f8]">
                            <Icon className="w-4 h-4" />
                          </div>
                          {section.badge && (
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#1b59f8] font-bold text-[10px] font-mono uppercase tracking-wider">
                              {section.badge}
                            </span>
                          )}
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight pt-1">
                          {section.title}
                        </h2>
                      </div>

                      {/* Copy Link Button */}
                      <button
                        type="button"
                        onClick={() => handleCopyLink(section.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-500 transition-colors shrink-0"
                        title="Copy direct shareable link to this clause"
                      >
                        {isCopied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Link</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Clause Content */}
                    <div className="pt-1">{section.content}</div>
                  </article>
                );
              })
            )}

            {/* Bottom Support & Help Banner */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                  DATA SOVEREIGNTY IN ACTION
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Have questions about your institutional data rights?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Whether you need to file a formal subject access inquiry, report an unlisted university domain, or request immediate account anonymization, our Trust &amp; Safety team responds within 24 hours.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/support"
                  className="px-5 py-2.5 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shadow-xs"
                >
                  Contact Data Protection Officer
                </Link>
                <Link
                  href="/profile/privacy"
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition-all backdrop-blur-sm"
                >
                  Launch Privacy Dashboard
                </Link>
                <Link
                  href="/terms"
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition-all backdrop-blur-sm"
                >
                  View Terms &amp; Conditions
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
