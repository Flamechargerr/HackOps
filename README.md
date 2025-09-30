<div align="center">

![HackOps Banner](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5fGVufDB8fHx8MTc1OTIxNzcwNnww&ixlib=rb-4.1.0&q=85&w=1200&h=400&fit=crop)

# 🛡️ HackOps
### *Cybersecurity Challenges, Reimagined* ✨

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Flamechargerr/HackOps/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/Flamechargerr/HackOps?style=social)](https://github.com/Flamechargerr/HackOps/stargazers)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Flamechargerr/HackOps/blob/main/CONTRIBUTING.md)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://flamechargerr.github.io/HackOps)

*A modern, interactive cybersecurity learning platform that transforms complex security concepts into engaging, hands-on challenges.*

[🚀 Live Demo](https://flamechargerr.github.io/HackOps) | [📖 Documentation](#documentation) | [🤝 Contributing](#contributing) | [🎯 Roadmap](#roadmap)

</div>

---

## 🌟 Features

<div align="center">

| 🎮 **Interactive Games** | 🎨 **Modern UI/UX** | 🔒 **Real Security** | ⚡ **Performance** |
|:---:|:---:|:---:|:---:|
| Password strength challenges | Glassmorphism + Dark theme | Actual vulnerability demos | Lightning-fast React + Vite |
| Terminal hacking simulations | Neon accents & animations | XSS & SQL injection labs | PWA-enabled for mobile |
| Encryption/decryption puzzles | Responsive design | Blockchain security | Hot-reload development |
| Leaderboard & progress tracking | Smooth micro-interactions | Authentication scenarios | Optimized builds |

</div>

### 🎯 **Challenge Categories**
- 🔑 **Password Game**: Master password creation with progressive difficulty
- 💻 **Terminal Hacking**: Command-line security simulations  
- 🔐 **Encryption Lab**: Hands-on cryptography challenges
- 🌐 **XSS Playground**: Cross-site scripting vulnerability training
- 💉 **SQL Injection**: Database security attack & defense
- 🏆 **Leaderboard**: Track progress and compete with others

---

## 🎥 Demo

> **Coming Soon**: Interactive demo GIF showcasing the platform in action

*Experience HackOps live at: [flamechargerr.github.io/HackOps](https://flamechargerr.github.io/HackOps)*

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **Python** 3.8+
- **MongoDB** (local or Atlas)
- **Yarn** package manager

### 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/Flamechargerr/HackOps.git
cd HackOps

# Install dependencies
yarn install
cd backend && pip install -r requirements.txt

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with your MongoDB URL and other configs

# Start development servers
yarn dev          # Frontend (React + Vite)
python backend/server.py  # Backend (FastAPI)
```

### 🌐 Production Deployment

#### Option A: SSH Deployment (Recommended for Developers)
```bash
# 1. Set up SSH key (one-time setup)
# See SSH_DEPLOYMENT.md for detailed instructions

# 2. Quick deployment
./deploy.sh

# Or manual steps:
cd frontend
yarn build
yarn deploy
```

#### Option B: GitHub Actions (Automated)
```bash
# Simply push to main branch - automatic deployment!
git add .
git commit -m "feat: add new security challenge"
git push origin main
```

#### Option C: Manual HTTPS Deployment
```bash
# Build and deploy to GitHub Pages
cd frontend
yarn build
yarn deploy
```

📖 **Detailed Setup**: See [SSH_DEPLOYMENT.md](SSH_DEPLOYMENT.md) for complete SSH configuration and troubleshooting.

---

## 🏗️ Architecture

```
┌─────────────────┬─────────────────┬─────────────────┐
│   Frontend      │    Backend      │    Database     │
│   (React)       │   (FastAPI)     │   (MongoDB)     │
├─────────────────┼─────────────────┼─────────────────┤
│ • Vite Builder  │ • Motor Driver  │ • Document DB   │
│ • TypeScript    │ • Pydantic V2   │ • UUID-based    │
│ • Tailwind CSS  │ • CORS Enabled  │ • Local/Atlas   │
│ • Radix UI      │ • Auto Docs     │ • Async Ops     │
│ • React Router  │ • Health Check  │ • Aggregation   │
│ • TanStack      │ • REST API      │ • Indexing      │
└─────────────────┴─────────────────┴─────────────────┘
                           │
                    ┌──────▼──────┐
                    │   /api/*    │
                    │  Endpoints  │
                    └─────────────┘
```

### 🔗 **API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/` | Health check & welcome |
| `POST` | `/api/status` | Create status record |
| `GET` | `/api/status` | List all status records |

---

## 📜 Scripts & Commands

### 🎯 Development
```bash
yarn dev          # Start frontend dev server
yarn build        # Build for production  
yarn lint         # Run ESLint checks
yarn preview      # Preview production build
```

### 🧪 Testing
```bash
yarn test         # Run all tests
yarn test:backend # Backend-specific tests
yarn test:e2e     # End-to-end testing
```

### 🚀 Deployment
```bash
yarn deploy       # Deploy to GitHub Pages
yarn build:dev    # Development build
```

---

## 🐛 Troubleshooting

<details>
<summary><strong>🔧 Common Issues & Solutions</strong></summary>

### **Frontend Issues**
- **Build fails**: Ensure Node.js 18+ and `yarn` are installed
- **Routes show 404**: Check `homepage` field in `package.json`
- **Hot reload not working**: Verify Vite config and port 3000 availability

### **Backend Issues**  
- **MongoDB connection**: Verify `MONGO_URL` in `.env` file
- **CORS errors**: Check backend CORS configuration
- **Port conflicts**: Ensure port 8001 is available

### **Deployment Issues**
- **GitHub Pages 404**: Add 404.html copy in build process
- **Asset loading**: Verify `base` path in Vite config
- **Environment variables**: Use `VITE_` prefix for frontend vars

</details>

---

## 🗺️ Roadmap

### 🎯 **Phase 1: Core Enhancement** (Current)
- [x] ✅ Interactive cybersecurity challenges
- [x] ✅ Modern dark UI with glassmorphism
- [x] ✅ Real-time leaderboard system
- [x] ✅ Responsive design & PWA support

### 🚀 **Phase 2: Advanced Features** (Next)
- [ ] 🔄 User authentication & profiles  
- [ ] 🔄 Achievement system & badges
- [ ] 🔄 Social sharing & competition
- [ ] 🔄 Advanced blockchain challenges

### 🌟 **Phase 3: AI Integration** (Future)
- [ ] 🤖 LLM-powered adaptive hints
- [ ] 🤖 Personalized learning paths
- [ ] 🤖 AI-generated challenges
- [ ] 🤖 Smart vulnerability detection

---

## 🤝 Contributing

We ❤️ contributions! HackOps thrives on community involvement.

### **🚦 Getting Started**

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`  
5. **Submit** a Pull Request

### **📋 Contribution Guidelines**

- Follow **conventional commits** (`feat:`, `fix:`, `docs:`, etc.)
- Add **tests** for new features
- Update **documentation** as needed
- Ensure **code quality** with ESLint
- Write **clear commit messages**

### **🎯 Areas We Need Help**

| Area | Skills | Difficulty |
|------|--------|------------|
| 🎮 New Challenges | Security knowledge | ⭐⭐⭐ |
| 🎨 UI/UX Design | CSS, Design | ⭐⭐ |
| 📱 Mobile Support | Responsive design | ⭐⭐ |
| 🔧 Backend APIs | FastAPI, Python | ⭐⭐⭐ |
| 📖 Documentation | Technical writing | ⭐ |

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - feel free to use this project for learning, teaching, or commercial purposes!
```

---

## 🙏 Acknowledgments

- **Radix UI** - For excellent accessible components
- **Tailwind CSS** - For utility-first styling
- **FastAPI** - For high-performance backend
- **Unsplash** - For stunning cybersecurity imagery
- **The cybersecurity community** - For inspiration and knowledge

---

<div align="center">

### 🚀 **Ready to Start Your Cybersecurity Journey?**

[![Deploy with GitHub Pages](https://img.shields.io/badge/Deploy%20with-GitHub%20Pages-181717?style=for-the-badge&logo=github)](https://flamechargerr.github.io/HackOps)
[![View Demo](https://img.shields.io/badge/View-Live%20Demo-success?style=for-the-badge&logo=vercel)](https://flamechargerr.github.io/HackOps)

**⭐ Star this repo** if you find it helpful • **🍴 Fork it** to contribute • **🐛 Report issues** for bugs

*Built with ❤️ by the cybersecurity community*

</div>