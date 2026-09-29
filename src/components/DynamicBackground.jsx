import React, { useEffect, useRef } from 'react';

/**
 * Ultra-clean, high-performance Black Dynamic Background
 * - Pitch Obsidian base (#05070a)
 * - 48px dynamic grid revealed subtly around cursor with smooth lerp
 * - Constellation particle network: 65-75 nodes on desktop, 28-32 on mobile
 * - Connecting lines when distance < 120px (emerald/indigo)
 * - Scroll-reactive upward parallax drift
 * - Pauses when tab is inactive (document.hidden)
 * - Full static fallback for prefers-reduced-motion
 */
export default function DynamicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let isVisible = !document.hidden;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (prefersReducedMotion) {
        drawStaticBackground();
      }
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates with smooth lerping
    const mouse = {
      x: width * 0.5,
      y: height * 0.3,
      targetX: width * 0.5,
      targetY: height * 0.3,
      radius: 260,
    };

    const handlePointerMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Scroll parallax tracker
    let lastScrollY = window.scrollY;
    let scrollDeltaY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollDeltaY = (currentScrollY - lastScrollY) * 0.18;
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Static fallback renderer for reduced-motion
    const drawStaticBackground = () => {
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, width, height);

      // Faint 48px grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 48) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += 48) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Top soft vignette
      const topGrad = ctx.createRadialGradient(width * 0.5, 0, 0, width * 0.5, 0, height * 0.7);
      topGrad.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
      topGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.02)');
      topGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, height);
    };

    if (prefersReducedMotion) {
      drawStaticBackground();
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('scroll', handleScroll);
      };
    }

    // Dynamic particles constellation
    const isMobile = width < 768;
    const particleCount = isMobile ? 30 : 70;

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45 - 0.1, // gentle upward baseline drift
      size: Math.random() * 1.2 + 0.8,
      baseAlpha: Math.random() * 0.35 + 0.25,
      isIndigo: Math.random() > 0.75,
    }));

    // Animation Loop
    const render = () => {
      if (!isVisible) return;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Decay scroll delta
      scrollDeltaY *= 0.9;

      ctx.clearRect(0, 0, width, height);

      // 1. Solid Pitch Obsidian Base
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, width, height);

      // 2. Base 48px Grid (faint opacity ~0.035)
      const gridSize = 48;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 3. Dynamic Cursor Spotlight illuminating grid & subtle emerald ambiance
      if (mouse.x > 0 && mouse.y > 0) {
        const spot = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius);
        spot.addColorStop(0, 'rgba(16, 185, 129, 0.09)');
        spot.addColorStop(0.45, 'rgba(99, 102, 241, 0.04)');
        spot.addColorStop(1, 'transparent');
        ctx.fillStyle = spot;
        ctx.fillRect(0, 0, width, height);

        // Highlight grid lines under spotlight
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius * 0.85, 0, Math.PI * 2);
        ctx.clip();
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        const startX = Math.floor((mouse.x - mouse.radius) / gridSize) * gridSize;
        const endX = Math.ceil((mouse.x + mouse.radius) / gridSize) * gridSize;
        for (let x = startX; x <= endX; x += gridSize) {
          ctx.moveTo(x, mouse.y - mouse.radius);
          ctx.lineTo(x, mouse.y + mouse.radius);
        }
        const startY = Math.floor((mouse.y - mouse.radius) / gridSize) * gridSize;
        const endY = Math.ceil((mouse.y + mouse.radius) / gridSize) * gridSize;
        for (let y = startY; y <= endY; y += gridSize) {
          ctx.moveTo(mouse.x - mouse.radius, y);
          ctx.lineTo(mouse.x + mouse.radius, y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // 4. Update and Draw Constellation Particles
      const maxDistance = 120;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle with scroll parallax offset
        p.x += p.vx;
        p.y += p.vy - scrollDeltaY;

        // Gentle cursor interaction (subtle repulsion)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 140 && distToMouse > 0) {
          const force = (140 - distToMouse) / 140;
          p.x += (dx / distToMouse) * force * 0.7;
          p.y += (dy / distToMouse) * force * 0.7;
        }

        // Screen wrap
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw particle dot
        ctx.beginPath();
        const color = p.isIndigo ? '165, 180, 252' : '52, 211, 153';
        ctx.fillStyle = `rgba(${color}, ${p.baseAlpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // 5. Connect nearby particles (< 120px) with very faint lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distDx = p.x - p2.x;
          const distDy = p.y - p2.y;
          const dist = Math.sqrt(distDx * distDx + distDy * distDy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.14;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16, 185, 129, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    // Tab visibility handling (pause on hidden)
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        animId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animId);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#05070a]"
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    />
  );
}
