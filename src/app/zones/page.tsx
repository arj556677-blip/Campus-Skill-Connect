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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1b59f8] mb-2">
            <MapPin className="w-4 h-4" />
            <span>Regional Innovation Belts • V2.0</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            City Technology Zones
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Connect with nearby student engineers and researchers across multiple universities located within the same metropolitan hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zones.map((zone) => {
            const count = profiles.filter((p) => p.zone_id === zone.id).length;

            return (
              <div
                key={zone.id}
                className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-[#1b59f8] bg-blue-50 border border-blue-200 px-3 py-0.5 rounded-full">
                      {zone.state}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Metropolitan Belt
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900">
                    {zone.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Active cluster of engineering institutions, hardware maker spaces, and student research groups in {zone.city}.
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Users className="w-4 h-4 text-[#1b59f8]" />
                      <span>{count + 64} Active Peers</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>3 Hackathons Planned</span>
                    </span>
                  </div>
                </div>

                <Link
                  href={`/people?zone=${zone.id}`}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
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
