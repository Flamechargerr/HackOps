import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Terminal,
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Star,
  Crown,
  Flame,
  Target,
  Users,
  Clock,
  Filter
} from "lucide-react";
import Header from "@/components/layout/Header";
import BackgroundFX from "@/components/FX/BackgroundFX";
import SpotlightCursor from "@/components/FX/SpotlightCursor";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type TimeFilter = "all" | "week" | "month";
type CategoryFilter = "all" | "terminal" | "password" | "encryption" | "web";

interface LeaderboardEntry {
  rank: number;
  username: string;
  displayName: string;
  score: number;
  challengesCompleted: number;
  badges: number;
  streak: number;
  avatarColor: string;
  isOnline?: boolean;
  trend?: "up" | "down" | "same";
}

const Leaderboard = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  // Mock leaderboard data - in production this would come from the API
  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, username: "cyberNinja", displayName: "CyberNinja", score: 12450, challengesCompleted: 48, badges: 15, streak: 21, avatarColor: "from-yellow-500 to-orange-500", isOnline: true, trend: "same" },
    { rank: 2, username: "h4ck3rX", displayName: "H4ck3rX", score: 11200, challengesCompleted: 42, badges: 13, streak: 14, avatarColor: "from-purple-500 to-pink-500", isOnline: true, trend: "up" },
    { rank: 3, username: "securityPro", displayName: "SecurityPro", score: 10850, challengesCompleted: 39, badges: 12, streak: 7, avatarColor: "from-blue-500 to-cyan-500", trend: "down" },
    { rank: 4, username: "cryptoKing", displayName: "CryptoKing", score: 9700, challengesCompleted: 35, badges: 11, streak: 12, avatarColor: "from-green-500 to-emerald-500", isOnline: true, trend: "up" },
    { rank: 5, username: "terminalMaster", displayName: "TerminalMaster", score: 8950, challengesCompleted: 33, badges: 10, streak: 5, avatarColor: "from-red-500 to-pink-500", trend: "same" },
    { rank: 6, username: "xssHunter", displayName: "XSSHunter", score: 8200, challengesCompleted: 30, badges: 9, streak: 3, avatarColor: "from-indigo-500 to-purple-500", trend: "up" },
    { rank: 7, username: "sqlNinja", displayName: "SQLNinja", score: 7650, challengesCompleted: 28, badges: 8, streak: 8, avatarColor: "from-orange-500 to-red-500", trend: "down" },
    { rank: 8, username: "penTester", displayName: "PenTester", score: 7100, challengesCompleted: 26, badges: 8, streak: 4, avatarColor: "from-teal-500 to-green-500", trend: "same" },
    { rank: 9, username: "bugBounty", displayName: "BugBounty", score: 6550, challengesCompleted: 24, badges: 7, streak: 2, avatarColor: "from-pink-500 to-rose-500", trend: "up" },
    { rank: 10, username: "ethicalHax", displayName: "EthicalHax", score: 6000, challengesCompleted: 22, badges: 6, streak: 6, avatarColor: "from-cyan-500 to-blue-500", isOnline: true, trend: "same" },
  ];

  const stats = [
    { label: "Total Players", value: "1,247", icon: <Users className="w-5 h-5" /> },
    { label: "Challenges Completed", value: "15.4K", icon: <Target className="w-5 h-5" /> },
    { label: "This Week", value: "+234", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Average Score", value: "2,450", icon: <Trophy className="w-5 h-5" /> },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 shadow-lg shadow-yellow-500/10";
      case 2: return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 3: return "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30";
      default: return "bg-card/50 border-primary/10 hover:border-primary/30";
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "down": return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default: return <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">—</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundFX />
      <SpotlightCursor />
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <Link to="/" className="inline-flex items-center mb-8 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Home</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Global Rankings</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-primary">Leaderboard</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Compete with security enthusiasts worldwide. Climb the ranks by completing challenges and earning badges.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card p-4 rounded-xl text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="glass-card p-4 rounded-xl mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Time:</span>
                <div className="flex gap-2">
                  {([
                    { id: "all", label: "All Time" },
                    { id: "month", label: "This Month" },
                    { id: "week", label: "This Week" }
                  ] as const).map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setTimeFilter(filter.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                        timeFilter === filter.id
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-muted/20 text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Updated 5 min ago</span>
              </div>
            </div>
          </div>

          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {/* 2nd Place */}
            <div className="order-1 pt-8">
              <div className="glass-card p-6 rounded-xl text-center border border-gray-400/30 bg-gradient-to-b from-gray-400/10 to-transparent">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-16 h-16 mx-auto border-4 border-gray-400">
                    <AvatarFallback className={cn("bg-gradient-to-br text-white text-xl font-bold", leaderboardData[1].avatarColor)}>
                      {leaderboardData[1].displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                </div>
                <div className="font-bold mb-1">{leaderboardData[1].displayName}</div>
                <div className="text-2xl font-bold text-gray-300">{leaderboardData[1].score.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">{leaderboardData[1].challengesCompleted} challenges</div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="order-2">
              <div className="glass-card p-6 rounded-xl text-center border border-yellow-500/30 bg-gradient-to-b from-yellow-500/20 to-transparent shadow-lg shadow-yellow-500/10 relative">
                <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="relative inline-block mb-4">
                  <Avatar className="w-20 h-20 mx-auto border-4 border-yellow-500">
                    <AvatarFallback className={cn("bg-gradient-to-br text-white text-2xl font-bold", leaderboardData[0].avatarColor)}>
                      {leaderboardData[0].displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {leaderboardData[0].isOnline && (
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="font-bold text-lg mb-1">{leaderboardData[0].displayName}</div>
                <div className="text-3xl font-bold text-yellow-400">{leaderboardData[0].score.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">{leaderboardData[0].challengesCompleted} challenges</div>
                <div className="flex items-center justify-center gap-1 mt-2 text-yellow-400">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm font-medium">{leaderboardData[0].streak} day streak</span>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="order-3 pt-12">
              <div className="glass-card p-6 rounded-xl text-center border border-amber-600/30 bg-gradient-to-b from-amber-600/10 to-transparent">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-14 h-14 mx-auto border-4 border-amber-600">
                    <AvatarFallback className={cn("bg-gradient-to-br text-white text-lg font-bold", leaderboardData[2].avatarColor)}>
                      {leaderboardData[2].displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                </div>
                <div className="font-bold text-sm mb-1">{leaderboardData[2].displayName}</div>
                <div className="text-xl font-bold text-amber-400">{leaderboardData[2].score.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">{leaderboardData[2].challengesCompleted} challenges</div>
              </div>
            </div>
          </div>

          {/* Full Leaderboard */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-4 border-b border-primary/10">
              <h3 className="font-bold text-lg">Full Rankings</h3>
            </div>
            <div className="divide-y divide-primary/10">
              {leaderboardData.map((entry) => (
                <div
                  key={entry.rank}
                  className={cn(
                    "flex items-center gap-4 p-4 transition-all hover:bg-primary/5",
                    entry.rank <= 3 && "bg-gradient-to-r",
                    entry.rank === 1 && "from-yellow-500/5 to-transparent",
                    entry.rank === 2 && "from-gray-400/5 to-transparent",
                    entry.rank === 3 && "from-amber-600/5 to-transparent"
                  )}
                >
                  {/* Rank */}
                  <div className="w-12 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative">
                      <Avatar className="w-10 h-10 border-2 border-primary/20">
                        <AvatarFallback className={cn("bg-gradient-to-br text-white font-bold", entry.avatarColor)}>
                          {entry.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {entry.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{entry.displayName}</div>
                      <div className="text-xs text-muted-foreground">@{entry.username}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span>{entry.challengesCompleted}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Challenges</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span>{entry.badges}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Badges</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span>{entry.streak}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Streak</div>
                    </div>
                  </div>

                  {/* Score & Trend */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-primary">{entry.score.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                    {getTrendIcon(entry.trend)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Rank CTA */}
          <div className="mt-10 glass-card p-8 rounded-xl text-center border border-primary/20">
            <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Want to See Your Rank?</h3>
            <p className="text-muted-foreground mb-6">
              Login to track your progress and compete with others on the leaderboard!
            </p>
            <Link to="/password-game">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors">
                <Star className="w-5 h-5" />
                Start Your First Challenge
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/10 py-10 border-t border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Terminal size={20} className="text-primary" />
            <span className="font-mono font-bold text-lg">HackOps</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HackOps. Open source cybersecurity training platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Leaderboard;
