import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Code, Layers, Sparkles, ExternalLink, X, Database, Terminal, Server } from 'lucide-react';
import { playClickSound, playHoverSound } from '../utils/audioFx';

const techDetails = {
  "Java": {
    category: "Languages",
    level: "Advanced (Core Production)",
    experience: "2+ Years • Spring Boot & Kafka",
    projects: ["Strive Partners SDE Intern", "Distributed Backend APIs"],
    snippet: `// Enterprise Spring Security JWT Principal
public UserDetails loadUserByUsername(String email) {
  return userRepository.findByEmail(email)
      .map(CustomUserDetails::new)
      .orElseThrow(() -> new UsernameNotFoundException("User not found"));
}`
  },
  "Spring Boot": {
    category: "Backend Frameworks",
    level: "Advanced (Production APIs)",
    experience: "SDE Intern @ Strive Partners",
    projects: ["Strive Partners REST APIs", "Microservices Architecture"],
    snippet: `@Configuration
@EnableKafka
public class KafkaConfig {
  @Bean
  public ConcurrentKafkaListenerContainerFactory<String, Object> factory() {
    return new ConcurrentKafkaListenerContainerFactory<>();
  }
}`
  },
  "React.js": {
    category: "Frontend Architecture",
    level: "Advanced (React 19 & Next.js)",
    experience: "2+ Years • Redux Toolkit",
    projects: ["DSAverse", "Strive Partners UI", "Algobyte Official Portal"],
    snippet: `// Modular State Slice with Redux Toolkit
const dsaSlice = createSlice({
  name: 'dsa',
  initialState: { solved: 450, filter: 'all' },
  reducers: {
    toggleTopic: (state, action) => { state.active = action.payload; }
  }
});`
  },
  "TypeScript": {
    category: "Languages & Systems",
    level: "Advanced (Strict Typing)",
    experience: "EnvGuard CLI & Full-Stack",
    projects: ["EnvGuard AST Engine", "Strive Partners Frontend"],
    snippet: `type ASTVisitor<T = BabelNode> = {
  enter?(node: T, parent: T): void;
  exit?(node: T): void;
};`
  },
  "Apache Kafka": {
    category: "Streaming & Messaging",
    level: "Proficient (Event-Driven)",
    experience: "Strive Partners Async Broker",
    projects: ["Strive Partners Event Streaming"],
    snippet: `kafkaTemplate.send(
  ProducerRecord.builder()
    .topic("user.activity.v1")
    .key(userId)
    .value(payload)
    .build()
);`
  },
  "PostgreSQL": {
    category: "Relational Storage",
    level: "Advanced (ACID & Indexing)",
    experience: "Enterprise Schemas & RBAC",
    projects: ["Strive Partners Core DB", "Relational Models"],
    snippet: `CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id INT REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
);`
  },
  "Docker": {
    category: "DevOps & Containers",
    level: "Proficient (Containerization)",
    experience: "Multi-stage builds & Compose",
    projects: ["EnvGuard CI/CD", "Submitty local container testing"],
    snippet: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
CMD ["node", "dist/index.js"]`
  },
  "Babel AST": {
    category: "Compiler Tooling",
    level: "Advanced (Static Code Analysis)",
    experience: "EnvGuard Author (npm published)",
    projects: ["EnvGuard CLI"],
    snippet: `traverse(ast, {
  MemberExpression(path) {
    if (path.matchesPattern("process.env.*")) {
      validateEnvUsage(path.node.property.name);
    }
  }
});`
  },
  "MongoDB": {
    category: "NoSQL Databases",
    level: "Advanced (MERN Stack)",
    experience: "DSAverse & Algobyte Club",
    projects: ["DSAverse", "Algobyte Club Website"],
    snippet: `const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  metrics: { solvedCount: Number, optimalComplexity: String }
});`
  },
  "C++": {
    category: "Algorithmic Problem Solving",
    level: "Advanced (DSA & Competitive)",
    experience: "450+ Curated Problems",
    projects: ["Google The Big Code Top 1,500", "DSAverse Core Algorithms"],
    snippet: `template <typename T>
