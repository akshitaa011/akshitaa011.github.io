import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Zap, Play, Volume2, VolumeX, Pause, Sparkles } from 'lucide-react';
import { playClickSound, playHoverSound } from '../utils/audioFx';

export default function FloatingDock({
  onOpenTerminal,
  onOpenRecruiter,
  isTourActive,
  onToggleTour,
  soundMuted = true,
  onToggleSound
}) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      const currentScrollY = window.scrollY;

      // Always stay visible during active tour or near top
      if (isTourActive || currentScrollY < 120) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Auto-hide when scrolling down, reappear when scrolling up
      if (currentScrollY > lastScrollY.current + 8) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 12) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isTourActive]);

  return (
    <div
      onMouseEnter={() => setIsVisible(true)}
      className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 sm:gap-2 bg-[rgba(17,24,39,0.85)] border border-white/[0.1] p-1.5 sm:p-2 rounded-2xl shadow-2xl backdrop-blur-2xl max-w-[96vw] transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      
      {/* 1. Mute / Sound Toggle */}
      <button
        onClick={() => {
          onToggleSound();
        }}
        onMouseEnter={playHoverSound}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
          !soundMuted
            ? 'bg-[#10B981]/15 border border-[#10B981]/40 text-[#34D399] shadow-[0_0_12px_rgba(16,185,129,0.2)]'
            : 'bg-slate-900/60 hover:bg-slate-800 border border-white/[0.05] text-[#9CA3AF] hover:text-white'
        }`}
        title={soundMuted ? "Click to unmute UI audio" : "Mute UI audio"}
      >
        {!soundMuted ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
            <span className="hidden md:inline">Sound: ON</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="hidden md:inline">Muted</span>
          </>
        )}
      </button>

      {/* 2. Inbuilt Cinematic Tour Trigger */}
      <button
        onClick={() => {
          playClickSound();
          onToggleTour();
        }}
        onMouseEnter={playHoverSound}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-sm ${
          isTourActive
            ? 'bg-[#10B981]/25 text-[#34D399] border border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            : 'bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/40 text-[#34D399]'
        }`}
        title="Toggle Inbuilt Cinematic Tour"
      >
        {isTourActive ? (
          <>
            <Pause className="w-3.5 h-3.5 fill-[#34D399] text-[#34D399] shrink-0" />
            <span className="hidden sm:inline">Tour: Active</span>
            <span className="sm:hidden text-[11px]">Tour</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-[#34D399] text-[#34D399] shrink-0" />
            <span className="hidden sm:inline">Cinematic Tour</span>
            <span className="sm:hidden text-[11px]">Tour</span>
          </>
        )}
      </button>

      {/* 3. Recruiter Mode Trigger */}
      <button
        onClick={() => {
          playClickSound();
          onOpenRecruiter();
        }}
        onMouseEnter={playHoverSound}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#6366F1]/15 hover:bg-[#6366F1]/25 border border-[#6366F1]/40 text-[#A5B4FC] text-xs font-semibold cursor-pointer transition-all shadow-sm"
        title="Open 30s Recruiter Executive Brief"
      >
        <Zap className="w-3.5 h-3.5 fill-[#6366F1] text-[#A5B4FC] shrink-0" />
        <span className="hidden sm:inline">Recruiter Mode</span>
        <span className="sm:hidden text-[11px]">Brief</span>
      </button>

      {/* 4. Terminal Launcher */}
      <button
        onClick={() => {
          playClickSound();
          onOpenTerminal();
        }}
        onMouseEnter={playHoverSound}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white hover:text-[#A5B4FC] border border-white/[0.08] text-xs font-mono cursor-pointer transition-all"
        title="Open Terminal (⌘K)"
      >
        <Terminal className="w-3.5 h-3.5 text-[#A5B4FC] shrink-0" />
        <span className="hidden sm:inline">Terminal</span>
        <kbd className="text-[10px] bg-slate-950 px-1 py-0.5 rounded text-[#9CA3AF] border border-white/[0.08] hidden md:inline">⌘K</kbd>
      </button>

    </div>
  );
}
