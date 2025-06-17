<h1 align="center">🔐 HACKOPS – PASSWORD CHALLENGE GAME 🔐</h1>
<p align="center"><em>A gamified learning experience that tests and strengthens your understanding of password security – one level at a time.</em></p>

<p align="center">
  <img src="https://img.shields.io/github/last-commit/Flamechargerr/HackOps?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/github/languages/top/Flamechargerr/HackOps?style=flat-square" alt="Top Language">
  <img src="https://img.shields.io/github/languages/count/Flamechargerr/HackOps?style=flat-square" alt="Languages Used">
</p>

---

## 📌 Overview

**HackOps** is a creative, educational browser game that transforms password-building into a thrilling challenge.  
Inspired by cybersecurity best practices, it teaches players how to build **secure, strong passwords** in a way that’s interactive and fun.

Perfect for beginners, learners, and developers who want to **level up their password hygiene** — literally.

---

### 🎮 Gameplay Snapshot

- 🧠 8 progressive levels with escalating password constraints  
- 🔐 Real-time feedback for each condition met  
- 🧩 Fun mix of logic + regex + game mechanics  
- 🎉 Celebrate final victory with animations and win screen  
- 📊 Dynamic scoring and condition-based UI updates

---

## 🛠️ Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
  <img src="https://img.shields.io/badge/Shadcn/UI-000000?style=for-the-badge&logo=react&logoColor=white">
  <img src="https://img.shields.io/badge/React_Router-EA4335?style=for-the-badge&logo=react-router&logoColor=white">
  <img src="https://img.shields.io/badge/Lucide_Icons-yellow?style=for-the-badge">
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

## 🔮 Future Additions

- 🌐 Online global leaderboard  
- 🧠 Add hints/tooltips explaining password rules  
- 📱 Responsive UI improvements  
- 🔊 Sound & feedback on correct/incorrect guesses  
- 🧪 Timed mode with challenges & badges

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

## 🔗 Live Demo

🌍 [**Play HackOps**](https://playful-password-playground.lovable.app) — Try it now and test your password mastery!

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

> **“The strongest walls begin with the smallest bricks — build your passwords the smart way.”**
