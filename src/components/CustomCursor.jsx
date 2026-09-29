import React, { useEffect, useState, useRef } from 'react';

/**
 * Custom Cursor Component (Desktop Only)
 * - Small emerald dot with trailing smooth spring ring
 * - Expands on hover over interactive elements (buttons, links, clickable cards)
 * - Hides inside text inputs/textareas to allow native text selection
 * - Completely disabled on touch devices and for prefers-reduced-motion
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInput, setIsInput] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Disable on touch devices or if prefers-reduced-motion
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      return;
    }

    setEnabled(true);

    let animId;

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering over clickable or input elements
      const target = e.target;
      const isInteractive = target.closest('a, button, [role="button"], .cursor-pointer, input, textarea');
      const isTextInput = target.closest('input, textarea, [contenteditable="true"]');

      setIsHovered(!!isInteractive && !isTextInput);
      setIsInput(!!isTextInput);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth trailing ring lerp loop
    const render = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!enabled || isInput) return null;

  return (
    <div className={`pointer-events-none fixed inset-0 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Trailing Smooth Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-4 -mt-4 rounded-full border border-[#10B981]/50 pointer-events-none transition-[width,height,background-color] duration-200 ${
          isHovered
            ? 'w-10 h-10 -ml-5 -mt-5 bg-[#10B981]/15 border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            : 'w-8 h-8 bg-transparent'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* Center Precise Emerald Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full pointer-events-none transition-transform duration-100 ${
          isHovered ? 'bg-[#34D399] scale-125' : 'bg-[#10B981]'
        }`}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}
