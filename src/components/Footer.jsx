import React from 'react';
import { ArrowUp, Heart, Sparkles } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

import { BUILD_DATE } from '../utils/telemetryApi';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#030712] py-12 relative text-[#9CA3AF] text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand info */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-white text-base">
              {portfolioData.personal.name}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full badge-indigo">
              v2026.1
            </span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Software Development Engineer • Submitty Open Source Contributor
          </p>
          <p className="text-[10px] text-slate-600 font-mono">
            Last deployed: {BUILD_DATE}
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(17,24,39,0.60)] border border-white/[0.08] text-[11px] text-[#9CA3AF]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span>Open to SDE roles & summer opportunities</span>
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/[0.08] hover:border-[#6366F1]/40 text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <span>Top</span>
          <ArrowUp className="w-3.5 h-3.5 text-[#A5B4FC]" />
        </button>

      </div>
    </footer>
  );
}
