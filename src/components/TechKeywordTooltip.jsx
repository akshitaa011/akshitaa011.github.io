import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Terminal, Sparkles, Layers } from 'lucide-react';

export default function TechKeywordTooltip({ keyword, snippet, title, tag, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
      tabIndex={0}
    >
      {/* Trigger Pill */}
      <span className="relative z-10 cursor-pointer font-semibold text-white px-1.5 py-0.5 rounded-md border-b-2 border-white/20 hover:border-[#10B981] hover:bg-white/[0.06] transition-all select-none group inline-flex items-center gap-1">
        <span>{children}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]/60 group-hover:bg-[#10B981] group-hover:scale-125 transition-all"></span>
      </span>

      {/* Floating Glass Tooltip Snippet Preview */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: -4, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-50 w-72 sm:w-80 p-3.5 rounded-xl bg-[#030712]/95 border border-white/[0.12] shadow-2xl shadow-black/80 backdrop-blur-2xl pointer-events-none text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] mb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-[#6366F1]/10 text-[#A5B4FC]">
                  <Code className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-mono font-semibold text-white">{title}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full badge-indigo">
                {tag}
              </span>
            </div>

            {/* Code Snippet Box */}
            <div className="p-2.5 rounded-lg bg-black/80 border border-white/[0.08] font-mono text-[11px] leading-relaxed text-[#9CA3AF] overflow-x-auto">
              <pre className="text-[#9CA3AF]">
                <code>{snippet}</code>
              </pre>
            </div>

            {/* Subtle glow edge */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-[#6366F1]/5 to-transparent pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
