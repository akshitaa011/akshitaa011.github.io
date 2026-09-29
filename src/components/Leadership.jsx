import React from 'react';
import { Users, GraduationCap, Calendar, MapPin, CheckCircle2, Globe, Server, Trophy } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Leadership() {
  const { leadership, education } = portfolioData;

  return (
    <section id="leadership" className="py-24 relative scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Leadership & Technical Community */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-indigo text-xs font-mono mb-4">
              <Users className="w-3.5 h-3.5" />
              <span>Community & Leadership</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight mb-4">
              Developer Community & <span className="text-gradient">Hackathon Leadership</span>
            </h3>
            <p className="text-[#9CA3AF] text-sm mb-6 leading-relaxed">
              Driving peer mentorship, building university developer platforms, and architecting real-time infrastructure for 24-hour hackathons.
            </p>

            {leadership.map((lead, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-white/[0.08] space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-lg font-bold font-heading text-white">{lead.club}</h4>
                    <span className="text-xs font-mono text-[#34D399] font-semibold">{lead.role}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 px-2.5 py-1 rounded-full bg-slate-900 border border-white/[0.08]">
                    {lead.period}
                  </span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-[#9CA3AF]">
                  {lead.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education Milestone */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-emerald text-xs font-mono mb-4">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic Foundation</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight mb-4">
              Formal Education & <span className="text-gradient-emerald">Academic Rigor</span>
            </h3>
            <p className="text-[#9CA3AF] text-sm mb-6 leading-relaxed">
              Consistently ranking in the top percentiles in computer science coursework, mathematics, and analytical problem-solving.
            </p>

            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className="glass-card p-5 rounded-2xl border border-white/[0.08] space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold font-heading text-white">{edu.institution}</h4>
                      <div className="text-xs text-[#9CA3AF]">{edu.degree}</div>
                    </div>
                    <span className="text-xs font-mono text-slate-500">{edu.period}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded badge-emerald">
                      {edu.score}
                    </span>
                    <span className="text-[11px] font-mono text-[#9CA3AF]">{edu.location}</span>
                  </div>

                  {edu.highlights && (
                    <div className="text-xs text-[#A5B4FC] font-mono pt-1">
                      ★ {edu.highlights}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
