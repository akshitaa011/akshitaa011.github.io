import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Zap, Terminal, Sparkles, Box, Code } from 'lucide-react';
import { Github, Linkedin, LeetCode } from './Icons';
import { portfolioData } from '../data/portfolioData';
import KineticName from './KineticName';
import TechKeywordTooltip from './TechKeywordTooltip';
import LiveActivityTicker from './LiveActivityTicker';
import MagneticButton from './MagneticButton';

const easeOutExpo = [0.16, 1, 0.3, 1];

const ROLES = [
  "Software Development Engineer",
  "Systems & Distributed Architecture",
  "Open Source Contributor"
];

export default function Hero({ onOpenRecruiter, onOpenTerminal }) {
  const { personal } = portfolioData;

  const [roleIndex, setRoleIndex] = useState(0);
  const [currentRoleText, setCurrentRoleText] = useState(ROLES[0]);
  const [isRoleDeleting, setIsRoleDeleting] = useState(false);

  useEffect(() => {
    const fullText = ROLES[roleIndex];
    let timer;

    if (!isRoleDeleting && currentRoleText.length < fullText.length) {
      timer = setTimeout(() => {
        setCurrentRoleText(fullText.substring(0, currentRoleText.length + 1));
      }, 40);
    } else if (!isRoleDeleting && currentRoleText.length === fullText.length) {
      timer = setTimeout(() => {
        setIsRoleDeleting(true);
      }, 2600);
    } else if (isRoleDeleting && currentRoleText.length > 0) {
      timer = setTimeout(() => {
        setCurrentRoleText(fullText.substring(0, currentRoleText.length - 1));
      }, 22);
    } else if (isRoleDeleting && currentRoleText.length === 0) {
      setIsRoleDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }

    return () => clearTimeout(timer);
  }, [currentRoleText, isRoleDeleting, roleIndex]);

  const springSnippet = `@RestController
@RequestMapping("/api/v1/events")
public class EventWorkflowController {
  @Autowired
  private KafkaTemplate<String, Object> kafka;

  @PostMapping("/dispatch")
  public ResponseEntity<Response> emit(@Valid @RequestBody Event e) {
    kafka.send("orders.topic", e.getId(), e);
    return ResponseEntity.ok(Response.success("Emitted"));
  }
}`;

  const reactSnippet = `interface SDEProfile {
  name: "Akshita Singhal";
  gpa: 9.58;
  stack: ["React 19", "TypeScript", "Redux"];
}

export const Engine: React.FC<SDEProfile> = ({ stack }) => {
  const dispatch = useAppDispatch();
  return <RoleRBACProvider roles={['ADMIN', 'DEV']} />;
};`;

  const astSnippet = `import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

export function scanEnvVars(code: string) {
  const ast = parse(code, { sourceType: "module" });
  traverse(ast, {
    MemberExpression(path) {
      if (path.node.object.name === "process") {
        trackEnvUsage(path.node.property.name);
      }
    }
  });
}`;

  return (
    <section
      id="about"
      className="relative min-h-[70vh] lg:min-h-[75vh] flex items-center justify-center pt-8 sm:pt-12 pb-12 overflow-hidden scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 flex flex-col items-center">
        
        {/* Status Pill with Pulsing Live Emerald Beacon */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[rgba(17,24,39,0.60)] border border-white/[0.08] backdrop-blur-md text-xs font-mono text-[#9CA3AF] mb-5 select-none"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </span>
          <span className="font-semibold text-white tracking-tight">Available for SDE Roles & Internships</span>
          <span className="text-slate-600">|</span>
          <span className="text-[#9CA3AF] font-normal">B.Tech CSE '28 • CGPA 9.58</span>
        </motion.div>

        {/* Interactive Kinetic 3D Name Tilt with Character Reveal */}
        <KineticName name={personal.name} />

        {/* Dynamic Rotating Role Title with Fixed Reserved Layout Width & Height (CLS & Clipping Prevention) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="min-h-[2.5rem] w-full max-w-xl mx-auto flex items-center justify-center mb-3 text-xs sm:text-base md:text-lg font-mono font-semibold text-[#34D399] px-2 text-center overflow-visible"
        >
          <span className="text-[#A5B4FC] mr-2 shrink-0">›</span>
          <span className="inline-block">{currentRoleText}</span>
          <span className="animate-pulse text-[#10B981] ml-0.5 font-bold shrink-0">_</span>
        </motion.div>

        {/* Subheadline with Interactive Floating Code Snippet Tooltip Trigger Pills (Punctuation wrap-safe) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: easeOutExpo }}
          className="text-base sm:text-xl md:text-2xl text-[#9CA3AF] max-w-3xl font-normal leading-relaxed mb-6 tracking-tight"
        >
          Building{' '}
          <span className="inline-block whitespace-nowrap">
            <TechKeywordTooltip
              title="Java Spring Boot Backend Architecture"
              tag="REST • Kafka • RBAC"
              snippet={springSnippet}
            >
              Java Spring Boot backends
            </TechKeywordTooltip>,
          </span>{' '}
          <span className="inline-block whitespace-nowrap">
            <TechKeywordTooltip
              title="React 19 & TypeScript Systems"
              tag="TypeScript • Redux • UI"
              snippet={reactSnippet}
            >
              React & TypeScript interfaces
            </TechKeywordTooltip>,
          </span>{' '}and{' '}
          <span className="inline-block whitespace-nowrap">
            <TechKeywordTooltip
              title="AST-Based Static Analysis (EnvGuard)"
              tag="Babel AST • CLI • npm"
              snippet={astSnippet}
            >
              AST-based developer tooling
            </TechKeywordTooltip>.
          </span>
        </motion.p>

        {/* Live System Activity Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: easeOutExpo }}
          className="w-full mb-6"
        >
          <LiveActivityTicker />
        </motion.div>

        {/* Primary CTA Buttons with Magnetic Physics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: easeOutExpo }}
          className="flex flex-wrap items-center justify-center gap-4 mb-6"
        >
          <MagneticButton
            onClick={onOpenRecruiter}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-semibold text-sm transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] cursor-pointer group hover:scale-[1.02]"
          >
            <Zap className="w-4 h-4 text-black fill-black" />
            <span>Recruiter Speed-Run (30s)</span>
          </MagneticButton>

          <MagneticButton
            onClick={() => {
              const el = document.getElementById('projects');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[rgba(17,24,39,0.60)] border border-white/[0.08] hover:border-white/20 text-[#9CA3AF] hover:text-white font-medium text-sm transition-all duration-300 backdrop-blur-md hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40 cursor-pointer"
          >
            <span>Explore Engineering</span>
            <ArrowDown className="w-4 h-4 text-[#9CA3AF]" />
          </MagneticButton>
        </motion.div>

        {/* Muted Monochrome Social Proof Bar with Vertical Clearance from Floating Dock */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.45, ease: easeOutExpo }}
          className="flex flex-wrap items-center justify-center gap-5 text-xs font-mono text-[#9CA3AF] pb-6"
        >
          <a
            href={personal.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-white/[0.05]"
          >
            <Github className="w-4 h-4 text-[#9CA3AF]" />
            <span>GitHub (@akshitaa011)</span>
          </a>
          <span className="text-slate-700 select-none">•</span>
          <a
            href={personal.links.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-white/[0.05]"
          >
            <LeetCode className="w-4 h-4 text-[#9CA3AF]" />
            <span>LeetCode (@akshita1111)</span>
          </a>
          <span className="text-slate-700 select-none">•</span>
          <a
            href={personal.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-white/[0.05]"
          >
            <Linkedin className="w-4 h-4 text-[#9CA3AF]" />
            <span>LinkedIn</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
