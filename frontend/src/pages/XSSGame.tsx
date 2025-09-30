
import { useState, useEffect } from "react";
import { ArrowLeft, Code, ShieldAlert, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { toast } from "sonner";
import Button from "@/components/Button";
import { Progress } from "@/components/ui/progress";

const maxLevel = 5;
const levelData = [
  {
    check: (input: string) => input.includes("<script>") && input.includes("</script>"),
    hints: [
      "Try using <script> tags to inject JavaScript.",
      "Example: <script>alert(1)</script>",
      "This is a classic reflected XSS."
    ],
    challenge: "Find a basic XSS vulnerability using script tags."
  },
  {
    check: (input: string) => input.toLowerCase().includes("onerror=") || input.toLowerCase().includes("onload="),
    hints: [
      "Use HTML event attributes like onerror or onload.",
      "Try: <img src=x onerror=alert(1)>",
      "Event-based XSS is common in images."
    ],
    challenge: "Discover event-based XSS vulnerabilities."
  },
  {
    check: (input: string) => input.toLowerCase().includes("javascript:") || input.toLowerCase().includes("data:"),
    hints: [
      "Try using javascript: or data: in a link.",
      "Example: <a href=javascript:alert(1)>click</a>",
      "Protocol-based XSS can bypass some filters."
    ],
    challenge: "Find advanced XSS vectors using protocols."
  },
  {
    check: (input: string) => input.toLowerCase().includes("document.location") || input.toLowerCase().includes("innerhtml"),
    hints: [
      "Try using DOM properties like document.location or innerHTML.",
      "Example: <img src=x onerror='document.location=\"https://evil.com\"'>",
      "DOM-based XSS exploits client-side code."
    ],
    challenge: "Exploit DOM-based XSS vulnerabilities."
  },
  {
    check: (input: string) => input.toLowerCase().includes("%3cscript%3e") || input.toLowerCase().includes("&#x3c;script&#x3e;"),
    hints: [
      "Try encoding your payload (URL or HTML encoding).",
      "Example: %3Cscript%3Ealert(1)%3C/script%3E or &#x3c;script&#x3e;alert(1)&#x3c;/script&#x3e;",
      "Obfuscated payloads can bypass naive filters."
    ],
    challenge: "Bypass filters with encoded or obfuscated payloads."
  }
];

const XSSGame = () => {
  const [level, setLevel] = useState(1);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [score, setScore] = useState(0);
  const [isVulnerable, setIsVulnerable] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const current = levelData[level - 1];

  useEffect(() => {
    toast.info("Welcome to the XSS Challenge!", {
      description: "Find and exploit XSS vulnerabilities safely.",
    });
    setInput("");
    setOutput("");
    setIsVulnerable(false);
    setShowHint(false);
  }, [level]);

  const handleSubmit = () => {
    if (current.check(input)) {
      toast.success("Vulnerability found!");
      setScore(score + 100);
      if (level < maxLevel) {
        setLevel(level + 1);
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
      setIsVulnerable(current.check(input));
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
                <div className="text-lg font-bold">Level {level}/{maxLevel}</div>
                <div className="text-primary">Score: {score}</div>
              </div>
              <Progress value={(level / maxLevel) * 100} className="mb-4" />
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
                      setShowHint(false);
                    }}
                    variant="outline"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Reset
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowHint(v => !v)}
                  >
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </Button>
                </div>
                {showHint && (
                  <div className="mt-4 p-4 bg-yellow-500/10 text-yellow-700 rounded shadow animate-fade-in">
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
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-3">Level {level} Challenge:</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">{current.challenge}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default XSSGame;
