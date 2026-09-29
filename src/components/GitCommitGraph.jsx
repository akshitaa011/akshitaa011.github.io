import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, GitPullRequest, GitMerge, ExternalLink, X, Check, Code, ShieldCheck, Info } from 'lucide-react';
import { playClickSound, playHoverSound } from '../utils/audioFx';

const gitEvents = [
  {
    id: "submitty-12567",
    branch: "fix/timer-progress-clamp",
    branchColor: "#6366F1",
    hash: "c7a2b9f",
    type: "merge",
    prNumber: 12567,
    title: "Merge PR #12567: Clamp gradeable submission progress overflow",
    repo: "Submitty / Submitty (RPI)",
    date: "Jan 2026",
    status: "Merged to Production",
    isIllustrative: false,
    verificationBadge: "Verified Production PR",
    url: "https://github.com/Submitty/Submitty/pull/12567",
    filesChanged: 2,
    insertions: 14,
    deletions: 4,
    diff: [
      { type: "header", text: "--- a/site/app/views/submission/SubmissionView.php" },
      { type: "header", text: "+++ b/site/app/views/submission/SubmissionView.php" },
      { type: "context", text: "@@ -148,7 +148,9 @@ public function renderProgressBar($elapsed, $total) {" },
      { type: "del", text: "-    $percentage = ($elapsed / $total) * 100;" },
      { type: "add", text: "+    // Prevent progress bar visual overflow when timers exceed expected duration" },
      { type: "add", text: "+    $rawRatio = $total > 0 ? ($elapsed / $total) * 100 : 0;" },
      { type: "add", text: "+    $percentage = max(0, min(100, $rawRatio));" },
      { type: "context", text: "     return $this->core->getOutput()->renderTemplate(...);" }
    ]
  },
  {
    id: "submitty-12549",
    branch: "refactor/forum-keyboard-a11y",
    branchColor: "#A5B4FC",
    hash: "9e4d10a",
    type: "merge",
    prNumber: 12549,
    title: "Merge PR #12549: Improve Discussion Forum keyboard accessibility",
    repo: "Submitty / Submitty (RPI)",
    date: "Feb 2026",
    status: "Merged to Production",
    isIllustrative: false,
    verificationBadge: "Verified Production PR",
    url: "https://github.com/Submitty/Submitty/pull/12549",
    filesChanged: 3,
    insertions: 32,
    deletions: 18,
    diff: [
      { type: "header", text: "--- a/site/public/js/forum.js" },
      { type: "header", text: "+++ b/site/public/js/forum.js" },
      { type: "context", text: "@@ -312,9 +312,12 @@ $(document).ready(function() {" },
      { type: "del", text: "-  $('.thread-item').on('keydown', function(e) { handleKey(e); });" },
      { type: "add", text: "+  // Refactor TAB / ESC keyboard handling using event delegation on forum root" },
      { type: "add", text: "+  $('#forum-thread-container').on('keydown', '.thread-focusable', function(e) {" },
      { type: "add", text: "+    if (e.key === 'Tab' || e.key === 'Escape') {" },
      { type: "add", text: "+      manageFocusTrap(e, this);" },
      { type: "add", text: "+    }" },
      { type: "add", text: "+  });" }
    ]
  },
  {
    id: "strive-rbac",
    branch: "feature/rbac-kafka-pipeline",
    branchColor: "#10B981",
    hash: "4b8e21d",
    type: "commit",
    title: "feat(auth): integrate OAuth 2.0 / JWT & Kafka event pipeline",
    repo: "Strive Partners (SDE Intern)",
    date: "June 2026",
    status: "Internal Codebase (Simulation)",
    isIllustrative: true,
    verificationBadge: "Architecture Simulation",
    url: null,
    filesChanged: 8,
    insertions: 142,
    deletions: 21,
    diff: [
      { type: "header", text: "--- a/src/main/java/com/strive/service/AuthService.java" },
      { type: "header", text: "+++ b/src/main/java/com/strive/service/AuthService.java" },
      { type: "context", text: "@@ -45,6 +45,11 @@ public AuthResponse authenticate(AuthRequest req) {" },
      { type: "add", text: "+    User user = userRepository.findByEmail(req.getEmail())" },
      { type: "add", text: "+        .orElseThrow(() -> new UnauthorizedException(\"Invalid credentials\"));" },
      { type: "add", text: "+    String token = jwtProvider.generateToken(user, user.getRoles());" },
      { type: "add", text: "+    kafkaTemplate.send(\"user-login-audit\", user.getId(), new LoginEvent(user.getId()));" },
      { type: "add", text: "+    return new AuthResponse(token, user.getRolePermissions());" }
    ]
  }
];

