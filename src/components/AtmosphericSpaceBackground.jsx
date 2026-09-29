import React, { useEffect, useRef } from 'react';

/**
 * Atmospheric Deep Space Background
 * Features:
 * - Ultra-deep Obsidian void (#030712)
 * - Soothing, slow-drifting cosmic aurora nebulae (Emerald & Indigo)
 * - Interactive cursor spotlight illuminating the space void
 * - Soft celestial stardust embers drifting upward with gentle twinkling
 * - Faint geometric cosmic grid with depth perspective
 * - Calm, fluid, premium 60fps canvas performance
 */
export default function AtmosphericSpaceBackground({ enabled = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates for interactive spotlight
    const mouse = {
      x: width * 0.5,
      y: height * 0.3,
      targetX: width * 0.5,
      targetY: height * 0.3,
      radius: 280,
    };

    const handlePointerMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Floating Celestial Stardust Embers (Calm, slow, soothing)
    const particleCount = Math.min(Math.floor((width * height) / 16000), 75);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(Math.random() * 0.45 + 0.15), // gently rising upward
      size: Math.random() * 1.8 + 0.6,
      baseAlpha: Math.random() * 0.45 + 0.2,
      twinkleSpeed: Math.random() * 0.025 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.45 
        ? { r: 99, g: 102, b: 241 }  // Indigo
        : { r: 52, g: 211, b: 153 }, // Emerald
    }));

    // Ambient Nebula Orbs that drift slowly in space
    const nebulae = [
      {
        baseX: 0.3,
        baseY: 0.25,
        radius: 450,
        color: 'rgba(99, 102, 241, 0.07)', // Indigo
        speed: 0.0006,
        phase: 0,
      },
      {
        baseX: 0.75,
        baseY: 0.65,
        radius: 400,
        color: 'rgba(16, 185, 129, 0.05)', // Emerald
        speed: 0.0008,
        phase: Math.PI,
      },
      {
        baseX: 0.5,
        baseY: 0.85,
        radius: 350,
        color: 'rgba(56, 189, 248, 0.04)', // Cyan / Sky
        speed: 0.0005,
        phase: Math.PI * 0.5,
      },
    ];

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // 1. Draw solid Obsidian base (#030712)
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // 2. Faint Top Linear Spotlight Gradient
      const topRadial = ctx.createRadialGradient(
        width * 0.5,
        0,
        0,
        width * 0.5,
        0,
        height * 0.75
      );
      topRadial.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
      topRadial.addColorStop(0.5, 'rgba(16, 185, 129, 0.03)');
      topRadial.addColorStop(1, 'transparent');
      ctx.fillStyle = topRadial;
      ctx.fillRect(0, 0, width, height);

      // 3. Render Slow-Drifting Cosmic Nebulae
      nebulae.forEach((neb) => {
        const nx = width * neb.baseX + Math.sin(time * neb.speed + neb.phase) * 80;
        const ny = height * neb.baseY + Math.cos(time * neb.speed + neb.phase) * 60;

        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, neb.radius);
        grad.addColorStop(0, neb.color);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });

      // 4. Interactive Mouse Aura Spotlight
      if (mouse.x > 0 && mouse.y > 0) {
        const mouseGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius
        );
        mouseGrad.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
        mouseGrad.addColorStop(0.4, 'rgba(16, 185, 129, 0.03)');
        mouseGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = mouseGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 5. Draw Faint Cosmic Grid Lines (Revealed softly around cursor and center)
      const gridSize = 64;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.018)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      // Vertical grid lines
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      // Horizontal grid lines
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 6. Draw Subtle Celestial Particles (Rising Embers)
      particles.forEach((p) => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Mouse slight repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 1.2;
          p.y += (dy / dist) * force * 1.2;
        }

        // Wrap around screen edges
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Twinkle calculation
        p.twinklePhase += p.twinkleSpeed;
        const alpha = p.baseAlpha * (0.7 + 0.3 * Math.sin(p.twinklePhase));

        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle soft glow around larger particles
        if (p.size > 1.4) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha * 0.22})`;
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#030712]"
      style={{ willChange: 'transform' }}
    />
  );
}
