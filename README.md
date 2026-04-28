<div align="center">

# 🛡️ HackOps

### AI-Powered Cybersecurity Training Platform

**Learn to hack. Learn to defend. Powered by Gemini AI.**

[![Live Demo](https://img.shields.io/badge/🔴_Live_Demo-flamechargerr.github.io/HackOps-00ff88?style=for-the-badge&labelColor=0d1117)](https://flamechargerr.github.io/HackOps/)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=0d1117)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=0d1117)](https://react.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Integrated-886FBF?style=for-the-badge&logo=google&logoColor=white&labelColor=0d1117)](https://ai.google.dev/)

<br/>

<img src="docs/images/hackops-homepage.png" alt="HackOps Platform" width="800" />

<br/>

*6 interactive security challenges • Real-time AI analysis • 15 earnable badges • Works fully offline*

---

[**Try it Live →**](https://flamechargerr.github.io/HackOps/) · [**Watch Demo**](#-demo) · [**Architecture**](#-architecture) · [**AI Features**](#-ai-integration)

</div>

---

## 🤔 The Problem

Security education is broken. Most platforms are either:
- 📖 **Too theoretical** — read docs, take quizzes, forget everything
- ⚠️ **Too dangerous** — practice on real systems and risk jail time
- 🤖 **Not AI-native** — static hints that don't adapt to what you're actually trying

**HackOps fixes all three.** It's a safe, gamified sandbox where you learn by *doing* — and an AI Security Advisor watches every attempt to teach you the *why* behind each vulnerability.

---

## ✨ Features

### 🎮 6 Interactive Security Challenges

| Challenge | What You Learn | Difficulty |
|-----------|---------------|------------|
| 🖥️ **Terminal Hacking** | Unix command injection, privilege escalation | ⭐⭐⭐ |
| 🔐 **Password Security** | Entropy, dictionary attacks, salting | ⭐⭐ |
| 🔑 **Encryption Lab** | Caesar, Base64, ROT13, Hex encoding | ⭐⭐ |
| 💉 **SQL Injection** | Auth bypass, UNION attacks, blind SQLi | ⭐⭐⭐⭐ |
| 🕸️ **XSS Attacks** | Reflected/stored XSS, DOM manipulation | ⭐⭐⭐ |
| ⛓️ **Blockchain Puzzles** | Hash mining, Merkle trees, transactions | ⭐⭐⭐ |

Each challenge has **5 progressive levels** with real-time scoring, hints, and an AI advisor.

### 🧠 AI Integration (Gemini)

This isn't AI bolted on as an afterthought — it's the **core product differentiator**:

```
┌─────────────────────────────────────────────────────┐
│                  AI SECURITY LAB                     │
├─────────────────┬─────────────────┬─────────────────┤
│  🔍 Vuln        │  🔐 Password    │  📝 Quiz        │
│  Scanner        │  Analyzer       │  Generator      │
│                 │                 │                 │
│ Paste code →    │ Test password → │ Pick topic →    │
│ Get severity-   │ Get attack      │ Get custom      │
│ rated audit     │ vector analysis │ security quiz   │
└─────────────────┴─────────────────┴─────────────────┘
```

| Feature | How It Works |
|---------|-------------|
| **AI Security Advisor** | Appears on every challenge — analyzes your attempt in real-time and explains what happened, how attackers exploit it, and how to defend |
| **Vulnerability Scanner** | Paste any code snippet → get a structured security audit with severity ratings (Critical/High/Medium/Low) |
| **Password Analyzer** | Enter a password → AI evaluates strength against real attack vectors (dictionary, rainbow tables, brute force) |
| **Security Quiz Generator** | Pick a topic + difficulty → AI generates a unique quiz every time |
| **Adaptive Hint Engine** | Hints get progressively more specific based on your attempt history — not static text |

**AI Architecture:**
- Multi-model fallback: `gemini-2.0-flash` → `gemini-1.5-flash` → `gemini-1.5-pro`
- Rate-limit resilience with automatic retry + exponential backoff
- Privacy-first: API keys stored locally, never transmitted to any server except Google's
- Works without AI too — graceful degradation when no key is configured

### 🏆 Gamification Engine

- **15 earnable badges** — First Hack, Terminal Master, Speed Demon, Perfectionist, Grandmaster...
- **Activity heatmap** — GitHub-style contribution graph on your profile
- **Streak tracking** — consecutive day rewards
- **Category breakdown** — radar view of your security skills
- **Score persistence** — localStorage + optional backend sync
- **Progressive difficulty** — each challenge scales from beginner to advanced

### 🌐 Works Everywhere

- **Fully offline** — PWA with service worker, works on GitHub Pages
- **No backend required** — all progress saved to localStorage
- **Optional backend** — Node.js + MongoDB for cloud sync when available
- **Mobile responsive** — plays great on phone and tablet

---

## 🏗️ Architecture

```
hackops/
├── frontend/                    # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   └── ai/              # AI Security Advisor component
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx   # Auth with offline fallback
│   │   │   └── GameContext.tsx   # Central game state + badge engine
│   │   ├── lib/
│   │   │   ├── ai.ts            # Gemini client (multi-model, retry logic)
│   │   │   └── storage.ts       # localStorage persistence layer
│   │   └── pages/
│   │       ├── AILab.tsx         # AI Security Lab (3 tools)
│   │       ├── ProfilePage.tsx   # Stats, heatmap, badges, history
│   │       └── games/           # 6 challenge engines
│   └── dist/                    # Production build (576KB JS)
│
├── backend-node/                # Express + MongoDB (optional)
│   ├── src/
│   │   ├── models/              # User, Challenge, Attempt schemas
│   │   ├── routes/              # Auth, challenges, progress APIs
│   │   └── middleware/          # JWT guard
│   └── tests/
│
└── docs/                        # Architecture, deployment, runbook
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind-inspired CSS |
| **AI** | Google Gemini API (2.0 Flash, 1.5 Flash, 1.5 Pro) |
| **State** | React Context + localStorage (hybrid online/offline) |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Auth** | JWT + bcrypt (optional — works without login) |
| **Deploy** | GitHub Pages (static) + GitHub Actions CI/CD |
| **PWA** | Service Worker + offline caching |

---

## 🚀 Quick Start

### Play Instantly (No Setup)
👉 **[flamechargerr.github.io/HackOps](https://flamechargerr.github.io/HackOps/)** — works in any browser, no install needed.

### Run Locally

```bash
git clone https://github.com/Flamechargerr/HackOps.git
cd HackOps/frontend
npm install
npm run dev
# → http://localhost:3000
```

### Enable AI Features

1. Get a free Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Open HackOps → navigate to **AI Lab** in the header
3. Click **Configure AI** → paste your key → **Test Connection** → **Save**
4. All AI features are now active across the platform ✨

### Optional: Run with Backend

```bash
cd backend-node
cp .env.example .env
# Set JWT_SECRET, MONGODB_URI, CORS_ORIGIN
npm install
npm start
# → http://localhost:4000
```

---

## 📊 Technical Highlights

| Metric | Value |
|--------|-------|
| **TypeScript errors** | 0 |
| **Production bundle** | 576KB JS, 106KB CSS |
| **AI response time** | <3 seconds |
| **Challenges** | 6 categories × 5 levels = 30 unique challenges |
| **Badges** | 15 earnable achievements |
| **Offline support** | Full PWA — works without internet |
| **Build time** | <2 seconds |

---

## 🧠 AI Deep Dive

The AI pipeline (`src/lib/ai.ts`) is built for **production resilience**, not demo-ware:

```typescript
// Multi-model cascade with automatic fallback
const MODELS = [
  'gemini-2.0-flash-lite',   // Fast + cheap
  'gemini-2.0-flash',        // Balanced
  'gemini-1.5-flash',        // Fallback
  'gemini-1.5-pro',          // Heavy lifting
];

// 5 specialized AI functions, each with security-focused system prompts:
analyzeAttempt()    // Real-time challenge feedback
generateHint()      // Progressive hint generation
analyzeThreat()     // Code vulnerability scanning
analyzePassword()   // Password strength analysis
generateQuiz()      // Dynamic quiz creation
```

**Key design decisions:**
- **System prompts are security-education focused** — the AI teaches defense, not attack
- **Rate limiting handled client-side** with retry + exponential backoff
- **API key rotation** — supports multiple comma-separated keys
- **Graceful degradation** — every feature works without AI (just without the smart analysis)

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

```bash
# Run tests
cd frontend && npx tsc --noEmit  # Type check
cd backend-node && npm test       # API tests
```

---

## 📄 License

MIT — use it, learn from it, build on it.

---

<div align="center">

**Built by [Anamay Tripathy](https://github.com/Flamechargerr)** · MIT License

*If you found this useful, consider giving it a ⭐*

</div>
