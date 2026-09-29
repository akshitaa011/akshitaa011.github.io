import React, { useState, useEffect } from 'react';
import { FileText, Menu, X } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { playClickSound, playHoverSound } from '../utils/audioFx';

export default function Navbar() {
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

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
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

        {/* Mobile Hamburger Trigger */}
        <div className="flex sm:hidden items-center gap-2">
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
            className="bg-[#030712]/98 border-b border-white/[0.1] px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200"
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

            <div className="pt-2 border-t border-white/[0.08]">
              <a
                href={portfolioData.personal.links.resumePdf}
                download="Akshita_Singhal_Resume.pdf"
                onClick={() => {
                  playClickSound();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-semibold text-xs shadow-md shadow-[#10B981]/25 transition-all"
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
