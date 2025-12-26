import { useState, useEffect } from "react";
import { ArrowLeft, Lock, Unlock, RefreshCw, KeyRound, Lightbulb, CheckCircle, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { toast } from "sonner";
import Button from "@/components/Button";
import { leaderboardManager } from "@/utils/leaderboard";
import { Progress } from "@/components/ui/progress";
import BackgroundFX from "@/components/FX/BackgroundFX";
import SpotlightCursor from "@/components/FX/SpotlightCursor";
import { cn } from "@/lib/utils";

const maxLevel = 5;

const levelData = [
  {
    encrypted: "khoor zruog",
    expected: "hello world",
    method: "Caesar Cipher",
    difficulty: "Beginner",
    hints: [
      "This is a Caesar cipher - each letter is shifted by a fixed number of positions.",
      "Try moving each letter back 3 positions in the alphabet.",
      "Example: 'd' becomes 'a', 'e' becomes 'b'"
    ]
  },
  {
    encrypted: "SGVsbG8gSGFja2Vy",
    expected: "Hello Hacker",
    method: "Base64 Encoding",
    difficulty: "Beginner",
    hints: [
      "This text is encoded in Base64 format.",
      "Base64 is commonly used for encoding binary data as text.",
      "Look for online Base64 decoders or use command: echo 'SGVsbG8gSGFja2Vy' | base64 -d"
    ]
  },
  {
    encrypted: "@ppl3 p13",
    expected: "apple pie",
    method: "Leetspeak",
    difficulty: "Beginner",
    hints: [
      "This is a leetspeak substitution cipher.",
      "Numbers and symbols replace similar-looking letters.",
      "Common: @ → a, 3 → e, 1 → i, 0 → o"
    ]
  },
  {
    encrypted: "uryyb jbeyq",
    expected: "hello world",
    method: "ROT13",
    difficulty: "Intermediate",
    hints: [
      "This is a ROT13 cipher - a special case of Caesar cipher.",
      "Each letter is rotated exactly 13 positions in the alphabet.",
      "Fun fact: Applying ROT13 twice returns the original text!"
    ]
  },
  {
    encrypted: "6861636b6572",
    expected: "hacker",
    method: "Hexadecimal",
    difficulty: "Intermediate",
    hints: [
      "This is hexadecimal (base 16) encoding.",
      "Each pair of hex digits represents one ASCII character.",
      "68 = 'h', 61 = 'a', 63 = 'c', 6b = 'k', 65 = 'e', 72 = 'r'"
    ]
  }
];

const EncryptionGame = () => {
  const [level, setLevel] = useState(1);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  const current = levelData[level - 1];

  useEffect(() => {
    toast.info("Encryption Lab", {
      description: "Decrypt messages using various cryptographic methods.",
      icon: "🔐"
    });
  }, []);

  useEffect(() => {
    setInput("");
    setShowHint(false);
    setIsLevelComplete(false);
    setAttempts(0);
  }, [level]);

  const handleSubmit = () => {
    setAttempts(prev => prev + 1);

    if (input.toLowerCase() === current.expected.toLowerCase()) {
      setIsLevelComplete(true);
      setCompletedLevels(prev => [...prev, level]);
      const pointsEarned = Math.max(100 - (attempts * 10), 50);
      setScore(score + pointsEarned);

      toast.success(`Level Complete! +${pointsEarned} points`, {
        description: level < maxLevel ? "Advancing to next level..." : "You've mastered encryption!",
        icon: "🎉"
      });

      if (level < maxLevel) {
        setTimeout(() => setLevel(level + 1), 1500);
      } else {
        const playerName = leaderboardManager.generatePlayerName();
        leaderboardManager.addScore({
          name: playerName,
          game: "encryption",
          score: score + pointsEarned,
          level: level,
          difficulty: 'Expert',
        });
      }
    } else {
      toast.error("Not quite right", {
        description: "Check the encryption method and try again.",
        icon: "❌"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
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
    setInput("");
    setShowHint(false);
    setIsLevelComplete(false);
    setAttempts(0);
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-4">
              <KeyRound className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">Cryptography</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Encryption <span className="text-primary">Lab</span></h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Learn cryptography by decrypting messages encoded with various classical and modern techniques.
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
                  <div className="text-xs text-muted-foreground mb-1">Method</div>
                  <div className="text-sm text-primary/80">{current.method}</div>
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
                <h2 className="text-lg font-bold">{current.method}</h2>
              </div>

              {/* Encrypted Text Display */}
              <div className="bg-muted/30 p-4 rounded-lg border border-primary/20 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={16} className="text-primary" />
                  <span className="text-sm text-muted-foreground">Encrypted Text</span>
                </div>
                <div className="font-mono text-xl bg-muted/20 p-4 rounded-lg text-center tracking-wider">
                  {current.encrypted}
                </div>
              </div>

              {/* Input */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Unlock size={16} className="text-accent" />
                    Your Decryption
                  </label>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full p-4 bg-muted/30 rounded-lg border border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none font-mono text-lg"
                    placeholder="Type the decrypted text..."
                    disabled={isLevelComplete}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleSubmit}
                    variant="glow"
                    className="flex-1 sm:flex-none"
                    disabled={isLevelComplete || !input.trim()}
                  >
                    <Unlock size={16} className="mr-2" />
                    Submit
                  </Button>
                  <Button
                    onClick={() => {
                      setInput("");
                      setShowHint(false);
                    }}
                    variant="outline"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Clear
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowHint(v => !v)}
                    disabled={isLevelComplete}
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
                <h3 className="text-2xl font-bold mb-2">Cryptography Master!</h3>
                <p className="text-muted-foreground mb-4">
                  You've decrypted all messages. Final score: <span className="text-primary font-bold">{score}</span>
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
            Master the art of cryptography in a safe learning environment.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EncryptionGame;
