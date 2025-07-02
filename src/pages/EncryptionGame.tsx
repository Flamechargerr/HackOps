
import { useState, useEffect } from "react";
import { ArrowLeft, Lock, Unlock, RefreshCw, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { toast } from "sonner";
import Button from "@/components/Button";
import { leaderboardManager } from "@/utils/leaderboard";

const EncryptionGame = () => {
  const [level, setLevel] = useState(1);
  const [input, setInput] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [score, setScore] = useState(0);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  useEffect(() => {
    toast.info("Welcome to the Encryption Challenge!", {
      description: "Decrypt the messages using various encryption methods.",
    });
    loadLevel(1);
  }, []);

  const loadLevel = (level: number) => {
    setIsLevelComplete(false);
    switch (level) {
      case 1:
        // Caesar Cipher
        setEncryptedText("khoor zruog");
        setExpectedOutput("hello world");
        break;
      case 2:
        // Base64
        setEncryptedText("SGVsbG8gSGFja2Vy");
        setExpectedOutput("Hello Hacker");
        break;
      case 3:
        // Simple substitution
        setEncryptedText("@ppl3 p13");
        setExpectedOutput("apple pie");
        break;
      default:
        setEncryptedText("");
        setExpectedOutput("");
    }
  };

  const handleSubmit = () => {
    if (input.toLowerCase() === expectedOutput.toLowerCase()) {
      setIsLevelComplete(true);
      toast.success("Level Complete!", {
        description: `+100 points! ${level < 3 ? "Next level unlocked!" : "You've mastered encryption!"}`,
      });
      setScore(score + 100);
      
      if (level < 3) {
        setTimeout(() => {
          setLevel(level + 1);
          loadLevel(level + 1);
          setInput("");
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
                    <div className="text-lg font-bold">Level {level}/3</div>
                  </div>
                  <div className="text-primary font-mono">Score: {score}</div>
                </div>

                <div className="space-y-6">
                  <div className="bg-muted/30 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center mb-2">
                      <Lock size={16} className="mr-2 text-primary" />
                      <span className="text-sm text-muted-foreground">Encrypted Text:</span>
                    </div>
                    <div className="font-mono text-lg bg-muted/20 p-3 rounded">{encryptedText}</div>
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
                        loadLevel(level);
                      }}
                      variant="outline"
                      className="group"
                    >
                      <RefreshCw size={16} className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-3 flex items-center">
                <Lock size={18} className="mr-2 text-primary" />
                Level {level} Hints:
              </h2>
              <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                {level === 1 && (
                  <>
                    <li>This is a Caesar cipher - each letter is shifted by 3 positions.</li>
                    <li>Try moving each letter back 3 positions in the alphabet.</li>
                    <li>Example: 'd' becomes 'a'</li>
                  </>
                )}
                {level === 2 && (
                  <>
                    <li>This text is encoded in Base64.</li>
                    <li>Base64 is commonly used for encoding binary data.</li>
                    <li>Look for online Base64 decoders to help you.</li>
                  </>
                )}
                {level === 3 && (
                  <>
                    <li>This is a leetspeak substitution cipher.</li>
                    <li>Numbers and symbols replace similar-looking letters.</li>
                    <li>Example: '@' might represent 'a', '3' might represent 'e'</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EncryptionGame;
