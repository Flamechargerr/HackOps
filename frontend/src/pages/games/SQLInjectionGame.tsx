import { useState, useEffect } from "react";
import { ArrowLeft, Database, AlertCircle, RefreshCw, Terminal, Lightbulb, CheckCircle, Server, Table } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import { Progress } from "@/components/ui/progress";
import BackgroundFX from "@/components/FX/BackgroundFX";
import SpotlightCursor from "@/components/FX/SpotlightCursor";
import { cn } from "@/lib/utils";

const maxLevel = 5;

const levelData = [
  {
    check: (input: string) => input.includes("'") && input.toUpperCase().includes("OR") && input.includes("1=1"),
    hints: [
      "Try using ' OR 1=1 -- to bypass authentication.",
      "The WHERE clause should always evaluate to true.",
      "Classic SQLi payload: ' OR 1=1 --"
    ],
    challenge: "Bypass the login authentication by making the WHERE clause always true.",
    title: "Authentication Bypass",
    difficulty: "Beginner",
    baseQuery: "SELECT * FROM users WHERE username = '[INPUT]' AND password = '***'"
  },
  {
    check: (input: string) => input.toUpperCase().includes("UNION") && input.toUpperCase().includes("SELECT"),
    hints: [
      "Use UNION SELECT to combine results from different tables.",
      "Try: ' UNION SELECT * FROM credit_cards --",
      "UNION-based SQLi can extract data from other tables."
    ],
    challenge: "Extract sensitive data from other tables using UNION-based injection.",
    title: "UNION Data Extraction",
    difficulty: "Beginner",
    baseQuery: "SELECT username, email FROM users WHERE id = [INPUT]"
  },
  {
    check: (input: string) => input.toUpperCase().includes("UPDATE") || input.toUpperCase().includes("INSERT"),
    hints: [
      "Try using UPDATE or INSERT statements.",
      "Example: '; UPDATE users SET admin=1 WHERE username='admin'; --",
      "You can stack queries with semicolons."
    ],
    challenge: "Modify data in the database to escalate privileges.",
    title: "Data Modification",
    difficulty: "Intermediate",
    baseQuery: "SELECT * FROM products WHERE category = '[INPUT]'"
  },
  {
    check: (input: string) => input.toUpperCase().includes("SLEEP(") || input.toUpperCase().includes("BENCHMARK("),
    hints: [
      "Try using SLEEP() or BENCHMARK() for time-based blind SQLi.",
      "Example: ' OR SLEEP(5) --",
      "Blind SQLi can be detected by timing the response."
    ],
    challenge: "Exploit blind SQL injection using time-based delays.",
    title: "Blind SQL Injection",
    difficulty: "Intermediate",
    baseQuery: "SELECT * FROM users WHERE id = [INPUT]"
  },
  {
    check: (input: string) => input.toUpperCase().includes("DROP") || input.toUpperCase().includes("DELETE") || input.includes(";"),
    hints: [
      "Try using DROP or DELETE statements.",
      "Example: '; DROP TABLE users; --",
      "Destructive SQLi can permanently alter the database."
    ],
    challenge: "Modify the database structure using destructive queries.",
    title: "Destructive Injection",
    difficulty: "Advanced",
    baseQuery: "SELECT * FROM logs WHERE action = '[INPUT]'"
  }
];

