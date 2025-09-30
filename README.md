HackOps — Cybersecurity Challenges, Reimagined

A modern, dark and sleek playground for learning ethical hacking through hands-on challenges. Built with React + Vite (shadcn + Tailwind), FastAPI, and MongoDB. Fully hot-reloading in this environment with backend routed under /api.

Highlights
- Polished dark UI with glassmorphism, neon accents, and smooth micro-interactions
- Multiple interactive challenges: Password Game, Terminal Hacking, Encryption, XSS, SQL Injection, Blockchain Puzzles
- Local leaderboard stored on the client (MVP-safe) with stats and filters
- PWA-enabled front-end for fast, app-like experience
- Clean API contract with FastAPI and MongoDB (UUID-based IDs)

Quickstart (Local in this environment)
- Frontend: auto-started by supervisor on port 3000 (do not run manually)
- Backend: auto-started by supervisor on 0.0.0.0:8001 (exposed through /api)
- Restart services if needed:
  - sudo supervisorctl restart frontend
  - sudo supervisorctl restart backend

Tech Stack
- Frontend: React 18, Vite 5, TypeScript, TailwindCSS + shadcn, Radix UI, react-router, TanStack Query
- Backend: FastAPI, Motor (Mongo), Pydantic v2
- DB: MongoDB (MONGO_URL from backend/.env)

API Overview (/api)
- GET /api/            -> Hello World
- POST /api/status     -> Create status check { client_name }
- GET /api/status      -> List status checks

Environment Rules
- Frontend must call backend using REACT_APP_BACKEND_URL (already configured by environment). Do not hardcode.
- Backend MUST read Mongo URL from os.environ['MONGO_URL']; DB name from os.environ['DB_NAME'].
- All backend routes are prefixed with /api to comply with ingress.

Developer Notes
- Vite dev server binds 0.0.0.0:3000 with outDir=build per infra requirements
- Do not modify .env files; use them as-is
- Use yarn (not npm)

Testing
- Backend tests are executed via the integrated testing agent in this environment. See test_result.md for protocol and history.
- Frontend tests: basic component tests exist for the Password Game (Testing Library + Jest). In this environment we use an automation agent for end-to-end smoke.

What’s Improved Now
- Standardized Vite server config to work with the platform (host 0.0.0.0, port 3000, outDir=build)
- Added a start script alias for consistency
- Readme overhaul (you’re reading it!)

Roadmap Ideas
- Persist leaderboard to backend (Mongo) with UUIDs
- Achievements, daily streaks, and social share cards
- Optional LLM-powered hints using Emergent LLM key (OpenAI/Gemini/Claude) upon your approval

License
MIT
