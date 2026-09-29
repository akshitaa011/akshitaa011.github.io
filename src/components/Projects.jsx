import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderGit2, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  GitPullRequest, 
  Server,
  Star,
  Calendar,
  Code2,
  ArrowUpRight
} from 'lucide-react';
import { Github } from './Icons';
import { portfolioData } from '../data/portfolioData';
import fallbackRepos from '../data/github-repos.json';
import AstPlayground from './AstPlayground';
import SpringBootArchitecture from './SpringBootArchitecture';
import SubmittyPrViewer from './SubmittyPrViewer';
import { playClickSound, playHoverSound } from '../utils/audioFx';

const GITHUB_USERNAME = 'akshitaa011';
const CACHE_KEY = 'akshita_github_repos_cache_v3';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes TTL

const EXCLUDED_NAMES = new Set([
  'envguard',
  'dsaverse',
  'intellichat-ai',
  'intellichat',
  'akshitaa011',
  'akshitaa011.github.io',
  'ner-model',
  'radar-x'
]);

const LANG_COLORS = {
  Python: '#3572A5',
  HTML: '#e34c26',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555'
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function ProjectCard({ project }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <motion.div
      ref={cardRef}
      tabIndex={0}
      role="region"
      aria-label={`Project: ${project.title}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        playHoverSound();
      }}
      onMouseLeave={() => setIsHovered(false)}
      variants={{
        hidden: { opacity: 0, y: 35, scale: 0.96 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
      }}
      className="glass-card rounded-2xl flex flex-col justify-between overflow-hidden border border-white/[0.08] hover:border-[#10B981]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] relative transition-all duration-300 group"
      style={{
        boxShadow: isHovered ? '0 12px 30px -10px rgba(16, 185, 129, 0.15)' : 'none'
      }}
    >
      {/* Mouse-Following Spotlight Glow */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.12), rgba(99, 102, 241, 0.05) 50%, transparent 80%)`
          }}
        />
      )}

      {/* Card Header */}
      <div className="p-6 sm:p-7 pb-4 relative z-10">
        
        {/* Meta Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full badge-emerald">
            {project.badge}
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {project.category}
          </span>
        </div>

        {/* Project Title */}
        <h3 className="text-2xl font-bold font-heading text-white group-hover:text-[#34D399] transition-colors mb-2">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Architecture Highlights */}
        <div className="space-y-2 mb-5">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-semibold">
            Core Architecture:
          </span>
          <ul className="space-y-1.5 text-xs text-[#9CA3AF]">
            {project.highlights.map((hl, hIdx) => (
              <li key={hIdx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                <span>{hl}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Card Footer: Tech Stack & Actions */}
      <div className="p-6 sm:p-7 pt-0 mt-auto relative z-10">
        
        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 mb-5 pt-4 border-t border-white/[0.08]">
          {project.techStack.map((tech, tIdx) => (
            <span
              key={tIdx}
              className="px-2.5 py-0.5 rounded-md badge-indigo text-[11px] font-mono"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Links: Clean full-width View Code */}
        <div className="flex items-center">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClickSound}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] hover:border-white/20 text-slate-200 hover:text-white text-xs font-medium transition-all group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]"
          >
            <Github className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-white" />
            <span>View Code</span>
          </a>
        </div>
      </div>

    </motion.div>
  );
}

