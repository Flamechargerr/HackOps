
import { useState, useEffect } from "react";
import { ArrowLeft, Database, AlertCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { toast } from "sonner";
import Button from "@/components/Button";
import { Progress } from "@/components/ui/progress";

const maxLevel = 5;
const levelData = [
  {
    check: (input: string) => input.includes("'") && input.toUpperCase().includes("OR") && input.includes("1=1"),
    hints: [
      "Try using ' OR 1=1 -- to bypass authentication.",
      "The WHERE clause should always be true.",
      "Classic SQLi: ' OR 1=1 --"
    ],
    challenge: "Bypass the login authentication."
  },
  {
    check: (input: string) => input.toUpperCase().includes("UNION") && input.toUpperCase().includes("SELECT"),
    hints: [
      "Use UNION SELECT to combine results from different tables.",
      "Try: ' UNION SELECT ...",
      "UNION-based SQLi can extract data from other tables."
    ],
    challenge: "Extract sensitive data using UNION-based injection."
  },
  {
    check: (input: string) => input.toUpperCase().includes("UPDATE") || input.toUpperCase().includes("INSERT"),
    hints: [
      "Try using UPDATE or INSERT to modify data.",
      "Example: '; UPDATE users SET admin=1 WHERE username='admin'; --",
      "Manipulate data, not just read it."
    ],
    challenge: "Modify data in the database."
  },
  {
    check: (input: string) => input.toUpperCase().includes("SLEEP(") || input.toUpperCase().includes("BENCHMARK("),
    hints: [
      "Try using SLEEP() or BENCHMARK() for time-based blind SQLi.",
      "Example: ' OR SLEEP(5) --",
      "Blind SQLi can be detected by timing responses."
    ],
    challenge: "Exploit blind SQL injection using time delays."
  },
  {
    check: (input: string) => input.toUpperCase().includes("DROP") || input.toUpperCase().includes("DELETE") || input.includes(";"),
    hints: [
      "Try using DROP or DELETE to remove data or tables.",
      "Example: '; DROP TABLE users; --",
      "Destructive SQLi can alter the database structure."
    ],
    challenge: "Modify the database structure."
  }
];

const SQLInjectionGame = () => {
  const [level, setLevel] = useState(1);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const current = levelData[level - 1];

  useEffect(() => {
    toast.info("Welcome to the SQL Injection Challenge!", {
      description: "Find and exploit SQL injection vulnerabilities safely.",
    });
    setQuery("");
    setResult([]);
    setShowHint(false);
  }, [level]);

  const executeQuery = () => {
    let mockResults: string[] = [];
    try {
      if (current.check(query)) {
        switch (level) {
          case 1:
            mockResults = ["admin", "user1", "user2", "superuser"];
            toast.success("Authentication bypassed!");
            break;
          case 2:
            mockResults = ["Credit Card: 4111-XXXX-XXXX-1234", "SSN: XXX-XX-1234"];
            toast.success("Data extracted!");
            break;
          case 3:
            mockResults = ["User 'admin' updated to admin=1."];
            toast.success("Data modified!");
            break;
          case 4:
            mockResults = ["Time delay detected. Blind SQLi successful!"];
            toast.success("Blind SQLi exploited!");
            break;
          case 5:
            mockResults = ["Table 'users' dropped successfully"];
            toast.success("Database modified!");
            break;
        }
        setScore(score + 100);
        if (level < maxLevel) {
          setTimeout(() => {
            setLevel(level + 1);
            setQuery("");
            setResult([]);
          }, 2000);
        } else {
          toast.success("Congratulations! You've completed all levels!");
        }
      } else {
        mockResults = ["No results found"];
        toast.error("Query failed! Try a different approach.");
      }
    } catch (error) {
      mockResults = ["Error executing query"];
    }
    setResult(mockResults);
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
                  <label className="block text-sm mb-2">SQL Query:</label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-primary">
                      <Database size={16} />
                    </div>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full pl-10 p-3 bg-muted/30 rounded-md border border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none font-mono"
                      placeholder="SELECT * FROM users WHERE username = 'input'"
                    />
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle size={16} className="mr-2 text-primary" />
                    <span className="text-sm text-muted-foreground">Query Result:</span>
                  </div>
                  <div className="font-mono space-y-1">
                    {result.map((line, i) => (
                      <div key={i} className="p-1 bg-muted/20 rounded">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button 
                    onClick={executeQuery}
                    className="flex-1"
                    variant="glow"
                  >
                    <Database size={16} className="mr-2" />
                    Execute Query
                  </Button>
                  <Button
                    onClick={() => {
                      setQuery("");
                      setResult([]);
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
                  <div className="mt-4 p-4 bg-blue-500/10 text-blue-700 rounded shadow animate-fade-in">
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

export default SQLInjectionGame;
