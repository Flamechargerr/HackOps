
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

const TUTORIAL_STEPS = [
  {
    title: "Welcome to the Password Challenge!",
    content: "Your goal is to create a password that meets all the requirements. Each level adds a new rule!"
  },
  {
    title: "Password Input",
    content: "Type your password in the input box. As you type, you'll see which requirements are met."
  },
  {
    title: "Requirements",
    content: "Each requirement is shown below. Green means completed, gray means not yet."
  },
  {
    title: "Hints & Energy",
    content: "Use the 'Show Hint' button to get help, but each hint costs 1 energy. You start with 5 energy!"
  },
  {
    title: "Progress & Winning",
    content: "Complete all requirements to advance levels. Beat all levels to win! Good luck!"
  }
];

const PasswordGame = ({ onGameComplete }: PasswordGameProps = {}) => {
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [requirementsVisible, setRequirementsVisible] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">("info");
  const [allRequirements, setAllRequirements] = useState<PasswordRequirementType[]>(initialRequirements);
  const [showHint, setShowHint] = useState(false);
  const [energy, setEnergy] = useState(5); // Energy system
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  // Get visible requirements based on current level
  const visibleRequirements = allRequirements.filter(req => 
    requirementsVisible.includes(req.id)
  );

  // Get the newest requirement for the current level
  const newestReqId = requirementsVisible[requirementsVisible.length - 1];
  const newestRequirement = allRequirements.find(req => req.id === newestReqId);

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
      if (level < 10) {
        setLevel(level + 1);
        setShowHint(false);
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

  // Show Hint logic with energy deduction
  const handleShowHint = () => {
    if (isGameComplete || energy <= 0) return;
    setShowHint((v) => {
      if (!v && energy > 0) {
        setEnergy((e) => e - 1);
      }
      return !v;
    });
  };

  // Reset game
  const resetGame = () => {
    setLevel(1);
    setPassword("");
    setIsGameComplete(false);
    setRequirementsVisible(["length"]);
    setScore(0);
    setAllRequirements(allRequirements.map(req => ({ ...req, completed: false })));
    setEnergy(5); // Reset energy
    setShowHint(false);
    setShowTutorial(true);
    setTutorialStep(0);
  };

  return (
    <div className="glass-card p-4 sm:p-6 rounded-xl w-full max-w-lg mx-auto">
      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
          <div
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-sm w-full animate-fade-in overflow-y-auto max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tutorial-title"
            aria-describedby="tutorial-desc"
            tabIndex={-1}
            onKeyDown={e => {
              if (e.key === 'Escape') setShowTutorial(false);
            }}
          >
            <h2 id="tutorial-title" className="text-xl font-bold mb-2">{TUTORIAL_STEPS[tutorialStep].title}</h2>
            <p id="tutorial-desc" className="mb-4 text-gray-700">{TUTORIAL_STEPS[tutorialStep].content}</p>
            <div className="flex justify-end gap-2">
              {tutorialStep < TUTORIAL_STEPS.length - 1 ? (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => setTutorialStep((s) => s + 1)}
                >
                  Next
                </button>
              ) : (
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => setShowTutorial(false)}
                >
                  Got it!
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Password Challenge</h2>
        <p className="text-muted-foreground">
          Create a password that meets all the requirements
        </p>
      </div>
      {/* Energy Display */}
      <div className="mb-2 flex justify-end items-center">
        <span className="text-sm font-mono bg-blue-100 text-blue-600 px-3 py-1 rounded shadow">
          Energy: {energy}/5
        </span>
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
      
      {/* Show Hint Button and Animated Hint */}
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <button
          type="button"
          className="text-primary underline hover:text-accent font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleShowHint}
          disabled={isGameComplete || energy <= 0}
        >
          {showHint ? "Hide Hint" : "Show Hint"}
        </button>
        {showHint && newestRequirement?.hint && (
          <span className="ml-0 sm:ml-4 px-3 py-2 bg-blue-500/10 text-blue-500 rounded shadow animate-fade-in w-full sm:w-auto text-center">
            💡 {newestRequirement.hint}
          </span>
        )}
      </div>
      
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
