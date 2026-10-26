export const profile = {
  name: "Mayank Jha",
  role: "Full-stack developer",
  email: "mayankjha0330@gmail.com",
  github: "https://github.com/MayankJha0333",
  githubOld: "https://github.com/MayankJha014",
  linkedin: "https://www.linkedin.com/in/mayank-jha-674118228/",
  x: "https://x.com/MayankJha014",
  reddit: "https://www.reddit.com/user/Mayank_Builds/",
  resume: "https://drive.google.com/file/d/1PikRu8fMIWbbtlgeCsKrhfTB5cCM9UFk/view?usp=sharing",
};

export type Project = {
  slug: string;
  name: string;
  summary: string;
  stack: string[];
  image: string;
  imageAlt: string;
  /** Backdrop colour behind the screenshot, taken from the product's own brand. */
  tint: string;
  /** One-line reason this project is worth a look. */
  kind: string;
  live?: string;
  code?: string;
  extra?: { label: string; href: string };
};

export const featured: Project[] = [
  {
    slug: "dovli",
    tint: "#b5e655",
    kind: "Notes, tasks and whiteboards",
    name: "Dovli",
    summary:
      "A calm place to write, plan and sketch. Block docs, to-dos and whiteboards that work offline, sync across web, Android, desktop and a Chrome side panel, and open up to AI apps over MCP.",
    stack: ["Next.js", "Expo", "BlockNote", "Firebase", "MCP"],
    image: "/work/hd/dovli.png",
    imageAlt: "Dovli landing page: A calm place to write, plan and sketch",
    live: "https://dovli.in",
    code: "https://github.com/MayankJha0333/dovli",
    extra: {
      label: "Chrome extension",
      href: "https://chromewebstore.google.com/detail/eompomcfedlnlnbgbacbennoaehobodh",
    },
  },
  {
    slug: "crestclip",
    tint: "#ff7a63",
    kind: "AI video clipping",
    name: "CrestClip",
    summary:
      "Clips the moment everyone rewatches. Reads YouTube's most-replayed data, comment timestamps and audio energy, then returns vertical clips with captions, a hook and a score.",
    stack: ["React", "Express", "Gemini on Vertex AI", "BullMQ", "ffmpeg"],
    image: "/work/hd/crestclip.png",
    imageAlt: "CrestClip landing page: Clip the moment everyone rewatches",
    live: "https://crestclip.com",
    code: "https://github.com/MayankJha0333/crestclip",
    extra: { label: "Product Hunt", href: "https://www.producthunt.com/products/crestclip" },
  },
  {
    slug: "rentrush",
    tint: "#58b979",
    kind: "Multiplayer 3D board game",
    name: "Rent Rush",
    summary:
      "A free multiplayer property-trading board game in the browser. A 3D island, private tables with voice chat, trades and auctions. Every board, pawn and sound is generated in code.",
    stack: ["React Three Fiber", "Socket.IO", "LiveKit", "SQLite"],
    image: "/work/hd/rentrush.jpg",
    imageAlt: "Rent Rush 3D board with players, streets and a city in the middle",
    live: "https://rentrush.in",
    code: "https://github.com/MayankJha0333/monopoly",
  },
  {
    slug: "klaude",
    tint: "#f1b648",
    kind: "VS Code extension",
    name: "Klaude",
    summary:
      "The Claude Code agent in a VS Code side panel: streaming chat, multi-file edits with diff previews and gated terminal runs. Published on the VS Code Marketplace and Open VSX.",
    stack: ["TypeScript", "VS Code Extension API"],
    image: "/work/hd/klaude.png",
    imageAlt: "Klaude logo next to its sign-in panel inside VS Code",
    live: "https://marketplace.visualstudio.com/items?itemName=LinkInsightLab.klaude",
    code: "https://github.com/MayankJha0333/klaude",
  },
  {
    slug: "vizpilot",
    tint: "#6d8dff",
    kind: "AI data analyst",
    name: "VizPilot",
    summary:
      "Ask your data a question and watch the dashboard build itself. Drop in a CSV and an AI analyst answers in plain English, then builds charts you can drag, resize and share.",
    stack: ["Next.js", "MongoDB", "Firebase", "Recharts"],
    image: "/work/hd/vizpilot.png",
    imageAlt: "VizPilot landing page: Ask your data. Watch the dashboard build itself",
    live: "https://vizpilot-puce.vercel.app",
    code: "https://github.com/MayankJha0333/VizPilot",
  },
  {
    slug: "sahayak",
    tint: "#3cb3a8",
    kind: "Home services, three apps",
    name: "Sahayak",
    summary:
      "House help in ten minutes. A customer app, an expert app and an ops website on one backend: book by the hour, pay online and track the expert live.",
    stack: ["Expo", "Firebase", "Razorpay", "Vite"],
    image: "/work/hd/sahayak.png",
    imageAlt: "Sahayak customer app screens on three phones",
    code: "https://github.com/MayankJha0333/sahayak",
  },
];

export type SmallProject = {
  name: string;
  summary: string;
  stack: string;
  code: string;
  live?: string;
};

