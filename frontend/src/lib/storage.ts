/**
 * LocalStorage-based progress persistence for offline mode.
 * When a backend is available, this acts as a cache / fallback.
 */

const STORAGE_PREFIX = 'hackops_';

/* ─── Types ─────────────────────────────────────────────────── */

export interface ChallengeCompletion {
  challengeId: string;
  score: number;
  hintsUsed: number;
  attempts: number;
  timeMs: number;
  completedAt: string; // ISO
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string; // ISO
}

export interface GameProgress {
  totalScore: number;
  challengesCompleted: number;
  completions: Record<string, ChallengeCompletion>;
  badges: Badge[];
  streakDays: number;
  lastPlayedAt: string | null;
}

/* ─── Badge Definitions ─────────────────────────────────────── */

export const BADGE_DEFINITIONS: Omit<Badge, 'earnedAt'>[] = [
  { id: 'first-hack', name: 'First Hack', description: 'Complete your first challenge', icon: '🏁' },
  { id: 'terminal-rookie', name: 'Terminal Rookie', description: 'Complete Terminal Level 1', icon: '💻' },
  { id: 'terminal-master', name: 'Terminal Master', description: 'Complete all Terminal levels', icon: '🖥️' },
  { id: 'password-pro', name: 'Password Pro', description: 'Complete the Password Challenge', icon: '🔐' },
  { id: 'crypto-cracker', name: 'Crypto Cracker', description: 'Complete the Encryption Challenge', icon: '🔑' },
  { id: 'xss-hunter', name: 'XSS Hunter', description: 'Complete all XSS levels', icon: '🕷️' },
  { id: 'sql-ninja', name: 'SQL Ninja', description: 'Complete all SQL Injection levels', icon: '💉' },
  { id: 'blockchain-wizard', name: 'Blockchain Wizard', description: 'Complete Blockchain Puzzles', icon: '⛓️' },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Complete any challenge in under 60 seconds', icon: '⚡' },
  { id: 'no-hints', name: 'Pure Skill', description: 'Complete any challenge without using hints', icon: '🧠' },
  { id: 'perfectionist', name: 'Perfectionist', description: 'Score 100% on any challenge', icon: '💯' },
  { id: 'streak-3', name: 'On a Roll', description: 'Play 3 days in a row', icon: '🔥' },
  { id: 'streak-7', name: 'Dedicated', description: 'Play 7 days in a row', icon: '🏆' },
  { id: 'all-rounder', name: 'All Rounder', description: 'Complete at least 1 challenge in every category', icon: '🌟' },
  { id: 'grandmaster', name: 'Grandmaster', description: 'Complete all challenges', icon: '👑' },
];

/* ─── Helpers ────────────────────────────────────────────────── */

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // localStorage full or blocked — silently ignore
  }
}

/* ─── Default Progress ──────────────────────────────────────── */

const DEFAULT_PROGRESS: GameProgress = {
  totalScore: 0,
  challengesCompleted: 0,
  completions: {},
  badges: [],
  streakDays: 0,
  lastPlayedAt: null,
};

/* ─── Public API ────────────────────────────────────────────── */

export function getProgress(): GameProgress {
  return getItem<GameProgress>('progress', { ...DEFAULT_PROGRESS });
}

export function saveProgress(progress: GameProgress): void {
  setItem('progress', progress);
}

/**
 * Record a challenge completion and compute new badges.
 * Returns the updated progress + any newly earned badges.
 */
