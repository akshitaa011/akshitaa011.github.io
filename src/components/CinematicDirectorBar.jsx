import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronRight, ChevronLeft, Zap, Sparkles, X, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playHoverSound, playSuccessSound } from '../utils/audioFx';

const chapters = [
  { id: "about", title: "Act 1: Executive Profile", metric: "9.58 CGPA", detail: "B.Tech CSE '28 • Reliance Scholar" },
  { id: "telemetry", title: "Act 2: Live Telemetry", metric: "450+ Solved", detail: "Real-time Telemetry & Slot Counters" },
  { id: "experience", title: "Act 3: Production Impact", metric: "2 Merged PRs", detail: "Git Branch Tree & Submitty (RPI)" },
  { id: "projects", title: "Act 4: Flagship AST Tooling", metric: "npm Published", detail: "EnvGuard AST & MERN Architecture" },
  { id: "skills", title: "Act 5: Tactile Tech Matrix", metric: "Full Stack", detail: "Interactive Physics Skills Orbit" },
  { id: "achievements", title: "Act 6: Competitive Honors", metric: "Top 1,500", detail: "Google Big Code & 7x DPS Scholar" },
  { id: "contact", title: "Act 7: Interview Ready", metric: "Immediate", detail: "Direct Dispatch & Fast Response" }
];

export default function CinematicDirectorBar({ isTourActive, onToggleTour }) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentChapter = chapters[currentChapterIndex];

  // Auto-scroll to section on chapter change
  useEffect(() => {
    if (!isTourActive) return;
    const targetElement = document.getElementById(currentChapter.id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentChapterIndex, isTourActive]);

  // Hands-free auto-advance timer when playing
  useEffect(() => {
    if (!isTourActive || !isPlaying) return;

    const timer = setTimeout(() => {
      if (currentChapterIndex < chapters.length - 1) {
        setCurrentChapterIndex((prev) => prev + 1);
        playHoverSound();
      } else {
        setIsPlaying(false);
        playSuccessSound();
        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.7 }
        });
      }
    }, 5500);

    return () => clearTimeout(timer);
  }, [isTourActive, isPlaying, currentChapterIndex]);

  if (!isTourActive) return null;

  const handleNext = () => {
    playClickSound();
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
    } else {
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
    }
  };

  const handlePrev = () => {
    playClickSound();
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1);
    }
  };

  const handleJumpToChapter = (idx) => {
    playClickSound();
    setCurrentChapterIndex(idx);
  };

  return (
    <div className="fixed top-20 inset-x-0 z-50 pointer-events-none flex justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -25, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="pointer-events-auto bg-[#030712]/95 border border-white/[0.12] rounded-2xl shadow-2xl shadow-black/90 backdrop-blur-2xl p-3.5 sm:p-4 max-w-2xl w-full flex flex-col gap-2.5"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Chapter Indicator */}
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg badge-emerald">
              <Zap className="w-4 h-4 text-[#10B981] fill-[#10B981]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  {currentChapter.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full badge-indigo">
                  {currentChapter.metric}
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#9CA3AF]">{currentChapter.detail}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playClickSound();
                setIsPlaying(!isPlaying);
              }}
              className="p-2 rounded-xl bg-slate-900 border border-white/[0.08] hover:border-white/20 text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
              title={isPlaying ? "Pause Inbuilt Tour" : "Resume Inbuilt Tour"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handlePrev}
              disabled={currentChapterIndex === 0}
              className="p-2 rounded-xl bg-slate-900 border border-white/[0.08] hover:border-white/20 disabled:opacity-40 text-[#9CA3AF] cursor-pointer"
              title="Previous Act"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentChapterIndex === chapters.length - 1}
              className="p-2 rounded-xl bg-slate-900 border border-white/[0.08] hover:border-white/20 disabled:opacity-40 text-[#9CA3AF] cursor-pointer"
              title="Next Act"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                playClickSound();
                onToggleTour();
              }}
              className="p-2 rounded-xl bg-slate-900 border border-white/[0.08] hover:bg-rose-950/80 text-[#9CA3AF] hover:text-rose-300 transition-colors cursor-pointer ml-1"
              title="Exit Cinematic Tour Mode"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Chapter Breadcrumbs Bar */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-white/[0.08] overflow-x-auto select-none">
          {chapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => handleJumpToChapter(idx)}
              onMouseEnter={playHoverSound}
              className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer ${
                idx === currentChapterIndex
                  ? 'bg-gradient-to-r from-[#10B981] to-[#6366F1] shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                  : idx < currentChapterIndex
                  ? 'bg-[#10B981]/50'
                  : 'bg-white/[0.08]'
              }`}
              title={ch.title}
            />
          ))}
        </div>

      </motion.div>
    </div>
  );
}
