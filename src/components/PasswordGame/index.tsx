
import { useState, useEffect } from "react";
import { PasswordRequirementType } from "./types";
import PasswordInput from "./PasswordInput";
import RequirementsList from "./RequirementsList";
import GameCompletion from "./GameCompletion";
import GameLevel from "./GameLevel";
import FeedbackMessage from "./FeedbackMessage";
import { getRequirementsForLevel } from "./gameUtils";
import { initialRequirements } from "./requirements";

interface PasswordGameProps {
  onGameComplete?: (score: number, level: number) => void;
}

const PasswordGame = ({ onGameComplete }: PasswordGameProps = {}) => {
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [requirementsVisible, setRequirementsVisible] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">("info");
  const [allRequirements, setAllRequirements] = useState<PasswordRequirementType[]>(initialRequirements);
  
  // Get visible requirements based on current level
  const visibleRequirements = allRequirements.filter(req => 
    requirementsVisible.includes(req.id)
  );

  // Function to reveal requirements based on level
  useEffect(() => {
    // Set requirements for current level
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
        
        // Call completion callback if provided
        if (onGameComplete) {
          setTimeout(() => {
            onGameComplete(completedCount * 100, level);
          }, 1000);
        }
      }
    }
  };

  // Check requirements when password changes
  useEffect(() => {
    checkAllRequirements();
  }, [password]);

  // Reset game
  const resetGame = () => {
    setLevel(1);
    setPassword("");
    setIsGameComplete(false);
    setRequirementsVisible(["length"]);
    setScore(0);
    setAllRequirements(allRequirements.map(req => ({ ...req, completed: false })));
  };

  return (
    <div className="glass-card p-6 rounded-xl w-full max-w-lg mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Password Challenge</h2>
        <p className="text-muted-foreground">
          Create a password that meets all the requirements
        </p>
      </div>
      
      {/* Game status - Score and Level */}
      <GameLevel level={level} score={score} />
      
      {/* Feedback message */}
      {feedbackMessage && (
        <FeedbackMessage message={feedbackMessage} type={feedbackType} />
      )}
      
      {/* Password Input */}
      <PasswordInput 
        password={password} 
        setPassword={setPassword} 
        isGameComplete={isGameComplete} 
      />
      
      {/* Requirements List */}
      <RequirementsList requirements={visibleRequirements} />
      
      {/* Game Complete */}
      {isGameComplete && (
        <GameCompletion score={score} onReset={resetGame} />
      )}
    </div>
  );
};

export default PasswordGame;
