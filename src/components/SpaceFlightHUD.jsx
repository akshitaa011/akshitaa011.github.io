import React, { useState, useEffect } from 'react';
import { Compass, Navigation, Radio, Sparkles } from 'lucide-react';
import { playClickSound, playHoverSound } from '../utils/audioFx';

const sectors = [
  { id: 'about', name: 'ORBIT', label: 'Sector 01' },
  { id: 'telemetry', name: 'TELEMETRY', label: 'Sector 02' },
  { id: 'experience', name: 'EXPEDITION', label: 'Sector 03' },
  { id: 'lab', name: 'FLIGHT LAB', label: 'Sector 04' },
  { id: 'projects', name: 'SYSTEMS', label: 'Sector 05' },
  { id: 'skills', name: 'ARSENAL', label: 'Sector 06' },
  { id: 'achievements', name: 'HONORS', label: 'Sector 07' },
  { id: 'contact', name: 'COMM-LINK', label: 'Sector 08' },
];

export default function SpaceFlightHUD() {
  const [activeSector, setActiveSector] = useState('about');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isWarping, setIsWarping] = useState(false);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(100, Math.max(0, Math.round((scrollY / (docHeight || 1)) * 100)));
      setScrollProgress(progress);

      setIsWarping(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsWarping(false), 220);

      // Determine active section by vertical position
      const scrollMiddle = scrollY + window.innerHeight * 0.35;
      for (let i = sectors.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectors[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollMiddle >= top) {
            setActiveSector(sectors[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const scrollToSector = (id) => {
    playClickSound();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const lightyears = Math.round(scrollProgress * 28.5);

  return (
    <aside 
      className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col items-start gap-4 select-none pointer-events-auto"
      aria-label="Deep Space Navigation HUD"
    >
      {/* Top HUD Telemetry Indicator */}
      <div className="p-2.5 rounded-xl bg-[#030712]/80 border border-white/[0.08] backdrop-blur-md shadow-xl flex items-center gap-2 text-[10px] font-mono text-[#9CA3AF]">
        <span className={`w-2 h-2 rounded-full ${isWarping ? 'bg-[#10B981] animate-ping' : 'bg-[#6366F1]'}`} />
        <span className="text-white font-semibold">{isWarping ? 'WARP SPEED' : 'CRUISE'}</span>
        <span className="text-slate-600">|</span>
        <span className="text-[#34D399] font-bold">{lightyears} LY</span>
      </div>

      {/* Vertical Cosmic Warp Timeline Beam */}
      <div className="relative pl-3 flex flex-col gap-3">
        {/* Glow Line Track */}
        <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-white/[0.08] rounded-full overflow-hidden">
          <div 
            className="w-full bg-gradient-to-b from-[#10B981] via-[#6366F1] to-[#34D399] transition-all duration-150"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>

        {/* Sector Waypoint Beacons */}
        {sectors.map((sec) => {
          const isActive = activeSector === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSector(sec.id)}
              onMouseEnter={playHoverSound}
              className="group flex items-center gap-3 text-left cursor-pointer relative z-10"
            >
              {/* Beacon Dot */}
              <div 
                className={`w-3.5 h-3.5 rounded-full border transition-all flex items-center justify-center ${
                  isActive
                    ? 'bg-[#10B981] border-[#34D399] shadow-[0_0_12px_rgba(16,185,129,0.8)] scale-125'
                    : 'bg-[#030712] border-white/20 group-hover:border-[#6366F1] group-hover:scale-110'
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
              </div>

              {/* Waypoint Label Popover on Hover / Active */}
              <div 
                className={`transition-all duration-200 font-mono text-[10px] px-2 py-0.5 rounded-md ${
                  isActive
                    ? 'bg-[#6366F1]/20 text-white font-bold border border-[#6366F1]/50 translate-x-0'
                    : 'text-slate-500 group-hover:text-slate-200 group-hover:translate-x-1'
                }`}
              >
                <span className="opacity-60 text-[9px] mr-1.5">{sec.label}</span>
                <span>{sec.name}</span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
