import { useState, useEffect } from "react";
import { ArrowLeft, Trophy, Medal, Award, Crown, Star, Target, Zap, User } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { leaderboardManager, LeaderboardEntry } from "@/utils/leaderboard";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

const Leaderboard = () => {
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<'score'|'level'|'time'>('score');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
  const [dateRange, setDateRange] = useState<'all'|'week'|'today'>('all');
  const currentUser = localStorage.getItem('hackops-profile') ? JSON.parse(localStorage.getItem('hackops-profile')!) : null;

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
  }, [selectedGame, sortBy, sortDir, dateRange]);

  const updateLeaderboard = () => {
    let entries = leaderboardManager.getTopScores(
      selectedGame === "all" ? undefined : selectedGame,
      100 // get more for filtering
    );
    // Date filter
    const now = Date.now();
    if (dateRange === 'today') {
      const start = new Date(); start.setHours(0,0,0,0);
      entries = entries.filter(e => e.timeCompleted >= start.getTime());
    } else if (dateRange === 'week') {
      const start = new Date(); start.setDate(start.getDate() - 7);
      entries = entries.filter(e => e.timeCompleted >= start.getTime());
    }
    // Sorting
    entries = [...entries].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'score') cmp = a.score - b.score;
      else if (sortBy === 'level') cmp = a.level - b.level;
      else if (sortBy === 'time') cmp = a.timeCompleted - b.timeCompleted;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    setLeaderboard(entries.slice(0, 20));
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

  const getGameName = (id: string) => {
    if (id === "all") return "All Games";
    const found = games.find(g => g.id === id);
    return found ? found.name : id.charAt(0).toUpperCase() + id.slice(1);
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
          <div className="flex justify-between items-center max-w-4xl mx-auto mb-4">
            <div />
            <Button
              variant="outline"
              size="sm"
              onClick={() => { leaderboardManager.clearLeaderboard(); setLeaderboard([]); }}
              className="text-xs"
            >
              Clear Leaderboard
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              🏆 Leaderboard
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See who's leading the charge in our hacking challenges. Compete with players worldwide!
            </p>
          </div>

          {/* Game Filter, Date Filter, Sorting */}
          <div className="glass-card p-4 rounded-xl mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
            <div className="flex flex-wrap gap-2 justify-center">
              <select
                className="border rounded px-2 py-1 text-sm bg-background"
                value={dateRange}
                onChange={e => setDateRange(e.target.value as any)}
                aria-label="Filter by date range"
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="today">Today</option>
              </select>
              <select
                className="border rounded px-2 py-1 text-sm bg-background"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                aria-label="Sort by"
              >
                <option value="score">Score</option>
                <option value="level">Level</option>
                <option value="time">Time</option>
              </select>
              <select
                className="border rounded px-2 py-1 text-sm bg-background"
                value={sortDir}
                onChange={e => setSortDir(e.target.value as any)}
                aria-label="Sort direction"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
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
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <div className="glass-card rounded-xl overflow-hidden min-w-[600px]">
              <div className="p-6 border-b border-primary/20">
                <h2 className="text-2xl font-bold flex items-center">
                  <Trophy className="mr-3 text-primary" size={24} />
                  {selectedGame === "all" ? "Global Rankings" : `${games.find(g => g.id === selectedGame)?.name} Rankings`}
                </h2>
              </div>
              
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
                <table className="w-full text-sm">
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
                    {leaderboard.map((entry, index) => {
                      const isCurrentUser = currentUser && entry.name === currentUser.nickname;
                      return (
                        <tr
                          key={entry.id}
                          className={cn(
                            "border-b border-primary/10 hover:bg-primary/5 transition-colors",
                            isCurrentUser && "bg-accent/10 border-accent/30"
                          )}
                        >
                          <td className="p-4">
                            <div className="flex items-center">
                              {getRankIcon(index + 1)}
                              {index < 3 && (
                                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-400/20 text-yellow-700">Top {index+1}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-lg">
                                {entry.name.slice(0,2).toUpperCase()}
                              </span>
                              <div className="font-mono font-medium">{entry.name}</div>
                              {isCurrentUser && <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-accent/20 text-accent">You</span>}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              {games.find(g => g.id === entry.game)?.icon}
                              <span className="text-sm">{getGameName(entry.game)}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-primary">{entry.score.toLocaleString()}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-accent font-mono">Level {entry.level}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground" title={format(new Date(entry.timeCompleted), 'PPpp')}>
                              {formatTimeAgo(entry.timeCompleted)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
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