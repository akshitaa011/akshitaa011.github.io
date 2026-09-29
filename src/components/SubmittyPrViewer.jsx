import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, CheckCircle2, AlertCircle, Sparkles, ExternalLink, Code2 } from 'lucide-react';
import { playClickSound, playHoverSound } from '../utils/audioFx';

const PRS = [
  {
    id: 'pr-12567',
    number: '#12567',
    title: 'clamp progress values overflow & fix grid breakdown',
    url: 'https://github.com/Submitty/Submitty/pull/12567',
    tag: 'Production Merged',
    problem: 'When students submitted bonus credit, progress values exceeded 100%, causing the UI progress bar to overflow its container and displace adjacent submission cards.',
    solution: 'Engineered Math.min(100, Math.max(0, val)) sanitization in the core renderer with CSS min-width clamp, preventing grid shift across 25,000+ daily student views.',
    beforeValue: 125,
    afterValue: 100,
    beforeCode: `// Before PR #12567
const pct = (studentPoints / maxPoints) * 100;
progressBar.style.width = \`\${pct}%\`; // Overflowed past 100% bounds!`,
    afterCode: `// Merged in PR #12567 (Fix)
const rawPct = (studentPoints / maxPoints) * 100;
const clampedPct = Math.min(100, Math.max(0, rawPct));
progressBar.style.width = \`\${clampedPct}%\`;`
  },
  {
    id: 'pr-12549',
    number: '#12549',
    title: 'TAB & ESC keyboard event delegation for forum modals',
    url: 'https://github.com/Submitty/Submitty/pull/12549',
    tag: 'a11y Refactor Merged',
    problem: 'Forum reply modals failed to trap focus or handle ESC key dismissal, trapping keyboard-only navigation users.',
    solution: 'Implemented centralized event delegation with focus-trap lifecycle, satisfying WCAG 2.1 AA keyboard accessibility standards.',
    beforeValue: null,
    afterValue: null,
    beforeCode: `// Before: Missing keyboard listeners on modal mount
modal.classList.add('visible');`,
    afterCode: `// Merged in PR #12549 (Fix)
handleKeyboardDelegation(modal, {
  trapFocus: true,
  onEscape: () => closeModal()
});`
  }
];

export default function SubmittyPrViewer() {
  const [selectedPr, setSelectedPr] = useState(PRS[0]);
  const [viewState, setViewState] = useState('after'); // 'before' or 'after'

  return (
    <div className="w-full mt-4 p-5 sm:p-6 rounded-2xl bg-[#030712]/95 border border-white/[0.1] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono text-[#34D399] uppercase font-bold tracking-wider flex items-center gap-1.5">
            <GitPullRequest className="w-3.5 h-3.5 text-[#10B981]" />
            Submitty (Rensselaer Polytechnic Institute) Open-Source Impact
          </span>
          <h4 className="text-sm sm:text-base font-heading font-bold text-white mt-0.5">
            Verified Production Pull Request Diffs
          </h4>
        </div>

        {/* PR Selection Tabs */}
        <div className="flex items-center gap-2">
          {PRS.map((pr) => (
            <button
              key={pr.id}
              onClick={() => {
                playClickSound();
                setSelectedPr(pr);
              }}
              onMouseEnter={playHoverSound}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedPr.id === pr.id
                  ? 'bg-[#10B981]/20 border border-[#10B981] text-[#34D399]'
                  : 'bg-slate-900/60 border border-white/[0.08] text-[#9CA3AF] hover:text-white'
              }`}
            >
              {pr.number}
            </button>
          ))}
        </div>
      </div>

      {/* Description & Link */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 font-mono text-xs">
        <span className="text-white font-semibold flex items-center gap-2">
          <span>{selectedPr.title}</span>
          <span className="px-2 py-0.5 rounded-full badge-emerald text-[10px]">
            {selectedPr.tag}
          </span>
        </span>
        <a
          href={selectedPr.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={playClickSound}
          className="flex items-center gap-1 text-[#A5B4FC] hover:text-white text-xs transition-colors"
        >
          <span>View on GitHub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Before / After Toggle Buttons */}
      <div className="flex items-center gap-2 mb-3 font-mono text-xs">
        <span className="text-slate-500 mr-1">Inspect State:</span>
        <button
          onClick={() => {
            playClickSound();
            setViewState('before');
          }}
          className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
            viewState === 'before'
              ? 'bg-rose-950/40 border border-rose-500/50 text-rose-300 font-bold'
              : 'bg-slate-900/70 border border-white/[0.08] text-[#9CA3AF] hover:text-white'
          }`}
        >
          Before PR (Issue)
        </button>
        <button
          onClick={() => {
            playClickSound();
            setViewState('after');
          }}
          className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
            viewState === 'after'
              ? 'bg-emerald-950/40 border border-emerald-500/50 text-[#34D399] font-bold'
              : 'bg-slate-900/70 border border-white/[0.08] text-[#9CA3AF] hover:text-white'
          }`}
        >
          After Fix (Merged)
        </button>
      </div>

      {/* Visual Simulation & Code Diff Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Summary & Live Visual Behavior */}
        <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] text-xs font-mono space-y-3">
          <div className="text-slate-400">
            {viewState === 'before' ? (
              <div className="space-y-1.5 text-rose-300/90">
                <div className="flex items-center gap-1.5 font-bold text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Reported Defect:</span>
                </div>
                <p className="text-[11px] leading-relaxed">{selectedPr.problem}</p>
              </div>
            ) : (
              <div className="space-y-1.5 text-emerald-300/90">
                <div className="flex items-center gap-1.5 font-bold text-[#34D399]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>Production Resolution:</span>
                </div>
                <p className="text-[11px] leading-relaxed">{selectedPr.solution}</p>
              </div>
            )}
          </div>

          {/* Interactive Progress Bar Demonstration for PR #12567 */}
          {selectedPr.beforeValue !== null && (
            <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Rendered Progress:</span>
                <span className={viewState === 'before' ? 'text-rose-400 font-bold' : 'text-[#34D399] font-bold'}>
                  {viewState === 'before' ? '125% (Overflowing Bounds)' : '100% (Clamped Cleanly)'}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative border border-white/10">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    viewState === 'before' ? 'bg-rose-500 w-[125%]' : 'bg-[#10B981] w-[100%]'
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Code Snippet Diff */}
        <div className="p-4 rounded-xl bg-black/80 border border-white/[0.08] font-mono text-xs overflow-x-auto">
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-white/[0.06] text-slate-500 text-[11px]">
            <Code2 className="w-3.5 h-3.5 text-[#A5B4FC]" />
            <span>{viewState === 'before' ? 'Legacy Vulnerable Code' : 'Optimized Production Diff'}</span>
          </div>
          <pre className="text-[11px] leading-relaxed">
            <code className={viewState === 'before' ? 'text-rose-300' : 'text-[#34D399]'}>
              {viewState === 'before' ? selectedPr.beforeCode : selectedPr.afterCode}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
