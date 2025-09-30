
import { Trophy } from "lucide-react";
import Button from "@/components/Button";
import { useEffect } from "react";

type GameCompletionProps = {
  score: number;
  onReset: () => void;
};

const GameCompletion = ({ score, onReset }: GameCompletionProps) => {
  // Social sharing logic
  const shareText = `I just completed the Password Challenge with a score of ${score}! Can you beat me? #HackOps`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    // Simple emoji confetti
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = '0';
    confetti.style.top = '0';
    confetti.style.width = '100vw';
    confetti.style.height = '100vh';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.overflow = 'hidden';
    confetti.className = 'confetti-emoji-container';
    document.body.appendChild(confetti);
    const emojis = ['🎉','✨','💥','🥳','🎊'];
    const pieces = 40;
    for (let i = 0; i < pieces; i++) {
      const span = document.createElement('span');
      span.innerText = emojis[Math.floor(Math.random()*emojis.length)];
      span.style.position = 'absolute';
      span.style.left = `${Math.random()*100}vw`;
      span.style.top = `-${Math.random()*20}vh`;
      span.style.fontSize = `${Math.random()*1.5+1.5}rem`;
      span.style.opacity = '0.85';
      span.style.transition = 'transform 2.2s cubic-bezier(.23,1.01,.32,1), opacity 2.2s';
      confetti.appendChild(span);
      setTimeout(() => {
        span.style.transform = `translateY(${100+Math.random()*20}vh) rotate(${Math.random()*360}deg)`;
        span.style.opacity = '0';
      }, 50);
    }
    setTimeout(() => {
      confetti.remove();
    }, 2500);
    return () => { confetti.remove(); };
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Password Challenge Complete!',
          text: shareText,
          url: shareUrl,
        });
      } catch (e) {
        // User cancelled or error
      }
    } else {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        '_blank'
      );
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Copied to clipboard!');
    } catch (e) {
      alert('Failed to copy.');
    }
  };

  return (
    <div className="text-center p-4 bg-green-500/10 rounded-md border border-green-500/30 animate-scale-in">
      <Trophy size={40} className="text-yellow-500 mx-auto mb-3" />
      <h3 className="text-xl font-bold mb-2">Challenge Complete!</h3>
      <p className="text-muted-foreground mb-4">Final Score: {score}</p>
      {/* Social Sharing Buttons */}
      <div className="flex flex-col gap-2 mb-4">
        <button
          onClick={handleShare}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors font-medium"
        >
          Share on X (Twitter)
        </button>
        <button
          onClick={handleCopy}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors font-medium"
        >
          Copy Result Link
        </button>
      </div>
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
