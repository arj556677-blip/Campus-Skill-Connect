export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { getCommunities, getWorks, getProfiles } from '@/lib/data/service';
import { Building, ShieldCheck, Users, ArrowRight, ExternalLink, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Campus Communities & Colleges — Campus Skill Connect',
  description: 'Federated academic institutions and universities on Campus Skill Connect.',
};

export default async function CommunitiesPage() {
  const communities = await getCommunities();
  const profiles = await getProfiles();
  const works = await getWorks();

  return (
    <div className="min-h-screen bg-[var(--color-paper)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--color-brand-primary)] font-bold mb-1">
            <Building className="w-4 h-4" />
            <span>Academic Institution Federation</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--color-ink)]">
            Verified Campus Colleges
          </h1>
          <p className="text-sm text-[var(--color-ink-muted)] mt-1">
            Students and faculty with verified institutional email domains receive academic proof-of-status and cross-campus collaboration permissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communities.map((comm) => {
            const studentCount = profiles.filter((p) => p.institution_id === comm.id).length;
            const projectCount = works.filter((w) => w.owner?.institution_id === comm.id).length;

            return (
              <div
                key={comm.id}
                className="rounded-3xl bg-white border border-[var(--color-border)] p-6 sm:p-8 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {comm.logo_url ? (
                        <img
                          src={comm.logo_url}
                          alt={comm.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-1 ring-zinc-200 shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 font-bold text-lg flex items-center justify-center ring-1 ring-zinc-200 shrink-0">
                          {comm.name?.slice(0, 2).toUpperCase() || 'CP'}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-base text-[var(--color-ink)]">{comm.name}</h3>
                          {comm.is_verified && (
                            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                        </div>
                        <p className="font-mono text-xs text-zinc-500 mt-0.5">{comm.domain}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                    {comm.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                      <p className="text-lg font-bold text-[var(--color-ink)]">{studentCount + 42}</p>
                      <p className="text-[11px] text-zinc-500 font-medium">Verified Builders</p>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                      <p className="text-lg font-bold text-emerald-600">{projectCount + 89}</p>
                      <p className="text-[11px] text-zinc-500 font-medium">Showcase Works</p>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/people?community=${comm.id}`}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary)] text-xs font-bold hover:bg-[var(--color-brand-primary)] hover:text-white transition-all"
                >
                  <span>Explore Campus Talent</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
