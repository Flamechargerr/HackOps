export interface LeaderboardEntry {
  id: string;
  name: string;
  game: string;
  score: number;
  level: number;
  timeCompleted: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
}

export interface GameStats {
  totalPlayed: number;
  averageScore: number;
  bestScore: number;
  completionRate: number;
}

class LeaderboardManager {
  private storageKey = 'hackops-leaderboard';
  private statsKey = 'hackops-stats';

  getLeaderboard(): LeaderboardEntry[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  addScore(entry: Omit<LeaderboardEntry, 'id' | 'timeCompleted'>): void {
    const leaderboard = this.getLeaderboard();
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: Date.now().toString(),
      timeCompleted: Date.now(),
    };

    leaderboard.push(newEntry);
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 100 entries
    if (leaderboard.length > 100) {
      leaderboard.splice(100);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(leaderboard));
    this.updateStats(entry.game, entry.score);
  }

  getTopScores(game?: string, limit: number = 10): LeaderboardEntry[] {
    const leaderboard = this.getLeaderboard();
    const filtered = game ? leaderboard.filter(entry => entry.game === game) : leaderboard;
    return filtered.slice(0, limit);
  }

  getPlayerStats(playerName: string): {
    totalGames: number;
    totalScore: number;
    averageScore: number;
    bestScore: number;
    gamesPlayed: string[];
  } {
    const leaderboard = this.getLeaderboard();
    const playerEntries = leaderboard.filter(entry => entry.name === playerName);
    
    const totalGames = playerEntries.length;
    const totalScore = playerEntries.reduce((sum, entry) => sum + entry.score, 0);
    const averageScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
    const bestScore = Math.max(...playerEntries.map(e => e.score), 0);
    const gamesPlayed = [...new Set(playerEntries.map(e => e.game))];

    return {
      totalGames,
      totalScore,
      averageScore,
      bestScore,
      gamesPlayed,
    };
  }

  private updateStats(game: string, score: number): void {
    const stats = this.getGameStats();
    if (!stats[game]) {
      stats[game] = {
        totalPlayed: 0,
        averageScore: 0,
        bestScore: 0,
        completionRate: 0,
      };
    }

    const gameStats = stats[game];
    gameStats.totalPlayed += 1;
    gameStats.bestScore = Math.max(gameStats.bestScore, score);
    gameStats.averageScore = Math.round(
      (gameStats.averageScore * (gameStats.totalPlayed - 1) + score) / gameStats.totalPlayed
    );

    localStorage.setItem(this.statsKey, JSON.stringify(stats));
  }

  getGameStats(): Record<string, GameStats> {
    const data = localStorage.getItem(this.statsKey);
    return data ? JSON.parse(data) : {};
  }

  clearLeaderboard(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.statsKey);
  }

  generatePlayerName(): string {
    const adjectives = ['Cyber', 'Shadow', 'Digital', 'Neon', 'Matrix', 'Quantum', 'Binary', 'Phantom', 'Ghost', 'Elite'];
    const nouns = ['Hacker', 'Ninja', 'Warrior', 'Agent', 'Hunter', 'Guardian', 'Master', 'Wizard', 'Champion', 'Legend'];
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 999) + 1;
    
    return `${adj}${noun}${num}`;
  }
}

export const leaderboardManager = new LeaderboardManager();