const SQLInjectionGame = () => {
  const [level, setLevel] = useState(1);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const current = levelData[level - 1];

  useEffect(() => {
    toast.info("SQL Injection Lab", {
      description: "Learn database exploitation in a safe environment.",
      icon: "💉"
    });
  }, []);

  useEffect(() => {
    setQuery("");
    setResult([]);
    setShowHint(false);
    setAttempts(0);
    setIsSuccess(false);
  }, [level]);

  const executeQuery = () => {
    setAttempts(prev => prev + 1);
    let mockResults: string[] = [];

    try {
      if (current.check(query)) {
        setIsSuccess(true);
        setCompletedLevels(prev => [...prev, level]);
        const pointsEarned = Math.max(100 - (attempts * 10), 50);
        setScore(score + pointsEarned);

        switch (level) {
          case 1:
            mockResults = [
              "✓ Query modified successfully!",
              "---",
              "| id | username  | email                |",
              "| 1  | admin     | admin@example.com   |",
              "| 2  | john_doe  | john@example.com    |",
              "| 3  | jane_smith| jane@example.com    |",
              "---",
              "Authentication bypassed! 3 users found."
            ];
            break;
          case 2:
            mockResults = [
              "✓ UNION injection successful!",
              "---",
              "| card_number         | exp_date | cvv |",
              "| 4111-XXXX-XXXX-1234 | 12/25    | *** |",
              "| 5500-XXXX-XXXX-5678 | 03/26    | *** |",
              "---",
              "Sensitive data extracted!"
            ];
            break;
          case 3:
            mockResults = [
              "✓ Query executed successfully!",
              "---",
              "1 row(s) affected.",
              "User 'admin' privileges updated.",
              "---",
              "Data modification successful!"
            ];
            break;
          case 4:
            mockResults = [
              "✓ Query executed in 5.02 seconds",
              "---",
              "Time delay detected!",
              "Blind SQLi confirmed - server response delayed.",
              "---",
              "Inference attack vector confirmed!"
            ];
            break;
          case 5:
            mockResults = [
              "✓ Query executed successfully!",
              "---",
              "DROP TABLE completed.",
              "Warning: Table 'users' no longer exists.",
              "---",
              "Destructive injection successful!"
            ];
            break;
        }

        toast.success(`Level ${level} complete! +${pointsEarned} points`, {
          description: level < maxLevel ? "Advancing to next level..." : "You've mastered SQL Injection!",
          icon: "🎉"
        });

        if (level < maxLevel) {
          setTimeout(() => setLevel(level + 1), 2000);
        }
      } else {
        setIsSuccess(false);
        mockResults = [
          "✗ Query failed!",
          "---",
          "No results found.",
          "Error: Invalid query or insufficient privileges.",
          "---",
          "Try a different approach..."
        ];
        toast.error("Query failed!", {
          description: "Check your injection technique and try again.",
          icon: "❌"
        });
      }
    } catch (error) {
      mockResults = ["Error executing query"];
    }
    setResult(mockResults);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-green-400 bg-green-400/10 border-green-400/30";
      case "Intermediate": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "Advanced": return "text-red-400 bg-red-400/10 border-red-400/30";
      default: return "text-primary bg-primary/10 border-primary/30";
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setCompletedLevels([]);
    setQuery("");
    setResult([]);
    setShowHint(false);
    setAttempts(0);
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundFX />
      <SpotlightCursor />
      <Header />

      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link to="/" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Home</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-4">
              <Database className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Database Security</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">SQL Injection <span className="text-primary">Lab</span></h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Master database exploitation techniques and understand how to defend against SQL injection attacks.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="glass-card p-4 rounded-xl mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Level</div>
                  <div className="text-xl font-bold text-primary">{level}/{maxLevel}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Score</div>
                  <div className="text-xl font-bold text-accent">{score}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Attempts</div>
                  <div className="text-xl font-bold">{attempts}</div>
                </div>
              </div>
              <Progress value={(level / maxLevel) * 100} className="w-full sm:w-48 h-2" />
            </div>
          </div>

          {/* Level Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {levelData.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  completedLevels.includes(idx + 1)
                    ? "bg-green-500"
                    : idx + 1 === level
                      ? "bg-primary animate-pulse"
                      : "bg-muted"
                )}
              />
            ))}
          </div>

          <div className="grid gap-6">
            {/* Challenge Card */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium border",
                  getDifficultyColor(current.difficulty)
                )}>
                  {current.difficulty}
                </span>
                <h2 className="text-lg font-bold">{current.title}</h2>
              </div>
              <p className="text-muted-foreground mb-4">{current.challenge}</p>

              {/* Base Query Display */}
              <div className="p-3 rounded-lg bg-muted/30 border border-primary/20">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Server className="w-3 h-3" />
                  Vulnerable Query
                </div>
                <code className="text-sm text-primary font-mono">{current.baseQuery}</code>
              </div>
            </div>

            {/* Input/Output Card */}
            <div className="glass-card p-6 rounded-xl">
              <div className="space-y-6">
                {/* Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Database size={16} className="text-primary" />
                    Your Input / Injection Payload
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && executeQuery()}
                      className="w-full p-4 bg-muted/30 rounded-lg border border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none font-mono text-sm pr-24"
                      placeholder="Enter your SQL injection payload..."
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      Press Enter
                    </span>
                  </div>
                </div>

                {/* Query Result */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Table size={16} className="text-muted-foreground" />
                    Query Result
                  </label>
                  <div className={cn(
                    "min-h-[150px] p-4 rounded-lg font-mono text-xs border transition-all",
                    isSuccess
                      ? "bg-green-500/10 border-green-500/30"
                      : result.length > 0
                        ? "bg-red-500/10 border-red-500/30"
                        : "bg-muted/20 border-muted/30"
                  )}>
                    {result.length > 0 ? (
                      <div className="space-y-1">
                        {result.map((line, i) => (
                          <div
                            key={i}
                            className={cn(
                              line.startsWith("✓") && "text-green-400",
                              line.startsWith("✗") && "text-red-400",
                              line === "---" && "text-muted-foreground/30"
                            )}
                          >
                            {line}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        Results will appear here after executing your query...
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={executeQuery}
                    variant="glow"
                    className="flex-1 sm:flex-none"
                  >
                    <Database size={16} className="mr-2" />
                    Execute Query
                  </Button>
                  <Button
                    onClick={() => {
                      setQuery("");
                      setResult([]);
                      setIsSuccess(false);
                    }}
                    variant="outline"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Clear
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowHint(v => !v)}
                    className={showHint ? "border-yellow-400/50" : ""}
                  >
                    <Lightbulb size={16} className={cn("mr-2", showHint && "text-yellow-400")} />
                    {showHint ? "Hide Hints" : "Show Hints"}
                  </Button>
                </div>

                {/* Hints */}
                {showHint && (
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 animate-fade-in">
                    <h3 className="flex items-center gap-2 font-medium text-yellow-400 mb-3">
                      <Lightbulb size={16} />
                      Hints
                    </h3>
                    <ul className="space-y-2">
                      {current.hints.map((hint, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-yellow-400">•</span>
                          <code className="text-xs">{hint}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Message */}
            {level === maxLevel && completedLevels.includes(maxLevel) && (
              <div className="glass-card p-8 rounded-xl text-center border border-green-500/30 bg-green-500/5">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Challenge Complete!</h3>
                <p className="text-muted-foreground mb-4">
                  You've mastered SQL injection techniques. Final score: <span className="text-primary font-bold">{score}</span>
                </p>
                <Button variant="glow" onClick={resetGame}>
                  <RefreshCw size={16} className="mr-2" />
                  Play Again
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-muted/10 border-t border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Terminal size={18} className="text-primary" />
            <span className="font-mono font-bold">HackOps</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Learn responsibly. Never use these techniques on systems you don't own.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SQLInjectionGame;
