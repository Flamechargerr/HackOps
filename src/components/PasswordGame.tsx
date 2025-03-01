
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Button from "./Button";
import { Check, X, AlertTriangle, Shield, Trophy } from "lucide-react";

type PasswordRequirement = {
  id: string;
  description: string;
  validator: (password: string) => boolean;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
};

const PasswordGame = () => {
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [requirementsVisible, setRequirementsVisible] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">("info");
  
  // Define all password requirements
  const [allRequirements, setAllRequirements] = useState<PasswordRequirement[]>([
    {
      id: "length",
      description: "Password must be at least 5 characters long",
      validator: (pwd) => pwd.length >= 5,
      difficulty: "easy",
      completed: false,
    },
    {
      id: "uppercase",
      description: "Password must contain at least one uppercase letter",
      validator: (pwd) => /[A-Z]/.test(pwd),
      difficulty: "easy",
      completed: false,
    },
    {
      id: "number",
      description: "Password must contain at least one number",
      validator: (pwd) => /[0-9]/.test(pwd),
      difficulty: "easy",
      completed: false,
    },
    {
      id: "special",
      description: "Password must contain at least one special character (!@#$%^&*)",
      validator: (pwd) => /[!@#$%^&*]/.test(pwd),
      difficulty: "medium",
      completed: false,
    },
    {
      id: "no-consecutive",
      description: "No three consecutive characters can be the same",
      validator: (pwd) => !/(.)\1\1/.test(pwd),
      difficulty: "medium",
      completed: false,
    },
    {
      id: "prime-length",
      description: "Password length must be a prime number",
      validator: (pwd) => {
        const isPrime = (num: number) => {
          if (num <= 1) return false;
          if (num <= 3) return true;
          if (num % 2 === 0 || num % 3 === 0) return false;
          let i = 5;
          while (i * i <= num) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
            i += 6;
          }
          return true;
        };
        return isPrime(pwd.length);
      },
      difficulty: "hard",
      completed: false,
    },
    {
      id: "month-name",
      description: "Password must contain a month name (e.g., January)",
      validator: (pwd) => {
        const months = [
          "january", "february", "march", "april", "may", "june", "july", 
          "august", "september", "october", "november", "december"
        ];
        return months.some(month => 
          pwd.toLowerCase().includes(month)
        );
      },
      difficulty: "hard",
      completed: false,
    },
    {
      id: "balanced-chars",
      description: "Equal number of uppercase and lowercase letters",
      validator: (pwd) => {
        const upperCount = (pwd.match(/[A-Z]/g) || []).length;
        const lowerCount = (pwd.match(/[a-z]/g) || []).length;
        return upperCount > 0 && upperCount === lowerCount;
      },
      difficulty: "hard",
      completed: false,
    },
  ]);
  
  // Get visible requirements based on current level
  const visibleRequirements = allRequirements.filter(req => 
    requirementsVisible.includes(req.id)
  );

  // Function to reveal requirements based on level
  useEffect(() => {
    // Determine which requirements to show based on level
    const getRequirementsForLevel = (currentLevel: number) => {
      switch (currentLevel) {
        case 1:
          return ["length"];
        case 2:
          return ["length", "uppercase"];
        case 3:
          return ["length", "uppercase", "number"];
        case 4:
          return ["length", "uppercase", "number", "special"];
        case 5:
          return ["length", "uppercase", "number", "special", "no-consecutive"];
        case 6:
          return ["length", "uppercase", "number", "special", "no-consecutive", "prime-length"];
        case 7:
          return ["length", "uppercase", "number", "special", "no-consecutive", "prime-length", "month-name"];
        case 8:
          return ["length", "uppercase", "number", "special", "no-consecutive", "prime-length", "month-name", "balanced-chars"];
        default:
          return ["length"];
      }
    };
    
    setRequirementsVisible(getRequirementsForLevel(level));
    
    // Show feedback when level changes (except first load)
    if (level > 1) {
      setFeedbackMessage(`Level ${level} unlocked! New requirement added.`);
      setFeedbackType("success");
      
      // Clear feedback after 3 seconds
      const timer = setTimeout(() => {
        setFeedbackMessage("");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [level]);

  // Check if all visible requirements are met
  const checkAllRequirements = () => {
    let allMet = true;
    let completedCount = 0;
    
    const updatedRequirements = allRequirements.map(req => {
      // Only check visible requirements
      if (requirementsVisible.includes(req.id)) {
        const isMet = req.validator(password);
        if (!isMet) {
          allMet = false;
        } else {
          completedCount++;
        }
        return { ...req, completed: isMet };
      }
      return req;
    });
    
    setAllRequirements(updatedRequirements);
    
    // Update score based on completed requirements
    setScore(completedCount * 100);
    
    // If all visible requirements are met, advance to next level
    if (allMet && visibleRequirements.length > 0) {
      if (level < 8) {
        setLevel(level + 1);
      } else {
        // Game complete
        setIsGameComplete(true);
        setFeedbackMessage("Congratulations! You've beaten the password game!");
        setFeedbackType("success");
      }
    }
  };

  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  
  // Check requirements when password changes
  useEffect(() => {
    checkAllRequirements();
  }, [password]);

  return (
    <div className="glass-card p-6 rounded-xl w-full max-w-lg mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Password Challenge</h2>
        <p className="text-muted-foreground">
          Create a password that meets all the requirements
        </p>
      </div>
      
      {/* Game status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Shield className="text-primary" size={20} />
          <span className="font-medium">Level {level}/8</span>
        </div>
        <div className="flex items-center space-x-2">
          <Trophy className="text-yellow-500" size={20} />
          <span className="font-medium">Score: {score}</span>
        </div>
      </div>
      
      {/* Feedback message */}
      {feedbackMessage && (
        <div 
          className={cn(
            "mb-4 p-3 rounded-md text-sm animate-slide-in-bottom",
            feedbackType === "success" && "bg-green-500/20 text-green-400 border border-green-500/30",
            feedbackType === "error" && "bg-red-500/20 text-red-400 border border-red-500/30",
            feedbackType === "info" && "bg-blue-500/20 text-blue-400 border border-blue-500/30",
          )}
        >
          {feedbackMessage}
        </div>
      )}
      
      {/* Password Input */}
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Your Password
        </label>
        <input
          type="text"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          disabled={isGameComplete}
          className={cn(
            "w-full p-3 bg-muted/30 rounded-md border focus:ring-2 focus:outline-none font-mono transition-all duration-200",
            isGameComplete 
              ? "border-green-500/50 ring-green-500/20" 
              : "border-primary/30 focus:border-primary/50 focus:ring-primary/20"
          )}
          placeholder="Type your password..."
        />
      </div>
      
      {/* Requirements List */}
      <div className="space-y-3 mb-6">
        <h3 className="font-medium">Requirements:</h3>
        <div className="bg-muted/20 rounded-md p-3 space-y-2">
          {visibleRequirements.map((req) => (
            <div 
              key={req.id}
              className={cn(
                "flex items-start p-2 rounded-md transition-colors",
                req.completed 
                  ? "bg-green-500/10 text-green-400" 
                  : "bg-muted/30"
              )}
            >
              <div className="mr-3 mt-0.5">
                {req.completed ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <X size={16} className="text-red-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm">{req.description}</p>
                <div className="flex items-center mt-1">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    req.difficulty === "easy" && "bg-green-500/20 text-green-400",
                    req.difficulty === "medium" && "bg-yellow-500/20 text-yellow-400",
                    req.difficulty === "hard" && "bg-red-500/20 text-red-400",
                  )}>
                    {req.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Game Complete */}
      {isGameComplete && (
        <div className="text-center p-4 bg-green-500/10 rounded-md border border-green-500/30 animate-scale-in">
          <Trophy size={40} className="text-yellow-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Challenge Complete!</h3>
          <p className="text-muted-foreground mb-4">Final Score: {score}</p>
          <Button 
            variant="glow" 
            onClick={() => {
              setLevel(1);
              setPassword("");
              setIsGameComplete(false);
              setRequirementsVisible(["length"]);
              setScore(0);
              setAllRequirements(allRequirements.map(req => ({ ...req, completed: false })));
            }}
            className="w-full"
          >
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default PasswordGame;
