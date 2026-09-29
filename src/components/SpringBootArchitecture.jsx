import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Database, Shield, Zap, Cpu, Play, CheckCircle2, RefreshCw } from 'lucide-react';
import { playClickSound, playHoverSound } from '../utils/audioFx';

const NODES = [
  {
    id: 'client',
    name: 'Client Application',
    type: 'Frontend / Client',
    tech: 'React 19 / HTTP / REST',
    latency: '15-40ms',
    throughput: 'Concurrent Users',
    role: 'Issues signed REST requests with JWT bearers to entry endpoints.'
  },
  {
    id: 'gateway',
    name: 'API Gateway',
    type: 'Edge Router',
    tech: 'Spring Cloud Gateway',
    latency: '< 4ms',
    throughput: '25,000 req/s',
    role: 'Handles TLS termination, rate-limiting, CORS policies, and path routing.'
  },
  {
    id: 'auth',
    name: 'Auth & Event Service',
    type: 'Core Backend',
    tech: 'Spring Boot 3.2 • Java 21',
    latency: '< 18ms',
    throughput: '8,500 req/s',
    role: 'Executes RBAC verification, business validation, and publishes transactional events.'
  },
  {
    id: 'kafka',
    name: 'Apache Kafka',
    type: 'Event Streaming',
    tech: 'Kafka 3.6 • Partitions',
    latency: '< 2ms publish',
    throughput: '120k msgs/s',
    role: 'Decoupled persistent event stream with partitioned offset log for async workers.'
  },
  {
    id: 'db',
    name: 'Primary Database',
    type: 'Relational Store',
    tech: 'PostgreSQL 16 + Redis',
    latency: '< 6ms index query',
    throughput: 'ACID Transactions',
    role: 'Relational data store with Redis L2 read caching for sub-millisecond hot lookups.'
  }
];

export default function SpringBootArchitecture() {
  const [selectedNode, setSelectedNode] = useState(NODES[2]); // default to Core Auth & Event Service
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(null);

  const simulateTrace = () => {
    if (isSimulating) return;
    playClickSound();
    setIsSimulating(true);

    const sequence = ['client', 'gateway', 'auth', 'kafka', 'db'];
    sequence.forEach((id, index) => {
      setTimeout(() => {
        setActiveStep(id);
        const nodeObj = NODES.find(n => n.id === id);
        if (nodeObj) setSelectedNode(nodeObj);
        playHoverSound();

        if (index === sequence.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
            setActiveStep(null);
          }, 800);
        }
      }, index * 600);
    });
  };

  return (
    <div className="w-full mt-4 p-5 sm:p-6 rounded-2xl bg-[#030712]/95 border border-white/[0.1] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono text-[#10B981] uppercase font-bold tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
            Interactive Microservices Architecture
          </span>
          <h4 className="text-sm sm:text-base font-heading font-bold text-white mt-0.5">
            Spring Boot • Kafka • Distributed Event Pipeline
          </h4>
        </div>

        <button
          onClick={simulateTrace}
          disabled={isSimulating}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/40 text-[#34D399] text-xs font-mono font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          {isSimulating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Tracing Request...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-[#34D399]" />
              <span>Simulate Trace Flow</span>
            </>
          )}
        </button>
      </div>

      {/* Nodes Flow Diagram */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-5 relative">
        {NODES.map((node) => {
          const isSelected = selectedNode.id === node.id;
          const isTraceActive = activeStep === node.id;

          return (
            <button
              key={node.id}
              onClick={() => {
                playClickSound();
                setSelectedNode(node);
              }}
              onMouseEnter={playHoverSound}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[96px] ${
                isTraceActive
                  ? 'bg-[#10B981]/20 border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.35)] scale-[1.03]'
                  : isSelected
                  ? 'bg-[#6366F1]/20 border-[#6366F1] shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                  : 'bg-slate-900/60 hover:bg-slate-900 border-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider truncate">
                  {node.type}
                </span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] shrink-0" />}
              </div>
              <span className="font-heading font-bold text-xs text-white leading-tight">
                {node.name}
              </span>
              <span className="text-[10px] font-mono text-[#34D399] mt-1">
                {node.latency}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Node Inspector Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedNode.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs text-[#9CA3AF]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">{selectedNode.name}</span>
              <span className="px-2 py-0.5 rounded-md badge-indigo text-[10px]">
                {selectedNode.tech}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>Latency SLA: <strong className="text-[#34D399]">{selectedNode.latency}</strong></span>
              <span className="text-slate-700">|</span>
              <span>Throughput: <strong className="text-white">{selectedNode.throughput}</strong></span>
            </div>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {selectedNode.role}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
