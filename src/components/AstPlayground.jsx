import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Terminal, Code, Cpu, ChevronRight, Layers, Copy, Check, RotateCcw, AlertOctagon, ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';
import { playClickSound, playHoverSound, playSuccessSound } from '../utils/audioFx';
import {
  parseEnvContent,
  extractAstData,
  classifyEnvironmentVariables,
  formatCliOutput,
  STATUS_MESSAGES
} from '../utils/envClassifier';

const PRESETS = {
  nextjs: {
    name: "Next.js Rule",
    framework: "Next.js App Router (process.env)",
    ruleHint: "Server/Client scoping with NEXT_PUBLIC_ or server-only secrets",
    defaultCode: `// app/dashboard/page.tsx
'use client';

// ✔ Valid: Client-safe exposed variable
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ✖ Unexposed: Server-only secret read in client component
const stripeKey = process.env.STRIPE_SECRET_KEY;

// 🔒 Leak Risk: Sensitive keyword exposed with NEXT_PUBLIC_
const leakedAuth = process.env.NEXT_PUBLIC_AUTH_TOKEN;`,
    defaultEnv: `NEXT_PUBLIC_API_URL=https://api.example.com
STRIPE_SECRET_KEY=sk_live_123456789
NEXT_PUBLIC_AUTH_TOKEN=jwt_secret_token_exposed
DATABASE_URL=postgres://user:pass@localhost:5432/db`
  },
  vite: {
    name: "Vite Prefix Rule",
    framework: "Vite + React (import.meta.env)",
    ruleHint: "Client-exposed variables must begin with VITE_ to prevent secret leaks",
    defaultCode: `// src/services/api.ts
export const apiUrl = import.meta.env.VITE_API_URL;
export const appTitle = import.meta.env.VITE_APP_TITLE;

// ✖ Security Risk: Missing 'VITE_' prefix in client bundle
export const secretToken = import.meta.env.SECRET_TOKEN;

// ✖ Missing: Referenced in code but missing from .env
export const analytics = import.meta.env.VITE_ANALYTICS_KEY;`,
    defaultEnv: `VITE_API_URL=https://api.production.internal
VITE_APP_TITLE="Akshita Singhal Portfolio"
SECRET_TOKEN=super_secret_token_leaked
UNUSED_VITE_CACHE=true
VITE_EMPTY_FLAG=
VITE_API_URL=https://duplicate.api.internal`
  }
};

