import React, { useEffect, useRef } from 'react';

/**
 * Dynamic 3D Deep Space Cosmos Background
 * Features:
 * - 3D Starfield with z-depth projection
 * - Warp-Speed / Hyperdrive acceleration on scroll (stars streak forward into light beams)
 * - Calming idle stardust drift with subtle twinkling
 * - Cosmic meteors / shooting stars with glowing gradient trails
 * - Deep obsidian void (#010309) with ambient nebula stardust clouds
 * - Interactive 3D camera parallax responding to mouse movements
 */
export default function SpaceCosmosBackground({ enabled = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Starfield parameters
    const STAR_COUNT = Math.min(Math.floor((width * height) / 3200), 450);
    const FOV = 280;
    const MAX_DEPTH = 1600;

    // Mouse parallax
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const handlePointerMove = (e) => {
      // Normalized coordinates from -1 to 1
      mouse.targetX = (e.clientX / width - 0.5) * 2;
      mouse.targetY = (e.clientY / height - 0.5) * 2;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Scroll velocity tracking for Hyperdrive / Warp effect
    let scrollSpeed = 0;
    let targetScrollSpeed = 0;
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();

    const handleScroll = () => {
      const now = performance.now();
      const dt = Math.max(now - lastScrollTime, 16);
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      lastScrollTime = now;

      // Calculate instantaneous scroll velocity
      const velocity = Math.abs(dy) / dt;
      targetScrollSpeed = Math.min(velocity * 45, 80); // clamp warp boost
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Color palettes for stars: Pure Diamond White, Electric Mint/Emerald, Neon Indigo
    const starColors = [
      { r: 255, g: 255, b: 255 }, // 70% pure white
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 243, g: 244, b: 246 },
      { r: 52, g: 211, b: 153 },  // Emerald
      { r: 165, g: 180, b: 252 }, // Indigo
      { r: 99, g: 102, b: 241 },  // Deep Indigo
    ];

    // Initialize 3D Stars
    const stars = Array.from({ length: STAR_COUNT }, () => {
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      return {
        x: (Math.random() - 0.5) * width * 3.5,
        y: (Math.random() - 0.5) * height * 3.5,
        z: Math.random() * MAX_DEPTH + 1,
        pz: 0, // previous z for streak rendering
        color,
        baseSize: Math.random() * 1.4 + 0.6,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.015,
      };
    });

    // Shooting Stars / Meteors
    const meteors = [];
    let lastMeteorSpawn = 0;

    const spawnMeteor = () => {
      const startX = Math.random() * width * 0.8;
      const startY = Math.random() * (height * 0.4);
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.35; // ~45 degrees diagonal
      const speed = Math.random() * 16 + 22;
      const length = Math.random() * 120 + 80;

      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length,
        life: 1.0,
        decay: Math.random() * 0.018 + 0.012,
        color: Math.random() > 0.4 ? 'rgba(52, 211, 153,' : 'rgba(165, 180, 252,',
      });
    };

    let clock = 0;

    // Main 60fps render loop
    const render = (time) => {
      clock += 0.016;

      // Smooth mouse parallax damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Smooth scroll velocity decay
      scrollSpeed += (targetScrollSpeed - scrollSpeed) * 0.12;
      targetScrollSpeed *= 0.88; // decay to idle

      // Base idle drift speed + warp acceleration
      const currentSpeed = 0.85 + scrollSpeed;

      // 1. Deep space background fill with subtle trail persistence during high warp
      if (scrollSpeed > 8) {
        ctx.fillStyle = 'rgba(2, 4, 10, 0.45)';
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#02040a';
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Ambient Nebula Cosmic Clouds
      const cx = width / 2;
      const cy = height / 2;

      // Top Indigo Nebula
      const topNebula = ctx.createRadialGradient(
        cx + mouse.x * 40,
        cy * 0.3 + mouse.y * 30,
        50,
        cx,
        cy * 0.3,
        width * 0.6
      );
      topNebula.addColorStop(0, 'rgba(99, 102, 241, 0.07)');
      topNebula.addColorStop(0.5, 'rgba(99, 102, 241, 0.025)');
      topNebula.addColorStop(1, 'transparent');
      ctx.fillStyle = topNebula;
      ctx.fillRect(0, 0, width, height);

      // Bottom-Right Emerald Nebula
      const bottomNebula = ctx.createRadialGradient(
        cx * 1.3 - mouse.x * 50,
        cy * 1.5 - mouse.y * 40,
        60,
        cx * 1.3,
        cy * 1.5,
        width * 0.55
      );
      bottomNebula.addColorStop(0, 'rgba(16, 185, 129, 0.05)');
      bottomNebula.addColorStop(0.6, 'rgba(16, 185, 129, 0.015)');
      bottomNebula.addColorStop(1, 'transparent');
      ctx.fillStyle = bottomNebula;
      ctx.fillRect(0, 0, width, height);

      // 3. Render 3D Starfield
      const halfW = width / 2;
      const halfH = height / 2;
      const isWarping = scrollSpeed > 2.5;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        star.pz = star.z;
        star.z -= currentSpeed;

        // Reset if star passes camera
        if (star.z <= 0) {
          star.z = MAX_DEPTH;
          star.pz = MAX_DEPTH;
          star.x = (Math.random() - 0.5) * width * 3.5;
          star.y = (Math.random() - 0.5) * height * 3.5;
        }

        // Apply mouse tilt
        const shiftedX = star.x - mouse.x * 70;
        const shiftedY = star.y - mouse.y * 70;

        // 3D Perspective Projection
        const k = FOV / star.z;
        const px = shiftedX * k + halfW;
        const py = shiftedY * k + halfH;

        // Check if within screen
        if (px < -10 || px > width + 10 || py < -10 || py > height + 10) {
          continue;
        }

        // Depth-based intensity & twinkle
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = 0.75 + Math.sin(star.twinklePhase) * 0.25;
        const depthAlpha = Math.max(0, 1 - star.z / MAX_DEPTH);
        const alpha = Math.min(1, depthAlpha * twinkle * (isWarping ? 1.4 : 1.0));
        const size = Math.max(0.6, (1 - star.z / MAX_DEPTH) * star.baseSize * (isWarping ? 1.2 : 1.0));

        // When in warp mode, draw hyperdrive streaks
        if (isWarping && star.pz > 0) {
          const prevK = FOV / star.pz;
          const prevX = shiftedX * prevK + halfW;
          const prevY = shiftedY * prevK + halfH;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${alpha})`;
          ctx.lineWidth = size * 1.2;
          ctx.lineCap = 'round';
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(px, py);
          ctx.stroke();
        } else {
          // Normal round star with delicate glow
          ctx.beginPath();
          ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${alpha})`;
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();

          // Subtle corona glow for close/bright stars
          if (size > 1.3 && alpha > 0.6) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${alpha * 0.25})`;
            ctx.arc(px, py, size * 2.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 4. Random Meteors / Shooting Stars
      if (time - lastMeteorSpawn > (isWarping ? 1800 : 4200) && Math.random() < 0.65) {
        spawnMeteor();
        lastMeteorSpawn = time;
      }

      for (let m = meteors.length - 1; m >= 0; m--) {
        const meteor = meteors[m];
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.life -= meteor.decay;

        if (meteor.life <= 0 || meteor.x > width + 100 || meteor.y > height + 100) {
          meteors.splice(m, 1);
          continue;
        }

        const tailX = meteor.x - (meteor.vx / Math.hypot(meteor.vx, meteor.vy)) * meteor.length;
        const tailY = meteor.y - (meteor.vy / Math.hypot(meteor.vx, meteor.vy)) * meteor.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.7, `${meteor.color} ${meteor.life * 0.4})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${meteor.life})`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(meteor.x, meteor.y);
        ctx.stroke();

        // Glowing starburst head
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${meteor.life})`;
        ctx.arc(meteor.x, meteor.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#02040a]"
      style={{ willChange: 'transform' }}
    />
  );
}