export function recordCompletion(completion: ChallengeCompletion): {
  progress: GameProgress;
  newBadges: Badge[];
} {
  const progress = getProgress();
  const isFirstTime = !progress.completions[completion.challengeId];

  progress.completions[completion.challengeId] = completion;

  if (isFirstTime) {
    progress.totalScore += completion.score;
    progress.challengesCompleted += 1;
  } else {
    // Update score if better
    const prev = progress.completions[completion.challengeId];
    if (completion.score > (prev?.score ?? 0)) {
      progress.totalScore += completion.score - (prev?.score ?? 0);
    }
  }

  // Update streak
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  if (progress.lastPlayedAt) {
    const lastDate = progress.lastPlayedAt.slice(0, 10);
    const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
    if (lastDate === yesterday) {
      progress.streakDays += 1;
    } else if (lastDate !== today) {
      progress.streakDays = 1;
    }
  } else {
    progress.streakDays = 1;
  }
  progress.lastPlayedAt = now.toISOString();

  // Compute new badges
  const newBadges = computeNewBadges(progress);
  progress.badges = [...progress.badges, ...newBadges];

  saveProgress(progress);
  return { progress, newBadges };
}

function computeNewBadges(progress: GameProgress): Badge[] {
  const earned = new Set(progress.badges.map((b) => b.id));
  const newBadges: Badge[] = [];
  const now = new Date().toISOString();

  const award = (id: string) => {
    if (earned.has(id)) return;
    const def = BADGE_DEFINITIONS.find((d) => d.id === id);
    if (def) {
      newBadges.push({ ...def, earnedAt: now });
      earned.add(id);
    }
  };

  const completions = Object.keys(progress.completions);
  const completionValues = Object.values(progress.completions);

  // First hack
  if (completions.length >= 1) award('first-hack');

  // Category badges
  const hasCategory = (prefix: string) => completions.some((id) => id.startsWith(prefix));
  const allInCategory = (ids: string[]) => ids.every((id) => progress.completions[id]);

  if (hasCategory('terminal')) award('terminal-rookie');
  if (allInCategory(['terminal-1', 'terminal-2', 'terminal-3', 'terminal-4', 'terminal-5'])) award('terminal-master');
  if (hasCategory('password')) award('password-pro');
  if (hasCategory('encryption')) award('crypto-cracker');
  if (allInCategory(['xss-1', 'xss-2', 'xss-3', 'xss-4', 'xss-5'])) award('xss-hunter');
  if (allInCategory(['sql-1', 'sql-2', 'sql-3', 'sql-4', 'sql-5'])) award('sql-ninja');
  if (hasCategory('blockchain')) award('blockchain-wizard');

  // Speed & skill badges
  if (completionValues.some((c) => c.timeMs < 60000)) award('speed-demon');
  if (completionValues.some((c) => c.hintsUsed === 0)) award('no-hints');
  if (completionValues.some((c) => c.score >= 100)) award('perfectionist');

  // Streak badges
  if (progress.streakDays >= 3) award('streak-3');
  if (progress.streakDays >= 7) award('streak-7');

  // All-rounder (at least 1 in each category)
  const categories = ['terminal', 'password', 'encryption', 'xss', 'sql', 'blockchain'];
  if (categories.every((cat) => completions.some((id) => id.startsWith(cat)))) {
    award('all-rounder');
  }

  // Grandmaster
  if (completions.length >= 25) award('grandmaster');

  return newBadges;
}

/* ─── AI Settings ────────────────────────────────────────────── */

export interface AISettings {
  apiKey: string;
  model: string;
  enabled: boolean;
}

const DEFAULT_AI_SETTINGS: AISettings = {
  apiKey: '',
  model: 'gemini-2.0-flash',
  enabled: true,
};

export function getAISettings(): AISettings {
  return getItem<AISettings>('ai_settings', { ...DEFAULT_AI_SETTINGS });
}

export function saveAISettings(settings: AISettings): void {
  setItem('ai_settings', settings);
}

export function isAIConfigured(): boolean {
  const settings = getAISettings();
  return settings.enabled && settings.apiKey.length > 0;
}

/* ─── Guest Username ────────────────────────────────────────── */

export function getGuestName(): string {
  return getItem<string>('guest_name', `Hacker_${Math.random().toString(36).slice(2, 6)}`);
}

export function setGuestName(name: string): void {
  setItem('guest_name', name);
}
