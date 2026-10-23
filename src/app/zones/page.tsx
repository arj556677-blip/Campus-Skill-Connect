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
    <div className="min-h-screen bg-[#08090d] text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-mono uppercase tracking-wider text-rose-400 font-bold mb-2">
            <MapPin className="w-4 h-4" />
            <span>Regional Innovation Belts • V2.0</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            City Technology Zones
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Connect with nearby student engineers and researchers across multiple universities located within the same metropolitan hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zones.map((zone) => {
            const count = profiles.filter((p) => p.zone_id === zone.id).length;

            return (
              <div
                key={zone.id}
                className="rounded-3xl bg-[#0e1017] border border-white/10 p-6 sm:p-8 shadow-2xl hover:border-violet-500/40 transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                      {zone.state}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      Metropolitan Belt
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-white">
                    {zone.name}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Active cluster of engineering institutions, hardware maker spaces, and student research groups in {zone.city}.
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-2 border-t border-white/[0.06]">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-violet-400" />
                      <span>{count + 64} Active Peers</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>3 Hackathons Planned</span>
                    </span>
                  </div>
                </div>

                <Link
                  href={`/people?zone=${zone.id}`}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-bold transition-all shadow-sm"
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
