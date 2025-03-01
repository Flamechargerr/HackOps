
import { Shield, Trophy } from "lucide-react";

type GameLevelProps = {
  level: number;
  score: number;
};

const GameLevel = ({ level, score }: GameLevelProps) => {
  return (
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
  );
};

export default GameLevel;
