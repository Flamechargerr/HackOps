import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  GameProgress,
  ChallengeCompletion,
  Badge,
  getProgress,
  recordCompletion,
  BADGE_DEFINITIONS,
} from '@/lib/storage';
import { toast } from 'sonner';

/* ─── Context Type ──────────────────────────────────────────── */

interface GameContextType {
  progress: GameProgress;
  completeChallenge: (completion: ChallengeCompletion) => Badge[];
  isChallengeCompleted: (challengeId: string) => boolean;
  getChallengeScore: (challengeId: string) => number;
  totalChallenges: number;
  refreshProgress: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

/* ─── Provider ──────────────────────────────────────────────── */

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [progress, setProgress] = useState<GameProgress>(getProgress);

  const refreshProgress = useCallback(() => {
    setProgress(getProgress());
  }, []);

  // Sync on mount and when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshProgress();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshProgress]);

  const completeChallenge = useCallback((completion: ChallengeCompletion): Badge[] => {
    const { progress: updated, newBadges } = recordCompletion(completion);
    setProgress(updated);

    // Show toast for new badges
    for (const badge of newBadges) {
      toast.success(`Badge Earned: ${badge.icon} ${badge.name}`, {
        description: badge.description,
        duration: 5000,
      });
    }

    return newBadges;
  }, []);

  const isChallengeCompleted = useCallback(
    (challengeId: string) => !!progress.completions[challengeId],
    [progress]
  );

  const getChallengeScore = useCallback(
    (challengeId: string) => progress.completions[challengeId]?.score ?? 0,
    [progress]
  );

  const value: GameContextType = {
    progress,
    completeChallenge,
    isChallengeCompleted,
    getChallengeScore,
    totalChallenges: BADGE_DEFINITIONS.length, // approximate
    refreshProgress,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
