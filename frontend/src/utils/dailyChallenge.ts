const CHALLENGES = [
  {
    id: "password-daily",
    type: "password",
    description: "Complete level 5+ in the Password Game today!",
  },
  {
    id: "terminal-daily",
    type: "terminal",
    description: "Finish level 3 in the Terminal Game today!",
  },
  {
    id: "encryption-daily",
    type: "encryption",
    description: "Solve the hardest Encryption Game level today!",
  },
  {
    id: "xss-daily",
    type: "xss",
    description: "Find an advanced XSS vector in the XSS Game today!",
  },
  {
    id: "sql-daily",
    type: "sql",
    description: "Exploit a blind SQLi in the SQL Injection Game today!",
  },
];

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

export function getDailyChallenge() {
  const key = getTodayKey();
  let challenge = localStorage.getItem("hackops-daily-challenge");
  if (challenge) {
    const { date, challenge: c } = JSON.parse(challenge);
    if (date === key) return c;
  }
  // Pick a random challenge for today
  const c = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
  localStorage.setItem("hackops-daily-challenge", JSON.stringify({ date: key, challenge: c }));
  return c;
}

export function markDailyComplete() {
  const key = getTodayKey();
  localStorage.setItem("hackops-daily-complete", key);
}

export function isDailyComplete() {
  const key = getTodayKey();
  return localStorage.getItem("hackops-daily-complete") === key;
} 