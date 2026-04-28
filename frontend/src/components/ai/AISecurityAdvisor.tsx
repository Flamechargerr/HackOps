import { useState } from 'react';
import { analyzeAttempt, type AIResponse } from '@/lib/ai';
import { isAIConfigured } from '@/lib/storage';
import { Brain, Loader2, Sparkles, Shield, AlertTriangle, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface AISecurityAdvisorProps {
  challengeType: string;
  level: number;
  lastInput?: string;
  wasSuccessful?: boolean;
  context?: string;
  className?: string;
}

export const AISecurityAdvisor = ({
  challengeType,
  level,
  lastInput,
  wasSuccessful,
  context,
  className,
}: AISecurityAdvisorProps) => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const configured = isAIConfigured();

  const handleAnalyze = async () => {
    if (!lastInput) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeAttempt({
        challengeType,
        level,
        userInput: lastInput,
        wasSuccessful: wasSuccessful ?? false,
        context,
      });
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!configured) {
    return (
      <div className={cn('glass-card p-4 rounded-xl border border-purple-500/20', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Brain className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-medium">AI Security Advisor</div>
              <div className="text-xs text-muted-foreground">Configure AI to get security analysis</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/ai-lab')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
          >
            <Settings className="w-3 h-3" />
            Setup AI
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('glass-card rounded-xl border border-purple-500/20 overflow-hidden', className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-purple-500/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium flex items-center gap-1">
              AI Security Advisor
              <Sparkles className="w-3 h-3 text-purple-400" />
            </div>
            <div className="text-xs text-muted-foreground">
              {analysis ? `Powered by ${analysis.model}` : 'Click Analyze for AI feedback'}
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in">
          {/* Analyze Button */}
          {lastInput && !analysis && !isLoading && (
            <button
              onClick={handleAnalyze}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-sm font-medium text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Analyze My Attempt
            </button>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span>Analyzing security implications...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Analysis Result */}
          {analysis && (
            <div className="space-y-2">
              <div className="text-sm prose prose-invert prose-sm max-w-none [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_strong]:text-foreground">
                <div dangerouslySetInnerHTML={{ __html: formatMarkdown(analysis.text) }} />
              </div>
              <button
                onClick={() => { setAnalysis(null); setError(null); }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear analysis
              </button>
            </div>
          )}

          {/* No input yet */}
          {!lastInput && !analysis && (
            <div className="text-xs text-muted-foreground text-center py-2">
              Make an attempt first — AI will analyze your approach
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Simple markdown → HTML for AI responses.
 * Only handles bold, code, headers, lists — keeps it safe.
 */
function formatMarkdown(md: string): string {
  return md
    .replace(/### (.*)/g, '<h3>$1</h3>')
    .replace(/## (.*)/g, '<h2>$1</h2>')
    .replace(/# (.*)/g, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded bg-muted/50 text-xs">$1</code>')
    .replace(/^- (.*)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul class="list-disc pl-4 space-y-1">$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
}
