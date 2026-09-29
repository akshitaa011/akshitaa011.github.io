import React, { useState } from 'react';
import { Cpu, Terminal, Database, Layers, Check, Sparkles, Server, Code2 } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import TechStackOrbit from './TechStackOrbit';
import { playHoverSound, playClickSound } from '../utils/audioFx';

export default function Skills() {
  const { skills } = portfolioData;
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Disciplines', icon: Layers },
    { id: 'languages', label: 'Languages', icon: Code2 },
    { id: 'frameworks', label: 'Frameworks & Backend', icon: Server },
    { id: 'databases', label: 'Databases & Storage', icon: Database },
    { id: 'tools', label: 'DevOps & Systems', icon: Terminal },
  ];

  return (
    <section id="skills" className="py-24 relative scroll-mt-24 sm:scroll-mt-28">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Interactive Physics Tech Stack Ribbon / Orbit */}
        <TechStackOrbit />

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mt-12 mb-10">
          <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white tracking-tight">
            Categorized <span className="text-gradient">Skillset Matrix</span>
          </h3>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playClickSound();
                    setActiveTab(tab.id);
                  }}
                  onMouseEnter={playHoverSound}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#6366F1]/20 text-[#A5B4FC] border border-[#6366F1]/50 shadow-[0_0_15px_rgba(99,102,241,0.2)] font-semibold'
                      : 'bg-slate-900/60 text-[#9CA3AF] border border-white/[0.08] hover:text-white hover:border-white/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#A5B4FC]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Languages */}
          {(activeTab === 'all' || activeTab === 'languages') && (
            <div className="glass-card p-6 rounded-2xl border border-white/[0.08] flex flex-col">
              <div className="flex items-center gap-2.5 mb-4 text-white font-heading font-bold text-base">
                <Code2 className="w-5 h-5 text-[#34D399]" />
                <span>Languages</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    onMouseEnter={playHoverSound}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      lang.hot
                        ? 'badge-emerald font-semibold shadow-sm shadow-[#10B981]/15'
                        : 'bg-slate-900/80 text-[#9CA3AF] border border-white/[0.08] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {lang.name}
                    {lang.hot && <span className="ml-1.5 text-[#34D399] text-[10px]">★</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Frameworks & Backend */}
          {(activeTab === 'all' || activeTab === 'frameworks') && (
            <div className="glass-card p-6 rounded-2xl border border-white/[0.08] flex flex-col">
              <div className="flex items-center gap-2.5 mb-4 text-white font-heading font-bold text-base">
                <Server className="w-5 h-5 text-[#A5B4FC]" />
                <span>Frameworks & Web</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.frameworks.map((fw, idx) => (
                  <span
                    key={idx}
                    onMouseEnter={playHoverSound}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      fw.hot
                        ? 'badge-indigo font-semibold shadow-sm shadow-[#6366F1]/15'
                        : 'bg-slate-900/80 text-[#9CA3AF] border border-white/[0.08] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {fw.name}
                    {fw.hot && <span className="ml-1.5 text-[#A5B4FC] text-[10px]">★</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Databases */}
          {(activeTab === 'all' || activeTab === 'databases') && (
            <div className="glass-card p-6 rounded-2xl border border-white/[0.08] flex flex-col">
              <div className="flex items-center gap-2.5 mb-4 text-white font-heading font-bold text-base">
                <Database className="w-5 h-5 text-[#34D399]" />
                <span>Databases & Storage</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.databases.map((db, idx) => (
                  <span
                    key={idx}
                    onMouseEnter={playHoverSound}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      db.hot
                        ? 'badge-emerald font-semibold shadow-sm shadow-[#10B981]/15'
                        : 'bg-slate-900/80 text-[#9CA3AF] border border-white/[0.08] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {db.name}
                    <span className="text-[10px] text-slate-500 ml-1">({db.type})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tools & DevOps */}
          {(activeTab === 'all' || activeTab === 'tools') && (
            <div className="glass-card p-6 rounded-2xl border border-white/[0.08] flex flex-col">
              <div className="flex items-center gap-2.5 mb-4 text-white font-heading font-bold text-base">
                <Terminal className="w-5 h-5 text-[#A5B4FC]" />
                <span>DevOps & Systems</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.toolsAndDevops.map((tool, idx) => (
                  <span
                    key={idx}
                    onMouseEnter={playHoverSound}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      tool.hot
                        ? 'badge-indigo font-semibold shadow-sm shadow-[#6366F1]/15'
                        : 'bg-slate-900/80 text-[#9CA3AF] border border-white/[0.08] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {tool.name}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Architectural Principles & Concepts Bar */}
        <div className="mt-8 p-6 rounded-2xl glass-panel border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9CA3AF] font-semibold mb-3">
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            <span>Architecture & Engineering Concepts</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {skills.coreConcepts.map((concept, idx) => (
              <div
                key={idx}
                onMouseEnter={playHoverSound}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/[0.08] text-xs text-[#9CA3AF] font-mono hover:border-[#6366F1]/40 hover:text-white transition-colors"
              >
                <Check className="w-3 h-3 text-[#10B981]" />
                <span>{concept}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
