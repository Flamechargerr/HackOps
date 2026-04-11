# 🤝 Contributing to HackOps

We're thrilled that you're interested in contributing to **HackOps**! This cybersecurity learning platform thrives on community involvement, and we welcome contributions from developers, security enthusiasts, educators, and learners at all levels.

## 📋 Table of Contents

- [🚦 Getting Started](#getting-started)
- [🎯 Ways to Contribute](#ways-to-contribute)
- [💻 Development Setup](#development-setup)
- [📝 Coding Standards](#coding-standards)
- [🔄 Pull Request Process](#pull-request-process)
- [🐛 Bug Reports](#bug-reports)
- [💡 Feature Requests](#feature-requests)
- [📖 Documentation](#documentation)
- [🏆 Recognition](#recognition)

---

## 🚦 Getting Started

### **First Time Contributing?**

1. **🍴 Fork** the repository
2. **⭐ Star** the project (if you find it useful!)
3. **👀 Browse** existing [issues](https://github.com/Flamechargerr/HackOps/issues) for something interesting
4. **💬 Comment** on an issue you'd like to work on
5. **🔧 Set up** your development environment

### **Quick Wins for New Contributors**

Looking for easy ways to get started? Try these:

| Label | Description | Good For |
|-------|-------------|----------|
| `good first issue` | Perfect for newcomers | First-time contributors |
| `documentation` | Improve docs, README, guides | Writers & beginners |
| `bug` | Fix reported issues | All skill levels |
| `enhancement` | Add new features | Experienced developers |
| `help wanted` | Community assistance needed | Anyone! |

---

## 🎯 Ways to Contribute

### 🎮 **Cybersecurity Challenges**
- Create new security challenges and games
- Improve existing challenge mechanics
- Add educational content and explanations
- Design progressive difficulty levels

### 🎨 **UI/UX Improvements**
- Enhance the dark theme and animations
- Improve mobile responsiveness
- Design new components and layouts
- Optimize user experience flows

### 🔧 **Technical Enhancements**
- Backend API improvements
- Frontend performance optimizations
- Database schema enhancements
- Security vulnerability fixes

### 📱 **Platform Support**
- Mobile app development
- Progressive Web App features
- Cross-browser compatibility
- Accessibility improvements

### 📖 **Documentation & Education**
- Tutorial creation
- Code comments and documentation
- Educational content writing
- Video/visual content creation

---

## 💻 Development Setup

### **Prerequisites**
- **Node.js** 18+
- **MongoDB** (local or Atlas)
- **npm** package manager
- **Git** for version control

### **🛠️ Local Development**

1. **Clone your fork:**
```bash
git clone https://github.com/YOUR_USERNAME/HackOps.git
cd HackOps
```

2. **Install dependencies:**
```bash
# Frontend
cd frontend
yarn install

# Backend (production path)
cd ../backend-node
npm install
```

3. **Set up environment variables:**
```bash
# Copy example files
cp backend-node/.env.example backend-node/.env
cp frontend/.env.example frontend/.env

# Edit .env files with your configurations
```

4. **Start development servers:**
```bash
# Terminal 1: Frontend
cd frontend
yarn dev

# Terminal 2: Backend
cd backend-node
npm run dev
```

5. **Verify setup:**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000/api

### **🧪 Running Tests**

```bash
# Frontend tests
cd frontend
yarn test

# Backend tests
cd backend-node
npm test

# Linting
yarn lint        # Frontend
flake8 .         # Backend
```

---

## 📝 Coding Standards

### **🎨 Frontend (React/TypeScript)**

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn components
- **State Management**: TanStack Query for server state
- **Routing**: React Router v6
- **Testing**: Jest + Testing Library

**Code Style:**
```typescript
// ✅ Good
interface GameProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number) => void;
}

const PasswordGame: React.FC<GameProps> = ({ difficulty, onComplete }) => {
  const [input, setInput] = useState<string>('');
  
  return (
    <div className="flex flex-col space-y-4 p-6">
      {/* Component content */}
    </div>
  );
};
```

### **🐍 Backend (FastAPI/Python)**

- **Framework**: FastAPI with async/await
- **Database**: MongoDB with Motor driver
- **Validation**: Pydantic v2 models
- **Testing**: pytest with async support

**Code Style:**
```python
# ✅ Good
from pydantic import BaseModel, Field
from typing import Optional
import uuid

class ChallengeResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_input: str
    is_correct: bool
    score: Optional[int] = None

@router.post("/challenge/validate", response_model=ChallengeResponse)
async def validate_challenge(challenge: ChallengeInput):
    # Implementation here
    pass
```

### **🎯 General Guidelines**

- **📝 Clear naming**: Use descriptive variable and function names
- **💬 Comments**: Explain complex logic, not obvious code
- **🔍 TypeScript**: Use strict typing, avoid `any`
- **🧪 Tests**: Write tests for new features and bug fixes
- **♻️ DRY**: Don't repeat yourself - extract reusable functions
- **🏗️ SOLID**: Follow SOLID principles for maintainable code

---

## 🔄 Pull Request Process

### **📋 PR Checklist**

Before submitting your PR, ensure:

- [ ] **🧪 Tests**: All tests pass locally
- [ ] **🔍 Linting**: No linting errors
- [ ] **📖 Documentation**: Updated relevant docs
- [ ] **🎯 Focus**: PR addresses a single concern
- [ ] **📝 Description**: Clear description of changes
- [ ] **🏷️ Labels**: Appropriate labels applied

### **📝 PR Template**

```markdown
## 🎯 Description
Brief description of changes made.

## 🔗 Related Issue
Fixes #(issue_number)

## 🧪 Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests passing

## 📷 Screenshots (if applicable)
Add screenshots for UI changes.

## ✅ Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

### **🎉 Conventional Commits**

Use conventional commit format for clear history:

```bash
# Types: feat, fix, docs, style, refactor, test, chore

feat: add password strength meter to password game
fix: resolve XSS vulnerability in user input
docs: update API documentation for new endpoints
style: improve dark theme consistency across components
refactor: extract common validation logic to utils
test: add comprehensive tests for encryption challenges
chore: update dependencies to latest versions
```

---

## 🐛 Bug Reports

Found a bug? Help us squash it! 🔨

### **📋 Bug Report Template**

```markdown
**🐛 Bug Description**
A clear description of the bug.

**🔄 Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. See error

**✅ Expected Behavior**
What should have happened.

**📱 Environment**
- OS: [e.g., Windows 10, macOS Big Sur]
- Browser: [e.g., Chrome 96, Firefox 95]
- Device: [e.g., Desktop, Mobile]

**📷 Screenshots**
Add screenshots if applicable.

**📝 Additional Context**
Any other relevant information.
```

---

## 💡 Feature Requests

Have an idea for HackOps? We'd love to hear it! 💭

### **📋 Feature Request Template**

```markdown
**🎯 Feature Description**
Clear description of the proposed feature.

**💪 Problem It Solves**
What problem does this feature address?

**🎨 Proposed Solution**
How should this feature work?

**🔄 Alternatives Considered**
Other approaches you've thought about.

**📈 Impact**
How would this benefit users?
```

### **🎯 Popular Feature Areas**

- **🎮 New Challenges**: Password cracking, network security, forensics
- **🏆 Gamification**: Achievements, streaks, leaderboards  
- **👥 Social**: User profiles, sharing, collaboration
- **🤖 AI Integration**: Adaptive hints, personalized learning
- **📱 Mobile**: Native apps, offline support

---

## 📖 Documentation

### **Types of Documentation**

- **📖 README**: Main project overview
- **🚀 Setup Guides**: Installation and deployment
- **🔗 API Docs**: Backend endpoint documentation  
- **🎮 Challenge Guides**: How to create new challenges
- **🎨 UI Guidelines**: Design system documentation

### **📝 Writing Guidelines**

- **🎯 Clear & Concise**: Easy to understand
- **📋 Step-by-Step**: Logical progression
- **💡 Examples**: Include code samples
- **🎨 Formatting**: Use proper markdown
- **🔗 Links**: Link to relevant resources

---

## 🏆 Recognition

We believe in recognizing our contributors! 🎉

### **🌟 Contribution Levels**

- **🥉 Contributor**: Made at least 1 merged PR
- **🥈 Regular Contributor**: 5+ merged PRs  
- **🥇 Core Contributor**: 15+ PRs + ongoing involvement
- **💎 Maintainer**: Trusted with repository access

### **📝 Contributors Wall**

All contributors are recognized in:
- `README.md` contributors section
- Release notes and changelogs  
- Social media shoutouts for major contributions
- Special badges and mentions

---

## 🤔 Questions?

**Need help getting started?**

- 💬 **Join Discussions**: [GitHub Discussions](https://github.com/Flamechargerr/HackOps/discussions)
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/Flamechargerr/HackOps/issues)
- 📧 **Contact Maintainers**: Create an issue with `@Flamechargerr`

---

## 📜 Code of Conduct

By participating in this project, you agree to:

- **🤝 Be respectful**: Treat everyone with respect
- **🌍 Be inclusive**: Welcome people from all backgrounds
- **💬 Be constructive**: Provide helpful feedback
- **📖 Follow guidelines**: Adhere to project standards
- **🎯 Stay on topic**: Keep discussions relevant

---

<div align="center">

## 🙏 **Thank You!**

**Every contribution, no matter how small, makes HackOps better for everyone. Together, we're building the future of cybersecurity education! 🚀**

[![Contributors](https://img.shields.io/github/contributors/Flamechargerr/HackOps)](https://github.com/Flamechargerr/HackOps/graphs/contributors)

*Ready to make your first contribution? [Find a good first issue!](https://github.com/Flamechargerr/HackOps/labels/good%20first%20issue)*

</div>