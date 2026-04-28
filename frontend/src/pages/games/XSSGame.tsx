import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Code, ShieldAlert, RefreshCw, Terminal, Lightbulb, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import { Progress } from "@/components/ui/progress";
import BackgroundFX from "@/components/FX/BackgroundFX";
import SpotlightCursor from "@/components/FX/SpotlightCursor";
import { cn } from "@/lib/utils";
import { useGame } from "@/contexts/GameContext";
import { AISecurityAdvisor } from "@/components/ai/AISecurityAdvisor";

const maxLevel = 5;

const levelData = [
  {
    check: (input: string) => input.includes("<script>") && input.includes("</script>"),
    hints: [
      "Try using <script> tags to inject JavaScript.",
      "Example: <script>alert(1)</script>",
      "This is a classic reflected XSS attack."
    ],
    challenge: "Find a basic XSS vulnerability using script tags.",
    title: "Basic Script Injection",
    difficulty: "Beginner"
  },
  {
    check: (input: string) => input.toLowerCase().includes("onerror=") || input.toLowerCase().includes("onload="),
    hints: [
      "Use HTML event attributes like onerror or onload.",
      "Try: <img src=x onerror=alert(1)>",
      "Event-based XSS is common in image elements."
    ],
    challenge: "Discover event-based XSS vulnerabilities using HTML attributes.",
    title: "Event Handler XSS",
    difficulty: "Beginner"
  },
  {
    check: (input: string) => input.toLowerCase().includes("javascript:") || input.toLowerCase().includes("data:"),
    hints: [
      "Try using javascript: or data: protocols in a link.",
      "Example: <a href=javascript:alert(1)>click</a>",
      "Protocol-based XSS can bypass some security filters."
    ],
    challenge: "Find advanced XSS vectors using protocol handlers.",
    title: "Protocol-based XSS",
    difficulty: "Intermediate"
  },
  {
    check: (input: string) => input.toLowerCase().includes("document.location") || input.toLowerCase().includes("innerhtml"),
    hints: [
      "Try using DOM properties like document.location or innerHTML.",
      "Example: <img src=x onerror='document.location=\"https://evil.com\"'>",
      "DOM-based XSS exploits client-side JavaScript code."
    ],
    challenge: "Exploit DOM-based XSS vulnerabilities for data exfiltration.",
    title: "DOM-based XSS",
    difficulty: "Intermediate"
  },
  {
    check: (input: string) => input.toLowerCase().includes("%3cscript%3e") || input.toLowerCase().includes("&#x3c;script&#x3e;"),
    hints: [
      "Try encoding your payload using URL or HTML encoding.",
      "Example: %3Cscript%3Ealert(1)%3C/script%3E",
      "Example: &#x3c;script&#x3e;alert(1)&#x3c;/script&#x3e;",
      "Obfuscated payloads can bypass naive input filters."
    ],
    challenge: "Bypass security filters with encoded or obfuscated payloads.",
    title: "Filter Bypass",
    difficulty: "Advanced"
  }
];

const XSSGame = () => {
  const { completeChallenge } = useGame();
  const [level, setLevel] = useState(1);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [score, setScore] = useState(0);
  const [isVulnerable, setIsVulnerable] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const startTimeRef = useRef(Date.now());

  const current = levelData[level - 1];

  useEffect(() => {
    toast.info("XSS Playground", {
      description: "Find and exploit XSS vulnerabilities safely.",
      icon: "🔍"
    });
  }, []);

  useEffect(() => {
    setInput("");
    setOutput("");
    setIsVulnerable(false);
    setShowHint(false);
    setAttempts(0);
  }, [level]);

  const handleSubmit = () => {
    setAttempts(prev => prev + 1);

    if (current.check(input)) {
      setIsVulnerable(true);
      const pointsEarned = Math.max(100 - (attempts * 10), 50);
      setScore(score + pointsEarned);
      setCompletedLevels(prev => [...prev, level]);
      completeChallenge({
        challengeId: `xss-${level}`,
        score: pointsEarned,
        hintsUsed,
        attempts: attempts + 1,
        timeMs: Date.now() - startTimeRef.current,
        completedAt: new Date().toISOString(),
      });

      toast.success(`Vulnerability found! +${pointsEarned} points`, {
        description: level < maxLevel ? "Advancing to next level..." : "You've mastered XSS!",
        icon: "🎉"
      });

      if (level < maxLevel) {
        setTimeout(() => setLevel(level + 1), 1500);
      }
    } else {
      toast.error("Not quite right", {
        description: "Check your payload and try again. Use hints if needed.",
        icon: "❌"
      });
    }
  };

  const renderOutput = () => {
    try {
      const sanitized = input.replace(/[<>]/g, (char) => `&${char === '<' ? 'lt' : 'gt'};`);
      setOutput(sanitized);
      setIsVulnerable(current.check(input));
    } catch (error) {
      setOutput("Error rendering output");
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setCompletedLevels([]);
    setInput("");
    setOutput("");
    setIsVulnerable(false);
    setShowHint(false);
    setAttempts(0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-green-400 bg-green-400/10 border-green-400/30";
      case "Intermediate": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "Advanced": return "text-red-400 bg-red-400/10 border-red-400/30";
      default: return "text-primary bg-primary/10 border-primary/30";
    }
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-4">
              <Code className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">Web Security</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">XSS <span className="text-primary">Playground</span></h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Learn about Cross-Site Scripting vulnerabilities by finding and exploiting them in a safe environment.
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
                <div>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium border",
                    getDifficultyColor(current.difficulty)
                  )}>
                    {current.difficulty}
                  </span>
                </div>
                <h2 className="text-lg font-bold">{current.title}</h2>
              </div>
              <p className="text-muted-foreground">{current.challenge}</p>
            </div>

            {/* Input/Output Card */}
            <div className="glass-card p-6 rounded-xl">
              <div className="space-y-6">
                {/* Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Code size={16} className="text-primary" />
                    Payload Input
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onBlur={renderOutput}
                    className="w-full h-32 p-4 bg-muted/30 rounded-lg border border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none font-mono text-sm resize-none"
                    placeholder="Enter your XSS payload here..."
                  />
                </div>

                {/* Output Preview */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Terminal size={16} className="text-muted-foreground" />
                    Output Preview
                  </label>
                  <div className={cn(
                    "min-h-[80px] p-4 rounded-lg font-mono text-sm border transition-all",
                    isVulnerable
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : "bg-muted/20 border-muted/30"
                  )}>
                    {output || <span className="text-muted-foreground">Output will appear here...</span>}
                    {isVulnerable && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-red-500/20">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">XSS vulnerability detected!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleSubmit}
                    variant="glow"
                    className="flex-1 sm:flex-none"
                  >
                    <ShieldAlert size={16} className="mr-2" />
                    Test Exploit
                  </Button>
                  <Button
                    onClick={() => {
                      setInput("");
                      setOutput("");
                      setIsVulnerable(false);
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
                          {hint}
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
                  You've mastered all XSS attack vectors. Final score: <span className="text-primary font-bold">{score}</span>
                </p>
                <Button variant="glow" onClick={resetGame}>
                  <RefreshCw size={16} className="mr-2" />
                  Play Again
                </Button>
              </div>
            )}

            {/* AI Security Advisor */}
            <AISecurityAdvisor
              challengeType="Cross-Site Scripting (XSS)"
              level={level}
              lastInput={input}
              wasSuccessful={isVulnerable}
              context={`Challenge: ${current.challenge}. Difficulty: ${current.difficulty}`}
            />
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

export default XSSGame;
