import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const easeOutExpo = [0.16, 1, 0.3, 1];

export default function KineticName({ name = "Akshita Singhal" }) {
  const containerRef = useRef(null);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 280, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 280, damping: 20 });
  const sheenX = useMotionValue(50);
  const sheenY = useMotionValue(50);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    rotateX.set(-normY * 16);
    rotateY.set(normX * 16);

    sheenX.set((x / rect.width) * 100);
    sheenY.set((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className="inline-block cursor-pointer select-none mb-6 group py-2 min-h-[4rem] sm:min-h-[5rem] md:min-h-[6rem] relative"
    >
      {/* Subtle First-Load Radiant Ambient Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.45, 0.2], scale: [0.8, 1.1, 1] }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-to-r from-[#6366F1]/20 via-[#10B981]/25 to-[#6366F1]/20 blur-2xl -z-10 rounded-full pointer-events-none"
      />

      <motion.div
        style={{
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
        }}
        whileHover={{ scale: 1.025 }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
        className="relative"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-heading text-silver-gradient leading-[1.08] relative z-10 flex flex-wrap justify-center gap-x-3">
          {name.split(" ").map((word, wIdx) => (
            <span key={wIdx} className="inline-flex">
              {Array.from(word).map((char, cIdx) => (
                <motion.span
                  key={cIdx}
                  initial={{ opacity: 0, y: 35, rotateX: -60 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.85,
                    delay: 0.08 + (wIdx * 6 + cIdx) * 0.035,
                    ease: easeOutExpo,
                  }}
                  className="inline-block hover:text-[#10B981] transition-colors duration-200"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        {/* Ambient 3D Depth Shadow under the text */}
        <div
          className="absolute inset-0 text-4xl sm:text-6xl md:text-7xl font-extrabold font-heading text-black/50 blur-md pointer-events-none select-none -z-10 translate-y-3"
          aria-hidden="true"
        >
          {name}
        </div>
      </motion.div>
    </div>
  );
}
