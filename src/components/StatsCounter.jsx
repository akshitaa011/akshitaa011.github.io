import React from 'react';
import { GraduationCap, Code2, GitPullRequest, Award, Medal, Sparkles } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

const iconMap = {
  GraduationCap,
  Code2,
  GitPullRequest,
  Award,
  Medal
};

export default function StatsCounter() {
  const { stats } = portfolioData;

  return (
    <section className="py-12 border-y border-white/[0.08] bg-[#030712]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          {stats.map((stat, idx) => {
            const Icon = iconMap[stat.icon] || Sparkles;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl glass-card flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] group-hover:text-white">
                    {stat.label}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-900 group-hover:bg-[#6366F1]/20 text-[#9CA3AF] group-hover:text-[#A5B4FC] transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white transition-all">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-1 font-light">
                    {stat.detail}
                  </div>
                </div>

                {/* Subtle corner light highlight */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#6366F1]/5 rounded-full blur-xl group-hover:bg-[#6366F1]/15 transition-all pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
