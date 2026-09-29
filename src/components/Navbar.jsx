import React, { useState, useEffect } from 'react';
import { FileText, Menu, X, Volume2, VolumeX } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { playClickSound, playHoverSound } from '../utils/audioFx';

export default function Navbar({ onOpenTerminal, soundMuted = true, onToggleSound }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ESC key listener & body lock for mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Telemetry', href: '#telemetry' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Honors', href: '#honors' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'py-3 bg-[#030712]/85 backdrop-blur-md border-b border-white/[0.08] shadow-lg shadow-black/50' : 'py-4 bg-transparent'
    }`}>
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a
          href="#about"
          className="flex items-center gap-3 group"
          onMouseEnter={playHoverSound}
          onClick={playClickSound}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] via-indigo-500 to-[#10B981] p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-md shadow-[#6366F1]/20">
            <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
              <span className="font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-[#10B981] text-lg tracking-wider">
                AS
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-white tracking-tight text-base group-hover:text-[#A5B4FC] transition-colors">
              Akshita Singhal
            </span>
            <span className="text-[11px] font-mono text-[#34D399] tracking-wide flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              SDE & Systems
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[rgba(17,24,39,0.60)] border border-white/[0.08] px-4 py-1.5 rounded-full backdrop-blur-lg shadow-sm">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="text-xs uppercase tracking-wider font-mono text-[#9CA3AF] hover:text-white px-3 py-1.5 rounded-full transition-colors hover:bg-white/[0.06]"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Controls (Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Sound Toggle (Speaker icon button, default OFF, persisted) */}
          <button
            onClick={onToggleSound}
            onMouseEnter={playHoverSound}
            aria-label={soundMuted ? "Sound is OFF. Click to unmute" : "Sound is ON. Click to mute"}
            title={soundMuted ? "Sound is OFF (Click to unmute)" : "Sound is ON (Click to mute)"}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer border ${
              !soundMuted
                ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#34D399] shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                : 'bg-[rgba(17,24,39,0.7)] hover:bg-slate-800 border-white/[0.1] text-slate-400 hover:text-white'
            }`}
          >
            {!soundMuted ? (
              <Volume2 className="w-4 h-4 text-[#34D399]" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Terminal Quick-Trigger (>_ with aria-label and tooltip "Terminal (Ctrl+K)") */}
          <button
            onClick={() => {
              playClickSound();
              onOpenTerminal?.();
            }}
            onMouseEnter={playHoverSound}
            aria-label="Terminal (Ctrl+K)"
            title="Terminal (Ctrl+K)"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-[rgba(17,24,39,0.7)] hover:bg-slate-800 text-[#A5B4FC] hover:text-white border border-white/[0.1] hover:border-[#6366F1]/50 font-mono font-bold text-xs tracking-tighter transition-all cursor-pointer shadow-sm hover:scale-105"
          >
            <span>&gt;_</span>
          </button>

          {/* Resume Download / View */}
          <a
            href={portfolioData.personal.links.resumePdf}
            download="Akshita_Singhal_Resume.pdf"
            onClick={playClickSound}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#10B981] hover:bg-[#059669] text-black transition-all cursor-pointer shadow-md shadow-[#10B981]/25 hover:scale-[1.02]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume</span>
          </a>
        </div>

        {/* Mobile Header Controls */}
        <div className="flex sm:hidden items-center gap-1.5">
          {/* Sound Toggle (Mobile Compact) */}
          <button
            onClick={onToggleSound}
            aria-label={soundMuted ? "Sound is OFF. Click to unmute" : "Sound is ON. Click to mute"}
            title={soundMuted ? "Sound is OFF (Click to unmute)" : "Sound is ON (Click to mute)"}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              !soundMuted
                ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#34D399]'
                : 'bg-[rgba(17,24,39,0.7)] border-white/[0.1] text-slate-400'
            }`}
          >
            {!soundMuted ? <Volume2 className="w-4 h-4 text-[#34D399]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Terminal Quick-Trigger (Mobile Compact) */}
          <button
            onClick={() => {
              playClickSound();
              onOpenTerminal?.();
            }}
            aria-label="Terminal (Ctrl+K)"
            title="Terminal (Ctrl+K)"
            className="p-2 rounded-xl bg-[rgba(17,24,39,0.7)] border border-white/[0.1] text-[#A5B4FC] hover:text-white font-mono font-bold text-xs transition-colors cursor-pointer"
          >
            <span>&gt;_</span>
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => {
              playClickSound();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl bg-[rgba(17,24,39,0.7)] border border-white/[0.1] text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#34D399]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Drawer Overlay & Panel */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 top-[65px] z-50 sm:hidden bg-black/60 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div 
            className="bg-[#030712]/98 border-b border-white/[0.1] px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200 max-h-[calc(100vh-65px)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    playClickSound();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium font-mono text-[#9CA3AF] hover:text-[#34D399] py-2.5 px-3 rounded-lg hover:bg-white/[0.04] transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <span className="text-slate-600 text-xs">→</span>
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-white/[0.08] space-y-2">
              {/* Terminal Button */}
              <button
                onClick={() => {
                  playClickSound();
                  setMobileMenuOpen(false);
                  onOpenTerminal?.();
                }}
                className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-mono text-[#A5B4FC] hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="font-bold text-base">&gt;_</span>
                  <span>Terminal</span>
                </span>
                <kbd className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 border border-white/[0.1]">Ctrl+K</kbd>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={() => {
                  onToggleSound();
                }}
                className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-mono text-slate-300 hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  {!soundMuted ? <Volume2 className="w-4 h-4 text-[#34D399]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                  <span>Sound Effects</span>
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${!soundMuted ? 'bg-[#10B981]/20 text-[#34D399]' : 'bg-slate-800 text-slate-400'}`}>
                  {!soundMuted ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Download Resume PDF */}
              <a
                href={portfolioData.personal.links.resumePdf}
                download="Akshita_Singhal_Resume.pdf"
                onClick={() => {
                  playClickSound();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-semibold text-xs shadow-md shadow-[#10B981]/25 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Download Resume (PDF)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
