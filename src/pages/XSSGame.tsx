
import { useState, useEffect } from "react";
import { ArrowLeft, Code, ShieldAlert, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { toast } from "sonner";
import Button from "@/components/Button";

const XSSGame = () => {
  const [level, setLevel] = useState(1);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [score, setScore] = useState(0);
  const [isVulnerable, setIsVulnerable] = useState(false);

  useEffect(() => {
    toast.info("Welcome to the XSS Challenge!", {
      description: "Find and exploit XSS vulnerabilities safely.",
    });
  }, []);

  const checkSolution = (input: string, level: number) => {
    switch (level) {
      case 1:
        return input.includes("<script>") && input.includes("</script>");
      case 2:
        return input.toLowerCase().includes("onerror=") || input.toLowerCase().includes("onload=");
      case 3:
        return input.toLowerCase().includes("javascript:") || input.toLowerCase().includes("data:");
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (checkSolution(input, level)) {
      toast.success("Vulnerability found!");
      setScore(score + 100);
      if (level < 3) {
        setLevel(level + 1);
        setInput("");
        setOutput("");
        setIsVulnerable(false);
      } else {
        toast.success("Congratulations! You've completed all levels!");
      }
    } else {
      toast.error("Try again! This isn't quite right.");
    }
  };

  const renderOutput = () => {
    try {
      // Safely render output in a controlled environment
      const sanitized = input.replace(/[<>]/g, (char) => `&${char === '<' ? 'lt' : 'gt'};`);
      setOutput(sanitized);
      setIsVulnerable(checkSolution(input, level));
    } catch (error) {
      setOutput("Error rendering output");
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
                <div>
                  <label className="block text-sm mb-2">Input:</label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onBlur={renderOutput}
                    className="w-full h-32 p-3 bg-muted/30 rounded-md border border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none font-mono"
                    placeholder="Enter your payload..."
                  />
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Code size={16} className="mr-2 text-primary" />
                    <span className="text-sm text-muted-foreground">Output:</span>
                  </div>
                  <div 
                    className={`font-mono p-2 rounded ${
                      isVulnerable ? "bg-red-500/20 text-red-400" : "bg-muted/20"
                    }`}
                  >
                    {output || "No output yet"}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={handleSubmit}
                    className="flex-1"
                    variant="glow"
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
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-3">Level {level} Challenge:</h2>
              <div className="space-y-4">
                {level === 1 && (
                  <>
                    <p className="text-muted-foreground">Find a basic XSS vulnerability using script tags.</p>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      <li>Try using basic script tags</li>
                      <li>The payload should execute JavaScript code</li>
                    </ul>
                  </>
                )}
                {level === 2 && (
                  <>
                    <p className="text-muted-foreground">Discover event-based XSS vulnerabilities.</p>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      <li>Look for HTML event attributes</li>
                      <li>Think about image loading events</li>
                    </ul>
                  </>
                )}
                {level === 3 && (
                  <>
                    <p className="text-muted-foreground">Find advanced XSS vectors using protocols.</p>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      <li>Explore different URL protocols</li>
                      <li>Think about data URIs</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default XSSGame;
