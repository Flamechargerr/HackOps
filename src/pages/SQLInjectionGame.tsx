
import { useState, useEffect } from "react";
import { ArrowLeft, Database, AlertCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { toast } from "sonner";
import Button from "@/components/Button";

const SQLInjectionGame = () => {
  const [level, setLevel] = useState(1);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    toast.info("Welcome to the SQL Injection Challenge!", {
      description: "Find and exploit SQL injection vulnerabilities safely.",
    });
  }, []);

  const checkSolution = (input: string, level: number) => {
    switch (level) {
      case 1:
        return input.includes("'") && input.includes("OR") && input.includes("1=1");
      case 2:
        return input.includes("UNION") && input.includes("SELECT");
      case 3:
        return input.includes("DROP") || input.includes("DELETE") || input.includes(";");
      default:
        return false;
    }
  };

  const executeQuery = () => {
    let mockResults: string[] = [];
    try {
      if (checkSolution(query, level)) {
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
            mockResults = ["Table 'users' dropped successfully"];
            toast.success("Database modified!");
            break;
        }
        setScore(score + 100);
        if (level < 3) {
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
                <div className="text-lg font-bold">Level {level}/3</div>
                <div className="text-primary">Score: {score}</div>
              </div>

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
                    <p className="text-muted-foreground">Bypass the login authentication</p>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      <li>The query checks username and password</li>
                      <li>Find a way to make the WHERE clause always true</li>
                    </ul>
                  </>
                )}
                {level === 2 && (
                  <>
                    <p className="text-muted-foreground">Extract sensitive data using UNION-based injection</p>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      <li>The database contains multiple tables</li>
                      <li>Try to combine results from different tables</li>
                    </ul>
                  </>
                )}
                {level === 3 && (
                  <>
                    <p className="text-muted-foreground">Modify the database structure</p>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      <li>Think about destructive SQL commands</li>
                      <li>Try to execute multiple queries at once</li>
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

export default SQLInjectionGame;
