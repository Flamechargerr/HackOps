
import { Shield, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

type GameLevelProps = {
  level: number;
  score: number;
};

const GameLevel = ({ level, score }: GameLevelProps) => {
  const [prevScore, setPrevScore] = useState(score);
  const [isScoreIncreasing, setIsScoreIncreasing] = useState(false);

  // Detect score changes for animation
  useEffect(() => {
    if (score > prevScore) {
      setIsScoreIncreasing(true);
      const timer = setTimeout(() => setIsScoreIncreasing(false), 1000);
      setPrevScore(score);
      return () => clearTimeout(timer);
    }
  }, [score, prevScore]);

  return (
    <div className="relative mb-8">
      {/* 3D Card Effect */}
      <div 
        className="
          p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5
          border border-primary/20 shadow-lg transform hover:translate-y-[-2px]
          transition-all duration-300 backdrop-blur-sm
        "
      >
        <div className="flex items-center justify-between">
          {/* Level indicator with animation */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="text-primary z-10 relative" size={24} />
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-subtle"></div>
            </div>
            <div>
              <span className="font-mono text-xs text-muted-foreground">SECURITY LEVEL</span>
              <div className="font-bold flex items-center space-x-2">
                <span>{level}</span>
                <span className="text-muted-foreground text-sm">/8</span>
                {level > 1 && (
                  <Sparkles 
                    size={14} 
                    className="text-yellow-400 animate-float" 
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Score with animation */}
          <div className="flex items-center space-x-3">
            <div>
              <span className="font-mono text-xs text-muted-foreground text-right block">POINTS</span>
              <div className="relative">
                <span 
                  className={cn(
                    "font-bold transition-all duration-300",
                    isScoreIncreasing && "text-yellow-400 scale-110"
                  )}
                >
                  {score}
                </span>
              </div>
            </div>
            <div className="relative">
              <Trophy 
                className={cn(
                  "text-yellow-500 z-10 relative transition-transform",
                  isScoreIncreasing && "animate-float"
                )} 
                size={24} 
              />
              {isScoreIncreasing && (
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-muted/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(level / 8) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Credit line */}
      <div className="absolute -bottom-5 right-0 text-xs text-muted-foreground">
        Made with love By Flamechargerr(Anamay)
      </div>
    </div>
  );
};

export default GameLevel;
