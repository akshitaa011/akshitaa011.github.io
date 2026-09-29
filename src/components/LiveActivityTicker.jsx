import React, { useState, useEffect } from 'react';
import { Terminal, Activity, GitCommit, CheckCircle2 } from 'lucide-react';
import { fetchGitHubActivities, STATIC_GITHUB_ACTIVITIES } from '../utils/telemetryApi';

export default function LiveActivityTicker() {
  const [activitiesList, setActivitiesList] = useState(STATIC_GITHUB_ACTIVITIES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    fetchGitHubActivities().then((data) => {
      if (data && data.length > 0) {
        setActivitiesList(data);
      }
    });
  }, []);

  useEffect(() => {
    const currentActivity = activitiesList[currentIndex] || activitiesList[0];
    if (!currentActivity) return;
    const fullText = `${currentActivity.prefix} "${currentActivity.text}"`;

    let timer;
    if (!isDeleting && charIndex <= fullText.length) {
      timer = setTimeout(() => {
        setDisplayText(fullText.substring(0, charIndex));
        setCharIndex((prev) => prev + 1);
      }, 35);
    } else if (!isDeleting && charIndex > fullText.length) {
      // Pause before deleting
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2400);
    } else if (isDeleting && charIndex > 0) {
      timer = setTimeout(() => {
        setDisplayText(fullText.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 18);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % (activitiesList.length || 1));
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentIndex, activitiesList]);

  const activeItem = activitiesList[currentIndex] || activitiesList[0] || { prefix: "git commit", text: "", tag: "Live" };
  const currentTag = activeItem.tag;
  const currentFullText = `${activeItem.prefix} "${activeItem.text}"`;

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 px-4">
      <div 
        tabIndex={0}
        role="region"
        aria-label={`Live commit and activity ticker: ${currentFullText}`}
        title={currentFullText}
        className="group relative flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-[rgba(17,24,39,0.60)] border border-white/[0.08] hover:border-white/20 focus:border-[#10B981]/50 focus:outline-none backdrop-blur-md shadow-lg shadow-black/40 text-xs font-mono transition-colors"
      >
        <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0">
          {/* Live pulsing dot */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
            <span className="text-[10px] uppercase font-bold text-[#34D399] tracking-wider hidden sm:inline">LIVE</span>
          </div>

          <span className="text-slate-700 shrink-0">|</span>

          {/* Typing Terminal Stream */}
          <div className="flex items-center gap-1.5 text-[#9CA3AF] truncate flex-1 min-w-0">
            <Terminal className="w-3.5 h-3.5 text-[#A5B4FC] shrink-0" />
            <span className="truncate text-slate-300 font-mono text-[11px] sm:text-xs">
              {displayText}
              <span className="animate-pulse text-[#10B981] font-bold">_</span>
            </span>
          </div>
        </div>

        {/* Source Badge */}
        <span className="text-[10px] shrink-0 px-2 py-0.5 rounded-full badge-indigo hidden md:inline">
          {currentTag}
        </span>

        {/* Floating expanded full-text tooltip on hover/focus for small desktop viewports */}
        <div className="pointer-events-none absolute left-0 -top-9 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-30 bg-[#090d16] text-[#A5B4FC] border border-white/10 px-3 py-1 rounded-md text-[11px] font-mono shadow-xl whitespace-nowrap max-w-lg truncate hidden sm:block">
          {currentFullText}
        </div>
      </div>
    </div>
  );
}
