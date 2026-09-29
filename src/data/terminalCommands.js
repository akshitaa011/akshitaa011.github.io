import { portfolioData } from "./portfolioData";

export const handleTerminalCommand = (rawCommand, context = {}) => {
  const cmd = rawCommand.trim();
  const lower = cmd.toLowerCase();
  const parts = lower.split(/\s+/);
  const mainCmd = parts[0];
  const arg1 = parts[1];
  const fullArgs = parts.slice(1).join(" ");

  switch (mainCmd) {
    case "help":
      return [
        { type: "info", text: "=== AkshitaOS Terminal Command Reference ===" },
        { type: "output", text: "  whoami / bio     - Executive engineer profile & background" },
        { type: "output", text: "  projects [name]  - List all flagship projects or inspect one" },
        { type: "output", text: "  skills           - Categorized technical competencies" },
        { type: "output", text: "  experience       - Production industry & open-source history" },
        { type: "output", text: "  contact          - Direct communication endpoints & email" },
        { type: "output", text: "  resume           - View career summary & PDF download link" },
        { type: "output", text: "  sound <on|off>   - Enable or disable spatial UI sound FX" },
        { type: "output", text: "  theme            - Display active Obsidian theme status" },
        { type: "output", text: "  ls [-la]         - List virtual filesystem contents" },
        { type: "output", text: "  cat <filename>   - Read contents of a virtual file" },
        { type: "output", text: "  git log          - Display recent verified production commits" },
        { type: "output", text: "  sudo hire akshita- Direct interview fast-track (with celebration)" },
        { type: "output", text: "  clear            - Wipe terminal buffer" },
        { type: "output", text: "  exit             - Close terminal window" }
      ];

    case "whoami":
    case "bio":
    case "about":
      return [
        { type: "success", text: `=== ${portfolioData.personal.name} ===` },
        { type: "output", text: `Role: ${portfolioData.personal.role}` },
        { type: "output", text: `Institution: ${portfolioData.personal.university} (Grad: ${portfolioData.personal.gradYear})` },
        { type: "output", text: `Academic Score: CGPA ${portfolioData.personal.cgpa} / 10.0` },
        { type: "output", text: `Philosophy: ${portfolioData.personal.bio}` },
        { type: "info", text: "Specialization: High-throughput Java Spring Boot, React 19, AST DevTooling, and Open-Source Systems." }
      ];

    case "projects":
      if (arg1) {
        const found = portfolioData.projects.find(p => 
          p.title.toLowerCase().includes(arg1) || p.id?.toLowerCase().includes(arg1)
        );
        if (found) {
          return [
            { type: "success", text: `=== Project: ${found.title} [${found.category}] ===` },
            { type: "output", text: `Badge: ${found.badge}` },
            { type: "output", text: `Overview: ${found.description}` },
            { type: "output", text: `Stack: ${found.techStack.join(" • ")}` },
            { type: "output", text: `Metrics: ${found.metrics || "Production verified"}` },
            { type: "info", text: `GitHub: ${found.github}` },
            ...(found.npm ? [{ type: "info", text: `npm: ${found.npm}` }] : []),
            ...(found.demo ? [{ type: "info", text: `Demo: ${found.demo}` }] : [])
          ];
        }
        return [
          { type: "error", text: `Project matching '${arg1}' not found.` },
          { type: "output", text: `Available projects: ${portfolioData.projects.map(p => p.title.toLowerCase().split(' ')[0]).join(', ')}` }
        ];
      }
      return [
        { type: "success", text: "=== Flagship Engineering Projects ===" },
        ...portfolioData.projects.flatMap(p => [
          { type: "info", text: `★ ${p.title} [${p.category}] - ${p.badge}` },
          { type: "output", text: `  ${p.description}` },
          { type: "output", text: `  Stack: ${p.techStack.join(", ")}` }
        ]),
        { type: "info", text: "Tip: Type 'projects envguard' or 'projects dsaverse' for deep-dive details." }
      ];

    case "skills":
      return [
        { type: "success", text: "=== Technical Skillset Matrix ===" },
        { type: "info", text: "Languages:" },
        { type: "output", text: "  " + portfolioData.skills.languages.map(l => l.name).join(" • ") },
        { type: "info", text: "Frameworks & Tooling:" },
        { type: "output", text: "  " + portfolioData.skills.frameworks.map(f => f.name).join(" • ") },
        { type: "info", text: "Databases & Cloud Systems:" },
        { type: "output", text: "  " + portfolioData.skills.databases.map(d => d.name).join(" • ") + " • Docker • Kafka • Babel AST" },
        { type: "info", text: "Core CS & Architecture:" },
        { type: "output", text: "  " + portfolioData.skills.coreConcepts.slice(0, 6).join(" • ") }
      ];

    case "experience":
      return [
        { type: "success", text: "=== Industry & Production Experience ===" },
        ...portfolioData.experience.flatMap(exp => [
          { type: "info", text: `▶ ${exp.role} @ ${exp.company} (${exp.period})` },
          { type: "output", text: `  ${exp.description}` },
          { type: "output", text: `  Tech: ${exp.skills.join(", ")}` }
        ])
      ];

    case "contact":
      return [
        { type: "success", text: "=== Contact & Verified Verification Channels ===" },
        { type: "output", text: `Email:    ${portfolioData.personal.email}` },
        { type: "output", text: `Phone:    ${portfolioData.personal.phone}` },
        { type: "output", text: `GitHub:   ${portfolioData.personal.links.github}` },
        { type: "output", text: `LinkedIn: ${portfolioData.personal.links.linkedin}` },
        { type: "output", text: `LeetCode: ${portfolioData.personal.links.leetcode}` },
        { type: "info", text: "Tip: Click email in the Contact section to copy with one touch." }
      ];

    case "resume":
      return [
        { type: "success", text: `AKSHITA SINGHAL — ${portfolioData.personal.role}` },
        { type: "output", text: `Education: B.Tech CSE @ Banasthali Vidyapith (CGPA: 9.58/10)` },
        { type: "output", text: `Experience: SDE Intern @ Strive Partners | Submitty (RPI Open Source)` },
        { type: "output", text: `Flagship: EnvGuard AST CLI (npm) | DSAverse (450+ problems) | Event Stream Engine` },
        { type: "output", text: `Accolades: Google Big Code Semi-Finalist (Top 1500) | Reliance Foundation Scholar` },
        { type: "info", text: `Download PDF: ${portfolioData.personal.links.resumePdf}` }
      ];

    case "sound":
      if (arg1 === "on") {
        if (context.toggleSound) context.toggleSound(false);
        return [{ type: "success", text: "✓ Spatial UI audio enabled." }];
      } else if (arg1 === "off") {
        if (context.toggleSound) context.toggleSound(true);
        return [{ type: "output", text: "✓ UI audio muted." }];
      }
      return [
        { type: "info", text: "Usage: sound on | sound off" }
      ];

    case "theme":
      return [
        { type: "success", text: "Active Theme: Pitch Obsidian High-Contrast (#05070a / #030712)" },
        { type: "output", text: "Accent: Electric Emerald (#10B981) + Neon Indigo (#6366F1)" },
        { type: "output", text: "Typography: JetBrains Mono + Plus Jakarta Sans" }
      ];

    case "ls":
      return [
        { type: "info", text: "drwxr-xr-x  projects/" },
        { type: "output", text: "-rw-r--r--  bio.md" },
        { type: "output", text: "-rw-r--r--  skills.json" },
        { type: "output", text: "-rw-r--r--  experience.txt" },
        { type: "output", text: "-rwxr-xr-x  resume.pdf" },
        { type: "output", text: "-rw-------  secrets.txt" }
      ];

    case "cat":
      if (!arg1) {
        return [{ type: "error", text: "Usage: cat <filename>. Try 'cat bio.md', 'cat resume.pdf', or 'cat secrets.txt'" }];
      }
      if (arg1 === "bio.md" || arg1 === "bio") {
        return [
          { type: "success", text: `=== ${portfolioData.personal.name} ===` },
          { type: "output", text: portfolioData.personal.bio }
        ];
      }
      if (arg1 === "resume.pdf" || arg1 === "resume") {
        return [
          { type: "success", text: `AKSHITA SINGHAL — ${portfolioData.personal.role}` },
          { type: "output", text: `B.Tech CSE @ Banasthali Vidyapith (CGPA: 9.58/10)` },
          { type: "output", text: `Experience: SDE Intern @ Strive Partners | Submitty (RPI Open Source)` },
          { type: "output", text: `Honors: Google Big Code Semi-Finalist | Reliance Scholar | 7x School Scholar (DPS Gold Medal)` },
          { type: "info", text: `PDF Download link: ${portfolioData.personal.links.resumePdf}` }
        ];
      }
      if (arg1 === "secrets.txt") {
        return [
          { type: "celebrate", text: "🔒 [CLASSIFIED ACCESS GRANTED]:" },
          { type: "output", text: "• Top 1,500 nationwide in Google's The Big Code algorithmic challenge." },
          { type: "output", text: "• 450+ Data Structures & Algorithms problems solved across Trees, Graphs, DP." },
          { type: "output", text: "• Built an AST CLI with Babel parsing 140+ files with zero false positives." }
        ];
      }
      if (arg1 === "skills.json") {
        return [
          { type: "output", text: JSON.stringify(portfolioData.skills, null, 2) }
        ];
      }
      if (arg1 === "experience.txt") {
        return portfolioData.experience.map(e => ({
          type: "output",
          text: `[${e.period}] ${e.role} @ ${e.company} - ${e.description}`
        }));
      }
      return [{ type: "error", text: `cat: ${arg1}: No such file or directory. Type 'ls' to view files.` }];

    case "git":
      if (arg1 === "log" || fullArgs === "log") {
        return [
          { type: "success", text: "=== Recent Git Commits (akshitaa011) ===" },
          { type: "info", text: "commit f89a31c (origin/main, prod)" },
          { type: "output", text: "Author: Akshita Singhal <akshita@example.com>" },
          { type: "output", text: "Date:   Sun Mar 29 2026" },
          { type: "output", text: "    feat(submitty): clamp progress values overflow (PR #12567 merged)\n" },
          { type: "info", text: "commit 4d7e220" },
          { type: "output", text: "Author: Akshita Singhal <akshita@example.com>" },
          { type: "output", text: "Date:   Fri Mar 27 2026" },
          { type: "output", text: "    refactor(forum): TAB/ESC keyboard event delegation (PR #12549 merged)\n" },
          { type: "info", text: "commit 91b045a" },
          { type: "output", text: "Author: Akshita Singhal <akshita@example.com>" },
          { type: "output", text: "Date:   Tue Mar 24 2026" },
          { type: "output", text: "    feat(envguard): AST parser strict engine v1.2.0 release" }
        ];
      }
      return [{ type: "info", text: "Usage: git log" }];

    case "sudo":
      if (fullArgs === "hire akshita" || fullArgs === "hire-me" || fullArgs === "hire") {
        return [
          { type: "celebrate", text: "🎉 [INTERVIEW ACCESS GRANTED]: Akshita Singhal is ready to deliver impact on your engineering team!" },
          { type: "output", text: `Direct dispatch: ${portfolioData.personal.email} | ${portfolioData.personal.phone}` },
          { type: "success", text: "Email dispatch initialized. Looking forward to speaking with you!" }
        ];
      }
      return [{ type: "error", text: "sudo: try 'sudo hire akshita'" }];

    case "":
      return [];

    default:
      return [
        { type: "error", text: `zsh: command not found: ${rawCommand}. Type 'help' to inspect commands.` }
      ];
  }
};
