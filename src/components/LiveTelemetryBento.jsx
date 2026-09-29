import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Code2, GitPullRequest, Award, Medal, Sparkles, Terminal, Activity, ArrowUpRight } from 'lucide-react';
import GlowTiltCard from './GlowTiltCard';
import { playHoverSound, playClickSound } from '../utils/audioFx';
import { portfolioData } from '../data/portfolioData';
import { fetchLeetCodeStats } from '../utils/telemetryApi';

// Animated Slot-Machine Counter
function RollingCounter({ target, suffix = "", duration = 1.6 }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const isFloat = target.toString().includes('.');
    const numericTarget = parseFloat(target);
    const start = 0;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (numericTarget - start) * ease;

      setCount(isFloat ? current.toFixed(2) : Math.floor(current));

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(update);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function LiveTelemetryBento({ onOpenPRDiff }) {
  const { stats } = portfolioData;
  const [leetStats, setLeetStats] = useState({ totalSolved: 450 });

  useEffect(() => {
    fetchLeetCodeStats().then((data) => {
      if (data && data.totalSolved) {
        setLeetStats(data);
      }
    });
  }, []);

  return (
    <section id="telemetry" className="py-8 sm:py-10 border-y border-white/[0.08] bg-transparent relative scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Telemetry Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#10B981]/10 text-[#34D399]">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Live Telemetry & Impact Metrics
              </span>
              <p className="text-[11px] font-mono text-[#9CA3AF]">Verified academic and engineering milestones</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono px-2.5 py-1 rounded-full badge-emerald">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
            <span>SYSTEM ACTIVE</span>
          </div>
        </div>

        {/* 5-Column Bento Grid with Staggered Dynamic Reveal */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
              }
            }
          }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4"
        >
          
          {/* 1. CGPA Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.94 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
            }}
          >
            <GlowTiltCard
              className="p-5 glass-card rounded-2xl flex flex-col justify-between h-full"
              onMouseEnter={playHoverSound}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-[#9CA3AF] uppercase tracking-wider">Academics</span>
                <GraduationCap className="w-4 h-4 text-[#34D399]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  <RollingCounter target="9.58" suffix=" / 10" />
                </div>
                <p className="text-[11px] font-mono text-[#34D399] mt-1">Banasthali Vidyapith</p>
              </div>
            </GlowTiltCard>
          </motion.div>

          {/* 2. DSA Solved Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.94 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
            }}
          >
            <GlowTiltCard
              className="p-5 glass-card rounded-2xl flex flex-col justify-between h-full"
              onMouseEnter={playHoverSound}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-[#9CA3AF] uppercase tracking-wider">DSA Curated</span>
                <Code2 className="w-4 h-4 text-[#A5B4FC]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  <RollingCounter target={leetStats.totalSolved} suffix="+" />
                </div>
                <p className="text-[11px] font-mono text-[#9CA3AF] mt-1">LeetCode & DSAverse</p>
              </div>
            </GlowTiltCard>
          </motion.div>

          {/* 3. Submitty Production PRs Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.94 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
            }}
          >
            <GlowTiltCard
              className="p-5 glass-card rounded-2xl flex flex-col justify-between h-full cursor-pointer group"
              onClick={() => {
                playClickSound();
                const el = document.getElementById('experience');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onMouseEnter={playHoverSound}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-[#9CA3AF] uppercase tracking-wider">Production PRs</span>
                <GitPullRequest className="w-4 h-4 text-[#34D399] group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  <RollingCounter target="2" suffix=" Merged" />
                </div>
                <p className="text-[11px] font-mono text-[#9CA3AF] mt-1 flex items-center justify-between">
                  <span>Submitty (RPI)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#34D399] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </p>
              </div>
            </GlowTiltCard>
          </motion.div>

          {/* 4. Google Big Code Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.94 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
            }}
          >
            <GlowTiltCard
              className="p-5 glass-card rounded-2xl flex flex-col justify-between h-full"
              onMouseEnter={playHoverSound}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-[#9CA3AF] uppercase tracking-wider">Google Code</span>
                <Award className="w-4 h-4 text-[#A5B4FC]" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold font-heading text-white mt-1">
                  Top 1,500
                </div>
                <p className="text-[11px] font-mono text-[#9CA3AF] mt-1">National Semi-Finalist</p>
              </div>
            </GlowTiltCard>
          </motion.div>

          {/* 5. Gold Medalist Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.94 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="col-span-2 lg:col-span-1"
          >
            <GlowTiltCard
              className="p-5 glass-card rounded-2xl flex flex-col justify-between h-full"
              onMouseEnter={playHoverSound}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-[#9CA3AF] uppercase tracking-wider">School Scholar</span>
                <Medal className="w-4 h-4 text-[#34D399]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  <RollingCounter target="7" suffix="x" />
                </div>
                <p className="text-[11px] font-mono text-[#9CA3AF] mt-1">DPS Academic Gold Medal</p>
              </div>
            </GlowTiltCard>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
