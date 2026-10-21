export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { getZones, getProfiles } from '@/lib/data/service';
import { MapPin, Users, ArrowRight, Sparkles, Building } from 'lucide-react';

export const metadata = {
  title: 'City Innovation Zones — Campus Skill Connect',
  description: 'Explore student builders and cross-campus engineering teams organized by regional technology zones.',
};

export default async function ZonesPage() {
  const zones = await getZones();
  const profiles = await getProfiles();

  return (
    <div className="min-h-screen bg-[var(--color-paper)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--color-brand-coral)] font-bold mb-1">
            <MapPin className="w-4 h-4" />
            <span>Regional Innovation Belts</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--color-ink)]">
            City Technology Zones
          </h1>
          <p className="text-sm text-[var(--color-ink-muted)] mt-1">
            Connect with nearby student engineers and researchers across multiple universities located within the same metropolitan hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zones.map((zone) => {
            const count = profiles.filter((p) => p.zone_id === zone.id).length;

            return (
              <div
                key={zone.id}
                className="rounded-3xl bg-white border border-[var(--color-border)] p-6 sm:p-8 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-[var(--color-brand-coral)] bg-rose-50 px-2.5 py-1 rounded-full">
                      {zone.state}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      Metropolitan Belt
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-[var(--color-ink)]">
                    {zone.name}
                  </h3>

                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                    Active cluster of engineering institutions, hardware maker spaces, and student research groups in {zone.city}.
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-600 pt-2">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-zinc-400" />
                      <span>{count + 64} Active Peers</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span>3 Hackathons Planned</span>
                    </span>
                  </div>
                </div>

                <Link
                  href={`/people?zone=${zone.id}`}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-[var(--color-ink)] hover:text-white text-[var(--color-ink)] text-xs font-bold transition-all"
                >
                  <span>Discover Zone Builders</span>
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
