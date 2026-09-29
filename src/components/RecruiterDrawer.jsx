import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Zap, FileText, Mail, Phone, ExternalLink, Copy, Check, Sparkles, Building2, Code, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { portfolioData } from '../data/portfolioData';
import { playClickSound, playSuccessSound } from '../utils/audioFx';

export default function RecruiterDrawer({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    playSuccessSound();
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email);
    setCopied(true);
    triggerConfetti();
    setTimeout(() => setCopied(false), 2500);
  };

  const topProjects = [
    {
      name: "EnvGuard (npm CLI)",
      role: "Babel AST Static Analyzer",
      impact: "Parses 140+ source files to identify dead/missing environment variables with zero false positives.",
      link: "https://github.com/akshitaa011/envguard"
    },
    {
      name: "Submitty (RPI)",
      role: "Production Open Source Contributor",
      impact: "Authored PRs #12567 & #12549 merged into production serving 25,000+ daily university students.",
      link: "https://github.com/Submitty/Submitty/pull/12567"
    },
    {
      name: "DSAverse Platform",
      role: "Curated Problem-Solving Engine",
      impact: "450+ categorized DSA challenges solved with full stateful visualization engine across Trees & DP.",
      link: "https://github.com/akshitaa011/dsaverse"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl bg-[#030712] border-l border-white/[0.1] h-full overflow-y-auto shadow-2xl flex flex-col z-10 text-[#9CA3AF]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] bg-[#030712]/95 sticky top-0 backdrop-blur-md flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#10B981]/15 text-[#34D399]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                Executive Recruiter Brief
                <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full badge-emerald">
                  30s Speed-Run
                </span>
              </h2>
              <p className="text-xs text-[#9CA3AF]">Key competencies, metrics, and direct verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 text-sm">
          
          {/* Quick Pitch Box */}
          <div className="p-4 rounded-xl bg-[rgba(17,24,39,0.7)] border border-white/[0.08]">
            <div className="flex items-center gap-2 text-[#34D399] font-semibold text-xs tracking-wide uppercase mb-1.5 font-mono">
              <Sparkles className="w-4 h-4 text-[#10B981]" />
              Candidate Profile
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              <strong className="text-white font-semibold">Akshita Singhal</strong> is an engineering candidate specializing in <span className="text-[#34D399] font-medium">Java Spring Boot systems</span>, <span className="text-[#A5B4FC] font-medium">React 19 & TypeScript</span>, and developer tooling. Maintains a <span className="text-white font-bold">9.58 / 10 CGPA</span> at Banasthali Vidyapith and holds production experience from <span className="text-white font-medium">Strive Partners</span> and <span className="text-[#34D399] font-medium">Submitty (RPI)</span>.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 font-semibold">
              Key Metrics & Standing
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-xl bg-[rgba(17,24,39,0.60)] border border-white/[0.08]">
                <span className="text-[11px] font-mono text-slate-400">Academic Score</span>
                <div className="text-xl font-extrabold text-white font-heading mt-0.5">9.58 / 10</div>
                <span className="text-[11px] font-mono text-[#34D399]">B.Tech CSE '28</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[rgba(17,24,39,0.60)] border border-white/[0.08]">
                <span className="text-[11px] font-mono text-slate-400">DSA Solved</span>
                <div className="text-xl font-extrabold text-white font-heading mt-0.5">450+ Curated</div>
                <span className="text-[11px] font-mono text-[#A5B4FC]">Trees, Graphs, DP</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[rgba(17,24,39,0.60)] border border-white/[0.08]">
                <span className="text-[11px] font-mono text-slate-400">Google The Big Code</span>
                <div className="text-xl font-extrabold text-white font-heading mt-0.5">Top 1,500</div>
                <span className="text-[11px] font-mono text-[#34D399]">National Semi-Finalist</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[rgba(17,24,39,0.60)] border border-white/[0.08]">
                <span className="text-[11px] font-mono text-slate-400">Reliance Foundation</span>
                <div className="text-xl font-extrabold text-white font-heading mt-0.5">Scholar</div>
                <span className="text-[11px] font-mono text-[#A5B4FC]">Merit & Leadership</span>
              </div>
            </div>
          </div>

          {/* Top 3 Flagship Projects */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 font-semibold">
              Top 3 Flagship Projects
            </h3>
            <div className="space-y-2.5">
              {topProjects.map((p, idx) => (
                <a
                  key={idx}
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3.5 rounded-xl bg-[rgba(17,24,39,0.60)] hover:bg-[rgba(17,24,39,0.85)] border border-white/[0.08] hover:border-[#10B981]/40 transition-all group/item"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-heading font-bold text-white text-xs group-hover/item:text-[#34D399] transition-colors">
                      {p.name}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover/item:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-mono text-[#A5B4FC] block mb-1">{p.role}</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{p.impact}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Technical Alignment Categorized By Proficiency */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 font-semibold">
              Skill & Technology Proficiency
            </h3>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[rgba(17,24,39,0.60)] border border-white/[0.08]">
                <span className="text-[#34D399] font-bold block mb-1">Core & Highly Proficient:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Java Spring Boot', 'React 19', 'TypeScript', 'PostgreSQL', 'Apache Kafka', 'Babel AST', 'REST APIs', 'Redux Toolkit'].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded-md badge-emerald text-[10px]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[rgba(17,24,39,0.60)] border border-white/[0.08]">
                <span className="text-[#A5B4FC] font-bold block mb-1">Systems, Cloud & Tooling:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Docker', 'Redis', 'CI/CD Pipelines', 'Tailwind CSS', 'Node.js', 'Git / GitHub', 'Webpack / Vite', 'Linux / zsh'].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded-md badge-indigo text-[10px]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sticky Action Footer */}
        <div className="p-6 border-t border-white/[0.08] bg-[#030712] space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`mailto:${portfolioData.personal.email}?subject=Interview%20Invitation%20for%20Akshita%20Singhal`}
              onClick={playClickSound}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs shadow-lg shadow-[#10B981]/25 transition-all text-center cursor-pointer hover:scale-[1.02]"
            >
              <Mail className="w-4 h-4" />
              <span>Email Interview Invite</span>
            </a>
            
            <a
              href={portfolioData.personal.links.resumePdf}
              download="Akshita_Singhal_Resume.pdf"
              onClick={playClickSound}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[rgba(17,24,39,0.9)] hover:bg-[#6366F1]/20 border border-white/[0.12] hover:border-[#6366F1]/50 text-white font-semibold text-xs transition-all text-center cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#A5B4FC]" />
              <span>Download Resume</span>
            </a>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#34D399] transition-colors font-mono cursor-pointer"
              title="Click to copy email address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied to clipboard!" : portfolioData.personal.email}</span>
            </button>
            <span className="text-xs text-slate-500 font-mono">{portfolioData.personal.phone}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
