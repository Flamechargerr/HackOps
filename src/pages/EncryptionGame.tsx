
import { useState, useEffect } from "react";
import { ArrowLeft, Lock, Unlock, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { toast } from "sonner";
import Button from "@/components/Button";

const EncryptionGame = () => {
  const [level, setLevel] = useState(1);
  const [input, setInput] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    toast.info("Welcome to the Encryption Challenge!", {
      description: "Decrypt the messages using various encryption methods.",
    });
    loadLevel(1);
  }, []);

  const loadLevel = (level: number) => {
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
    if (input.toLowerCase() === expectedOutput) {
      toast.success("Level Complete!");
      setScore(score + 100);
      if (level < 3) {
        setLevel(level + 1);
        loadLevel(level + 1);
        setInput("");
      } else {
        toast.success("Congratulations! You've completed all levels!");
      }
    } else {
      toast.error("Try again!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <Link to="/" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Home</span>
          </Link>

          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-6 rounded-xl mb-8">
              <div className="flex justify-between items-center mb-6">
                <div className="text-lg font-bold">Level {level}/3</div>
                <div className="text-primary">Score: {score}</div>
              </div>

              <div className="space-y-6">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Lock size={16} className="mr-2 text-primary" />
                    <span className="text-sm text-muted-foreground">Encrypted Text:</span>
                  </div>
                  <div className="font-mono text-lg">{encryptedText}</div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Your Solution:</label>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full p-3 bg-muted/30 rounded-md border border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none font-mono"
                    placeholder="Type your decrypted text..."
                  />
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={handleSubmit}
                    className="flex-1 group"
                    variant="glow"
                  >
                    <Unlock size={16} className="mr-2 group-hover:rotate-12 transition-transform" />
                    Submit
                  </Button>
                  <Button
                    onClick={() => {
                      setInput("");
                      loadLevel(level);
                    }}
                    variant="outline"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-3">Level {level} Hints:</h2>
              <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                {level === 1 && (
                  <>
                    <li>This is a Caesar cipher - each letter is shifted by 3 positions.</li>
                    <li>Try moving each letter back 3 positions in the alphabet.</li>
                  </>
                )}
                {level === 2 && (
                  <>
                    <li>This text is encoded in Base64.</li>
                    <li>Base64 is commonly used for encoding binary data.</li>
                  </>
                )}
                {level === 3 && (
                  <>
                    <li>This is a leetspeak substitution cipher.</li>
                    <li>Numbers and symbols replace similar-looking letters.</li>
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
