import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Square, Terminal as TerminalIcon, Sparkles, ChevronUp, CornerDownLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { handleTerminalCommand } from '../data/terminalCommands';
import { playClickSound, playHoverSound, playSuccessSound } from '../utils/audioFx';

const AUTOCOMPLETE_COMMANDS = [
  "help",
  "whoami",
  "bio",
  "projects",
  "projects envguard",
  "projects dsaverse",
  "skills",
  "experience",
  "contact",
  "resume",
  "sound on",
  "sound off",
  "theme",
  "ls",
  "cat resume.pdf",
  "cat bio.md",
  "cat secrets.txt",
  "git log",
  "sudo hire akshita",
  "clear",
  "exit"
];

export default function TerminalModal({ isOpen, onClose, onToggleSound }) {
  const [history, setHistory] = useState([
    { type: "info", text: "AkshitaOS Translucent Terminal v3.2.0 (x86_64-darwin-zsh)" },
    { type: "output", text: "Type 'help' for command manual, 'projects' to inspect codebases, or try 'sudo hire akshita'!" },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    playClickSound();

    if (trimmed.toLowerCase() === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    }

    if (trimmed.toLowerCase() === "exit") {
      onClose();
      return;
    }

    const commandEntry = { type: "command", text: trimmed };
    const outputs = handleTerminalCommand(trimmed, { toggleSound: onToggleSound });

    // If sudo hire akshita or sudo hire-me, trigger confetti & chime
    const lower = trimmed.toLowerCase();
    if (lower.startsWith("sudo hire")) {
      playSuccessSound();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    }

    setHistory((prev) => [...prev, commandEntry, ...outputs]);
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInputVal("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) return;
      const matched = AUTOCOMPLETE_COMMANDS.find(cmd => cmd.startsWith(current));
      if (matched) {
        setInputVal(matched);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < commandHistory.length) {
          setHistoryIndex(nextIndex);
          setInputVal(commandHistory[nextIndex]);
        } else {
          setHistoryIndex(-1);
          setInputVal("");
        }
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, y: 60, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="w-full max-w-4xl bg-[#030712]/95 border border-white/[0.12] rounded-2xl shadow-2xl shadow-black/95 overflow-hidden flex flex-col h-[520px] max-h-[82vh] font-mono text-xs sm:text-sm relative backdrop-blur-2xl"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.focus();
        }}
      >
        {/* Subtle Scanline Glow Gradient */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#6366F1] via-[#10B981] to-[#6366F1]" />

        {/* Terminal Header */}
        <div className="bg-[#090d16] border-b border-white/[0.08] px-4 py-2.5 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" 
              title="Close (ESC)"
            />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
                setHistory([]);
              }}
              className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" 
              title="Clear Terminal"
            />
            <button 
              className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors cursor-pointer" 
              title="Active Shell"
            />
            <span className="text-[11px] text-[#9CA3AF] font-mono ml-2 flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-[#10B981]" />
              akshita@workstation:~ (zsh) — ⌘K Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 hidden sm:inline">Press TAB to complete • ESC to close</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
                onClose();
              }}
              className="text-[#9CA3AF] hover:text-white p-1 rounded hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Quick Suggestions Bar */}
        <div className="bg-[#060a12] border-b border-white/[0.06] px-4 py-1.5 flex items-center gap-2 overflow-x-auto text-[11px] text-[#9CA3AF]">
          <span className="text-slate-500 shrink-0 font-medium font-mono">Run:</span>
          {['help', 'whoami', 'skills', 'experience', 'projects', 'cat resume.pdf', 'git log', 'sudo hire akshita'].map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
                setInputVal(cmd);
                inputRef.current?.focus();
              }}
              onMouseEnter={playHoverSound}
              className="px-2.5 py-0.5 rounded-lg bg-slate-900/90 hover:bg-[#6366F1]/20 hover:text-[#A5B4FC] border border-white/[0.08] text-[#9CA3AF] shrink-0 transition-colors cursor-pointer font-mono"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Output Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-[#030712] text-[#9CA3AF] select-text leading-relaxed">
          {history.map((line, idx) => {
            if (line.type === "command") {
              return (
                <div key={idx} className="flex items-center gap-2 text-white font-semibold pt-1">
                  <span className="text-[#10B981]">akshita@singhal:~$</span>
                  <span>{line.text}</span>
                </div>
              );
            }
            if (line.type === "info") {
              return <div key={idx} className="text-[#A5B4FC] font-semibold">{line.text}</div>;
            }
            if (line.type === "success") {
              return <div key={idx} className="text-[#34D399] font-bold">{line.text}</div>;
            }
            if (line.type === "error") {
              return <div key={idx} className="text-rose-400">{line.text}</div>;
            }
            if (line.type === "celebrate") {
              return (
                <div key={idx} className="p-3 my-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[#34D399] font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#10B981] shrink-0 animate-spin" />
                  <span>{line.text}</span>
                </div>
              );
            }
            return <div key={idx} className="text-[#9CA3AF] whitespace-pre-wrap">{line.text}</div>;
          })}

          {/* Active Input Line with Blinking Cursor */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
            <span className="text-[#10B981] shrink-0 font-bold">akshita@singhal:~$</span>
            <div className="flex-1 relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-white outline-none border-none p-0 focus:ring-0 font-mono text-xs sm:text-sm"
                autoFocus
                placeholder="type 'help', 'whoami', 'cat resume.pdf', 'git log'..."
              />
            </div>
            <button
              type="submit"
              className="p-1 rounded bg-slate-800 text-[#9CA3AF] hover:text-white shrink-0 cursor-pointer"
              title="Execute"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>

          <div ref={bottomRef} />
        </div>
      </motion.div>
    </div>
  );
}
