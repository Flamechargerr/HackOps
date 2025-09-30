
import { useState, useEffect, useMemo } from "react";
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

const extraHardRequirement: PasswordRequirementType = {
  id: "noVowels",
  label: "No vowels (hard mode)",
  hint: "Remove vowels a,e,i,o,u (case‑insensitive)",
  completed: false,
  validator: (pwd: string) => !/[aeiou]/i.test(pwd)
};

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
  const [energy, setEnergy] = useState(5);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);

  // New: Modes
  const [hardMode, setHardMode] = useState(false);
  const [timedMode, setTimedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes default

  // Setup extra requirement list when hard mode toggles
  useEffect(() => {
    setAllRequirements(prev => {
      const hasExtra = prev.some(r => r.id === extraHardRequirement.id);
      if (hardMode && !hasExtra) return [...prev, { ...extraHardRequirement }];
      if (!hardMode && hasExtra) return prev.filter(r => r.id !== extraHardRequirement.id);
      return prev;
    });
  }, [hardMode]);

  // Timer
  useEffect(() => {
    if (!timedMode || isGameComplete) return;
    setTimeLeft(120); // reset when enabling
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setFeedbackMessage("Time's up! Try again.");
          setFeedbackType("error");
          setIsGameComplete(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timedMode, isGameComplete]);

  // Get visible requirement ids for current level
  useEffect(() => {
    setRequirementsVisible(getRequirementsForLevel(level));
    if (level > 1) {
      setFeedbackMessage(`Level ${level} unlocked! New requirement added.`);
      setFeedbackType("success");
      const timer = setTimeout(() => setFeedbackMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [level]);

  // Compute visible requirements with mode extras
  const visibleIds = useMemo(() => {
    const ids = [...requirementsVisible];
    if (hardMode) ids.push(extraHardRequirement.id);
    return ids;
  }, [requirementsVisible, hardMode]);

  const visibleRequirements = allRequirements.filter(req => visibleIds.includes(req.id));

  // Check if all visible requirements are met
  const checkAllRequirements = () => {
    let allMet = true;
    let completedCount = 0;

    const updatedRequirements = allRequirements.map(req => {
      if (visibleIds.includes(req.id)) {
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
    setScore(completedCount * 100 + (hardMode ? 50 : 0));

    if (allMet && visibleRequirements.length > 0) {
      if (level < 10) {
        setLevel(level + 1);
        setShowHint(false);
      } else {
        setIsGameComplete(true);
        setFeedbackMessage("Congratulations! You've beaten the password game!");
        setFeedbackType("success");
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
    if (!isGameComplete) checkAllRequirements();
  }, [password]);

  const handleShowHint = () => {
    if (isGameComplete || energy <= 0) return;
    setShowHint((v) => {
      if (!v && energy > 0) setEnergy((e) => e - 1);
      return !v;
    });
  };

  const resetGame = () => {
    setLevel(1);
    setPassword("");
    setIsGameComplete(false);
    setRequirementsVisible(["length"]);
    setScore(0);
    setAllRequirements(initialRequirements);
    setEnergy(5);
    setShowHint(false);
    setShowTutorial(true);
    setTutorialStep(0);
    setTimedMode(false);
    setHardMode(false);
    setTimeLeft(120);
  };

  return (
    <div className="glass-card p-4 sm:p-6 rounded-xl w-full max-w-lg mx-auto">
      {/* Modes */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          className={`px-3 py-2 rounded-md border ${hardMode ? 'bg-primary/20 border-primary/50' : 'bg-muted/20 border-primary/20'}`}
          onClick={() => setHardMode(v => !v)}
        >
          🔥 Hard Mode
        </button>
        <button
          type="button"
          className={`px-3 py-2 rounded-md border ${timedMode ? 'bg-accent/20 border-accent/50' : 'bg-muted/20 border-primary/20'}`}
          onClick={() => setTimedMode(v => !v)}
        >
          ⏱️ Timed Mode
        </button>
      </div>

      {/* Timer HUD */}
      {timedMode && !isGameComplete && (
        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1">Time left: {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</div>
          <div className="h-2 bg-muted/30 rounded">
            <div className="h-2 bg-accent rounded" style={{width: `${(timeLeft/120)*100}%`}} />
          </div>
        </div>
      )}

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Password Challenge</h2>
        <p className="text-muted-foreground">Create a password that meets all the requirements</p>
      </div>

      {/* Energy */}
      <div className="mb-2 flex justify-end items-center">
        <span className="text-sm font-mono bg-blue-100 text-blue-600 px-3 py-1 rounded shadow">Energy: {energy}/5</span>
      </div>

      {/* Game status */}
      <GameLevel level={level} score={score} />

      {feedbackMessage && (
        <FeedbackMessage message={feedbackMessage} type={feedbackType} />
      )}

      <PasswordInput password={password} setPassword={setPassword} isGameComplete={isGameComplete} />

      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <button
          type="button"
          className="text-primary underline hover:text-accent font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleShowHint}
          disabled={isGameComplete || energy <= 0}
        >
          {showHint ? "Hide Hint" : "Show Hint"}
        </button>
        {showHint && (
          <span className="ml-0 sm:ml-4 px-3 py-2 bg-blue-500/10 text-blue-500 rounded shadow animate-fade-in w-full sm:w-auto text-center">
            💡 Focus on the newest rule first — then backfill the earlier ones.
          </span>
        )}
      </div>

      <RequirementsList requirements={visibleRequirements} />

      {isGameComplete && (
        <GameCompletion score={score} onReset={resetGame} />
      )}
    </div>
  );
};

export default PasswordGame;
