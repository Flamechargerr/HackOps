import Header from "@/components/layout/Header";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Layers, Lightbulb, RefreshCw, CheckCircle, Terminal, Cpu, Zap, Hash } from "lucide-react";
import Button from "@/components/common/Button";
import BackgroundFX from "@/components/FX/BackgroundFX";
import SpotlightCursor from "@/components/FX/SpotlightCursor";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGame } from "@/contexts/GameContext";

function sha256(str: string): Promise<string> {
  const encoder = new TextEncoder();
  return window.crypto.subtle.digest("SHA-256", encoder.encode(str)).then(buf => {
    return Array.from(new Uint8Array(buf)).map(x => x.toString(16).padStart(2, "0")).join("");
  });
}

const maxLevel = 4;

const levelData = [
  {
    title: "Hash Mining",
    description: "Find an input that hashes to a value starting with '00' (proof-of-work simulation).",
    targetPrefix: "00",
    difficulty: "Beginner",
    hints: [
      "Try different inputs until the hash starts with 00.",
      "This simulates mining a block in Bitcoin.",
      "Use the Auto Mine button to let the computer try for you."
    ],
    validate: (input: string, hash: string) => hash.startsWith("00"),
  },
  {
    title: "Merkle Root",
    description: "Find the Merkle root of ['a', 'b']. Calculate hash(hash('a') + hash('b')).",
    targetPrefix: null,
    difficulty: "Intermediate",
    hints: [
      "Hash 'a' and 'b' separately using SHA-256.",
      "Concatenate the two hashes (no space between them).",
      "Hash the concatenated string to get the Merkle root."
    ],
    validate: (input: string) => input.length === 64 && /^[a-f0-9]{64}$/.test(input),
    merkle: true,
  },
  {
    title: "Transaction Format",
    description: "Enter a valid JSON transaction with 'from', 'to', and 'amount' fields.",
    targetPrefix: null,
    difficulty: "Beginner",
    hints: [
      'Use JSON format: {"from":"alice","to":"bob","amount":10}',
      "All keys and string values must be in double quotes.",
      "The amount must be a number (no quotes)."
    ],
    validate: (input: string) => {
      try {
        const obj = JSON.parse(input);
        return obj.from && obj.to && typeof obj.amount === "number";
      } catch {
        return false;
      }
    },
  },
  {
    title: "Block Hash",
    description: "Find a block string that hashes to a value starting with '000' (higher difficulty).",
    targetPrefix: "000",
    difficulty: "Advanced",
    hints: [
      "This is like mining a block with higher difficulty.",
      "More leading zeros = more computational work.",
      "Use the Auto Mine button for help."
    ],
    validate: (input: string, hash: string) => hash.startsWith("000"),
  },
];

// Animated blockchain visual
const BlockchainVisual = () => (
  <div className="flex items-center justify-center gap-2 py-6 overflow-hidden">
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className="relative">
        <div
          className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        >
          <Hash className="w-6 h-6 text-primary" />
        </div>
        {i < 3 && (
          <div className="absolute top-1/2 -right-3 w-4 h-0.5 bg-gradient-to-r from-primary to-transparent" />
        )}
      </div>
    ))}
  </div>
);

