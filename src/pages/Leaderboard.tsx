import { useState, useEffect } from "react";
import { ArrowLeft, Trophy, Medal, Award, Crown, Star, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { leaderboardManager, LeaderboardEntry } from "@/utils/leaderboard";

const Leaderboard = () => {
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<Record<string, any>>({});

  const games = [
    { id: "all", name: "All Games", icon: <Trophy size={16} /> },
    { id: "password", name: "Password Challenge", icon: <Target size={16} /> },
    { id: "terminal", name: "Terminal Hacking", icon: <Zap size={16} /> },
    { id: "encryption", name: "Encryption", icon: <Medal size={16} /> },
    { id: "xss", name: "XSS Challenge", icon: <Award size={16} /> },
    { id: "sql", name: "SQL Injection", icon: <Star size={16} /> },
  ];

  useEffect(() => {
    updateLeaderboard();
    setStats(leaderboardManager.getGameStats());
  }, [selectedGame]);

  const updateLeaderboard = () => {
    const entries = leaderboardManager.getTopScores(
      selectedGame === "all" ? undefined : selectedGame,
      20
    );
    setLeaderboard(entries);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={20} />;
      case 2:
        return <Medal className="text-gray-400" size={20} />;
      case 3:
        return <Award className="text-amber-600" size={20} />;
      default:
        return <span className="text-muted-foreground font-mono">#{rank}</span>;
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <Link to="/" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              🏆 Leaderboard
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See who's leading the charge in our hacking challenges. Compete with players worldwide!
            </p>
          </div>

          {/* Game Filter */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="glass-card p-4 rounded-xl">
              <div className="flex flex-wrap gap-2 justify-center">
                {games.map((game) => (
                  <Button
                    key={game.id}
                    variant={selectedGame === game.id ? "glow" : "outline"}
                    size="sm"
                    onClick={() => setSelectedGame(game.id)}
                    className="flex items-center space-x-2"
                  >
                    {game.icon}
                    <span>{game.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="max-w-4xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-6 rounded-xl text-center">
              <Trophy className="mx-auto mb-2 text-primary" size={24} />
              <div className="text-2xl font-bold text-primary">
                {leaderboard.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Players</div>
            </div>
            <div className="glass-card p-6 rounded-xl text-center">
              <Target className="mx-auto mb-2 text-accent" size={24} />
              <div className="text-2xl font-bold text-accent">
                {leaderboard.length > 0 ? Math.max(...leaderboard.map(e => e.score)) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Highest Score</div>
            </div>
            <div className="glass-card p-6 rounded-xl text-center">
              <Zap className="mx-auto mb-2 text-yellow-400" size={24} />
              <div className="text-2xl font-bold text-yellow-400">
                {leaderboard.length > 0 ? Math.round(leaderboard.reduce((sum, e) => sum + e.score, 0) / leaderboard.length) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="max-w-4xl mx-auto">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-6 border-b border-primary/20">
                <h2 className="text-2xl font-bold flex items-center">
                  <Trophy className="mr-3 text-primary" size={24} />
                  {selectedGame === "all" ? "Global Rankings" : `${games.find(g => g.id === selectedGame)?.name} Rankings`}
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                {leaderboard.length === 0 ? (
                  <div className="p-12 text-center">
                    <Trophy className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <h3 className="text-xl font-bold mb-2">No Scores Yet!</h3>
                    <p className="text-muted-foreground mb-6">
                      Be the first to set a record in this challenge.
                    </p>
                    <Link to="/">
                      <Button variant="glow">
                        Start Playing
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-primary/20">
                        <th className="p-4 text-left">Rank</th>
                        <th className="p-4 text-left">Player</th>
                        <th className="p-4 text-left">Game</th>
                        <th className="p-4 text-left">Score</th>
                        <th className="p-4 text-left">Level</th>
                        <th className="p-4 text-left">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry, index) => (
                        <tr
                          key={entry.id}
                          className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center">
                              {getRankIcon(index + 1)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-mono font-medium">{entry.name}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              {games.find(g => g.id === entry.game)?.icon}
                              <span className="text-sm">{entry.game}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-primary">{entry.score.toLocaleString()}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-accent font-mono">Level {entry.level}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground">
                              {formatTimeAgo(entry.timeCompleted)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="max-w-4xl mx-auto mt-8 text-center">
            <div className="glass-card p-8 rounded-xl">
              <Trophy className="mx-auto mb-4 text-primary" size={48} />
              <h3 className="text-2xl font-bold mb-4">Ready to Climb the Rankings?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Test your skills across our collection of hacking challenges and secure your spot on the leaderboard!
              </p>
              <Link to="/">
                <Button variant="glow" size="lg">
                  Start Your Journey
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;