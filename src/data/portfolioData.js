export const portfolioData = {
  personal: {
    name: "Akshita Singhal",
    role: "Software Development Engineer & Open Source Contributor",
    tagline: "Building high-performance backend systems, AST-based developer tooling, and modern web applications.",
    bio: "Computer Science undergraduate at Banasthali Vidyapith with a 9.58/10 CGPA. Former SDE Intern at Strive Partners, open-source contributor to RPI's Submitty, and creator of developer tooling like EnvGuard (npm) and DSAverse.",
    email: "akshitasinghal300@gmail.com",
    phone: "+91 8630370137",
    location: "Meerut / Newai, India",
    university: "Banasthali Vidyapith",
    degree: "B.Tech in Computer Science and Engineering",
    gradYear: "2024 – 2028",
    cgpa: "9.58 / 10",
    links: {
      github: "https://github.com/akshitaa011",
      leetcode: "https://leetcode.com/u/akshita1111/",
      linkedin: "https://linkedin.com/in/akshita-singhal-649956304",
      resumePdf: "/resume.pdf"
    }
  },

  stats: [
    { label: "Academic CGPA", value: "9.58", detail: "Banasthali Vidyapith", icon: "GraduationCap" },
    { label: "DSA Problems Curated/Solved", value: "450+", detail: "DSAverse & LeetCode", icon: "Code2" },
    { label: "Merged Production PRs", value: "2", detail: "Submitty (RPI Open Source)", icon: "GitPullRequest" },
    { label: "Google The Big Code", value: "Top 1,500", detail: "National Semi-Finalist", icon: "Award" },
    { label: "DPS School Scholar", value: "7x", detail: "Academic Gold Medalist", icon: "Medal" }
  ],

  experience: [
    {
      company: "Strive Partners",
      role: "Software Development Engineer (SDE) Intern",
      period: "May 2026 – July 2026",
      type: "Internship",
      location: "Remote / Hybrid",
      description: "Engineered scalable backend architectures and full-stack integrations using enterprise Java Spring Boot and React.",
      points: [
        "Developed high-throughput RESTful APIs using Java Spring Boot, designing structured JSON response schemas, strict request validation, and global exception handling pipelines.",
        "Engineered modular, responsive UIs in React.js and TypeScript, leveraging Redux Toolkit for predictable state management and implementing multi-tenant Role-Based Access Control (RBAC).",
        "Orchestrated end-to-end full-stack feature delivery, implementing OAuth 2.0 and JWT token authentication routines with PostgreSQL relational persistence.",
        "Architected and experimented with Apache Kafka message brokers for decoupled, asynchronous event-driven microservices communication."
      ],
      skills: ["Java", "Spring Boot", "React.js", "TypeScript", "Redux", "PostgreSQL", "Apache Kafka", "OAuth 2.0", "JWT", "RBAC"],
      completionLetter: "https://drive.google.com/file/d/1_MPyqcfwaRJZF_qHTzh9sdPiQ--bQC3R/view?usp=drive_link"
    },
    {
      company: "Submitty (Rensselaer Polytechnic Institute)",
      role: "Open Source Contributor",
      period: "Jan 2026 – Present",
      type: "Open Source",
      location: "Global",
      description: "Active contributor to Submitty, RPI's enterprise automated grading platform serving thousands of university students and professors worldwide.",
      points: [
        "Authored and successfully merged 2 high-impact production pull requests into the core platform.",
        "Diagnosed and resolved a critical timer overflow bug in the gradeable submission flow by clamping progress bar percentage values (PR #12567).",
        "Refactored keyboard accessibility and accessibility compliance in the Discussion Forum by overhauling TAB/ESC key handler lifecycle via efficient event delegation (PR #12549)."
      ],
      skills: ["PHP", "JavaScript", "Event Delegation", "Accessibility (a11y)", "Git Workflow", "Open Source"],
      highlights: [
        { label: "PR #12567: Timer Overflow Clamping", url: "https://github.com/Submitty/Submitty/pull/12567", merged: true },
        { label: "PR #12549: TAB/ESC Event Delegation", url: "https://github.com/Submitty/Submitty/pull/12549", merged: true }
      ]
    }
  ],

  projects: [
    {
      id: "envguard",
      title: "EnvGuard CLI",
      category: "Developer Tooling & Systems",
      badge: "Published on npm",
      featured: true,
      description: "Open-source AST-based static analysis CLI tool that detects dead, missing, empty, and duplicate environment variables across modern JavaScript & TypeScript codebases.",
      impact: "Zero-runtime overhead CLI with framework-aware inference rules for Next.js, Vite, React, NestJS, and Remix.",
      techStack: ["TypeScript", "Babel AST", "Node.js", "npm", "GitHub Actions"],
      github: "https://github.com/akshitaa011/envguard",
      npm: "https://www.npmjs.com",
      highlights: [
        "Abstract Syntax Tree (AST) parsing with Babel",
        "Static code scanning for undeclared process.env / import.meta.env",
        "Framework-specific heuristic engines for Next.js, Vite & NestJS",
        "Automated CI/CD release workflow via GitHub Actions"
      ]
    },
    {
      id: "dsaverse",
      title: "DSAverse",
      category: "Full Stack & EdTech",
      badge: "Flagship MERN Platform",
      featured: true,
      description: "Comprehensive interactive DSA tracker and learning platform equipped with 450+ curated coding problems, algorithmic optimization guides, and real-time visual progress analytics.",
      impact: "Helps hundreds of engineers practice structured problem-solving with integrated code optimization suggestions and topic mastery dashboards.",
      techStack: ["MongoDB", "React", "Express.js", "Node.js", "Bootstrap", "Generative AI", "RESTful APIs"],
      github: "https://github.com/akshitaa011/DSAverse",
      demo: "https://github.com/akshitaa011/DSAverse",
      highlights: [
        "450+ curated DSA challenges across Data Structures & Algorithms",
        "Generative AI powered code optimization assistant",
        "Real-time visual progress & difficulty breakdown metrics",
        "Curated video tutorials & editorial solutions"
      ]
    },
    {
      id: "intellichat",
      title: "IntelliChat AI",
      category: "AI & Full Stack",
      badge: "Multi-Modal AI System",
      featured: true,
      description: "Full-stack AI conversational assistant built on clean MVC architecture supporting multimodal reasoning, context-aware memory, vision-based image diagnostics, and text-to-image synthesis.",
      impact: "Low-latency streaming responses integrated with OpenRouter APIs and Pollinations AI with secure multipart file upload handling.",
      techStack: ["Node.js", "Express.js", "JavaScript", "HTML5", "CSS3", "OpenRouter API", "Pollinations AI"],
      github: "https://github.com/akshitaa011/IntelliChat-AI",
      demo: "https://github.com/akshitaa011/IntelliChat-AI",
      highlights: [
        "Strict Model-View-Controller (MVC) modular backend",
        "Vision-based image analysis and automated prompt expansion",
        "Text-to-image neural generation integration",
        "Sanitized multipart media uploads & token streaming"
      ]
    }
  ],

  achievements: [
    {
      title: "Google The Big Code 2026 Semi-Finalist",
      organization: "Google",
      category: "National Contest",
      date: "2026",
      description: "Selected among the top 1,500 students nationwide in Google's flagship algorithmic and software challenge.",
      badge: "Top 1,500 Nationwide",
      linkText: "Result",
      link: "https://drive.google.com/file/d/1kbSzzvUmncEcqESEnWclt18iDljnK2pi/view?usp=drive_link",
      image: ""
    },
    {
      title: "Cisco Women in Technology Mentee",
      organization: "Cisco Systems",
      category: "Mentorship",
      date: "May 2026 – July 2026",
      description: "Mentee for the Cisco Women in Technology Mentorship Program.",
      badge: "Mentorship",
      linkText: "Certificate",
      link: "https://drive.google.com/file/d/1IFHFJya5Js1WEFbXZ33ARFLFF5tAhbFp/view?usp=drive_link",
      image: ""
    },
    {
      title: "Reliance Foundation Scholar",
      organization: "Reliance Foundation",
      category: "Scholarship",
      date: "2024 – Present",
      description: "Awarded the prestigious nationwide undergraduate scholarship for exceptional academic excellence, technical promise, and leadership potential.",
      badge: "Prestigious Grant",
      linkText: "Result",
      link: "https://drive.google.com/file/d/1GkBgm5qcIzVTac7qJWjuRK9jk5rIlCaz/view?usp=drive_link",
      image: ""
    },
    {
      title: "Top 10 Teams (out of 250+), Hack With Rajasthan",
      organization: "AIC Banasthali Vidyapith × Devnovate",
      category: "Hackathon",
      date: "2025",
      description: "Built a 24-hour innovation prototype competing against 250+ inter-college developer teams.",
      badge: "Finalist (Top 4%)",
      linkText: "Certificate",
      link: "https://drive.google.com/file/d/1Y-LgnxaBhiCYtCtxkda6TnFJMVkFvPYl/view?usp=drive_link",
      image: ""
    },
    {
      title: "Second Runner-Up, Lingua Hackathon",
      organization: "Mayukh Tech Fest",
      category: "Hackathon",
      date: "2025",
      description: "Awarded podium finish for developing natural language processing and multilingual software solutions.",
      badge: "Podium Winner",
      linkText: "Certificate",
      link: "https://drive.google.com/file/d/1eD6ICwuIu0b6FNaLEmdl9MrcREIfxgMp/view?usp=drive_link",
      image: ""
    },
    {
      title: "Rank 30, Banasthali Vidyapith Entrance Exam",
      organization: "Banasthali Vidyapith",
      category: "Academic",
      date: "2024",
      description: "Secured All-India Rank 30 among thousands of applicants for the B.Tech Computer Science program.",
      badge: "AIR 30",
      linkText: "Result",
      link: "https://drive.google.com/file/d/1qCs6Ewc7cIZ1RnnnoJjG7uNNiefIF_Qj/view?usp=drivesdk",
      image: ""
    },
    {
      title: "Gold Medal for Academic Excellence",
      organization: "Delhi Public School",
      category: "Academic Honor",
      date: "7 Consecutive Years",
      description: "Scholar for seven consecutive years in school, awarded the Academic Gold Medal.",
      badge: "7x School Scholar",
      linkText: "Certificate",
      link: "https://drive.google.com/file/d/116tGK2CIIB0APobLn4E05TfndrJXlA2Q/view?usp=drive_link",
      image: ""
    },
    {
      title: "JPMorgan Chase & Co. Virtual Software Experience",
      organization: "JPMorgan Chase (via Forage)",
      category: "Industry Simulation",
      date: "2025",
      description: "Completed financial engineering simulations: interface with financial data feeds, TypeScript visualizations, and Perspective charts.",
      badge: "Certified",
      linkText: "Certificate",
      link: "https://drive.google.com/file/d/1lSy-5joxNK--88D05aX95p1pQ3xtnhWe/view?usp=drivesdk",
      image: ""
    },
    {
      title: "Goldman Sachs Virtual Software Experience",
      organization: "Goldman Sachs (via Forage)",
      category: "Industry Simulation",
      date: "2025",
      description: "Implemented cryptography security solutions, password hash cracking defense, and secure backend protocols.",
      badge: "Certified",
      linkText: "Certificate",
      link: "https://drive.google.com/file/d/1i1SYEmROWuAynv18BDcFvMdNc7TDBo3w/view?usp=drivesdk",
      image: ""
    },
    {
      title: "Oracle Certified Foundations Associate",
      organization: "Oracle",
      category: "Certification",
      date: "2025",
      description: "Certified proficiency in cloud fundamentals, database architectures, and enterprise infrastructure.",
      badge: "Oracle Certified",
      linkText: "Certificate",
      link: "https://drive.google.com/file/d/1h7fFLJgYMEEIwcCE0hAItUM0TL_5gGX6/view?usp=drivesdk",
      image: ""
    }
  ],

  leadership: [
    {
      club: "Algobyte Club, Banasthali Vidyapith",
      role: "Technical Member",
      period: "August 2024 – Present",
      points: [
        "Collaborated on building the official Algobyte Club website — implemented user authentication, developed responsive frontend pages, and managed data using MongoDB.",
        "Contributed to technical coordination of Sangam 3.0, an offline senior–junior interaction initiative, assisting in session architecture and smooth execution.",
        "Spearheaded technical organization of Hack the Horizon 2.0, a 24-hour hackathon — managing server infrastructure, real-time developer troubleshooting, and participant workflows."
      ]
    }
  ],

  skills: {
    languages: [
      { name: "Java", level: "Advanced", hot: true },
      { name: "TypeScript", level: "Advanced", hot: true },
      { name: "JavaScript", level: "Advanced", hot: true },
      { name: "C++", level: "Proficient" },
      { name: "C", level: "Proficient" },
      { name: "Python", level: "Proficient" },
      { name: "SQL", level: "Advanced" },
      { name: "PHP", level: "Familiar (Open Source)" },
      { name: "Bash", level: "Proficient" }
    ],
    frameworks: [
      { name: "React.js", category: "Frontend", hot: true },
      { name: "Spring Boot", category: "Backend", hot: true },
      { name: "Node.js", category: "Backend", hot: true },
      { name: "Express.js", category: "Backend" },
      { name: "Redux / Redux Toolkit", category: "State" },
      { name: "Tailwind CSS", category: "Styling", hot: true },
      { name: "Bootstrap", category: "Styling" },
      { name: "Babel AST", category: "Tooling" }
    ],
    databases: [
      { name: "PostgreSQL", type: "Relational", hot: true },
      { name: "MongoDB", type: "Document", hot: true },
      { name: "MySQL", type: "Relational" }
    ],
    toolsAndDevops: [
      { name: "Git & GitHub", category: "VCS" },
      { name: "Docker", category: "Containers", hot: true },
      { name: "Apache Kafka", category: "Streaming", hot: true },
      { name: "GitHub Actions", category: "CI/CD" },
      { name: "npm / Yarn", category: "Packages" },
      { name: "Linux / Bash", category: "OS" }
    ],
    coreConcepts: [
      "Data Structures & Algorithms",
      "RESTful API Design",
      "Role-Based Access Control (RBAC)",
      "OAuth 2.0 & JWT Security",
      "Event-Driven Microservices",
      "MVC Architecture",
      "Abstract Syntax Trees (AST)",
      "Web Accessibility (WCAG / a11y)",
      "Generative AI & LLM Integrations"
    ]
  },

  education: [
    {
      institution: "Banasthali Vidyapith",
      location: "Newai, Rajasthan",
      degree: "Bachelor of Technology in Computer Science and Engineering",
      score: "CGPA: 9.58 / 10",
      period: "2024 – 2028",
      highlights: "Rank 30 in Banasthali Vidyapith Entrance Exam"
    },
    {
      institution: "Delhi Public School",
      location: "Meerut, Uttar Pradesh",
      degree: "Class 12th (CBSE Board)",
      score: "Percentage: 92.83%",
      period: "2023",
      highlights: "Scholar for 7 Consecutive Years (Academic Gold Medalist)"
    },
    {
      institution: "Delhi Public School",
      location: "Meerut, Uttar Pradesh",
      degree: "Class 10th (CBSE Board)",
      score: "Percentage: 97.2%",
      period: "2021",
      highlights: ""
    }
  ]
};
