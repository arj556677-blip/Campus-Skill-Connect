export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  FileText,
  Users,
  Video,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Building,
  Check,
  Briefcase,
  Layers,
  Code2,
} from 'lucide-react';
import WorkCard from '@/components/cards/WorkCard';
import ProfileCard from '@/components/cards/ProfileCard';
import { getWorks, getProfiles, getCommunities } from '@/lib/data/service';

export default async function HomePage() {
  const works = await getWorks();
  const profiles = await getProfiles();
  const communities = await getCommunities();

  const categories = [
    { label: 'All Disciplines', active: true },
    { label: 'Distributed Systems', active: false },
    { label: 'AI & Machine Learning', active: false },
    { label: 'Web Architecture', active: false },
    { label: 'UI/UX Design', active: false },
    { label: 'Cybersecurity', active: false },
    { label: 'Cloud & DevOps', active: false },
  ];

  return (
    <div className="flex flex-col w-full bg-white text-[#0f172a] selection:bg-[#1b59f8]/20 selection:text-[#1b59f8]">
      {/* ── 1. HERO SECTION (Directly matching reference design) ── */}
      <section className="relative pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline & Action CTAs */}
            <div className="lg:col-span-6 flex flex-col items-start">
              {/* Kicker Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 mb-6 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#1b59f8] animate-pulse" />
                <span>#1 Campus Proof-of-Work Platform 2026</span>
              </div>

              {/* Bold Display Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#0f172a] tracking-tight leading-[1.08]">
                Shape Your Future with the{' '}
                <span className="text-[#1b59f8]">Right Proof</span> of Work
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl font-normal">
                Discover a high-trust campus proof-of-work ecosystem. Empower yourself to succeed in your career, passions, and peer collaborations through verifiable repositories, research, and design.
              </p>

              {/* Action Buttons: Black Pill CTA */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-sm font-bold shadow-md active:scale-95 transition-all group"
                >
                  <span>GET STARTED</span>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </Link>

                <Link
                  href="/showcase"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold active:scale-95 transition-all"
                >
                  <Compass className="w-4 h-4 text-slate-600" />
                  <span>Explore Showcase</span>
                </Link>
              </div>

              {/* Micro Proof Elements */}
              <div className="mt-10 flex items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Domain Identity</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Free for Students</span>
                </div>
              </div>
            </div>

            {/* Right Column: Signature Hero Container matching reference image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-[36px] bg-[#f8fafc] border border-slate-200/90 p-6 sm:p-10 flex items-center justify-center min-h-[500px] shadow-sm overflow-hidden">
                
                {/* Decorative Doodles matching reference image */}
                {/* Blue doodle squiggle top-left */}
                <svg className="absolute top-6 left-8 w-12 h-12 text-[#1b59f8] opacity-80" viewBox="0 0 50 50" fill="none">
                  <path d="M10 25C15 15 20 35 25 25C30 15 35 35 40 25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>

                {/* Blue curved arrow top-right */}
                <svg className="absolute top-24 right-8 w-14 h-14 text-[#1b59f8] opacity-70" viewBox="0 0 60 60" fill="none">
                  <path d="M50 10C35 15 25 35 40 50M40 50L30 45M40 50L45 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                {/* Subtle dotted grid texture */}
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                {/* Centered Student Hero Photo */}
                <div className="relative z-10 w-full max-w-[320px] sm:max-w-[340px] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-slate-200">
                  <img
                    src="/images/hero-student.jpg"
                    alt="Campus Student Builder"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Floating Electric Blue Badge 1: Top-Right (50,000+ Students) */}
                <div className="absolute top-6 right-4 sm:right-6 z-20 bg-[#1b59f8] text-white p-3 sm:p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-blue-300 ring-2 ring-white flex items-center justify-center text-[9px] font-bold text-blue-900">AR</div>
                    <div className="w-7 h-7 rounded-full bg-indigo-300 ring-2 ring-white flex items-center justify-center text-[9px] font-bold text-indigo-900">PS</div>
                    <div className="w-7 h-7 rounded-full bg-emerald-300 ring-2 ring-white flex items-center justify-center text-[9px] font-bold text-emerald-900">KV</div>
                    <div className="w-7 h-7 rounded-full bg-white ring-2 ring-white flex items-center justify-center text-[10px] font-extrabold text-[#1b59f8]">+</div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Federated</p>
                    <p className="text-xs font-black text-white leading-tight">50,000+ Students</p>
                  </div>
                </div>

                {/* Floating Electric Blue Badge 2: Middle-Right (Best Collaboration) */}
                <div className="absolute top-1/2 -right-1 sm:right-4 -translate-y-1/2 z-20 bg-[#1b59f8] text-white px-3.5 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-bold whitespace-nowrap">Best Collaboration</span>
                </div>

                {/* Floating Electric Blue Badge 3: Bottom-Left ($0 Free For Students) */}
                <div className="absolute bottom-6 left-4 sm:left-6 z-20 bg-[#1b59f8] text-white p-3.5 sm:p-4 rounded-2xl shadow-xl max-w-[210px]">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200 block">Verified Access</span>
                  <div className="text-2xl font-black text-white mt-0.5">$0 Free</div>
                  <p className="text-[11px] text-blue-100 font-medium leading-tight mt-1">
                    For All Accredited Students &amp; Faculty
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. METRICS RIBBON (Directly matching 100% · 12+ · 20k+ · 90+ container) ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-14 w-full">
        <div className="bg-[#f8fafc] border border-slate-200/90 rounded-[32px] p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center items-center">
            
            <div>
              <p className="text-3xl sm:text-5xl font-black text-[#0f172a] tracking-tight">100%</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Verified Work Proofs</p>
            </div>

            <div className="relative">
              <span className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-300 font-bold">·</span>
              <p className="text-3xl sm:text-5xl font-black text-[#0f172a] tracking-tight">48+</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Federated Campuses</p>
            </div>

            <div className="relative">
              <span className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-300 font-bold">·</span>
              <p className="text-3xl sm:text-5xl font-black text-[#0f172a] tracking-tight">1,480+</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Peer-Reviewed Projects</p>
            </div>

            <div className="relative">
              <span className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-300 font-bold">·</span>
              <p className="text-3xl sm:text-5xl font-black text-[#0f172a] tracking-tight">85+</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Verified Skill Domains</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. FEATURED WORKS SECTION ("Courses Designed for Success" -> "Works Engineered for Impact") ── */}
      <section className="py-14 sm:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 mb-3">
              Our Verified Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
              Works Engineered for Real Impact
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Start your journey with projects that build real-world skills. Get access to verified code repositories, research papers, and technical blueprints evaluated by peers.
            </p>
          </div>

          {/* Category Tabs Row */}
          <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  cat.active
                    ? 'bg-[#1b59f8] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Works Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.slice(0, 6).map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-12 text-center">
            <Link
              href="/showcase"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <span>Explore All 1,480+ Works</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ── 4. POWERFUL FEATURES SPLIT SECTION (Matching reference image) ── */}
      <section className="py-16 sm:py-24 border-b border-slate-100 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Image with Floating Stat Badge */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-[380px] aspect-[3/4] rounded-[32px] overflow-hidden shadow-lg border-2 border-white bg-slate-200">
                <img
                  src="/images/features-student.jpg"
                  alt="Student with laptop"
                  className="w-full h-full object-cover object-top"
                />

                {/* Floating Metric Badge (+2520% Profile Views) */}
                <div className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    ↗
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">+2520%</p>
                    <p className="text-[10px] text-slate-500 font-medium">Recruiter Profile Views</p>
                  </div>
                </div>

                {/* Floating Tag */}
                <div className="absolute bottom-6 right-6 z-20 bg-[#1b59f8] text-white px-3.5 py-1.5 rounded-full shadow-lg text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Real Peer Signals</span>
                </div>
              </div>
            </div>

            {/* Right Column: Feature List with Checkmark Bullets */}
            <div className="lg:col-span-6">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-3">
                Why Campus Skill Connect
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight leading-tight">
                Powerful Features for Your Campus Journey
              </h2>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-lg">
                Engineered specifically for university students, researchers, and creators to replace self-asserted resume claims with verified, tamper-proof proof of work.
              </p>

              {/* Feature Checklist */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-[#1b59f8] flex items-center justify-center mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0f172a]">Link-First Proof Publishing</h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Instant HTTPS previews for GitHub repositories, ArXiv papers, and Figma files with strict SSRF protection.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-[#1b59f8] flex items-center justify-center mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0f172a]">Live Sprint Rooms</h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Instant WebRTC video and collaborative sprint spaces across campuses. No installation needed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-[#1b59f8] flex items-center justify-center mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0f172a]">Student Dashboard &amp; 4-Level Privacy</h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Database-enforced visibility across Only Me, Connections, Campus, and Public. Zero client data leaks.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-[#1b59f8] flex items-center justify-center mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0f172a]">Rule-Based ATS Resume Studio</h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Real structural analysis for headings, contact clarity, and date consistency without fabricated score metrics.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. "OUR JOURNEY TO EXCELLENCE" (Impact Numbers) ── */}
      <section className="py-16 sm:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-[#f8fafc] border border-slate-200/90 rounded-[32px] p-8 sm:p-12">
            
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#1b59f8] font-bold">
                Our Journey to Excellence
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                Verified Scale Backed By Real Commits.
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every metric is derived directly from genuine student submissions, validated against accredited institutions.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <p className="text-4xl sm:text-5xl font-black text-[#0f172a] tracking-tight">20M+</p>
              <p className="text-xs font-semibold text-slate-600 mt-1">Lines of Code Indexed</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Across GitHub &amp; GitLab</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <p className="text-4xl sm:text-5xl font-black text-[#1b59f8] tracking-tight">250+</p>
              <p className="text-xs font-semibold text-slate-600 mt-1">Corporate Recruiters</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Vetted Corporate Accounts</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. MEET CAMPUS TALENT ("Meet Our Expert Mentors" in reference design) ── */}
      <section className="py-16 sm:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 mb-2">
                Campus Builders
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                Meet Verified Campus Talent
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Connect with student engineers, researchers, and faculty mentors.
              </p>
            </div>

            <Link
              href="/people"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b59f8] hover:text-blue-700 transition-colors"
            >
              <span>Explore all peers &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profiles.slice(0, 4).map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>

        </div>
      </section>

      {/* ── 7. OUR TRUSTED PARTNERS (Partner Institutional Network) ── */}
      <section className="py-12 sm:py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-8">
            Federated Across Premier Campuses &amp; Hiring Partners
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70 grayscale hover:grayscale-0 transition-all">
            {communities.map((comm) => (
              <div
                key={comm.id}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs font-semibold text-xs text-slate-700"
              >
                <Building className="w-4 h-4 text-blue-600" />
                <span>{comm.name.split('(')[0].trim()}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs font-semibold text-xs text-slate-700">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Stripe University Sourcing</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs font-semibold text-xs text-slate-700">
              <Code2 className="w-4 h-4 text-emerald-600" />
              <span>Google Cloud Campus</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
