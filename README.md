# Akshita Singhal — Developer Portfolio & Systems Engineering

[![Live Portfolio](https://img.shields.io/badge/Live%20Site-akshitaa011.github.io-10B981?style=for-the-badge&logo=githubpages&logoColor=white)](https://akshitaa011.github.io/)
[![Deploy Status](https://img.shields.io/github/actions/workflow/status/akshitaa011/akshitaa011.github.io/deploy.yml?branch=main&style=for-the-badge&label=Deployment)](https://github.com/akshitaa011/akshitaa011.github.io/actions)

High-performance, interactive developer portfolio showcasing systems engineering, AST developer tooling, production open-source contributions, and verified telemetry.

## 🚀 Tech Stack

- **Frontend Core**: React 19, TypeScript, Vite
- **Styling & Design System**: Tailwind CSS v4, Custom Glassmorphism, CSS Tokens
- **Animations & Physics**: Framer Motion, Three.js, Canvas Confetti
- **Developer Tooling**: @babel/parser (In-browser AST analysis), Oxlint
- **Audio & Haptics**: Web Audio API synthesized micro-interactions
- **Hosting**: GitHub Pages via automated GitHub Actions CI/CD

## 🛠️ Flagship Features

1. **In-Browser AST Playground (EnvGuard)**:
   - Live AST static analysis of environment variables (`process.env.X` and `import.meta.env.X`) using lazy-loaded `@babel/parser`.
   - Real-time diagnostic tree graph, source code inspection, and CLI diagnostic output tabs.
2. **Submitty (RPI Open Source) PR Inspector**:
   - Interactive Git branch tree and diff viewer for production merged PRs (#12567 timer overflow bug and #12549 forum accessibility).
3. **Live Telemetry Bento**:
   - Real-time GitHub public activity streamer with 15-minute cached sessionStorage.
   - LeetCode metrics and rolling mechanical slot counters.
4. **Cinematic Recruiter Tour**:
   - Interactive 7-act guided walkthrough with automated hands-free advance and confetti celebration.
5. **Interactive Terminal (⌘K / Ctrl+K)**:
   - CLI shell with tab auto-completion, executable commands (`cat bio.md`, `cat resume.pdf`, `skills`, `clear`).

## 📦 Local Development

```bash
# Clone the repository
git clone https://github.com/akshitaa011/akshitaa011.github.io.git
cd akshitaa011.github.io

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📄 License

MIT © [Akshita Singhal](https://github.com/akshitaa011)