export default function Projects() {
  const { projects } = portfolioData;
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeInteractiveDemo, setActiveInteractiveDemo] = useState('ast'); // 'ast', 'spring', 'submitty', 'none'

  // Additional GitHub repositories state with runtime API fetch + fallback + cache
  const [moreRepos, setMoreRepos] = useState(fallbackRepos || []);
  const [repoLangFilter, setRepoLangFilter] = useState('All');

  useEffect(() => {
    async function loadRepos() {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_TTL && Array.isArray(parsed.data) && parsed.data.length > 0) {
            setMoreRepos(parsed.data);
            return;
          }
        }

        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
        if (!res.ok) return;

        const data = await res.json();
        if (!Array.isArray(data)) return;

        const filtered = data
          .filter(r => !r.fork && !r.archived && !EXCLUDED_NAMES.has(r.name.toLowerCase()))
          .map(r => {
            const isResumeIQ = r.name.toLowerCase() === 'resumeiq';
            return {
              id: r.id,
              name: r.name,
              fullName: r.full_name,
              description: isResumeIQ 
                ? "Interactive resume analysis & engineering tool built with JavaScript and HTML" 
                : (r.description || `${r.name} engineering repository by @${GITHUB_USERNAME}`),
              language: isResumeIQ ? 'JavaScript' : (r.language || 'Code'),
              languages: isResumeIQ ? ['JavaScript', 'HTML'] : (r.language ? [r.language] : ['Code']),
              stars: r.stargazers_count,
              forks: r.forks_count,
              updatedAt: r.updated_at,
              htmlUrl: r.html_url,
              homepage: r.homepage ? r.homepage.trim() : null
            };
          });

        if (filtered.length > 0) {
          setMoreRepos(filtered);
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: filtered
          }));
        }
      } catch {
        // Fallback remains active
      }
    }

    loadRepos();
  }, []);

  const categories = ['All', 'Developer Tooling & Systems', 'Full Stack & EdTech', 'AI & Full Stack'];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  // GitHub repos unique languages
  const repoLanguages = ['All', ...Array.from(new Set(moreRepos.flatMap(r => r.languages || [r.language]).filter(Boolean)))];

  const filteredMoreRepos = repoLangFilter === 'All'
    ? moreRepos
    : moreRepos.filter(r => (r.languages ? r.languages.includes(repoLangFilter) : r.language === repoLangFilter));

  return (
    <section id="projects" className="py-24 relative bg-transparent scroll-mt-24 sm:scroll-mt-28">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#10B981]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-emerald text-xs font-mono mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Featured Engineering</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            Flagship Software & <span className="text-gradient">Interactive Systems</span>
          </h2>
          <p className="text-[#9CA3AF] text-sm sm:text-base max-w-2xl mt-3">
            Production systems, AST-based static code analyzers, and event-driven architectures built for developer productivity and user impact.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playClickSound();
                  setActiveFilter(cat);
                }}
                onMouseEnter={playHoverSound}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] font-semibold'
                    : 'bg-slate-900/60 text-[#9CA3AF] border border-white/[0.08] hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Flagship Demonstrator Tabs */}
        <div className="mb-14">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#10B981]" />
                <span>Interactive Architecture & Demos</span>
              </span>
            </div>

            {/* Toggle demo selector */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/[0.08] text-xs font-mono">
              <button
                onClick={() => {
                  playClickSound();
                  setActiveInteractiveDemo(activeInteractiveDemo === 'ast' ? 'none' : 'ast');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeInteractiveDemo === 'ast'
                    ? 'bg-[#10B981]/20 border border-[#10B981]/50 text-[#34D399] font-semibold'
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>AST Parser (EnvGuard)</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setActiveInteractiveDemo(activeInteractiveDemo === 'spring' ? 'none' : 'spring');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeInteractiveDemo === 'spring'
                    ? 'bg-[#10B981]/20 border border-[#10B981]/50 text-[#34D399] font-semibold'
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>Spring Boot Microservices</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setActiveInteractiveDemo(activeInteractiveDemo === 'submitty' ? 'none' : 'submitty');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeInteractiveDemo === 'submitty'
                    ? 'bg-[#10B981]/20 border border-[#10B981]/50 text-[#34D399] font-semibold'
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                <GitPullRequest className="w-3.5 h-3.5" />
                <span>Submitty PR Diffs</span>
              </button>
            </div>
          </div>

          {/* Interactive Demos Content Panel */}
          <AnimatePresence mode="wait">
            {activeInteractiveDemo === 'ast' && (
              <motion.div
                key="ast"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <AstPlayground />
              </motion.div>
            )}

            {activeInteractiveDemo === 'spring' && (
              <motion.div
                key="spring"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <SpringBootArchitecture />
              </motion.div>
            )}

            {activeInteractiveDemo === 'submitty' && (
              <motion.div
                key="submitty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <SubmittyPrViewer />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Projects Bento Grid with Dynamic Staggered Reveal */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12,
              }
            }
          }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20"
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenDemo={(demoKey) => setActiveInteractiveDemo(demoKey)}
            />
          ))}
        </motion.div>

        {/* TASK 2: More Projects from GitHub Section */}
        {moreRepos.length > 0 && (
          <div className="pt-12 border-t border-white/[0.08]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-indigo text-xs font-mono mb-2">
                  <Code2 className="w-3.5 h-3.5 text-[#818CF8]" />
                  <span>Open Repositories</span>
                </div>
                <h3 className="text-2xl font-bold font-heading text-white">
                  More Projects from <span className="text-gradient">GitHub</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1 max-w-xl">
                  Public codebases, NLP research models, and domain tools fetched live from @{GITHUB_USERNAME}.
                </p>
              </div>

              {/* Language Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {repoLanguages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setRepoLangFilter(lang);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      repoLangFilter === lang
                        ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 font-semibold'
                        : 'bg-slate-900/60 text-[#9CA3AF] border border-white/[0.08] hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Repos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {filteredMoreRepos.map((repo) => (
                <div
                  key={repo.id}
                  tabIndex={0}
                  role="region"
                  aria-label={`Repository: ${repo.name}`}
                  className="glass-card p-5 rounded-xl border border-white/[0.08] hover:border-[#10B981]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] flex flex-col justify-between group transition-all"
                >
                  <div>
                    {/* Header: Title + Language */}
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <FolderGit2 className="w-4 h-4 text-[#10B981] shrink-0" />
                        <h4 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-[#34D399] transition-colors truncate">
                          {repo.name}
                        </h4>
                      </div>
                      {(repo.languages && repo.languages.length > 0) ? (
                        <div className="flex items-center gap-2.5 shrink-0">
                          {repo.languages.map((lang) => (
                            <span key={lang} className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                              <span 
                                className="w-2 h-2 rounded-full inline-block" 
                                style={{ backgroundColor: LANG_COLORS[lang] || '#10B981' }} 
                              />
                              <span>{lang}</span>
                            </span>
                          ))}
                        </div>
                      ) : repo.language ? (
                        <span className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 shrink-0">
                          <span 
                            className="w-2 h-2 rounded-full inline-block" 
                            style={{ backgroundColor: LANG_COLORS[repo.language] || '#10B981' }} 
                          />
                          <span>{repo.language}</span>
                        </span>
                      ) : null}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#9CA3AF] leading-relaxed mb-4 line-clamp-2">
                      {repo.description}
                    </p>
                  </div>

                  {/* Footer Meta & Actions */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-4">
                      {repo.stars > 0 && (
                        <span className="flex items-center gap-1 hover:text-white transition-colors">
                          <Star className="w-3.5 h-3.5 text-amber-400" />
                          <span>{repo.stars}</span>
                        </span>
                      )}
                      {repo.updatedAt && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(repo.updatedAt)}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#34D399] hover:text-[#6EE7B7] text-xs font-mono font-medium hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-[#10B981] px-1.5 py-0.5"
                      >
                        <Github className="w-3 h-3" />
                        <span>Code</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* "View all on GitHub" button */}
            <div className="flex justify-center">
              <a
                href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.12] hover:border-[#10B981]/50 text-white text-xs sm:text-sm font-mono transition-all group shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]"
              >
                <Github className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                <span>View all repositories on GitHub</span>
                <ArrowUpRight className="w-4 h-4 text-[#10B981] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
