import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BackgroundFX from '@/components/FX/BackgroundFX';
import SpotlightCursor from '@/components/FX/SpotlightCursor';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { BADGE_DEFINITIONS } from '@/lib/storage';
import {
  ArrowLeft, Terminal, Trophy, Award, Target, Flame, Star,
  Clock, Zap, Shield, User, TrendingUp, Lock, Code,
  KeyRound, Database, Layers, Brain, CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

/* ─── Activity Heatmap ──────────────────────────────────────── */

const ActivityHeatmap = ({ completions }: { completions: Record<string, { completedAt: string }> }) => {
  const weeks = 12;
  const days = 7;

  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    Object.values(completions).forEach((c) => {
      const date = c.completedAt.slice(0, 10);
      map.set(date, (map.get(date) || 0) + 1);
    });
    return map;
  }, [completions]);

  const cells = useMemo(() => {
    const result: { date: string; count: number }[] = [];
    const today = new Date();
    for (let w = weeks - 1; w >= 0; w--) {
      for (let d = 0; d < days; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + (6 - d)));
        const dateStr = date.toISOString().slice(0, 10);
        result.push({ date: dateStr, count: activityMap.get(dateStr) || 0 });
      }
    }
    return result;
  }, [activityMap]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted/30';
    if (count === 1) return 'bg-primary/30';
    if (count === 2) return 'bg-primary/50';
    return 'bg-primary/80';
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: weeks }).map((_, w) => (
        <div key={w} className="flex flex-col gap-1">
          {Array.from({ length: days }).map((_, d) => {
            const cell = cells[w * days + d];
            return (
              <div
                key={d}
                className={cn('w-3 h-3 rounded-sm transition-colors', getColor(cell?.count ?? 0))}
                title={cell ? `${cell.date}: ${cell.count} challenge${cell.count !== 1 ? 's' : ''}` : ''}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ─── Profile Page ───────────────────────────────────────────── */

export const ProfilePage = () => {
  const { user, isAuthenticated, isOfflineMode, guestName } = useAuth();
  const { progress } = useGame();
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'challenges'>('overview');

  const displayName = isAuthenticated ? (user?.profile?.display_name || user?.username || 'User') : guestName;

  const categoryStats = useMemo(() => {
    const cats = [
      { id: 'terminal', name: 'Terminal', icon: <Terminal className="w-4 h-4" />, color: 'text-blue-400' },
      { id: 'password', name: 'Password', icon: <Lock className="w-4 h-4" />, color: 'text-green-400' },
      { id: 'encryption', name: 'Encryption', icon: <KeyRound className="w-4 h-4" />, color: 'text-purple-400' },
      { id: 'xss', name: 'XSS', icon: <Code className="w-4 h-4" />, color: 'text-orange-400' },
      { id: 'sql', name: 'SQL Injection', icon: <Database className="w-4 h-4" />, color: 'text-yellow-400' },
      { id: 'blockchain', name: 'Blockchain', icon: <Layers className="w-4 h-4" />, color: 'text-indigo-400' },
    ];

    return cats.map((cat) => {
      const completed = Object.keys(progress.completions).filter((id) => id.startsWith(cat.id)).length;
      const totalScore = Object.entries(progress.completions)
        .filter(([id]) => id.startsWith(cat.id))
        .reduce((sum, [, c]) => sum + c.score, 0);
      return { ...cat, completed, totalScore };
    });
  }, [progress]);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'badges' as const, label: 'Badges', icon: <Award className="w-4 h-4" /> },
    { id: 'challenges' as const, label: 'Challenges', icon: <Target className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundFX />
      <SpotlightCursor />
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <Link to="/" className="inline-flex items-center mb-8 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Home</span>
          </Link>

          {/* Profile Header */}
          <div className="glass-card p-8 rounded-xl mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary/30 flex items-center justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-1">{displayName}</h1>
                <p className="text-muted-foreground mb-3">
                  {isOfflineMode ? 'Guest Mode — Offline' : isAuthenticated ? user?.email : 'Guest Mode'}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="font-bold text-primary">{progress.totalScore}</span>
                    <span className="text-muted-foreground">points</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="font-bold">{progress.challengesCompleted}</span>
                    <span className="text-muted-foreground">completed</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span className="font-bold">{progress.badges.length}</span>
                    <span className="text-muted-foreground">badges</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="font-bold">{progress.streakDays}</span>
                    <span className="text-muted-foreground">day streak</span>
                  </div>
                </div>
              </div>

              {/* Level */}
              <div className="glass-card p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {Math.floor(progress.totalScore / 100) + 1}
                </div>
                <div className="text-xs text-muted-foreground">Level</div>
                <Progress value={(progress.totalScore % 100)} className="w-20 h-1.5 mt-2" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/20 text-muted-foreground hover:bg-muted/40'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Overview Tab ─────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Activity Heatmap */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Activity (Last 12 Weeks)
                </h3>
                <ActivityHeatmap completions={progress.completions} />
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <span>Less</span>
                  <div className="w-3 h-3 rounded-sm bg-muted/30" />
                  <div className="w-3 h-3 rounded-sm bg-primary/30" />
                  <div className="w-3 h-3 rounded-sm bg-primary/50" />
                  <div className="w-3 h-3 rounded-sm bg-primary/80" />
                  <span>More</span>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Category Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryStats.map((cat) => (
                    <div key={cat.id} className="p-4 rounded-lg bg-muted/10 border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cat.color}>{cat.icon}</span>
                        <span className="font-medium text-sm">{cat.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">{cat.completed}</div>
                        <div className="text-xs text-muted-foreground">{cat.totalScore} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-4 rounded-xl text-center">
                  <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{progress.totalScore}</div>
                  <div className="text-xs text-muted-foreground">Total Score</div>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                  <Star className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{progress.badges.length}</div>
                  <div className="text-xs text-muted-foreground">Badges Earned</div>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                  <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {Object.values(progress.completions).reduce((sum, c) => sum + c.hintsUsed, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Hints Used</div>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                  <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{progress.streakDays}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </div>
          )}

          {/* ── Badges Tab ───────────────────────────────────── */}
          {activeTab === 'badges' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {BADGE_DEFINITIONS.map((badge) => {
                  const earned = progress.badges.find((b) => b.id === badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={cn(
                        'glass-card p-5 rounded-xl transition-all',
                        earned
                          ? 'border border-yellow-500/30 bg-yellow-500/5'
                          : 'opacity-40 grayscale'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{badge.icon}</div>
                        <div className="flex-1">
                          <div className="font-bold text-sm flex items-center gap-1.5">
                            {badge.name}
                            {earned && <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
                          </div>
                          <div className="text-xs text-muted-foreground">{badge.description}</div>
                          {earned && (
                            <div className="text-xs text-yellow-400 mt-1">
                              Earned {new Date(earned.earnedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-center mt-6 text-sm text-muted-foreground">
                {progress.badges.length} / {BADGE_DEFINITIONS.length} badges earned
              </div>
            </div>
          )}

          {/* ── Challenges Tab ───────────────────────────────── */}
          {activeTab === 'challenges' && (
            <div className="animate-fade-in">
              {Object.keys(progress.completions).length === 0 ? (
                <div className="text-center py-16">
                  <Target className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No challenges completed yet</h3>
                  <p className="text-muted-foreground mb-6">Start playing to see your challenge history here</p>
                  <Link to="/challenges">
                    <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                      Browse Challenges
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(progress.completions)
                    .sort(([, a], [, b]) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                    .map(([id, completion]) => (
                      <div key={id} className="glass-card p-4 rounded-xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(completion.completedAt).toLocaleDateString()} · {completion.attempts} attempts · {completion.hintsUsed} hints
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">{completion.score}</div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-muted/10 py-10 border-t border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Terminal size={20} className="text-primary" />
            <span className="font-mono font-bold text-lg">HackOps</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HackOps. Open source cybersecurity training platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;
