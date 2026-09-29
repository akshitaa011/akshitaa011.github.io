import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveTelemetryBento from './components/LiveTelemetryBento';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Achievements from './components/Achievements';
import Leadership from './components/Leadership';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingDock from './components/FloatingDock';
import TerminalModal from './components/TerminalModal';
import RecruiterDrawer from './components/RecruiterDrawer';
import DynamicBackground from './components/DynamicBackground';
import ScrollProgressBar from './components/ScrollProgressBar';
import ScrollReveal from './components/ScrollReveal';
import CustomCursor from './components/CustomCursor';
import { setSoundMuted, isSoundMuted, playClickSound, playHoverSound, playSuccessSound } from './utils/audioFx';
import confetti from 'canvas-confetti';

const tourSections = ["about", "telemetry", "experience", "projects", "skills", "honors", "contact"];

export default function App() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isRecruiterOpen, setIsRecruiterOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(isSoundMuted());
  const [currentTourIndex, setCurrentTourIndex] = useState(0);

  // Guarantee clean document scrollability on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, []);

  // Global hotkeys (Cmd+K / Ctrl+K for CLI, ESC for close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        playClickSound();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth scroll to initial URL hash on direct load & check ?mode=recruiter param
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'recruiter') {
        setIsRecruiterOpen(true);
        const cleanUrl = window.location.pathname + (window.location.hash || '');
        window.history.replaceState(null, '', cleanUrl || '/');
      }

      if (window.location.hash) {
        let currentHash = window.location.hash;
        if (currentHash === '#achievements') {
          currentHash = '#honors';
          window.history.replaceState(null, '', '#honors');
        }
        const targetId = currentHash.replace('#', '');
        const timer = setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Scroll-spy: update URL hash via replaceState as user scrolls through sections
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sectionIds = ["about", "telemetry", "experience", "projects", "skills", "honors", "contact"];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            const id = entry.target.id;
            if (id && window.location.hash !== `#${id}`) {
              window.history.replaceState(null, '', `#${id}`);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-10% 0px -40% 0px',
        threshold: [0.25]
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Cinematic Tour auto-scroll handler
  useEffect(() => {
    if (!isTourActive) return;

    const targetId = tourSections[currentTourIndex];
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const timer = setTimeout(() => {
      if (currentTourIndex < tourSections.length - 1) {
        setCurrentTourIndex((prev) => prev + 1);
        playHoverSound();
      } else {
        setIsTourActive(false);
        setCurrentTourIndex(0);
        playSuccessSound();
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [isTourActive, currentTourIndex]);

  const handleToggleTour = () => {
    playClickSound();
    if (isTourActive) {
      setIsTourActive(false);
    } else {
      setIsTourActive(true);
      setCurrentTourIndex(0);
    }
  };

  const handleToggleAudio = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    setSoundMuted(nextMuted);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-[#9CA3AF] flex flex-col selection:bg-[#6366F1]/30 selection:text-white relative">
      
      {/* Precision Custom Cursor for Desktop */}
      <CustomCursor />

      {/* 1. Ultra-Sleek Dynamic Top Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* 2. Pitch Obsidian Dynamic Background (Faint 48px Grid, Cursor Spotlight, Particle Constellation) */}
      <DynamicBackground />

      {/* 3. Clean Top Header Navigation */}
      <Navbar />

      {/* 4. Full-Width Unified Content Flow with Dynamic 3D Scroll Reveals */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-32 space-y-24">
        
        {/* Sector 01: Hero */}
        <ScrollReveal direction="depth" duration={1.0}>
          <Hero 
            onOpenRecruiter={() => {
              playClickSound();
              setIsRecruiterOpen(true);
            }}
            onOpenTerminal={() => {
              playClickSound();
              setIsTerminalOpen(true);
            }}
          />
        </ScrollReveal>

        {/* Sector 02: Live Bento Telemetry Metrics */}
        <ScrollReveal direction="up" delay={0.1}>
          <LiveTelemetryBento />
        </ScrollReveal>

        {/* Sector 03: Work Experience & Verified Production PRs */}
        <ScrollReveal direction="depth" delay={0.1}>
          <Experience />
        </ScrollReveal>

        {/* Sector 04: Flagship Projects Showcase */}
        <ScrollReveal direction="depth" delay={0.1}>
          <Projects />
        </ScrollReveal>

        {/* Sector 05: Tactile Skills Matrix & Orbit */}
        <ScrollReveal direction="up" delay={0.1}>
          <Skills />
        </ScrollReveal>

        {/* Sector 06: Honors, Competitive Milestones & Scholarships */}
        <ScrollReveal direction="depth" delay={0.1}>
          <Achievements />
        </ScrollReveal>

        {/* Sector 07: Community Leadership & Education */}
        <ScrollReveal direction="up" delay={0.1}>
          <Leadership />
        </ScrollReveal>

        {/* Sector 08: Direct Contact Hub */}
        <ScrollReveal direction="depth" delay={0.1}>
          <Contact />
        </ScrollReveal>

        {/* Footer */}
        <Footer />
      </main>

      {/* 4. Single Root-Level Floating Command Dock (Centered at bottom) */}
      <FloatingDock 
        onOpenTerminal={() => {
          playClickSound();
          setIsTerminalOpen(true);
        }}
        onOpenRecruiter={() => {
          playClickSound();
          setIsRecruiterOpen(true);
        }}
        isTourActive={isTourActive}
        onToggleTour={handleToggleTour}
        soundMuted={isAudioMuted}
        onToggleSound={handleToggleAudio}
      />

      {/* Slide-Up Terminal Drawer Modal */}
      <TerminalModal 
        isOpen={isTerminalOpen} 
        onClose={() => setIsTerminalOpen(false)} 
        onToggleSound={handleToggleAudio}
      />

      {/* 30s Recruiter Executive Drawer */}
      <RecruiterDrawer 
        isOpen={isRecruiterOpen} 
        onClose={() => setIsRecruiterOpen(false)} 
      />

    </div>
  );
}
