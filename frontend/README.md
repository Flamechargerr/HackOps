# 🔐 HACKOPS – PASSWORD CHALLENGE GAME 🔐

_A gamified learning experience that tests and strengthens your understanding of password security – one level at a time._

<p align="center">
  <img src="https://img.shields.io/github/last-commit/Flamechargerr/HackOps?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/github/languages/top/Flamechargerr/HackOps?style=flat-square" alt="Top Language">
  <img src="https://img.shields.io/github/languages/count/Flamechargerr/HackOps?style=flat-square" alt="Languages Used">
  <img src="https://img.shields.io/badge/PWA-Ready-brightgreen?style=flat-square" alt="PWA Ready">
</p>

---

## 📌 Overview

**HackOps** is a creative, educational browser game that transforms password-building into a thrilling challenge.  
Inspired by cybersecurity best practices, it teaches players how to build **secure, strong passwords** in a way that’s interactive and fun.

Perfect for beginners, learners, and developers who want to **level up their password hygiene** — literally.

---

### 🎮 Gameplay & Features

- 🧠 8 progressive levels with escalating password constraints  
- 🔐 Real-time feedback for each condition met  
- 🧩 Fun mix of logic + regex + game mechanics  
- 🎉 Celebrate final victory with confetti and win screen  
- 📊 Dynamic scoring and condition-based UI updates
- 🌟 **Hints & Energy System**: Use hints with limited energy for help
- 🏆 **Achievements & Badges**: Earn badges for milestones
- 🌐 **Global Leaderboard**: Filter, sort, and view stats for all games
- 📱 **Mobile-first & Responsive**: Beautiful on all devices
- ♿ **Accessibility**: ARIA, keyboard navigation, color contrast
- 💬 **Social Sharing**: Share your results on X (Twitter) or copy a link
- 🧑‍🏫 **In-game Tutorials**: Step-by-step onboarding for new users
- 🌙 **Dark/Light Mode**: Toggle for your preferred theme
- ⚡ **PWA/Offline Support**: Installable, works offline, fast loading
- ✨ **UI/UX Polish**: Smooth animations, tactile buttons, interactive cards

---

## 🛠️ Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
  <img src="https://img.shields.io/badge/Shadcn/UI-000000?style=for-the-badge&logo=react&logoColor=white">
  <img src="https://img.shields.io/badge/React_Router-EA4335?style=for-the-badge&logo=react-router&logoColor=white">
  <img src="https://img.shields.io/badge/Lucide_Icons-yellow?style=for-the-badge">
  <img src="https://img.shields.io/badge/PWA-Ready-brightgreen?style=for-the-badge">
</p>

---

## 🔐 Password Logic & Levels

Each level introduces a new requirement. Players must build passwords that meet **all previous + current conditions**.

| Level | Requirement                                 |
|-------|---------------------------------------------|
| 1️⃣    | Minimum 5 characters                       |
| 2️⃣    | At least one uppercase letter              |
| 3️⃣    | At least one number                        |
| 4️⃣    | At least one special character             |
| 5️⃣    | No three consecutive repeating characters  |
| 6️⃣    | Password length must be a **prime number** |
| 7️⃣    | Must contain a **month name**              |
| 8️⃣    | Equal number of uppercase & lowercase chars|

---

## 💡 Educational Value

HackOps promotes **cybersecurity awareness** by helping users:
- Visualize password vulnerabilities
- Understand why rules exist (e.g., primes, repetition)
- Train mental models for secure password creation
- Have **fun while learning** (rare in infosec!)

Great for:
- 👨‍🏫 Students  
- 🧑‍💻 Developers  
- 🧓🏽 Non-tech users  

---

## 🚀 Live Demo

🌍 [**Play HackOps on GitHub Pages**](https://flamechargerr.github.io/HackOps/) — Try it now and test your password mastery!

---

## 📲 PWA & Offline Support

- **Installable**: Add to your home screen on desktop or mobile
- **Works offline**: Play even without an internet connection
- **Fast loading**: Optimized for performance

---

## 📂 How to Run Locally

```bash
git clone https://github.com/Flamechargerr/HackOps.git
cd HackOps
npm install
npm run dev
```

➡️ Open `http://localhost:5173` in your browser.  
✅ No external backend or database needed.

---

## 🌐 How to Deploy (GitHub Pages)

1. Make sure your `vite.config.ts` has:
   ```js
   base: '/HackOps/',
   ```
2. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```
3. Your app will be live at:  
   [https://flamechargerr.github.io/HackOps/](https://flamechargerr.github.io/HackOps/)

> For SPA routing, a `404.html` fallback is automatically created for GitHub Pages.

---

## 🧪 Testing

```bash
npm test
```

Test logic includes:
- ✅ Password validator  
- 🧪 Rule engine  
- 🔄 Win-check loop logic

---

## 👨‍💻 Author

Made with 💡 & ❤️ by  
**[@Flamechargerr (Anamay)](https://github.com/Flamechargerr)**  
Powered by **React**, styled by **Tailwind + Shadcn**, and designed for a better internet.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

> **“The strongest walls begin with the smallest bricks — build your passwords the smart way.”**
