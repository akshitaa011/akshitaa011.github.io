import React, { useEffect, useState } from 'react';

/**
 * Ultra-sleek dynamic scroll progress indicator
 * Displays a luminous gradient energy line fixed at the top of the viewport
 */
export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = Math.min(100, Math.max(0, (scrollY / (docHeight || 1)) * 100));
      setProgress(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#10B981] via-[#6366F1] to-[#34D399] transition-all duration-75 relative shadow-[0_0_10px_rgba(16,185,129,0.7)]"
        style={{ width: `${progress}%` }}
      >
        {/* Leading edge glow pulse */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#10B981]" />
      </div>
    </div>
  );
}
