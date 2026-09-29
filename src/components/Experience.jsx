import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GitPullRequest, CheckCircle2, ExternalLink, Calendar, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import GitCommitGraph from './GitCommitGraph';
import { playHoverSound, playClickSound } from '../utils/audioFx';

export default function Experience() {
  const { experience } = portfolioData;

  return (
    <section id="experience" className="py-24 relative scroll-mt-24 sm:scroll-mt-28">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#6366F1]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-indigo text-xs font-mono mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Track Record</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            Work Experience & <span className="text-gradient-emerald">Production Impact</span>
          </h2>
          <p className="text-[#9CA3AF] text-sm sm:text-base max-w-2xl mt-3 font-mono">
            Engineering robust backends, architecting responsive frontend interfaces, and contributing verified code to production open-source systems.
          </p>
        </div>

        {/* 1. Interactive Production Git Branch Tree */}
        <GitCommitGraph />

        {/* 2. Structured Experience Timeline */}
        <div className="space-y-10 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:w-0.5 before:-translate-x-1/2 before:bg-gradient-to-b before:from-[#6366F1]/40 before:via-[#10B981]/30 before:to-transparent mt-12">
          {experience.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isEven ? 35 : -35, scale: 0.96 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex flex-col sm:flex-row items-start ${
                  isEven ? 'sm:flex-row-reverse' : ''
                } gap-8 group`}
              >
                {/* Timeline Center Node */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#030712] border-2 border-[#10B981] flex items-center justify-center shadow-md shadow-[#10B981]/25 z-10 group-hover:scale-125 transition-transform duration-300">
                  {item.type === 'Open Source' ? (
                    <GitPullRequest className="w-3.5 h-3.5 text-[#10B981]" />
                  ) : (
                    <Briefcase className="w-3.5 h-3.5 text-[#10B981]" />
                  )}
                </div>

                {/* Content Card */}
                <div className="ml-12 sm:ml-0 sm:w-1/2 sm:px-6 w-full">
                  <div
                    className="glass-card p-6 sm:p-7 rounded-2xl relative overflow-hidden group-hover:border-[#6366F1]/40"
                    onMouseEnter={playHoverSound}
                  >
                    
                    {/* Top Row: Role, Company & Period */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono uppercase tracking-wider text-[#34D399] font-semibold">
                            {item.type}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs text-[#9CA3AF] font-mono">{item.location}</span>
                        </div>
                        <h3 className="text-xl font-bold font-heading text-white mt-1">
                          {item.role}
                        </h3>
                        <div className="text-sm font-medium text-slate-300 mt-0.5 flex items-center gap-1.5 font-mono">
                          <span>{item.company}</span>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/[0.08] text-xs font-mono text-[#9CA3AF] shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-[#A5B4FC]" />
                        <span>{item.period}</span>
                      </div>
                    </div>

                    {/* Overview description */}
                    <p className="text-xs sm:text-sm text-[#9CA3AF] mb-4 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Bullet Points */}
                    <ul className="space-y-2.5 mb-5 text-xs sm:text-sm text-[#9CA3AF]">
                      {item.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Open Source Pull Request Highlights (Submitty) */}
                    {item.highlights && (
                      <div className="my-4 p-3.5 rounded-xl bg-slate-950/80 border border-white/[0.08] space-y-2">
                        <div className="text-xs font-mono text-white font-semibold flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                          <span>Verified Production Pull Requests:</span>
                        </div>
                        <div className="space-y-1.5">
                          {item.highlights.map((hl, hIdx) => (
                            <a
                              key={hIdx}
                              href={hl.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={playClickSound}
                              className="flex items-center justify-between p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/[0.08] hover:border-[#6366F1]/40 text-xs text-[#9CA3AF] hover:text-white transition-all group/link"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                                <span className="font-mono text-slate-200">{hl.label}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                                <span className="px-1.5 py-0.5 rounded badge-emerald">Merged</span>
                                <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform text-[#34D399]" />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.08]">
                      {item.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-0.5 rounded-md badge-indigo text-[11px] font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
