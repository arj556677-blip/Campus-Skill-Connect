import React from 'react';
import { Sparkles } from 'lucide-react';
import HoloCard from '@/components/ui/HoloCard';

export default function HeroVisualCard() {
  return (
    <div className="relative w-full max-w-[490px] mx-auto lg:max-w-none group/card">
      {/* Outer Card with dot-grid pattern and rounded frame matching reference mockup */}
      <div className="relative w-full p-5 sm:p-7 sm:pb-8 rounded-[2.5rem] bg-white border border-slate-200/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_-15px_rgba(27,89,248,0.12)] transition-all duration-500 bg-[radial-gradient(#cbd5e1_1.2px,transparent_1.2px)] [background-size:18px_18px]">
        
        {/* Top-Left Decorative Squiggle Icon with hover reaction */}
        <div className="absolute top-6 left-6 z-10 text-[#1b59f8] cursor-pointer hover:scale-115 hover:rotate-6 transition-transform duration-300">
          <svg
            className="w-8 h-4 text-[#1b59f8]"
            viewBox="0 0 36 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M2 8 C 5 2, 9 2, 12 8 C 15 14, 19 14, 22 8 C 25 2, 29 2, 34 8"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Central Student Portrait with WebGL2 Holographic Foil Effect from React Bits */}
        <div className="relative w-full flex items-center justify-center rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-200/60 shadow-xs">
          <HoloCard
            image="/images/hero-student.jpg"
            alt="Student builder collaborating in university innovation lab"
            preset="bursts"
            radius={28}
            width="100%"
            intensity={0.82}
            glare={0.45}
            edgeSparkle={0.8}
            tiltMax={14}
            hoverScale={1.03}
            idle={true}
            shadow={false}
            className="w-full block"
          />
        </div>

        {/* ── 1. Top-Right Badge: Federated Campus Network with float & hover lift ── */}
        <div className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 z-20 flex items-center gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-[#1b59f8] text-white shadow-[0_12px_28px_rgba(27,89,248,0.4)] hover:shadow-[0_18px_36px_rgba(27,89,248,0.55)] border border-white/20 select-none cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-float-slow group/badge">
          {/* Avatar stack with interactive pop on hover */}
          <div className="flex -space-x-2 shrink-0">
            <div className="w-7 h-7 rounded-full bg-[#bfdbfe] text-[#1e3a8a] text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white shadow-xs transition-transform duration-200 hover:scale-125 hover:z-30 hover:-translate-y-0.5">
              AF
            </div>
            <div className="w-7 h-7 rounded-full bg-[#e9d5ff] text-[#581c87] text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white shadow-xs transition-transform duration-200 hover:scale-125 hover:z-30 hover:-translate-y-0.5">
              PS
            </div>
            <div className="w-7 h-7 rounded-full bg-[#a7f3d0] text-[#065f46] text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white shadow-xs transition-transform duration-200 hover:scale-125 hover:z-30 hover:-translate-y-0.5">
              KV
            </div>
            <div className="w-7 h-7 rounded-full bg-white text-slate-800 text-[11px] font-black flex items-center justify-center ring-2 ring-white shadow-xs transition-transform duration-200 hover:scale-125 hover:z-30 hover:-translate-y-0.5">
              +
            </div>
          </div>
          {/* Label & title */}
          <div className="leading-tight text-left pr-1">
            <span className="block text-[9px] font-mono font-bold uppercase tracking-wider text-blue-200">
              FEDERATED
            </span>
            <span className="block text-xs sm:text-sm font-extrabold text-white">
              Campus Network
            </span>
          </div>
        </div>

        {/* ── 2. Mid-Right Badge: Peer Collaboration with hand-drawn arrow & sparkle pulse ── */}
        <div className="absolute -right-3 sm:-right-5 top-[52%] -translate-y-1/2 z-20 select-none animate-float-slow-reverse group/collab">
          {/* Hand-drawn curved arrow above pill pointing towards the badge with interactive nudge */}
          <div className="absolute -top-11 right-5 pointer-events-none text-[#1b59f8] transition-transform duration-300 group-hover/collab:-translate-y-1 group-hover/collab:translate-x-0.5">
            <svg
              className="w-7 h-9 text-[#1b59f8]"
              viewBox="0 0 28 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M22 4 C 27 14, 18 22, 8 28"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 29 L 6 29 L 8 23"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-[#1b59f8] text-white shadow-[0_12px_28px_rgba(27,89,248,0.4)] hover:shadow-[0_18px_36px_rgba(27,89,248,0.55)] border border-white/20 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95">
            <div className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white animate-sparkle-pulse group-hover/collab:rotate-45 transition-transform duration-300" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
              Peer Collaboration
            </span>
          </div>
        </div>

        {/* ── 3. Bottom-Left Card: Verified Access $0 Free with tactile hover & active states ── */}
        <div className="absolute -bottom-4 -left-3 sm:-bottom-5 sm:-left-5 z-20 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#1b59f8] text-white shadow-[0_18px_36px_rgba(27,89,248,0.45)] hover:shadow-[0_24px_48px_rgba(27,89,248,0.6)] border border-white/20 select-none min-w-[210px] sm:min-w-[230px] text-left cursor-pointer transition-all duration-300 hover:scale-104 hover:-translate-y-1 active:scale-96">
          <div className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-blue-200">
            VERIFIED ACCESS
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
            $0 Free
          </div>
          <div className="text-[11px] text-blue-100 font-semibold mt-1 leading-snug">
            For All Accredited Students &amp; Faculty
          </div>
        </div>

      </div>
    </div>
  );
}