export default function AstPlayground() {
  const [selectedPresetKey, setSelectedPresetKey] = useState('nextjs');
  const [activeTab, setActiveTab] = useState('ast'); // 'ast', 'code', 'cli'
  const [code, setCode] = useState(PRESETS.nextjs.defaultCode);
  const [envContent, setEnvContent] = useState(PRESETS.nextjs.defaultEnv);

  const [parseError, setParseError] = useState(null);
  const [astNodes, setAstNodes] = useState([]);
  const [classifiedResults, setClassifiedResults] = useState([]);
  const [isClientComponent, setIsClientComponent] = useState(false);
  const [executionTimeMs, setExecutionTimeMs] = useState(0.12);
  const [activeNode, setActiveNode] = useState(null);
  const [highlightRange, setHighlightRange] = useState(null);

  const [copied, setCopied] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const debounceTimerRef = useRef(null);
  const codeTextareaRef = useRef(null);

  // Switch presets
  const handleSelectPreset = (key) => {
    playClickSound();
    setSelectedPresetKey(key);
    setCode(PRESETS[key].defaultCode);
    setEnvContent(PRESETS[key].defaultEnv);
    setActiveNode(null);
    setHighlightRange(null);
  };

  // Reset sample button
  const handleResetSample = () => {
    playClickSound();
    setCode(PRESETS[selectedPresetKey].defaultCode);
    setEnvContent(PRESETS[selectedPresetKey].defaultEnv);
    setActiveNode(null);
    setHighlightRange(null);
  };

  // Parse .env line-by-line
  const parsedEnv = useMemo(() => {
    return parseEnvContent(envContent);
  }, [envContent]);

  // Live in-browser AST parsing via lazy-loaded @babel/parser
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsParsing(true);

    debounceTimerRef.current = setTimeout(async () => {
      const startTime = performance.now();
      try {
        const { parse } = await import('@babel/parser');
        const ast = parse(code, {
          sourceType: 'module',
          plugins: ['typescript', 'jsx'],
          errorRecovery: true,
        });

        setParseError(null);

        // Extract AST references, directives, and node graph
        const { references, isClientComponent: isClient, nodesList } = extractAstData(ast, code);
        setIsClientComponent(isClient);

        // Single source-of-truth classification
        const results = classifyEnvironmentVariables({
          parsedEnv,
          envReferences: references,
          isClientComponent: isClient,
          mode: selectedPresetKey
        });

        const endTime = performance.now();
        const elapsed = Math.max(0.01, endTime - startTime);
        setExecutionTimeMs(elapsed);

        setAstNodes(nodesList.slice(0, 45)); // keep tree view performant
        setClassifiedResults(results);
      } catch (err) {
        setParseError(err.message || 'Syntax parse error in code editor');
      } finally {
        setIsParsing(false);
      }
    }, 200);

    return () => clearTimeout(debounceTimerRef.current);
  }, [code, envContent, selectedPresetKey, parsedEnv]);

  // Summary counts derived strictly from the single classifiedResults array
  const counts = useMemo(() => ({
    valid: classifiedResults.filter(r => r.status === 'valid').length,
    unexposed: classifiedResults.filter(r => r.status === 'unexposed').length,
    leakRisk: classifiedResults.filter(r => r.status === 'leakRisk').length,
    missing: classifiedResults.filter(r => r.status === 'missing').length,
    dead: classifiedResults.filter(r => r.status === 'dead').length,
    empty: classifiedResults.filter(r => r.status === 'empty').length,
    duplicate: classifiedResults.filter(r => r.status === 'duplicate').length,
    totalViolations: classifiedResults.filter(r => r.isViolation).length
  }), [classifiedResults]);

  // Formatted CLI diagnostic text
  const cliText = useMemo(() => {
    return formatCliOutput({
      results: classifiedResults,
      mode: selectedPresetKey,
      isClientComponent,
      executionTimeMs
    });
  }, [classifiedResults, selectedPresetKey, isClientComponent, executionTimeMs]);

  // Copy CLI output
  const handleCopyCli = () => {
    playSuccessSound();
    navigator.clipboard.writeText(cliText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Node Click: Highlight in Editor & switch tab if desired
  const handleNodeClick = (node) => {
    playClickSound();
    setActiveNode(node);
    setHighlightRange(node.range);

    if (codeTextareaRef.current && node.range) {
      const [start, end] = node.range;
      codeTextareaRef.current.focus();
      codeTextareaRef.current.setSelectionRange(start, end);
    }
  };

  return (
    <div className="w-full my-6 glass-panel p-5 sm:p-6 rounded-2xl border border-white/[0.08] relative">
      
      {/* Top Header: Title, Preset Switcher & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl badge-indigo">
            <Cpu className="w-4 h-4 text-[#A5B4FC]" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm sm:text-base text-white flex items-center gap-2">
              EnvGuard AST Engine (Live Browser Parser)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full badge-emerald flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
                @babel/parser
              </span>
              {selectedPresetKey === 'nextjs' && isClientComponent && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/40">
                  'use client' active
                </span>
              )}
            </h4>
            <p className="text-xs text-[#9CA3AF] font-mono">{PRESETS[selectedPresetKey].ruleHint}</p>
          </div>
        </div>

        {/* Action Controls: Presets + Reset + Copy */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-white/[0.08] text-xs font-mono">
            {Object.keys(PRESETS).map((key) => (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                onMouseEnter={playHoverSound}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedPresetKey === key
                    ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 font-semibold'
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                {PRESETS[key].name}
              </button>
            ))}
          </div>

          {/* Reset Sample Button */}
          <button
            onClick={handleResetSample}
            onMouseEnter={playHoverSound}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-xs font-mono text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
            title="Reset code & .env to initial preset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('ast');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'ast'
                ? 'bg-[#10B981]/15 border-[#10B981]/50 text-[#34D399] font-semibold'
                : 'bg-slate-900/60 border-white/[0.08] text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AST Node Graph</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('code');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-[#6366F1]/20 border-[#6366F1]/50 text-[#A5B4FC] font-semibold'
                : 'bg-slate-900/60 border-white/[0.08] text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Editable Source & .env Panes</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('cli');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'cli'
                ? 'bg-[#10B981]/15 border-[#10B981]/50 text-[#34D399] font-semibold'
                : 'bg-slate-900/60 border-white/[0.08] text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>CLI Diagnostic Output</span>
          </button>
        </div>

        {/* Copy CLI Output Button */}
        {activeTab === 'cli' && (
          <button
            onClick={handleCopyCli}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/40 text-[#34D399] transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Output!" : "Copy CLI Output"}</span>
          </button>
        )}
      </div>

      {/* Syntax Error Banner */}
      {parseError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Parser Warning: {parseError} (Fallback AST active)</span>
        </div>
      )}

      {/* TAB 1: AST Node Graph */}
      {activeTab === 'ast' && (
        <div className="rounded-xl bg-[#030712] border border-white/[0.08] p-4 font-mono text-xs overflow-x-auto min-h-[340px]">
          <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-white/[0.08] mb-3">
            <span>Babel AST Traversal (Click any node to highlight range):</span>
            <span>{astNodes.length} nodes parsed • {counts.totalViolations} violations</span>
          </div>

          <div className="space-y-1">
            {astNodes.map((node, idx) => {
              const isSelected = activeNode === node;
              const isEnvNode = node.preview.includes('process.env') || node.preview.includes('import.meta.env');
              const matchedResult = classifiedResults.find(r => node.preview.includes(r.key));

              let statusBadge = null;
              if (matchedResult) {
                if (matchedResult.status === 'valid') {
                  statusBadge = <span className="text-[10px] px-2 py-0.5 rounded-md badge-emerald shrink-0 font-bold">VALID</span>;
                } else if (matchedResult.status === 'unexposed') {
                  statusBadge = <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-300 border border-rose-500/50 shrink-0 font-bold">UNEXPOSED</span>;
                } else if (matchedResult.status === 'leakRisk') {
                  statusBadge = <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-500/50 shrink-0 font-bold">LEAK RISK</span>;
                } else if (matchedResult.status === 'missing') {
                  statusBadge = <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-300 border border-rose-500/50 shrink-0 font-bold">MISSING</span>;
                } else if (matchedResult.status === 'empty') {
                  statusBadge = <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-500/50 shrink-0 font-bold">EMPTY</span>;
                } else if (matchedResult.status === 'duplicate') {
                  statusBadge = <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-500/50 shrink-0 font-bold">DUPLICATE</span>;
                } else {
                  statusBadge = <span className="text-[10px] px-2 py-0.5 rounded-md badge-indigo shrink-0 font-bold">DEAD</span>;
                }
              } else if (isEnvNode) {
                statusBadge = <span className="text-[10px] px-2 py-0.5 rounded-md badge-emerald shrink-0 font-bold">ENV NODE</span>;
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={playHoverSound}
                  className={`py-1.5 px-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-[#10B981]/20 border border-[#10B981]/60 text-white shadow-sm'
                      : matchedResult?.isViolation
                      ? 'bg-rose-950/20 hover:bg-rose-950/30 border border-rose-500/30 text-rose-200'
                      : isEnvNode
                      ? 'bg-[#6366F1]/10 hover:bg-[#6366F1]/20 border border-[#6366F1]/30 text-[#A5B4FC]'
                      : 'hover:bg-slate-900/80 text-[#9CA3AF]'
                  }`}
                  style={{ marginLeft: `${Math.min(node.depth * 14, 140)}px` }}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-white text-[11px]">{node.type}</span>
                    <span className="text-slate-400 text-[10px] truncate max-w-sm sm:max-w-md">
                      {node.preview}
                    </span>
                  </div>

                  {statusBadge}
                </div>
              );
            })}
          </div>

          {/* Active Node Detail Inspector */}
          {activeNode && (
            <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-[#10B981]/30 text-xs text-[#9CA3AF] flex flex-wrap items-center justify-between gap-2">
              <div>
                <strong className="text-white font-bold">{activeNode.type}</strong>
                <span className="ml-2 text-slate-400 font-mono">
                  Range: [{activeNode.range[0]}, {activeNode.range[1]}] • Line {activeNode.loc?.start?.line}
                </span>
              </div>
              <button
                onClick={() => setActiveTab('code')}
                className="text-[11px] text-[#34D399] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>View in Source Code Pane</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Dual Editable Panes (Code + .env) */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Source Code Editor */}
          <div className="flex flex-col rounded-xl bg-[#030712] border border-white/[0.08] overflow-hidden">
            <div className="bg-[#090d16] px-4 py-2 border-b border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <Code className="w-3.5 h-3.5 text-[#10B981]" />
                <span>source.ts (Editable)</span>
              </span>
              <span className="text-[10px] text-slate-500">Debounced: 200ms</span>
            </div>
            <textarea
              ref={codeTextareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={14}
              spellCheck={false}
              className="w-full p-4 bg-transparent text-slate-200 font-mono text-xs leading-relaxed outline-none border-none resize-none focus:ring-0 selection:bg-[#10B981]/30"
              placeholder="Paste or type TypeScript / React code..."
            />
          </div>

          {/* Right: .env Editor */}
          <div className="flex flex-col rounded-xl bg-[#030712] border border-white/[0.08] overflow-hidden">
            <div className="bg-[#090d16] px-4 py-2 border-b border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <Terminal className="w-3.5 h-3.5 text-[#A5B4FC]" />
                <span>.env.local (Editable)</span>
              </span>
              <span className="text-[10px] text-slate-500">{parsedEnv.entries.length} variables</span>
            </div>
            <textarea
              value={envContent}
              onChange={(e) => setEnvContent(e.target.value)}
              rows={14}
              spellCheck={false}
              className="w-full p-4 bg-transparent text-slate-200 font-mono text-xs leading-relaxed outline-none border-none resize-none focus:ring-0 selection:bg-[#6366F1]/30"
              placeholder="KEY=value format..."
            />
          </div>
        </div>
      )}

      {/* TAB 3: CLI Diagnostic Output */}
      {activeTab === 'cli' && (
        <div className="rounded-xl bg-black/95 border border-white/[0.08] p-5 font-mono text-xs overflow-x-auto min-h-[340px]">
          <pre className="text-slate-300 leading-relaxed font-mono whitespace-pre-wrap selection:bg-[#10B981]/30">
            <code>{cliText}</code>
          </pre>
        </div>
      )}

      {/* Live Status Classification Strip (Footer Badges) */}
      <div className="mt-4 pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500">Live Heuristics:</span>
          
          <span className="px-2 py-0.5 rounded-md badge-emerald text-[11px] font-semibold">
            {counts.valid} Valid
          </span>

          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
            counts.unexposed > 0
              ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
              : 'bg-slate-900 text-slate-500 border border-white/5'
          }`}>
            {counts.unexposed} Unexposed
          </span>

          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
            counts.leakRisk > 0
              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
              : 'bg-slate-900 text-slate-500 border border-white/5'
          }`}>
            {counts.leakRisk} Leak Risk
          </span>

          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
            counts.missing > 0
              ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
              : 'bg-slate-900 text-slate-500 border border-white/5'
          }`}>
            {counts.missing} Missing
          </span>

          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
            counts.dead > 0
              ? 'badge-indigo'
              : 'bg-slate-900 text-slate-500 border border-white/5'
          }`}>
            {counts.dead} Dead
          </span>

          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
            counts.empty > 0
              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
              : 'bg-slate-900 text-slate-500 border border-white/5'
          }`}>
            {counts.empty} Empty
          </span>

          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
            counts.duplicate > 0
              ? 'bg-purple-950/60 text-purple-300 border border-purple-500/40'
              : 'bg-slate-900 text-slate-500 border border-white/5'
          }`}>
            {counts.duplicate} Duplicate
          </span>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
          {isParsing ? (
            <span className="text-[#34D399] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
              Parsing AST...
            </span>
          ) : (
            <span>AST Engine Synchronized</span>
          )}
        </div>
      </div>

    </div>
  );
}