void dijkstra(int src, vector<vector<pair<int, T>>>& adj) {
  priority_queue<pair<T, int>, vector<pair<T, int>>, greater<>> pq;
  pq.push({0, src});
}`
  }
};

const techKeys = Object.keys(techDetails);

export default function TechStackOrbit() {
  const [selectedTech, setSelectedTech] = useState(null);
  const [isHoveringTrack, setIsHoveringTrack] = useState(false);

  const activeTechData = selectedTech ? techDetails[selectedTech] : null;

  return (
    <div className="w-full my-12 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-indigo text-xs font-mono mb-3">
          <Cpu className="w-3.5 h-3.5 text-[#A5B4FC]" />
          <span>Interactive Skills Ribbon</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
          Tactile <span className="text-[#34D399]">Tech Stack Matrix</span>
        </h3>
        <p className="text-[#9CA3AF] text-xs sm:text-sm max-w-xl mt-2 font-mono">
          Hover or click any technology node to inspect live code implementations, proficiency, and connected projects.
        </p>
      </div>

      {/* Marquee Track 1 (Left to Right) */}
      <div
        className="relative w-full overflow-hidden py-3 select-none"
        onMouseEnter={() => setIsHoveringTrack(true)}
        onMouseLeave={() => setIsHoveringTrack(false)}
      >
        <div className="flex gap-3 animate-marquee w-max hover:[animation-play-state:paused]">
          {[...techKeys, ...techKeys].map((tech, idx) => (
            <button
              key={`${tech}-${idx}`}
              onClick={() => {
                playClickSound();
                setSelectedTech(tech);
              }}
              onMouseEnter={playHoverSound}
              className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                selectedTech === tech
                  ? 'bg-[#6366F1]/20 text-[#A5B4FC] border-[#6366F1]/60 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                  : 'bg-[rgba(17,24,39,0.60)] text-[#9CA3AF] border border-white/[0.08] hover:border-white/20 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              <span>{tech}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Marquee Track 2 (Right to Left - Reverse) */}
      <div
        className="relative w-full overflow-hidden py-3 select-none"
        onMouseEnter={() => setIsHoveringTrack(true)}
        onMouseLeave={() => setIsHoveringTrack(false)}
      >
        <div className="flex gap-3 animate-marquee-reverse w-max hover:[animation-play-state:paused]">
          {[...techKeys.slice().reverse(), ...techKeys.slice().reverse()].map((tech, idx) => (
            <button
              key={`rev-${tech}-${idx}`}
              onClick={() => {
                playClickSound();
                setSelectedTech(tech);
              }}
              onMouseEnter={playHoverSound}
              className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                selectedTech === tech
                  ? 'bg-[#6366F1]/20 text-[#A5B4FC] border-[#6366F1]/60 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                  : 'bg-[rgba(17,24,39,0.60)] text-[#9CA3AF] border border-white/[0.08] hover:border-white/20 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              <span>{tech}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Micro Code-Snippet Popover */}
      <AnimatePresence>
        {selectedTech && activeTechData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full max-w-xl bg-[#030712] border border-white/[0.12] rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/[0.08] mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-extrabold text-xl text-white">
                      {selectedTech}
                    </h4>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full badge-indigo">
                      {activeTechData.category}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#34D399] mt-1">
                    {activeTechData.level} • {activeTechData.experience}
                  </div>
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedTech(null);
                  }}
                  className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-white/[0.05] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Connected Projects */}
              <div className="mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5">
                  Applied In Production / Flagship Projects:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeTechData.projects.map((proj, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/[0.08] text-xs font-mono text-slate-300"
                    >
                      {proj}
                    </span>
                  ))}
                </div>
              </div>

              {/* Micro Code Demonstration */}
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5">
                  Implementation Code Snippet:
                </span>
                <div className="p-3.5 rounded-xl bg-black/80 border border-white/[0.08] font-mono text-xs overflow-x-auto">
                  <pre className="text-[#9CA3AF] leading-relaxed">
                    <code>{activeTechData.snippet}</code>
                  </pre>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-5 pt-3 border-t border-white/[0.08] flex justify-end">
                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedTech(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.08] hover:border-white/20 text-white text-xs font-mono cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
