
import { Trophy } from "lucide-react";
import Button from "@/components/Button";

type GameCompletionProps = {
  score: number;
  onReset: () => void;
};

const GameCompletion = ({ score, onReset }: GameCompletionProps) => {
  return (
    <div className="text-center p-4 bg-green-500/10 rounded-md border border-green-500/30 animate-scale-in">
      <Trophy size={40} className="text-yellow-500 mx-auto mb-3" />
      <h3 className="text-xl font-bold mb-2">Challenge Complete!</h3>
      <p className="text-muted-foreground mb-4">Final Score: {score}</p>
      <Button 
        variant="glow" 
        onClick={onReset}
        className="w-full"
      >
        Play Again
      </Button>
    </div>
  );
};

export default GameCompletion;
