import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, ChevronRight, ChevronLeft, Zap, ExternalLink, FileText, CheckCircle2, Sparkles, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { portfolioData } from '../data/portfolioData';

const tourSteps = [
  {
    step: 1,
    targetId: "about",
    title: "Executive Snapshot & Academic Excellence",
    subtitle: "B.Tech CSE @ Banasthali Vidyapith",
    highlights: [
      "CGPA: 9.58 / 10 — Banasthali Vidyapith",
      "Reliance Foundation Scholar (Academic & Leadership Fellowship)",
      "Google The Big Code 2026 National Semi-Finalist (Top 1,500)"
    ],
    metric: "9.58 CGPA",
    actionText: "View Academics"
  },
  {
    step: 2,
    targetId: "experience",
    title: "Production Engineering & Open Source",
    subtitle: "Strive Partners SDE Intern & Submitty (RPI)",
    highlights: [
      "Engineered Java Spring Boot RESTful APIs with PostgreSQL & Apache Kafka",
      "Authored 2 Merged Production Pull Requests into Submitty (RPI grading system)",
      "Fixed submission timer overflow bug (PR #12567) & refactored forum a11y (PR #12549)"
    ],
    metric: "2 Merged PRs",
    actionText: "Inspect PRs"
  },
  {
    step: 3,
    targetId: "projects",
    title: "Flagship Tooling & Systems Architecture",
    subtitle: "EnvGuard CLI, DSAverse & IntelliChat AI",
    highlights: [
      "EnvGuard: Published npm CLI performing Babel AST static analysis for environment variables",
      "DSAverse: MERN stack platform with 450+ curated challenges & AI code optimization",
      "IntelliChat AI: MVC multimodal conversational AI with vision and image generation"
    ],
    metric: "Published on npm",
    actionText: "Explore Projects"
  },
  {
    step: 4,
    targetId: "achievements",
    title: "Competitive Honors & Fellowships",
    subtitle: "National Hackathons & Industry Programs",
    highlights: [
      "Cisco Women in Technology Mentorship Program Mentee",
      "Hack With Rajasthan Top 10 Finalist (out of 250+ teams)",
      "Scholar for 7 Consecutive Years (Academic Gold Medalist at DPS)"
    ],
    metric: "Top 1,500",
    actionText: "View Honors"
  },
  {
    step: 5,
    targetId: "contact",
    title: "Interview Ready & Direct Contact",
    subtitle: "Immediate SDE Availability",
    highlights: [
      "Direct Email: akshitasinghal300@gmail.com",
      "Direct Phone: +91 8630370137",
      "Available for full-time SDE roles, summer internships, and high-impact teams"
    ],
    metric: "Available Now",
    actionText: "Schedule Interview"
  }
];

export default function CinematicTourModal({ isOpen, onClose }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentStep = tourSteps[currentStepIndex];

  // Auto-scroll to section on step change
  useEffect(() => {
    if (!isOpen) return;
    const targetElement = document.getElementById(currentStep.targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStepIndex, isOpen]);

  // Auto-advance timer when playing
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStepIndex < tourSteps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.7 }
        });
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [isOpen, isPlaying, currentStepIndex]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < tourSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-center sm:items-bottom p-4 sm:p-6">
      
      {/* Floating Cinematic Control HUD */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="pointer-events-auto w-full max-w-xl bg-[#030712]/95 border border-white/[0.12] rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-2xl p-5 sm:p-6 overflow-hidden relative"
      >
        {/* Glow Accent Edge */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#10B981] via-[#6366F1] to-[#10B981]" />

        {/* Progress Bar & Header */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg badge-indigo">
              <Zap className="w-4 h-4 text-[#A5B4FC]" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Cinematic Recruiter Tour
                <span className="text-[10px] px-2 py-0.5 rounded-full badge-indigo font-mono">
                  {currentStepIndex + 1} / {tourSteps.length}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-slate-900 border border-white/[0.08] text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
              title={isPlaying ? "Pause Tour" : "Resume Tour"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 border border-white/[0.08] text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
              title="Close Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Card with Transition */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                {currentStep.title}
              </h3>
              <p className="text-xs text-[#9CA3AF] font-mono">{currentStep.subtitle}</p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg badge-emerald shrink-0">
              {currentStep.metric}
            </span>
          </div>

          <ul className="space-y-1.5 text-xs text-[#9CA3AF]">
            {currentStep.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between gap-3 mt-5 pt-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded-lg bg-slate-900 border border-white/[0.08] hover:border-white/20 disabled:opacity-40 text-[#9CA3AF] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepIndex === tourSteps.length - 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-white/[0.08] hover:border-white/20 disabled:opacity-40 text-[#9CA3AF] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentStepIndex === tourSteps.length - 1 ? (
              <a
                href={`mailto:${portfolioData.personal.email}?subject=Interview%20Invitation`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs shadow-md shadow-[#10B981]/20"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Interview Invite</span>
              </a>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl badge-indigo hover:bg-[#6366F1]/20 text-xs font-mono cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