export const moreProjects: SmallProject[] = [
  {
    name: "Entrepreneur Woods",
    summary: "Startup-news site with an animated front page and a full editor admin with RSS import.",
    stack: "Next.js · MongoDB · GSAP",
    code: "https://github.com/MayankJha0333/Entrepreneur-Woodss",
    live: "https://entrepreneur-woodss.vercel.app",
  },
  {
    name: "BookWell",
    summary: "Appointment booking for salons and studios where a slot can never be booked twice.",
    stack: "Next.js 14 · Tailwind · GSAP",
    code: "https://github.com/MayankJha0333/bookwell",
  },
  {
    name: "Agentic RAG on Kubeflow",
    summary: "System design for a multi-agent RAG assistant running on Kubeflow.",
    stack: "LangGraph · KServe · Kubeflow Pipelines",
    code: "https://github.com/MayankJha0333/Agentic-RAG-on-Kubeflow-Expansion-of-kubeflow-docs-agent",
  },
  {
    name: "BiteSpeed Flow Builder",
    summary: "Drag-and-drop chatbot flow builder with nodes, edges and validation.",
    stack: "Next.js · React Flow · TypeScript",
    code: "https://github.com/MayankJha0333/BiteSpeed-Flow-Builder",
    live: "https://bite-speed-flow-builder-xi.vercel.app",
  },
  {
    name: "Chat Messenger",
    summary: "Real-time chat with groups, typing indicators and read receipts.",
    stack: "MERN · Socket.io",
    code: "https://github.com/MayankJha0333/Chat-Messanger",
    live: "https://chat-messanger-front.vercel.app/",
  },
  {
    name: "Notion Blog Hub",
    summary: "A blog that publishes posts straight from a Notion database.",
    stack: "React · Redux · Notion API",
    code: "https://github.com/MayankJha0333/Notion-Blog-Hub",
    live: "https://blog-website-31b6.vercel.app/",
  },
  {
    name: "Plant Detection",
    summary: "Identifies plant leaves from a photo and shows their Ayurvedic uses.",
    stack: "Flutter · Dart",
    code: "https://github.com/MayankJha0333/Plant-Based-Detetcion",
  },
];

export type Contribution = {
  org: string;
  project: string;
  blurb: string;
  did: string;
  merged: number;
  href: string;
};

export const contributions: Contribution[] = [
  {
    org: "MetaCall",
    project: "MetaSSR",
    blurb: "Rust server-side rendering framework",
    did: "Fixed live reload for API routes, SSR and SSG build mapping, and a crash on extension-less files. Wrote test suites for the CLI, server, API handler and client builder.",
    merged: 9,
    href: "https://github.com/metacall/metassr/pulls?q=is%3Apr+author%3AMayankJha0333+is%3Amerged",
  },
  {
    org: "Palisadoes",
    project: "Talawa Admin, Talawa, Switchmap-NG",
    blurb: "Community management platform",
    did: "Moved test suites from Jest to Vitest, raised coverage across chat, venues and org cards, built the organization drawer and moved uploads to MinIO.",
    merged: 17,
    href: "https://github.com/search?q=org%3APalisadoesFoundation+author%3AMayankJha014+is%3Apr+is%3Amerged&type=pullrequests",
  },
  {
    org: "Kubeflow",
    project: "docs-agent",
    blurb: "AI agent for the Kubeflow docs",
    did: "Made the hard-coded namespace configurable and fixed top_k being ignored in Milvus search.",
    merged: 2,
    href: "https://github.com/kubeflow/docs-agent/pulls?q=is%3Apr+author%3AMayankJha0333+is%3Amerged",
  },
  {
    org: "MetaCall",
    project: "Core",
    blurb: "Polyglot runtime",
    did: "Added file-type detection by extension and an execution-path helper.",
    merged: 1,
    href: "https://github.com/metacall/core/pulls?q=is%3Apr+author%3AMayankJha0333+is%3Amerged",
  },
];

export const mergedTotal = 30;

export type Role = { company: string; title?: string; period: string; detail: string };

export const experience: Role[] = [
  {
    company: "Pulsegen",
    title: "Full Stack Intern",
    period: "Now",
    detail: "Building AI-first product intelligence tools.",
  },
  {
    company: "Apiero Medica",
    period: "From Jun 2023",
    detail: "Built a teleconsultation system to bring medical services to rural areas.",
  },
  {
    company: "Bharat Heavy Electricals (BHEL)",
    period: "Apr - May 2023",
    detail: "Planned the move off Oracle Forms 11g and shipped the BHEL Pharmacy System as a proof of concept.",
  },
  {
    company: "Acompworld Technosoft",
    period: "Feb - Apr 2023",
    detail: "Worked on a custom CMS and an inventory system with procurement, vendor tracking and QR tagging.",
  },
];

export const education = {
  school: "Lakshmi Narain College of Technology & Science",
  degree: "B.Tech, Computer Science",
  period: "2021 - 2025",
};

export const toolkit: { name: string; slug: string }[] = [
  { name: "TypeScript", slug: "typescript" },
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "Node.js", slug: "nodedotjs" },
  { name: "Expo", slug: "expo" },
  { name: "Flutter", slug: "flutter" },
  { name: "Firebase", slug: "firebase" },
  { name: "MongoDB", slug: "mongodb" },
  { name: "Three.js", slug: "threedotjs" },
  { name: "Socket.IO", slug: "socketdotio" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "Rust", slug: "rust" },
  { name: "Google Cloud", slug: "googlecloud" },
  { name: "Docker", slug: "docker" },
  { name: "Kubernetes", slug: "kubernetes" },
  { name: "Vercel", slug: "vercel" },
];
