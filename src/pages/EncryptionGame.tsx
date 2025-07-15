
import { useState, useEffect } from "react";
import { ArrowLeft, Lock, Unlock, RefreshCw, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { toast } from "sonner";
import Button from "@/components/Button";
import { leaderboardManager } from "@/utils/leaderboard";
import { Progress } from "@/components/ui/progress";

const maxLevel = 5;
const levelData = [
  {
    encrypted: "khoor zruog",
    expected: "hello world",
    hints: [
      "This is a Caesar cipher - each letter is shifted by 3 positions.",
      "Try moving each letter back 3 positions in the alphabet.",
      "Example: 'd' becomes 'a'"
    ]
  },
  {
    encrypted: "SGVsbG8gSGFja2Vy",
    expected: "Hello Hacker",
    hints: [
      "This text is encoded in Base64.",
      "Base64 is commonly used for encoding binary data.",
      "Look for online Base64 decoders to help you."
    ]
  },
  {
    encrypted: "@ppl3 p13",
    expected: "apple pie",
    hints: [
      "This is a leetspeak substitution cipher.",
      "Numbers and symbols replace similar-looking letters.",
      "Example: '@' might represent 'a', '3' might represent 'e'"
    ]
  },
  {
    encrypted: "uryyb jbeyq",
    expected: "hello world",
    hints: [
      "This is a ROT13 cipher.",
      "Each letter is rotated 13 positions in the alphabet.",
      "Try decoding using a ROT13 tool."
    ]
  },
  {
    encrypted: "6861636b6572",
    expected: "hacker",
    hints: [
      "This is a hexadecimal encoding.",
      "Each pair of digits represents a character.",
      "Try converting hex to ASCII."
    ]
  }
];

const EncryptionGame = () => {
  const [level, setLevel] = useState(1);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const current = levelData[level - 1];

  useEffect(() => {
    toast.info("Welcome to the Encryption Challenge!", {
      description: "Decrypt the messages using various encryption methods.",
    });
    setInput("");
    setShowHint(false);
    setIsLevelComplete(false);
  }, [level]);

  const handleSubmit = () => {
    if (input.toLowerCase() === current.expected.toLowerCase()) {
      setIsLevelComplete(true);
      toast.success("Level Complete!", {
        description: `+100 points! ${level < maxLevel ? "Next level unlocked!" : "You've mastered encryption!"}`,
      });
      setScore(score + 100);
      if (level < maxLevel) {
        setTimeout(() => {
          setLevel(level + 1);
        }, 1500);
      } else {
        toast.success("🏆 Congratulations! You've completed all levels!", {
          description: "You're now a master of encryption!",
        });
        // Submit to leaderboard
        const playerName = leaderboardManager.generatePlayerName();
        leaderboardManager.addScore({
          name: playerName,
          game: "encryption",
          score: score,
          level: level,
          difficulty: 'Expert',
        });
      }
    } else {
      toast.error("Try again!", {
        description: "The decryption was not correct. Check the hints and try another approach.",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <Header />
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <Link to="/" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Home</span>
          </Link>
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-6 rounded-xl mb-8 relative overflow-hidden">
              <div className="absolute inset-0 cyber-grid opacity-10" />
              <div className="relative">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                    <Shield size={20} className="text-primary animate-pulse" />
                    <div className="text-lg font-bold">Level {level}/{maxLevel}</div>
                  </div>
                  <div className="text-primary font-mono">Score: {score}</div>
                </div>
                <Progress value={(level / maxLevel) * 100} className="mb-4" />
                <div className="space-y-6">
                  <div className="bg-muted/30 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center mb-2">
                      <Lock size={16} className="mr-2 text-primary" />
                      <span className="text-sm text-muted-foreground">Encrypted Text:</span>
                    </div>
                    <div className="font-mono text-lg bg-muted/20 p-3 rounded">{current.encrypted}</div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Your Solution:</label>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full p-3 bg-muted/30 rounded-md border border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none font-mono"
                      placeholder="Type your decrypted text..."
                      disabled={isLevelComplete}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <Button 
                      onClick={handleSubmit}
                      className="flex-1 group relative overflow-hidden"
                      variant="glow"
                      disabled={isLevelComplete}
                    >
                      <Unlock size={16} className="mr-2 group-hover:rotate-12 transition-transform" />
                      Submit
                      {isLevelComplete && (
                        <span className="absolute inset-0 bg-primary/20 animate-pulse" />
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setInput("");
                        setShowHint(false);
                      }}
                      variant="outline"
                      className="group"
                    >
                      <RefreshCw size={16} className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
                      Reset
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="group"
                      onClick={() => setShowHint(v => !v)}
                      disabled={isLevelComplete}
                    >
                      {showHint ? "Hide Hint" : "Show Hint"}
                    </Button>
                  </div>
                  {showHint && (
                    <div className="mt-4 p-4 bg-blue-500/10 text-blue-500 rounded shadow animate-fade-in">
                      <h3 className="font-medium mb-2">Hints:</h3>
                      <ul className="list-disc pl-5">
                        {current.hints.map((hint, i) => (
                          <li key={i}>{hint}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EncryptionGame;
