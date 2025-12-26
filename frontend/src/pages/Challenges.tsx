import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Terminal,
  Lock,
  KeyRound,
  Code,
  Database,
  Layers,
  Search,
  Filter,
  ChevronRight,
  Clock,
  Star,
  Users,
  Zap,
  Trophy
} from "lucide-react";
import Header from "@/components/layout/Header";
import BackgroundFX from "@/components/FX/BackgroundFX";
import SpotlightCursor from "@/components/FX/SpotlightCursor";
import TiltCard from "@/components/common/TiltCard";
import Button from "@/components/common/Button";
import { cn } from "@/lib/utils";

type Difficulty = "all" | "beginner" | "intermediate" | "advanced";
type Category = "all" | "terminal" | "password" | "encryption" | "web" | "blockchain";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: "beginner" | "intermediate" | "advanced";
  icon: React.ReactNode;
  href: string;
  points: number;
  duration: string;
  completions: number;
  isNew?: boolean;
  isPopular?: boolean;
}

const Challenges = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>("all");
  const [categoryFilter, setCategoryFilter] = useState<Category>("all");

  const challenges: Challenge[] = [
    {
      id: "terminal-basic",
      title: "Terminal Mastery",
      description: "Navigate Unix-like systems, explore file structures, and learn essential command-line operations.",
      category: "terminal",
      difficulty: "beginner",
      icon: <Terminal className="w-6 h-6" />,
      href: "/terminal-game",
      points: 100,
      duration: "15-20 min",
      completions: 1247,
      isPopular: true
    },
    {
      id: "password-security",
      title: "Password Security",
      description: "Create unbreakable passwords that meet increasingly complex security requirements.",
      category: "password",
      difficulty: "beginner",
      icon: <Lock className="w-6 h-6" />,
      href: "/password-game",
      points: 75,
      duration: "10-15 min",
      completions: 2156,
      isPopular: true
    },
    {
      id: "caesar-cipher",
      title: "Caesar Cipher",
      description: "Learn the basics of cryptography by decoding messages encrypted with Caesar cipher.",
      category: "encryption",
      difficulty: "beginner",
      icon: <KeyRound className="w-6 h-6" />,
      href: "/encryption",
      points: 50,
      duration: "10 min",
      completions: 892
    },
    {
      id: "xss-basics",
      title: "XSS Fundamentals",
      description: "Discover and exploit cross-site scripting vulnerabilities in a safe sandbox environment.",
      category: "web",
      difficulty: "intermediate",
      icon: <Code className="w-6 h-6" />,
      href: "/xss-game",
      points: 150,
      duration: "20-25 min",
      completions: 654,
      isNew: true
    },
    {
      id: "sql-injection",
      title: "SQL Injection",
      description: "Learn database exploitation techniques and understand how to prevent SQL injection attacks.",
      category: "web",
      difficulty: "intermediate",
      icon: <Database className="w-6 h-6" />,
      href: "/sql-injection",
      points: 175,
      duration: "25-30 min",
      completions: 523
    },
    {
      id: "blockchain-security",
      title: "Blockchain Puzzles",
      description: "Explore hash mining, Merkle trees, and smart contract security vulnerabilities.",
      category: "blockchain",
      difficulty: "advanced",
      icon: <Layers className="w-6 h-6" />,
      href: "/blockchain-puzzles",
      points: 250,
      duration: "30-40 min",
      completions: 234,
      isNew: true
    },
    {
      id: "advanced-encryption",
      title: "Advanced Cryptography",
      description: "Master modern encryption algorithms including AES, RSA, and hash functions.",
      category: "encryption",
      difficulty: "advanced",
      icon: <KeyRound className="w-6 h-6" />,
      href: "/encryption",
      points: 200,
      duration: "25 min",
      completions: 312
    },
    {
      id: "terminal-advanced",
      title: "Privilege Escalation",
      description: "Learn advanced techniques for escalating privileges in Unix-like systems.",
      category: "terminal",
      difficulty: "advanced",
      icon: <Terminal className="w-6 h-6" />,
      href: "/terminal-game",
      points: 225,
      duration: "30 min",
      completions: 189
    }
  ];

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || challenge.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === "all" || challenge.category === categoryFilter;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const categories = [
    { id: "all" as Category, label: "All Categories", icon: <Layers className="w-4 h-4" /> },
    { id: "terminal" as Category, label: "Terminal", icon: <Terminal className="w-4 h-4" /> },
    { id: "password" as Category, label: "Password", icon: <Lock className="w-4 h-4" /> },
    { id: "encryption" as Category, label: "Encryption", icon: <KeyRound className="w-4 h-4" /> },
    { id: "web" as Category, label: "Web Security", icon: <Code className="w-4 h-4" /> },
    { id: "blockchain" as Category, label: "Blockchain", icon: <Database className="w-4 h-4" /> },
  ];

  const difficulties = [
    { id: "all" as Difficulty, label: "All Levels" },
    { id: "beginner" as Difficulty, label: "Beginner" },
    { id: "intermediate" as Difficulty, label: "Intermediate" },
    { id: "advanced" as Difficulty, label: "Advanced" },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-400 bg-green-400/10 border-green-400/30";
      case "intermediate": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "advanced": return "text-red-400 bg-red-400/10 border-red-400/30";
      default: return "text-primary bg-primary/10 border-primary/30";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundFX />
      <SpotlightCursor />
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link to="/" className="inline-flex items-center mb-8 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Home</span>
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Security <span className="text-primary">Challenges</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Master cybersecurity skills through hands-on practice
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{challenges.length} Challenges</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="glass-card p-6 rounded-xl mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search challenges..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-primary/20 rounded-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      categoryFilter === cat.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {cat.icon}
                    <span className="hidden sm:inline">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-primary/10">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Difficulty:</span>
              <div className="flex gap-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setDifficultyFilter(diff.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                      difficultyFilter === diff.id
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-muted/20 text-muted-foreground hover:bg-muted/40"
                    )}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-sm text-muted-foreground">
            Showing {filteredChallenges.length} of {challenges.length} challenges
          </div>

          {/* Challenge Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredChallenges.map((challenge) => (
              <TiltCard key={challenge.id}>
                <div
                  className="glass-card p-6 rounded-xl h-full flex flex-col cursor-pointer group hover:border-primary/30 transition-all duration-300"
                  onClick={() => navigate(challenge.href)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                      {challenge.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      {challenge.isNew && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
                          New
                        </span>
                      )}
                      {challenge.isPopular && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                          <Star className="w-3 h-3 inline mr-1" />
                          Popular
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {challenge.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {challenge.description}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium border capitalize",
                      getDifficultyColor(challenge.difficulty)
                    )}>
                      {challenge.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {challenge.duration}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {challenge.completions.toLocaleString()} completions
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="font-bold text-primary">{challenge.points}</span>
                      <span className="text-sm text-muted-foreground">points</span>
                    </div>
                    <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                      Start
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* Empty State */}
          {filteredChallenges.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No challenges found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search query
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setDifficultyFilter("all");
                setCategoryFilter("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
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

export default Challenges;
