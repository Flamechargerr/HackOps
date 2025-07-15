export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-hack",
    name: "First Hack",
    description: "Complete your first game.",
    icon: "🎉",
  },
  {
    id: "all-games",
    name: "All Games Completed",
    description: "Complete every game at least once.",
    icon: "🏆",
  },
  {
    id: "top-10",
    name: "Top 10%",
    description: "Reach the top 10% on any leaderboard.",
    icon: "🥇",
  },
  {
    id: "perfect-score",
    name: "Perfect Score",
    description: "Achieve a perfect score in any game.",
    icon: "💯",
  },
  {
    id: "daily-challenge",
    name: "Daily Winner",
    description: "Win a daily challenge.",
    icon: "🌟",
  },
];

export function getEarnedAchievements(profile: any, stats: any, leaderboard: any[]): string[] {
  const earned: string[] = [];
  // First Hack
  if (stats && Object.values(stats).some((s: any) => s.totalPlayed > 0)) {
    earned.push("first-hack");
  }
  // All Games Completed
  if (stats && Object.keys(stats).length >= 5 && Object.values(stats).every((s: any) => s.totalPlayed > 0)) {
    earned.push("all-games");
  }
  // Top 10%
  if (leaderboard && profile && leaderboard.some((e, i) => e.name === profile.nickname && i < Math.ceil(leaderboard.length * 0.1))) {
    earned.push("top-10");
  }
  // Perfect Score
  if (stats && Object.values(stats).some((s: any) => s.bestScore >= 1000)) {
    earned.push("perfect-score");
  }
  // Daily Winner (stub, to be implemented with daily challenge)
  // ...
  return earned;
} 