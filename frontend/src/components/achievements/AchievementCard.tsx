import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Trophy, Star, Lock } from 'lucide-react';

interface Achievement {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  points: number;
  requirements: any;
}

interface AchievementProgress {
  current: number;
  required: number;
  percentage: number;
}

interface AchievementCardProps {
  badge: Achievement;
  progress?: AchievementProgress;
  earned?: boolean;
  earnedAt?: string;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  badge,
  progress,
  earned = false,
  earnedAt
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'rare': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'epic': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'legendary': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${
      earned 
        ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-yellow-500/50 shadow-lg shadow-yellow-500/20' 
        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
    }`}>
      {earned && (
        <div className="absolute top-2 right-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-3xl p-2 rounded-lg ${
              earned ? 'bg-yellow-500/20' : 'bg-slate-700/50'
            }`}>
              {badge.icon}
            </div>
            <div>
              <CardTitle className={`text-lg ${earned ? 'text-white' : 'text-slate-300'}`}>
                {badge.name}
              </CardTitle>
              <Badge className={`mt-1 ${getRarityColor(badge.rarity)}`}>
                {badge.rarity}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className={`text-sm mb-3 ${earned ? 'text-slate-200' : 'text-slate-400'}`}>
          {badge.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">
              {badge.points} points
            </span>
          </div>
          {earnedAt && (
            <span className="text-xs text-slate-500">
              Earned {new Date(earnedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {!earned && progress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Progress</span>
              <span className="text-slate-400">
                {progress.current}/{progress.required}
              </span>
            </div>
            <Progress 
              value={progress.percentage} 
              className="h-2 bg-slate-700"
            />
          </div>
        )}

        {!earned && !progress && (
          <div className="flex items-center gap-2 text-slate-500">
            <Lock className="w-4 h-4" />
            <span className="text-xs">Complete challenges to unlock</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};