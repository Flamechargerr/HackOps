# 🛡️ HackOps

<div align="center">

![HackOps Banner](https://img.shields.io/badge/HackOps-Cybersecurity%20Training-00d4ff?style=for-the-badge&logo=shield&logoColor=white)

**Interactive Cybersecurity Learning Platform**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[🚀 Live Demo](https://flamechargerr.github.io/HackOps) · [📖 Documentation](#documentation) · [🤝 Contributing](#contributing) · [🐛 Report Bug](https://github.com/Flamechargerr/HackOps/issues)

</div>

---

## ✨ Overview

HackOps is a modern, interactive cybersecurity learning platform that transforms complex security concepts into engaging, hands-on challenges. Practice real-world security techniques in a completely safe sandbox environment.

### Why HackOps?

- 🔒 **100% Safe Environment** - Practice exploits without any legal concerns
- 🎯 **Real-World Scenarios** - Learn techniques used by security professionals
- 📊 **Track Progress** - Earn badges and climb the global leaderboard
- 📚 **Guided Learning** - Hints and explanations for every challenge
- 🆓 **Free & Open Source** - No paywalls, forever free

---

## 🎮 Challenge Categories

| Category | Description | Difficulty |
|----------|-------------|------------|
| 🖥️ **Terminal Hacking** | Unix-like system navigation and privilege escalation | Beginner → Advanced |
| 🔐 **Password Security** | Create passwords that defeat layered defenses | Beginner |
| 🔑 **Encryption Lab** | Classical and modern cryptography challenges | Beginner → Intermediate |
| 💉 **XSS Playground** | Cross-site scripting vulnerability training | Intermediate |
| 🗄️ **SQL Injection** | Database exploitation and defense techniques | Intermediate |
| ⛓️ **Blockchain Puzzles** | Hash mining and smart contract security | Advanced |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ 
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/Flamechargerr/HackOps.git
cd HackOps

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Backend Setup (Optional)

For full functionality including user authentication and leaderboards:

```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URL

# Start backend server
python server.py
```

---

## 📁 Project Structure

```
HackOps/
├── frontend/                 # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts (Auth, etc.)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   └── lib/             # Library configurations
│   ├── public/              # Static assets
│   └── index.html           # Entry HTML
├── backend/                  # FastAPI + MongoDB backend
│   ├── server.py            # Main API server
│   ├── auth.py              # Authentication logic
│   ├── achievements.py      # Badge/achievement system
│   └── models.py            # Pydantic models
├── docs/                     # Documentation
└── README.md
```

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** TanStack Query
- **Routing:** React Router 6

### Backend
- **Framework:** FastAPI (Python)
- **Database:** MongoDB with Motor async driver
- **Authentication:** JWT with bcrypt
- **API Documentation:** OpenAPI/Swagger

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint

# Deployment
npm run deploy       # Build and deploy to GitHub Pages
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Ideas
- 🆕 New challenge types
- 🎨 UI/UX improvements
- 🐛 Bug fixes
- 📖 Documentation updates
- 🌐 Translations

---

## 📋 Roadmap

### Phase 1: Core Enhancement ✅
- [x] Modern UI/UX redesign
- [x] All challenge categories functional
- [x] Leaderboard with mock data
- [x] About page
- [x] Consistent branding

### Phase 2: Advanced Features 🚧
- [ ] User authentication system
- [ ] Persistent progress tracking
- [ ] Real-time leaderboard updates
- [ ] Achievement badge system
- [ ] Challenge difficulty progression

### Phase 3: Community & AI 📋
- [ ] Community challenge submissions
- [ ] AI-powered hint system
- [ ] Multiplayer CTF mode
- [ ] Learning paths/tracks

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide Icons](https://lucide.dev/) for beautiful icons
- All contributors who help make HackOps better!

---

<div align="center">

### 🚀 Ready to Start Your Cybersecurity Journey?

[**Try HackOps Now →**](https://flamechargerr.github.io/HackOps)

Made with ❤️ by the HackOps Team

</div>