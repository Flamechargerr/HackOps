
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
  const [isHovering, setIsHovering] = useState(false);

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
      {/* 3D Card Effect with enhanced parallax */}
      <div 
        className={cn(
          "p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5",
          "border border-primary/20 shadow-lg",
          "transform hover:translate-y-[-5px] hover:shadow-xl",
          "transition-all duration-300 backdrop-blur-sm",
          "perspective-1000"
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          transform: isHovering ? 'rotateX(2deg) rotateY(2deg)' : 'rotateX(0) rotateY(0)',
        }}
      >
        <div className="flex items-center justify-between">
          {/* Level indicator with enhanced animation */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield 
                className={cn(
                  "text-primary z-10 relative",
                  isHovering && "animate-pulse"
                )} 
                size={24} 
              />
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-subtle"></div>
            </div>
            <div>
              <span className="font-mono text-xs text-muted-foreground">SECURITY LEVEL</span>
              <div className="font-bold flex items-center space-x-2">
                <span 
                  className={cn(
                    "transition-all duration-300",
                    isHovering && "text-primary scale-110"
                  )}
                >
                  {level}
                </span>
                <span className="text-muted-foreground text-sm">/8</span>
                {level > 1 && (
                  <Sparkles 
                    size={14} 
                    className={cn(
                      "text-yellow-400",
                      isHovering ? "animate-bounce" : "animate-float"
                    )}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Score with enhanced animation */}
          <div className="flex items-center space-x-3">
            <div>
              <span className="font-mono text-xs text-muted-foreground text-right block">POINTS</span>
              <div className="relative">
                <span 
                  className={cn(
                    "font-bold transition-all duration-300",
                    isScoreIncreasing ? "text-yellow-400 scale-125" : 
                    isHovering && "text-yellow-400 scale-110"
                  )}
                >
                  {score}
                </span>
                {isScoreIncreasing && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 opacity-0 animate-fly-up text-yellow-400 font-bold">
                    +100
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <Trophy 
                className={cn(
                  "text-yellow-500 z-10 relative transition-transform",
                  isScoreIncreasing ? "animate-bounce" : 
                  isHovering && "animate-float"
                )} 
                size={24} 
              />
              {isScoreIncreasing && (
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
        
        {/* Enhanced progress bar with animation */}
        <div className="mt-3 h-1.5 bg-muted/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(level / 8) * 100}%` }}
          >
            <div className="h-full w-10 bg-white/20 animate-shimmer"></div>
          </div>
        </div>
      </div>
      
      {/* Enhanced credit line with hover effect */}
      <div className="absolute -bottom-5 right-0 text-xs text-muted-foreground hover:text-primary transition-colors duration-300">
        Made with love By Flamechargerr(Anamay)
      </div>
    </div>
  );
};

export default GameLevel;
