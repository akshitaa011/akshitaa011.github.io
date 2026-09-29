import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Code, Cpu, Layers, GitBranch, Sparkles, CornerDownLeft, Play, RefreshCw, CheckCircle2 } from 'lucide-react';
import { handleTerminalCommand } from '../data/terminalCommands';
import AstPlayground from './AstPlayground';
import GitCommitGraph from './GitCommitGraph';
import confetti from 'canvas-confetti';

export default function EngineeringInterface() {
  const [activeTab, setActiveTab] = useState('CLI'); // 'CLI', 'CodePlay', 'Terminal'

  // CLI state
  const [cliHistory, setCliHistory] = useState([
    { type: "info", text: "AkshitaOS v3.2.0 (Spatial OS Core)" },
    { type: "output", text: "Type 'help', 'projects', 'skills', or 'sudo hire-me'!" },
  ]);
  const [cliInput, setCliInput] = useState("");
  const cliBottomRef = useRef(null);
  const cliInputRef = useRef(null);

  useEffect(() => {
    cliBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [cliHistory]);

  const handleCliSubmit = (e) => {
    e.preventDefault();
    const trimmed = cliInput.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === "clear") {
      setCliHistory([]);
      setCliInput("");
      return;
    }

    const commandEntry = { type: "command", text: trimmed };
    const outputs = handleTerminalCommand(trimmed);

    if (trimmed.toLowerCase() === "sudo hire-me") {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    }

    setCliHistory((prev) => [...prev, commandEntry, ...outputs]);
    setCliInput("");
  };

  return (
    <div className="w-full min-h-[480px] flex flex-col bg-[rgba(17,24,39,0.60)] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-2xl shadow-2xl relative">
      
      {/* Top Station Header */}
      <div className="p-3.5 bg-slate-950/70 border-b border-white/[0.08] flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">
            Engineering Station
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full badge-indigo">
          Spatial OS
        </span>
      </div>

      {/* Tabs Selector Bar */}
      <div className="flex items-center p-1.5 bg-[#030712]/80 border-b border-white/[0.08] gap-1 text-xs font-mono select-none">
        <button
          onClick={() => setActiveTab('CLI')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'CLI'
              ? 'bg-[#6366F1]/20 text-[#A5B4FC] border border-[#6366F1]/50 font-semibold shadow-sm'
              : 'text-[#9CA3AF] hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>[CLI]</span>
        </button>

        <button
          onClick={() => setActiveTab('CodePlay')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'CodePlay'
              ? 'bg-[#6366F1]/20 text-[#A5B4FC] border border-[#6366F1]/50 font-semibold shadow-sm'
              : 'text-[#9CA3AF] hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>[CodePlay]</span>
        </button>

        <button
          onClick={() => setActiveTab('Terminal')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'Terminal'
              ? 'bg-[#6366F1]/20 text-[#A5B4FC] border border-[#6366F1]/50 font-semibold shadow-sm'
              : 'text-[#9CA3AF] hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>[Git Tree]</span>
        </button>
      </div>

      {/* Tab 1: Interactive CLI */}
      {activeTab === 'CLI' && (
        <div 
          className="flex-1 flex flex-col p-4 bg-[#030712]/95 text-[#9CA3AF] font-mono text-xs overflow-hidden"
          onClick={() => cliInputRef.current?.focus()}
        >
          {/* Quick command hints */}
          <div className="flex flex-wrap gap-1.5 pb-2 mb-2 border-b border-white/[0.08] text-[10px]">
            {['help', 'projects', 'skills', 'cat resume', 'sudo hire-me'].map((cmd) => (
              <button
                key={cmd}
                onClick={(e) => {
                  e.stopPropagation();
                  setCliInput(cmd);
                  cliInputRef.current?.focus();
                }}
                className="px-2 py-0.5 rounded bg-slate-900/80 hover:bg-[#6366F1]/20 hover:text-white border border-white/[0.08] text-[#9CA3AF] cursor-pointer transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* History Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {cliHistory.map((line, idx) => {
              if (line.type === "command") {
                return (
                  <div key={idx} className="flex items-center gap-2 text-white font-bold">
                    <span className="text-[#10B981]">akshita:~$</span>
                    <span>{line.text}</span>
                  </div>
                );
              }
              if (line.type === "info") {
                return <div key={idx} className="text-[#A5B4FC] font-medium">{line.text}</div>;
              }
              if (line.type === "success") {
                return <div key={idx} className="text-[#34D399] font-bold">{line.text}</div>;
              }
              if (line.type === "error") {
                return <div key={idx} className="text-rose-400">{line.text}</div>;
              }
              if (line.type === "celebrate") {
                return (
                  <div key={idx} className="p-2.5 my-1 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30 text-[#34D399] text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>{line.text}</span>
                  </div>
                );
              }
              return <div key={idx} className="text-[#9CA3AF] whitespace-pre-wrap">{line.text}</div>;
            })}
            <div ref={cliBottomRef} />
          </div>

          {/* Active input bar */}
          <form onSubmit={handleCliSubmit} className="flex items-center gap-1.5 pt-2 border-t border-white/[0.08] mt-2">
            <span className="text-[#10B981] shrink-0 font-bold text-xs">akshita:~$</span>
            <input
              ref={cliInputRef}
              type="text"
              value={cliInput}
              onChange={(e) => setCliInput(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none border-none p-0 focus:ring-0 font-mono text-xs placeholder:text-slate-600"
              placeholder="type command..."
            />
            <button type="submit" className="p-1 rounded bg-slate-900 text-[#9CA3AF] hover:text-white">
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: CodePlay (AST Sandbox) */}
      {activeTab === 'CodePlay' && (
        <div className="flex-1 overflow-y-auto p-3 bg-[#030712]/90 text-xs">
          <AstPlayground />
        </div>
      )}

      {/* Tab 3: Git Commit Diff Explorer */}
      {activeTab === 'Terminal' && (
        <div className="flex-1 overflow-y-auto p-3 bg-[#030712]/90 text-xs">
          <GitCommitGraph />
        </div>
      )}

    </div>
  );
}
