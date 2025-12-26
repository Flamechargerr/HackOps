import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import PasswordGame from "@/components/PasswordGame";
import { ArrowLeft, Trophy, Lock, Target, Zap, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { leaderboardManager } from "@/utils/leaderboard";
import Button from "@/components/common/Button";
import BackgroundFX from "@/components/FX/BackgroundFX";
import SpotlightCursor from "@/components/FX/SpotlightCursor";

const PasswordGamePage = () => {
  const [playerName, setPlayerName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);

  useEffect(() => {
    toast.info("Password Security Challenge", {
      description: "Create a password that meets all the security requirements.",
      icon: "🔐",
    });
  }, []);

  const handleGameComplete = (finalScore: number, finalLevel: number) => {
    setGameScore(finalScore);
    setGameLevel(finalLevel);
    setShowNameInput(true);
  };

  const submitScore = () => {
    if (playerName.trim()) {
      leaderboardManager.addScore({
        name: playerName.trim(),
        game: "password",
        score: gameScore,
        level: gameLevel,
        difficulty: gameLevel >= 8 ? 'Expert' : gameLevel >= 6 ? 'Hard' : gameLevel >= 4 ? 'Medium' : 'Easy',
      });
      setShowNameInput(false);
      toast.success("Score submitted!", {
        description: "Check the leaderboard to see your ranking.",
        icon: "🏆"
      });
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-4">
              <Lock className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Password Security</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Password <span className="text-primary">Challenge</span></h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Create a password that meets an increasing set of security requirements. Each level adds a new challenge to overcome.
            </p>
          </div>

          {/* Tips Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-sm">Progressive Difficulty</div>
                  <div className="text-xs text-muted-foreground">10 levels to complete</div>
                </div>
              </div>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-sm">Real-Time Feedback</div>
                  <div className="text-xs text-muted-foreground">Instant validation</div>
                </div>
              </div>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center text-yellow-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-sm">Leaderboard</div>
                  <div className="text-xs text-muted-foreground">Compete globally</div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Container */}
          <div className="glass-card p-6 rounded-xl">
            <PasswordGame onGameComplete={handleGameComplete} />
          </div>

          {/* Score Submission Modal */}
          {showNameInput && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
              <div
                className="glass-card p-8 rounded-2xl max-w-md w-full border border-primary/30 shadow-2xl"
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Challenge Complete!</h2>
                  <p className="text-muted-foreground">
                    You scored <span className="text-primary font-bold">{gameScore}</span> points and reached level <span className="text-accent font-bold">{gameLevel}</span>!
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Enter your name for the leaderboard:
                    </label>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Your name"
                      className="w-full p-3 bg-muted/30 border border-primary/30 rounded-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none font-medium"
                      maxLength={20}
                      onKeyDown={(e) => e.key === 'Enter' && submitScore()}
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={submitScore}
                      variant="glow"
                      className="flex-1"
                      disabled={!playerName.trim()}
                    >
                      <Trophy className="mr-2 w-4 h-4" />
                      Submit Score
                    </Button>
                    <Button
                      onClick={() => setShowNameInput(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Skip
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            Challenge yourself with more security games on our platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PasswordGamePage;