export default function GitCommitGraph() {
  const [selectedCommit, setSelectedCommit] = useState(gitEvents[0]);
  const [isDiffOpen, setIsDiffOpen] = useState(false);

  const handleSelect = (commit) => {
    playClickSound();
    setSelectedCommit(commit);
    setIsDiffOpen(true);
  };

  return (
    <div className="w-full my-8">
      {/* Visual Git Branch Pipeline Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg badge-indigo">
              <GitMerge className="w-4 h-4 text-[#A5B4FC]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
                Production Git Branch Tree
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full badge-emerald">
                  Live History
                </span>
              </h4>
              <p className="text-xs text-[#9CA3AF]">Click any node to inspect unified code diffs or view live pull requests</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#9CA3AF]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
              <span>main</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]"></span>
              <span>Submitty</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A5B4FC]"></span>
              <span>a11y</span>
            </span>
          </div>
        </div>

        {/* Tree Nodes Flow */}
        <div className="space-y-4">
          {gitEvents.map((evt) => {
            const isSelected = selectedCommit?.id === evt.id;
            return (
              <div
                key={evt.id}
                tabIndex={0}
                role="button"
                aria-label={`Inspect git commit ${evt.hash} - ${evt.title}`}
                onClick={() => handleSelect(evt)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(evt);
                  }
                }}
                onMouseEnter={playHoverSound}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] ${
                  isSelected
                    ? 'bg-[rgba(17,24,39,0.70)] border-[#6366F1]/50 shadow-md shadow-[#6366F1]/15'
                    : 'bg-[rgba(17,24,39,0.50)] border-white/[0.08] hover:border-white/20 hover:bg-slate-900/50'
                }`}
              >
                {/* Node details */}
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border"
                    style={{
                      borderColor: evt.branchColor,
                      backgroundColor: `${evt.branchColor}18`,
                      color: evt.branchColor,
                    }}
                  >
                    {evt.type === 'merge' ? <GitMerge className="w-4 h-4" /> : <GitCommit className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-white hover:text-[#A5B4FC] transition-colors">
                        {evt.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-[#9CA3AF] border border-white/[0.06]">
                        {evt.hash}
                      </span>
                      {evt.isIllustrative ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full text-amber-300 bg-amber-950/40 border border-amber-500/30">
                          Architecture Simulation
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full text-emerald-300 bg-emerald-950/40 border border-emerald-500/30">
                          Verified Production PR
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#9CA3AF] mt-1 font-mono">
                      <span style={{ color: evt.branchColor }}>{evt.branch}</span>
                      <span>•</span>
                      <span>{evt.repo}</span>
                      <span>•</span>
                      <span className="text-[#34D399]">+{evt.insertions}</span>
                      <span className="text-rose-400">-{evt.deletions}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
                  {/* Direct link to real PR if available */}
                  {evt.url && (
                    <a
                      href={evt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        playClickSound();
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg badge-indigo text-xs font-mono font-medium hover:scale-105 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#6366F1]"
                      aria-label={`Open PR #${evt.prNumber} directly on GitHub (opens in new tab)`}
                    >
                      <GitPullRequest className="w-3.5 h-3.5 text-[#818CF8]" />
                      <span>PR #{evt.prNumber}</span>
                      <ExternalLink className="w-3 h-3 text-[#A5B4FC]" />
                    </a>
                  )}

                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-[#9CA3AF] border border-white/[0.08] hidden md:inline-block">
                    {evt.date}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(evt);
                    }}
                    className="text-xs font-mono text-[#A5B4FC] hover:text-white px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center gap-1 transition-colors"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>View Diff</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Interactive Git Unified Diff Modal */}
      <AnimatePresence>
        {isDiffOpen && selectedCommit && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
            onClick={() => setIsDiffOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl bg-[#030712] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] font-mono text-xs"
            >
              {/* Diff Header */}
              <div className="p-4 bg-[#090d16] border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg badge-emerald">
                    <GitPullRequest className="w-4 h-4 text-[#10B981]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                      {selectedCommit.title}
                    </h3>
                    <span className="text-[11px] text-[#9CA3AF] font-mono">
                      commit {selectedCommit.hash} • {selectedCommit.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedCommit.url && (
                    <a
                      href={selectedCommit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg badge-indigo text-[11px]"
                    >
                      <span>GitHub PR</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      playClickSound();
                      setIsDiffOpen(false);
                    }}
                    className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-white/[0.06] cursor-pointer"
                    aria-label="Close diff modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Code Diff Body */}
              <div className="p-4 overflow-y-auto space-y-1 bg-black/80 flex-1 leading-relaxed">
                {selectedCommit.diff.map((line, idx) => {
                  if (line.type === "header") {
                    return <div key={idx} className="text-slate-500 font-bold">{line.text}</div>;
                  }
                  if (line.type === "context") {
                    return <div key={idx} className="text-[#A5B4FC] bg-[#6366F1]/10 px-2 py-0.5 rounded my-1">{line.text}</div>;
                  }
                  if (line.type === "add") {
                    return <div key={idx} className="text-[#34D399] bg-emerald-950/40 px-2 py-0.5 rounded font-medium">{line.text}</div>;
                  }
                  if (line.type === "del") {
                    return <div key={idx} className="text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded line-through opacity-80">{line.text}</div>;
                  }
                  return <div key={idx} className="text-[#9CA3AF] px-2">{line.text}</div>;
                })}
              </div>

              {/* Diff Footer */}
              <div className="p-3 bg-[#030712] border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#9CA3AF]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-3.5 h-3.5 ${selectedCommit.isIllustrative ? 'text-amber-400' : 'text-[#10B981]'}`} />
                  <span>
                    {selectedCommit.isIllustrative 
                      ? 'Architecture Simulation • Illustrative model based on Strive Partners internal architecture'
                      : 'Verified Production Contribution • Reviewed & Merged in Submitty repository'
                    }
                  </span>
                </div>
                <span>{selectedCommit.filesChanged} files changed • +{selectedCommit.insertions} -{selectedCommit.deletions}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
