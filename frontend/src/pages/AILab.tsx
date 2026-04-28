import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BackgroundFX from '@/components/FX/BackgroundFX';
import SpotlightCursor from '@/components/FX/SpotlightCursor';
import Button from '@/components/common/Button';
import {
  ArrowLeft, Brain, Shield, Key, Code, Loader2, Sparkles,
  AlertTriangle, CheckCircle, Copy, RefreshCw, Zap, BookOpen,
  Settings, Lock, Search, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  analyzeThreat, analyzePassword, generateQuiz,
  testAIConnection, AVAILABLE_MODELS, type AIResponse
} from '@/lib/ai';
import { getAISettings, saveAISettings, isAIConfigured, type AISettings } from '@/lib/storage';
import { toast } from 'sonner';

/* ─── AI Settings Panel ──────────────────────────────────────── */

const AISettingsPanel = ({ onClose }: { onClose: () => void }) => {
  const [settings, setSettings] = useState<AISettings>(getAISettings());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; model?: string; error?: string } | null>(null);

  const handleSave = () => {
    saveAISettings(settings);
    toast.success('AI settings saved');
    onClose();
  };

  const handleTest = async () => {
    saveAISettings(settings);
    setTesting(true);
    setTestResult(null);
    const result = await testAIConnection();
    setTestResult(result);
    setTesting(false);
    if (result.success) {
      toast.success(`Connected to ${result.model}`);
    } else {
      toast.error(`Connection failed: ${result.error}`);
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl border border-purple-500/20 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          AI Configuration
        </h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-sm">✕</button>
      </div>

      <div className="space-y-4">
        {/* API Key */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Gemini API Key</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              placeholder="Enter your Gemini API key"
              className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-primary/20 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-sm"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Get a free key at{' '}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
              className="text-purple-400 hover:underline">
              aistudio.google.com/apikey
            </a>
            . Your key is stored locally — never sent to any server except Google's API.
          </p>
        </div>

        {/* Model */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Model</label>
          <div className="grid gap-2">
            {AVAILABLE_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSettings({ ...settings, model: model.id })}
                className={cn(
                  'p-3 rounded-lg border text-left transition-all',
                  settings.model === model.id
                    ? 'border-purple-500/50 bg-purple-500/10'
                    : 'border-primary/10 hover:border-primary/30'
                )}
              >
                <div className="text-sm font-medium">{model.name}</div>
                <div className="text-xs text-muted-foreground">{model.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Enable/Disable */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Enable AI Features</span>
          <button
            onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
            className={cn(
              'w-12 h-6 rounded-full transition-colors relative',
              settings.enabled ? 'bg-purple-500' : 'bg-muted'
            )}
          >
            <div className={cn(
              'w-5 h-5 rounded-full bg-white shadow-sm transition-transform absolute top-0.5',
              settings.enabled ? 'translate-x-6' : 'translate-x-0.5'
            )} />
          </button>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={cn(
            'p-3 rounded-lg border text-sm flex items-center gap-2',
            testResult.success
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          )}>
            {testResult.success ? (
              <><CheckCircle className="w-4 h-4" /> Connected to {testResult.model}</>
            ) : (
              <><AlertTriangle className="w-4 h-4" /> {testResult.error}</>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleTest}
            disabled={testing || !settings.apiKey}
            className="flex-1 py-2.5 rounded-lg border border-purple-500/30 text-sm font-medium text-purple-400 hover:bg-purple-500/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Test Connection
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-lg bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Tool Cards ─────────────────────────────────────────────── */

type ActiveTool = 'none' | 'threat' | 'password' | 'quiz' | 'settings';

const AILab = () => {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<ActiveTool>('none');
  const [isConfigured, setIsConfigured] = useState(isAIConfigured());

  // Threat Analyzer state
  const [threatInput, setThreatInput] = useState('');
  const [threatType, setThreatType] = useState<'code' | 'url' | 'log' | 'general'>('code');
  const [threatResult, setThreatResult] = useState<AIResponse | null>(null);
  const [threatLoading, setThreatLoading] = useState(false);

  // Password Analyzer state
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordResult, setPasswordResult] = useState<AIResponse | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Quiz state
  const [quizTopic, setQuizTopic] = useState('XSS');
  const [quizDifficulty, setQuizDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [quizResult, setQuizResult] = useState<AIResponse | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    if (!isConfigured) setActiveTool('settings');
  }, [isConfigured]);

  const handleThreatAnalysis = async () => {
    if (!threatInput.trim()) return;
    setThreatLoading(true);
    try {
      const result = await analyzeThreat({ input: threatInput, type: threatType });
      setThreatResult(result);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setThreatLoading(false);
    }
  };

  const handlePasswordAnalysis = async () => {
    if (!passwordInput.trim()) return;
    setPasswordLoading(true);
    try {
      const result = await analyzePassword(passwordInput);
      setPasswordResult(result);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    try {
      const result = await generateQuiz({ topic: quizTopic, difficulty: quizDifficulty, count: 3 });
      setQuizResult(result);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Quiz generation failed');
    } finally {
      setQuizLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const tools = [
    {
      id: 'threat' as ActiveTool,
      title: 'Vulnerability Scanner',
      description: 'Paste code or URLs to scan for security vulnerabilities',
      icon: <Search className="w-6 h-6" />,
      color: 'text-red-400',
      bg: 'from-red-500/10 to-orange-500/10',
      border: 'border-red-500/20',
    },
    {
      id: 'password' as ActiveTool,
      title: 'Password Analyzer',
      description: 'Evaluate password strength against real attack patterns',
      icon: <Lock className="w-6 h-6" />,
      color: 'text-green-400',
      bg: 'from-green-500/10 to-emerald-500/10',
      border: 'border-green-500/20',
    },
    {
      id: 'quiz' as ActiveTool,
      title: 'Security Quiz',
      description: 'AI-generated quizzes to test your knowledge',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'text-blue-400',
      bg: 'from-blue-500/10 to-cyan-500/10',
      border: 'border-blue-500/20',
    },
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

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">AI-Powered Tools</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI Security <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Lab</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Analyze threats, test passwords, and generate custom security quizzes — all powered by Gemini AI.
            </p>
          </div>

          {/* Settings Toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => { setActiveTool(activeTool === 'settings' ? 'none' : 'settings'); }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                isConfigured
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                  : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20'
              )}
            >
              {isConfigured ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              {isConfigured ? 'AI Connected' : 'Configure AI'}
            </button>
          </div>

          {/* Settings Panel */}
          {activeTool === 'settings' && (
            <div className="mb-8">
              <AISettingsPanel onClose={() => { setActiveTool('none'); setIsConfigured(isAIConfigured()); }} />
            </div>
          )}

          {/* Tool Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(activeTool === tool.id ? 'none' : tool.id)}
                disabled={!isConfigured}
                className={cn(
                  'glass-card p-6 rounded-xl text-left transition-all group relative overflow-hidden',
                  activeTool === tool.id ? `border ${tool.border}` : 'hover:border-primary/30',
                  !isConfigured && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className={cn('absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity', tool.bg)} />
                <div className="relative z-10">
                  <div className={cn('w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform', tool.color)}>
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* ── Threat Analyzer ──────────────────────────────── */}
          {activeTool === 'threat' && (
            <div className="glass-card p-6 rounded-xl border border-red-500/20 space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Search className="w-5 h-5 text-red-400" />
                Vulnerability Scanner
              </h3>

              {/* Type selector */}
              <div className="flex gap-2">
                {(['code', 'url', 'log', 'general'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setThreatType(t)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all',
                      threatType === t ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-muted/20 text-muted-foreground hover:bg-muted/40'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <textarea
                value={threatInput}
                onChange={(e) => setThreatInput(e.target.value)}
                placeholder="Paste code, URL, or log entry to analyze..."
                className="w-full h-40 p-4 bg-muted/30 rounded-lg border border-primary/20 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 focus:outline-none font-mono text-sm resize-none"
              />

              <div className="flex gap-3">
                <Button onClick={handleThreatAnalysis} variant="glow" disabled={threatLoading || !threatInput.trim()}>
                  {threatLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                  Analyze
                </Button>
                {threatResult && (
                  <Button variant="outline" onClick={() => copyToClipboard(threatResult.text)}>
                    <Copy className="w-4 h-4 mr-2" /> Copy Report
                  </Button>
                )}
              </div>

              {threatResult && (
                <div className="p-4 rounded-lg bg-muted/20 border border-primary/10">
                  <div className="text-xs text-muted-foreground mb-2">Analyzed by {threatResult.model}</div>
                  <div className="prose prose-invert prose-sm max-w-none [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_strong]:text-foreground"
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(threatResult.text) }}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── Password Analyzer ────────────────────────────── */}
          {activeTool === 'password' && (
            <div className="glass-card p-6 rounded-xl border border-green-500/20 space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-400" />
                Password Strength Analyzer
              </h3>

              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter a password to analyze..."
                  className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-primary/20 rounded-lg focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 focus:outline-none font-mono text-sm"
                />
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Your password is analyzed by pattern only — the actual text is never sent to the AI.
              </p>

              <Button onClick={handlePasswordAnalysis} variant="glow" disabled={passwordLoading || !passwordInput.trim()}>
                {passwordLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                Analyze Password
              </Button>

              {passwordResult && (
                <div className="p-4 rounded-lg bg-muted/20 border border-primary/10">
                  <div className="text-xs text-muted-foreground mb-2">Analyzed by {passwordResult.model}</div>
                  <div className="prose prose-invert prose-sm max-w-none [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_strong]:text-foreground"
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(passwordResult.text) }}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── Quiz Generator ────────────────────────────────── */}
          {activeTool === 'quiz' && (
            <div className="glass-card p-6 rounded-xl border border-blue-500/20 space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Security Quiz Generator
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Topic</label>
                  <select
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    className="w-full p-2.5 bg-muted/30 border border-primary/20 rounded-lg focus:border-blue-500/50 focus:outline-none text-sm"
                  >
                    <option value="XSS">Cross-Site Scripting (XSS)</option>
                    <option value="SQL Injection">SQL Injection</option>
                    <option value="Password Security">Password Security</option>
                    <option value="Cryptography">Cryptography</option>
                    <option value="Network Security">Network Security</option>
                    <option value="Blockchain Security">Blockchain Security</option>
                    <option value="Web Application Security">Web App Security</option>
                    <option value="Social Engineering">Social Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Difficulty</label>
                  <div className="flex gap-2">
                    {(['beginner', 'intermediate', 'advanced'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setQuizDifficulty(d)}
                        className={cn(
                          'flex-1 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all',
                          quizDifficulty === d
                            ? d === 'beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : d === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-muted/20 text-muted-foreground hover:bg-muted/40'
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={handleGenerateQuiz} variant="glow" disabled={quizLoading}>
                {quizLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Generate Quiz
              </Button>

              {quizResult && (
                <div className="p-4 rounded-lg bg-muted/20 border border-primary/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-muted-foreground">Generated by {quizResult.model}</div>
                    <div className="flex gap-2">
                      <button onClick={handleGenerateQuiz} className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> New Quiz
                      </button>
                      <button onClick={() => copyToClipboard(quizResult.text)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_strong]:text-foreground"
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(quizResult.text) }}
                  />
                </div>
              )}
            </div>
          )}

          {/* No tool selected info */}
          {activeTool === 'none' && isConfigured && (
            <div className="text-center py-12 text-muted-foreground">
              <Brain className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">Select a tool above to get started</p>
              <p className="text-sm">All analysis runs through Gemini AI with your API key</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/10 py-10 border-t border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain size={20} className="text-purple-400" />
            <span className="font-mono font-bold text-lg">HackOps AI Lab</span>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered security analysis. Your API key stays on your device.
          </p>
        </div>
      </footer>
    </div>
  );
};

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

export default AILab;
