
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import PasswordGame from "@/components/PasswordGame";
import { ArrowLeft, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { leaderboardManager } from "@/utils/leaderboard";
import Button from "@/components/Button";

const PasswordGamePage = () => {
  const [playerName, setPlayerName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);

  useEffect(() => {
    // Show a welcome toast when the page loads
    toast.info("Welcome to the Password Challenge!", {
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
      
      toast.success("Score submitted to leaderboard!", {
        description: `${playerName} scored ${gameScore} points!`,
      });
      
      setShowNameInput(false);
    } else {
      toast.error("Please enter your name to submit score.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Back navigation */}
          <Link to="/" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Home</span>
          </Link>
          
          {/* Page title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Password Challenge</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Create a password that meets an increasing set of security requirements. 
              Each level adds a new challenge to overcome.
            </p>
          </div>
          
          {/* Game container */}
          <div className="max-w-2xl mx-auto">
            <PasswordGame onGameComplete={handleGameComplete} />
          </div>

          {/* Score Submission Modal */}
          {showNameInput && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="glass-card p-8 rounded-xl max-w-md w-full border border-primary/30">
                <div className="text-center mb-6">
                  <Trophy className="mx-auto mb-4 text-primary" size={48} />
                  <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
                  <p className="text-muted-foreground">
                    You scored <span className="text-primary font-bold">{gameScore}</span> points 
                    and reached level <span className="text-accent font-bold">{gameLevel}</span>!
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Enter your name for the leaderboard:</label>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Your name"
                      className="game-input w-full"
                      maxLength={20}
                      onKeyDown={(e) => e.key === 'Enter' && submitScore()}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={submitScore}
                      variant="glow"
                      className="flex-1"
                      disabled={!playerName.trim()}
                    >
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
                  
                  <div className="text-center">
                    <Link to="/leaderboard" className="text-primary hover:text-primary/80 text-sm">
                      View Leaderboard →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Game instructions */}
          <div className="max-w-2xl mx-auto mt-8 glass-card p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-3">How to Play</h2>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>Type a password that satisfies all the visible requirements.</li>
              <li>As you complete each level, new requirements will be added.</li>
              <li>The difficulty increases with each level.</li>
              <li>Try to complete all 8 levels to master the challenge!</li>
            </ul>
          </div>
        </div>
      </main>
      
      {/* Simple footer */}
      <footer className="py-6 bg-muted/10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Challenge yourself with more hacking games on our platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default PasswordGamePage;