const BlockchainPuzzles = () => {
  const { completeChallenge } = useGame();
  const [level, setLevel] = useState(1);
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");
  const [success, setSuccess] = useState(false);
  const [mining, setMining] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const startTimeRef = useRef(Date.now());

  const current = levelData[level - 1];

  useEffect(() => {
    toast.info("Blockchain Puzzles", {
      description: "Learn blockchain concepts through hands-on challenges.",
      icon: "⛓️"
    });
  }, []);

  useEffect(() => {
    setInput("");
    setHash("");
    setSuccess(false);
    setShowHint(false);
    setMiningProgress(0);
  }, [level]);

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    setSuccess(false);

    if (val) {
      if (current.merkle) {
        const ha = await sha256('a');
        const hb = await sha256('b');
        const concat = ha + hb;
        const merkle = await sha256(concat);
        setHash(merkle);
        setSuccess(val === merkle);
      } else {
        const h = await sha256(val);
        setHash(h);
        setSuccess(current.validate(val, h));
      }
    } else {
      setHash("");
    }
  };

  const handleMine = async () => {
    setMining(true);
    setMiningProgress(0);
    let nonce = 0;
    let found = false;
    let candidate = "";
    const maxAttempts = 100000;

    while (!found && nonce < maxAttempts) {
      candidate = `block-${Math.random().toString(36).slice(2)}-${nonce}`;
      const h = await sha256(candidate);

      if (nonce % 1000 === 0) {
        setMiningProgress(Math.min((nonce / maxAttempts) * 100, 95));
      }

      if (current.targetPrefix && h.startsWith(current.targetPrefix)) {
        setInput(candidate);
        setHash(h);
        setSuccess(true);
        found = true;
        setMiningProgress(100);
        toast.success("Block mined!", {
          description: `Found valid hash after ${nonce} attempts.`,
          icon: "⛏️"
        });
        break;
      }
      nonce++;
    }
    setMining(false);
  };

  const handleSubmit = () => {
    if (success) {
      setCompletedLevels(prev => [...prev, level]);
      completeChallenge({
        challengeId: `blockchain-${level}`,
        score: 100,
        hintsUsed: showHint ? 1 : 0,
        attempts: 1,
        timeMs: Date.now() - startTimeRef.current,
        completedAt: new Date().toISOString(),
      });
      if (level < maxLevel) {
        toast.success(`Level ${level} complete!`, {
          description: "Advancing to next challenge...",
          icon: "🎉"
        });
        setTimeout(() => {
          setLevel(level + 1);
        }, 1000);
      }
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
    setCompletedLevels([]);
    setInput("");
    setHash("");
    setSuccess(false);
    setShowHint(false);
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-4">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-400">Blockchain Security</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Blockchain <span className="text-primary">Puzzles</span></h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Explore hash mining, Merkle trees, and transaction validation through interactive challenges.
            </p>
          </div>

          {/* Visual */}
          <BlockchainVisual />

          {/* Stats Bar */}
          <div className="glass-card p-4 rounded-xl mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Level</div>
                  <div className="text-xl font-bold text-primary">{level}/{maxLevel}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Challenge</div>
                  <div className="text-sm text-primary/80">{current.title}</div>
                </div>
              </div>
              <Progress value={(level / maxLevel) * 100} className="w-full sm:w-48 h-2" />
            </div>
          </div>

          {/* Level Progress */}
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
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  {current.title}
                </h2>
              </div>
              <p className="text-muted-foreground mb-6">{current.description}</p>

              {/* Input */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Zap size={16} className="text-primary" />
                    Your Input
                  </label>
                  <input
                    type="text"
                    value={input}
                    onChange={handleInput}
                    className="w-full p-4 bg-muted/30 rounded-lg border border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none font-mono text-sm"
                    placeholder="Type your answer here..."
                    disabled={mining}
                  />
                </div>

                {/* Hash Display */}
                {hash && (
                  <div className={cn(
                    "p-4 rounded-lg border transition-all",
                    success
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-muted/20 border-muted/30"
                  )}>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Hash className="w-3 h-3" />
                      SHA-256 Hash
                    </div>
                    <div className="font-mono text-xs break-all">
                      <span className={success ? "text-green-400" : "text-foreground"}>
                        {current.targetPrefix && hash.slice(0, current.targetPrefix.length)}
                      </span>
                      {current.targetPrefix && hash.slice(current.targetPrefix.length)}
                      {!current.targetPrefix && hash}
                    </div>
                    {success && (
                      <div className="flex items-center gap-2 mt-2 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Valid solution found!
                      </div>
                    )}
                  </div>
                )}

                {/* Mining Progress */}
                {mining && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Mining in progress...</span>
                      <span className="text-primary font-mono">{Math.round(miningProgress)}%</span>
                    </div>
                    <Progress value={miningProgress} className="h-2" />
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {current.targetPrefix && (
                    <Button
                      onClick={handleMine}
                      variant="outline"
                      disabled={mining}
                      className="flex-1 sm:flex-none"
                    >
                      <Cpu size={16} className={cn("mr-2", mining && "animate-spin")} />
                      {mining ? "Mining..." : "Auto Mine"}
                    </Button>
                  )}
                  <Button
                    onClick={handleSubmit}
                    variant="glow"
                    disabled={!success}
                    className="flex-1 sm:flex-none"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    {level < maxLevel ? "Next Level" : "Finish"}
                  </Button>
                  <Button
                    onClick={() => {
                      setInput("");
                      setHash("");
                      setSuccess(false);
                      setShowHint(false);
                    }}
                    variant="outline"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Reset
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

            {/* Completion */}
            {level === maxLevel && completedLevels.includes(maxLevel) && (
              <div className="glass-card p-8 rounded-xl text-center border border-green-500/30 bg-green-500/5">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Blockchain Master!</h3>
                <p className="text-muted-foreground mb-4">
                  You've completed all blockchain challenges!
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
            Explore the fundamentals of blockchain technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BlockchainPuzzles;
