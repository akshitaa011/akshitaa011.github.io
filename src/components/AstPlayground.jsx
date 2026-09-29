import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Terminal, Code, Cpu, ChevronRight, Layers, Copy, Check, RotateCcw, AlertOctagon } from 'lucide-react';
import { playClickSound, playHoverSound, playSuccessSound } from '../utils/audioFx';

const PRESETS = {
  nextjs: {
    name: "Next.js Rule",
    framework: "Next.js App Router (process.env)",
    ruleHint: "Server/Client scoping with NEXT_PUBLIC_ or server-only secrets",
    defaultCode: `// app/api/auth/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // ✔ Valid: Defined in .env and read in handler
  const secret = process.env.AUTH_SECRET;

  // ✖ Missing: Referenced in code, omitted in .env
  const dbUrl = process.env.DATABASE_URL;

  // ⚠ Empty: Defined in .env without an assigned value
  const timeout = process.env.TIMEOUT_MS;

  return NextResponse.json({ status: "ok", secret, dbUrl, timeout });
}`,
    defaultEnv: `AUTH_SECRET=sk_live_9928341908
OLD_LEGACY_KEY=deprecated_value_never_used
TIMEOUT_MS=
AUTH_SECRET=sk_duplicate_key_test`
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
  const [envReferences, setEnvReferences] = useState([]);
  const [activeNode, setActiveNode] = useState(null);

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
    const lines = envContent.split('\n');
    const entries = [];
    const keyCounts = {};

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1];
        const rawValue = match[2];
        keyCounts[key] = (keyCounts[key] || 0) + 1;

        entries.push({
          key,
          value: rawValue,
          line: index + 1,
          isEmpty: rawValue.trim() === '',
          isDuplicate: keyCounts[key] > 1,
        });
      }
    });

    // Mark previous occurrences of duplicate keys
    entries.forEach(e => {
      if (keyCounts[e.key] > 1) {
        e.isDuplicate = true;
      }
    });

    return { entries, keyCounts };
  }, [envContent]);

  // Live in-browser AST parsing via lazy-loaded @babel/parser
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsParsing(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const { parse } = await import('@babel/parser');
        const ast = parse(code, {
          sourceType: 'module',
          plugins: ['typescript', 'jsx'],
          errorRecovery: true,
        });

        setParseError(null);

        const nodesList = [];
        const references = [];

        const isProcessEnv = (node) => {
          if (!node) return false;
          if (node.type !== 'MemberExpression' && node.type !== 'OptionalMemberExpression') return false;
          const obj = node.object;
          const prop = node.property;
          return (
            obj &&
            obj.type === 'Identifier' &&
            obj.name === 'process' &&
            prop &&
            prop.type === 'Identifier' &&
            prop.name === 'env'
          );
        };

        const isImportMetaEnv = (node) => {
          if (!node) return false;
          if (node.type !== 'MemberExpression' && node.type !== 'OptionalMemberExpression') return false;
          const obj = node.object;
          const prop = node.property;
          return (
            obj &&
            obj.type === 'MetaProperty' &&
            obj.meta?.name === 'import' &&
            obj.property?.name === 'meta' &&
            prop &&
            prop.type === 'Identifier' &&
            prop.name === 'env'
          );
        };

        const getPropertyName = (prop, computed) => {
          if (!prop) return null;
          if (!computed) {
            return prop.type === 'Identifier' ? prop.name : null;
          }
          if (prop.type === 'StringLiteral') return prop.value;
          if (prop.type === 'TemplateLiteral' && prop.quasis?.length === 1) {
            return prop.quasis[0].value?.raw;
          }
          if (prop.type === 'Identifier') return prop.name;
          return null;
        };

        const handleObjectPattern = (pattern, prefix) => {
          if (!pattern || pattern.type !== 'ObjectPattern') return;
          for (const prop of pattern.properties) {
            if (prop.type === 'ObjectProperty') {
              let varName = null;
              if (!prop.computed && prop.key?.type === 'Identifier') {
                varName = prop.key.name;
              } else if (prop.key?.type === 'StringLiteral') {
                varName = prop.key.value;
              }

              if (varName && typeof varName === 'string') {
                const isVitePrefixIssue = selectedPresetKey === 'vite' && prefix === 'import.meta.env' && !varName.startsWith('VITE_');
                references.push({
                  varName,
                  prefix,
                  loc: prop.loc,
                  range: [prop.start, prop.end],
                  isVitePrefixIssue
                });
              }
            }
          }
        };

        // Recursive AST Traversal
        const walk = (node, depth = 0) => {
          if (!node || typeof node !== 'object') return;

          // Track readable AST nodes for the Tree View
          if (node.type && typeof node.type === 'string') {
            const preview = code.substring(node.start, Math.min(node.end, node.start + 35)).replace(/\n/g, ' ');
            nodesList.push({
              type: node.type,
              depth,
              range: [node.start, node.end],
              loc: node.loc,
              preview: preview || node.type,
              astNode: node
            });
          }

          // 1. Direct or Optional property access: process.env.X, process.env?.X, process.env['X'], import.meta.env.X, etc.
          if (node.type === 'MemberExpression' || node.type === 'OptionalMemberExpression') {
            const obj = node.object;
            const prop = node.property;

            if (isProcessEnv(obj)) {
              const varName = getPropertyName(prop, node.computed);
              if (varName && typeof varName === 'string') {
                references.push({
                  varName,
                  prefix: 'process.env',
                  loc: node.loc,
                  range: [node.start, node.end],
                  isVitePrefixIssue: false
                });
              }
            } else if (isImportMetaEnv(obj)) {
              const varName = getPropertyName(prop, node.computed);
              if (varName && typeof varName === 'string') {
                const isVitePrefixIssue = selectedPresetKey === 'vite' && !varName.startsWith('VITE_');
                references.push({
                  varName,
                  prefix: 'import.meta.env',
                  loc: node.loc,
                  range: [node.start, node.end],
                  isVitePrefixIssue
                });
              }
            }
          }

          // 2. Destructuring in VariableDeclarator: const { A, B } = process.env;
          if (node.type === 'VariableDeclarator' && node.init) {
            if (isProcessEnv(node.init)) {
              handleObjectPattern(node.id, 'process.env');
            } else if (isImportMetaEnv(node.init)) {
              handleObjectPattern(node.id, 'import.meta.env');
            }
          }

          // 3. Destructuring in AssignmentExpression: ({ A, B } = process.env);
          if (node.type === 'AssignmentExpression' && node.right) {
            if (isProcessEnv(node.right)) {
              handleObjectPattern(node.left, 'process.env');
            } else if (isImportMetaEnv(node.right)) {
              handleObjectPattern(node.left, 'import.meta.env');
            }
          }

          // 4. Destructuring in AssignmentPattern (default params): ({ A, B } = process.env)
          if (node.type === 'AssignmentPattern' && node.right) {
            if (isProcessEnv(node.right)) {
              handleObjectPattern(node.left, 'process.env');
            } else if (isImportMetaEnv(node.right)) {
              handleObjectPattern(node.left, 'import.meta.env');
            }
          }

          for (const key of Object.keys(node)) {
            if (key === 'loc' || key === 'range' || key === 'comments' || key === 'tokens') continue;
            const child = node[key];
            if (Array.isArray(child)) {
              for (const item of child) {
                if (item && typeof item.type === 'string') walk(item, depth + 1, node);
              }
            } else if (child && typeof child.type === 'string') {
              walk(child, depth + 1, node);
            }
          }
        };

        walk(ast.program, 0);

        setAstNodes(nodesList.slice(0, 45)); // keep list performant
        setEnvReferences(references);
      } catch (err) {
        setParseError(err.message || 'Syntax parse error in code editor');
      } finally {
        setIsParsing(false);
      }
    }, 200);

    return () => clearTimeout(debounceTimerRef.current);
  }, [code, selectedPresetKey]);

  // Classification Logic: VALID, MISSING, DEAD, EMPTY, DUPLICATE
  const analysis = useMemo(() => {
    const envMap = new Map();
    parsedEnv.entries.forEach(e => {
      if (!envMap.has(e.key)) envMap.set(e.key, []);
      envMap.get(e.key).push(e);
    });

    const codeRefMap = new Map();
    envReferences.forEach(ref => {
      if (!codeRefMap.has(ref.varName)) codeRefMap.set(ref.varName, []);
      codeRefMap.get(ref.varName).push(ref);
    });

    const missing = [];
    const dead = [];
    const empty = [];
    const duplicate = [];
    const valid = [];
    const security = [];

    // Check code references against .env
    codeRefMap.forEach((refs, varName) => {
      const inEnv = envMap.get(varName);
      if (!inEnv || inEnv.length === 0) {
        missing.push({ varName, refs });
      } else {
        const hasEmpty = inEnv.some(e => e.isEmpty);
        const hasSecurity = refs.some(r => r.isVitePrefixIssue);

        if (hasSecurity) {
          security.push({ varName, refs, envEntries: inEnv });
        } else if (hasEmpty) {
          empty.push({ varName, refs, envEntry: inEnv.find(e => e.isEmpty) });
        } else {
          valid.push({ varName, refs, envEntries: inEnv });
        }
      }
    });

    // Check .env entries against code references (Dead & Duplicate)
    envMap.forEach((entries, key) => {
      if (!codeRefMap.has(key)) {
        dead.push({ key, line: entries[0].line, value: entries[0].value });
      }
      if (entries.length > 1) {
        duplicate.push({ key, lines: entries.map(e => e.line) });
      }
    });

    return { missing, dead, empty, duplicate, valid, security };
  }, [parsedEnv, envReferences]);

  // Formatted CLI diagnostic text
  const cliText = useMemo(() => {
    let out = `$ npx envguard scan --strict\n\n`;
    out += `🔍 Scanning AST in ${selectedPresetKey === 'nextjs' ? 'Next.js App' : 'Vite React'} project...\n`;
    out += `📁 Analyzed 1 source file + .env configuration\n\n`;

    const totalIssues = analysis.missing.length + analysis.dead.length + analysis.empty.length + analysis.duplicate.length + analysis.security.length;

    if (totalIssues > 0) {
      out += `✖ [FAIL] ${totalIssues} static environment violation(s) detected:\n\n`;
    } else {
      out += `✔ [PASS] 0 violations detected. Clean AST environment configuration.\n\n`;
    }

    if (analysis.missing.length > 0) {
      out += `✖ MISSING (referenced in AST, not declared in .env):\n`;
      analysis.missing.forEach(m => {
        out += `  • ${m.varName}\n`;
        m.refs.forEach(r => {
          out += `    └─ Referenced at line ${r.loc?.start?.line}:${r.loc?.start?.column} (${r.prefix}.${m.varName})\n`;
        });
      });
      out += `\n`;
    }

    if (analysis.dead.length > 0) {
      out += `✖ DEAD (declared in .env, never referenced in AST):\n`;
      analysis.dead.forEach(d => {
        out += `  • ${d.key} (line ${d.line})\n`;
        out += `    └─ Declared with value but zero AST read nodes found\n`;
      });
      out += `\n`;
    }

    if (analysis.empty.length > 0) {
      out += `⚠ EMPTY (declared with blank/empty value in .env):\n`;
      analysis.empty.forEach(e => {
        out += `  • ${e.varName} (line ${e.envEntry?.line})\n`;
        out += `    └─ Assigned empty string; will evaluate to undefined\n`;
      });
      out += `\n`;
    }

    if (analysis.duplicate.length > 0) {
      out += `⚠ DUPLICATE (defined multiple times in .env):\n`;
      analysis.duplicate.forEach(dup => {
        out += `  • ${dup.key}\n`;
        out += `    └─ Repeated on lines: ${dup.lines.join(', ')}\n`;
      });
      out += `\n`;
    }

    if (analysis.security.length > 0) {
      out += `🔒 SECURITY WARNING (client exposure prefix missing):\n`;
      analysis.security.forEach(s => {
        out += `  • ${s.varName}\n`;
        out += `    └─ Vite rule requires 'VITE_' prefix to expose variables to client bundle\n`;
      });
      out += `\n`;
    }

    if (analysis.valid.length > 0) {
      out += `✔ VALID (active and verified in AST):\n`;
      analysis.valid.forEach(v => {
        out += `  • ${v.varName} (defined line ${v.envEntries[0]?.line})\n`;
      });
      out += `\n`;
    }

    out += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    const summaryParts = [
      `${analysis.valid.length} Valid`,
      analysis.security.length > 0 ? `${analysis.security.length} Security Warning${analysis.security.length > 1 ? 's' : ''}` : null,
      `${analysis.missing.length} Missing`,
      `${analysis.dead.length} Dead`,
      `${analysis.empty.length} Empty`,
      `${analysis.duplicate.length} Duplicate`
    ].filter(Boolean);

    out += `Summary: ${summaryParts.join(' | ')}\n`;
    out += `Execution: 0.12s | @babel/parser dynamic engine`;

    return out;
  }, [analysis, selectedPresetKey]);

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
            <span>{astNodes.length} nodes parsed</span>
          </div>

          <div className="space-y-1">
            {astNodes.map((node, idx) => {
              const isSelected = activeNode === node;
              const isEnvNode = node.preview.includes('process.env') || node.preview.includes('import.meta.env');

              return (
                <div
                  key={idx}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={playHoverSound}
                  className={`py-1.5 px-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-[#10B981]/20 border border-[#10B981]/60 text-white shadow-sm'
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

                  {isEnvNode && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md badge-emerald shrink-0 font-bold">
                      ENV NODE
                    </span>
                  )}
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

      {/* Live Status Classification Strip */}
      <div className="mt-4 pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500">Live Heuristics:</span>
          <span className="px-2 py-0.5 rounded-md badge-emerald text-[11px]">
            {analysis.valid.length} Valid
          </span>
          {analysis.security.length > 0 && (
            <span className="px-2 py-0.5 rounded-md text-[11px] bg-amber-950/60 text-amber-300 border border-amber-500/40 font-semibold">
              {analysis.security.length} Security Warning{analysis.security.length > 1 ? 's' : ''}
            </span>
          )}
          <span className={`px-2 py-0.5 rounded-md text-[11px] ${analysis.missing.length > 0 ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40' : 'bg-slate-900 text-slate-500 border border-white/5'}`}>
            {analysis.missing.length} Missing
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[11px] ${analysis.dead.length > 0 ? 'badge-indigo' : 'bg-slate-900 text-slate-500 border border-white/5'}`}>
            {analysis.dead.length} Dead
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[11px] ${analysis.empty.length > 0 ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40' : 'bg-slate-900 text-slate-500 border border-white/5'}`}>
            {analysis.empty.length} Empty
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[11px] ${analysis.duplicate.length > 0 ? 'bg-purple-950/60 text-purple-300 border border-purple-500/40' : 'bg-slate-900 text-slate-500 border border-white/5'}`}>
            {analysis.duplicate.length} Duplicate
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
