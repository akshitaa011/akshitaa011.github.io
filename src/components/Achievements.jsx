import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ExternalLink, Sparkles, X, FileCheck, ShieldCheck } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Achievements() {
  const { achievements } = portfolioData;
  const [activeModalItem, setActiveModalItem] = useState(null);
  const modalCloseBtnRef = useRef(null);

  // Accessible Escape key listener and body overflow lock
  useEffect(() => {
    if (!activeModalItem) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModalItem(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    setTimeout(() => {
      modalCloseBtnRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeModalItem]);

  return (
    <section id="honors" className="py-24 relative bg-transparent scroll-mt-24 sm:scroll-mt-28">
      {/* Backwards-compatibility alias for #achievements anchor */}
      <span id="achievements" className="scroll-mt-28 absolute -top-28 pointer-events-none" aria-hidden="true" />
      
      {/* Background Glow */}
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-[#10B981]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-emerald text-xs font-mono mb-3">
            <Trophy className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Honors & Distinctions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            National Recognitions & <span className="text-gradient-emerald">Competitive Milestones</span>
          </h2>
          <p className="text-[#9CA3AF] text-sm sm:text-base max-w-2xl mt-3">
            Acknowledged across national engineering competitions, corporate fellowships, and university academic boards.
          </p>
        </div>

        {/* Bento Grid with Dynamic Staggered Reveal */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.12 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {achievements.map((item, idx) => {
            const hasLink = item.link && item.link.trim().length > 0;
            const hasImage = item.image && item.image.trim().length > 0;

            return (
              <motion.div
                key={idx}
                tabIndex={0}
                role="region"
                aria-label={`${item.title} - ${item.organization}`}
                variants={{
                  hidden: { opacity: 0, y: 35, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
                  }
                }}
                className="glass-card p-6 rounded-2xl border border-white/[0.08] hover:border-[#10B981]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:border-transparent flex flex-col justify-between group transition-all"
              >
                <div>
                  {/* Badge & Year */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full badge-emerald">
                      {item.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{item.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-base text-white group-hover:text-[#34D399] transition-colors mb-1.5 leading-snug">
                    {item.title}
                  </h3>

                  {/* Organization */}
                  <div className="text-xs font-medium text-[#A5B4FC] font-mono mb-2.5">
                    {item.organization}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer action bar */}
                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-[#9CA3AF] group-hover:text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{item.category}</span>
                  </span>

                  {/* Dynamic Action: Real Link, Lightbox Image Modal, or Request Chip */}
                  {hasLink ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#34D399] hover:text-[#6EE7B7] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] rounded px-1.5 py-0.5 transition-colors"
                      aria-label={`${item.linkText || 'View verification for'} ${item.title} (opens in new tab)`}
                    >
                      <span>{item.linkText || "View Result"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : hasImage ? (
                    <button
                      type="button"
                      onClick={() => setActiveModalItem(item)}
                      className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#34D399] hover:text-[#6EE7B7] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] rounded px-1.5 py-0.5 transition-colors cursor-pointer"
                      aria-label={`Open certificate image for ${item.title}`}
                    >
                      <span>{item.linkText || "Certificate"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>

      {/* Accessible Lightbox Modal for Certificate Images */}
      <AnimatePresence>
        {activeModalItem && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-lightbox-title"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
            onClick={() => setActiveModalItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-[#0B0F17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0F172A]/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                  <h3 id="cert-lightbox-title" className="text-base font-heading font-bold text-white truncate max-w-md">
                    {activeModalItem.title}
                  </h3>
                </div>
                <button
                  ref={modalCloseBtnRef}
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]"
                  aria-label="Close certificate preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex flex-col items-center">
                <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-4 pb-2 border-b border-white/5">
                  <span>Organization: <strong className="text-white">{activeModalItem.organization}</strong></span>
                  <span>Issued: <strong className="text-[#34D399]">{activeModalItem.date}</strong></span>
                </div>

                <div className="w-full bg-black/50 rounded-xl border border-white/10 flex items-center justify-center p-3 overflow-hidden min-h-[280px]">
                  <img
                    src={activeModalItem.image}
                    alt={`Certificate for ${activeModalItem.title}`}
                    className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="text-center p-8">
                          <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center text-[#10B981]">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.5L19 7.5V19a2 2 0 01-2 2z"></path></svg>
                          </div>
                          <p class="text-sm font-medium text-slate-300">Certificate Document Available on Request</p>
                          <p class="text-xs text-slate-500 font-mono mt-1">${activeModalItem.image}</p>
                        </div>
                      `;
                    }}
                  />
                </div>

                <p className="text-xs text-slate-400 mt-4 text-center max-w-lg leading-relaxed">
                  {activeModalItem.description}
                </p>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-white/10 bg-[#0F172A]/50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-1.5 text-xs font-mono font-medium rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors"
                >
                  Close (Esc)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
