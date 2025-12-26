import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Button from "@/components/common/Button";
import TiltCard from "@/components/common/TiltCard";
import BackgroundFX from "@/components/FX/BackgroundFX";
import SpotlightCursor from "@/components/FX/SpotlightCursor";
import { cn } from "@/lib/utils";
import {
  Terminal,
  Lock,
  KeyRound,
  Code,
  Database,
  Layers,
  Users,
  Trophy,
  Zap,
  Target,
  BookOpen,
  Shield,
  Globe,
  Award,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  Play,
  ArrowRight,
  Sparkles,
  CheckCircle
} from "lucide-react";

// Animated cyber grid background component
const CyberGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 cyber-grid opacity-20" />
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
  </div>
);

// Floating icons animation
const FloatingIcons = () => {
  const icons = [
    { Icon: Shield, delay: 0, x: 10, y: 20 },
    { Icon: Lock, delay: 0.5, x: 85, y: 15 },
    { Icon: Code, delay: 1, x: 15, y: 70 },
    { Icon: Database, delay: 1.5, x: 80, y: 75 },
    { Icon: Terminal, delay: 2, x: 50, y: 10 },
    { Icon: KeyRound, delay: 2.5, x: 90, y: 50 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, delay, x, y }, i) => (
        <div
          key={i}
          className="absolute w-8 h-8 text-primary/20 animate-float"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${4 + i * 0.5}s`
          }}
        >
          <Icon className="w-full h-full" />
        </div>
      ))}
    </div>
  );
};

// Animated terminal preview
const TerminalPreview = () => {
  const [displayLines, setDisplayLines] = useState<{ id: string; text: string }[]>([]);

  const terminalLines = [
    "$ whoami",
    "hacker",
    "$ ls -la /secrets",
    "drwxr-xr-x  access_codes.enc",
    "-rw-r--r--  passwords.db",
    "$ cat passwords.db",
    "Decrypting...",
    "✓ Access granted!"
  ];

  useEffect(() => {
    let currentLine = 0;
    let cycle = 0;

    const interval = setInterval(() => {
      if (currentLine < terminalLines.length) {
        const newLine = { id: `${cycle}-${currentLine}-${Date.now()}`, text: terminalLines[currentLine] };
        setDisplayLines(prev => [...prev, newLine]);
        currentLine++;
      } else {
        setDisplayLines([]);
        currentLine = 0;
        cycle++;
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-4 rounded-xl font-mono text-xs sm:text-sm max-w-md mx-auto border border-primary/30 shadow-glow-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-primary/20">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-muted-foreground text-xs ml-2">hackops@terminal</span>
      </div>
      <div className="h-32 overflow-hidden">
        {displayLines.map((line) => (
          <div
            key={line.id}
            className={cn(
              "animate-fade-in",
              line.text.startsWith("$") ? "text-primary" :
                line.text.startsWith("✓") ? "text-green-400" :
                  "text-muted-foreground"
            )}
          >
            {line.text}
          </div>
        ))}
        <span className="inline-block w-2 h-4 bg-primary animate-cursor-blink" />
      </div>
    </div>
  );
};


// Stats counter animation
const AnimatedCounter = ({ target, label, icon: Icon }: { target: string; label: string; icon: React.ElementType }) => {
  const [count, setCount] = useState(0);
  const numericTarget = parseInt(target.replace(/\D/g, '')) || 0;

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = numericTarget / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [numericTarget]);

  return (
    <div className="glass-card p-4 sm:p-6 rounded-xl text-center group hover:border-primary/30 transition-all">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
      </div>
      <div className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
        {count}{target.includes('+') ? '+' : ''}{target.includes('K') ? 'K' : ''}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

// Feature card with icon and gradient
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  gradient: string;
  badge?: string;
}

const FeatureCard = ({ icon, title, description, href, gradient, badge }: FeatureCardProps) => {
  const navigate = useNavigate();

  return (
    <TiltCard>
      <div
        className="glass-card p-6 rounded-xl h-full flex flex-col cursor-pointer group relative overflow-hidden hover:border-primary/30 transition-all duration-300"
        onClick={() => navigate(href)}
      >
        {/* Gradient overlay on hover */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          `bg-gradient-to-br ${gradient}`
        )} />

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent/20 text-accent border border-accent/30">
              {badge}
            </span>
          </div>
        )}

        <div className="relative z-10">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-muted-foreground text-sm flex-1">{description}</p>
          <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Start Challenge</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// Learning track card
interface LearningTrackProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  challenges: number;
  duration: string;
  level: string;
  color: string;
}

const LearningTrack = ({ icon, title, description, challenges, duration, level, color }: LearningTrackProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="glass-card p-6 rounded-xl cursor-pointer group hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
      onClick={() => navigate('/challenges')}
    >
      <div className={cn("absolute top-0 left-0 w-1 h-full", color)} />
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform",
          color.replace('bg-', 'bg-opacity-20 bg-')
        )}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {challenges} challenges
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {duration}
            </span>
            <span className={cn(
              "px-2 py-0.5 rounded-full border",
              level === "Beginner" && "text-green-400 bg-green-400/10 border-green-400/30",
              level === "Intermediate" && "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
              level === "Advanced" && "text-red-400 bg-red-400/10 border-red-400/30"
            )}>
              {level}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
      </div>
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const fullText = "Master Cybersecurity. One Challenge at a Time.";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Terminal className="w-7 h-7 text-blue-400" />,
      title: "Terminal Hacking",
      description: "Navigate Unix-like systems, decrypt files, and escalate privileges in this realistic command-line simulation.",
      href: "/terminal-game",
      gradient: "from-blue-500/5 to-cyan-500/5",
      badge: "Popular"
    },
    {
      icon: <Lock className="w-7 h-7 text-green-400" />,
      title: "Password Security",
      description: "Create passwords that defeat layered security requirements. Learn what makes a password truly secure.",
      href: "/password-game",
      gradient: "from-green-500/5 to-emerald-500/5"
    },
    {
      icon: <KeyRound className="w-7 h-7 text-purple-400" />,
      title: "Encryption Lab",
      description: "Decode messages encrypted with Caesar ciphers, Base64, ROT13, and hexadecimal encoding.",
      href: "/encryption",
      gradient: "from-purple-500/5 to-pink-500/5"
    },
    {
      icon: <Code className="w-7 h-7 text-orange-400" />,
      title: "XSS Playground",
      description: "Discover and exploit cross-site scripting vulnerabilities in a safe sandbox environment.",
      href: "/xss-game",
      gradient: "from-orange-500/5 to-red-500/5",
      badge: "New"
    },
    {
      icon: <Database className="w-7 h-7 text-yellow-400" />,
      title: "SQL Injection",
      description: "Learn database exploitation techniques and understand how attackers extract sensitive data.",
      href: "/sql-injection",
      gradient: "from-yellow-500/5 to-orange-500/5"
    },
    {
      icon: <Layers className="w-7 h-7 text-indigo-400" />,
      title: "Blockchain Puzzles",
      description: "Explore hash mining, Merkle trees, and transaction validation in this blockchain security challenge.",
      href: "/blockchain-puzzles",
      gradient: "from-indigo-500/5 to-purple-500/5",
      badge: "Advanced"
    },
  ];

  const learningTracks = [
    {
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      title: "Security Fundamentals",
      description: "Start your journey with password security, basic cryptography, and terminal navigation.",
      challenges: 8,
      duration: "2-3 hours",
      level: "Beginner",
      color: "bg-blue-500"
    },
    {
      icon: <Globe className="w-6 h-6 text-orange-400" />,
      title: "Web Security Mastery",
      description: "Deep dive into XSS vulnerabilities, SQL injection, and web application security.",
      challenges: 10,
      duration: "4-5 hours",
      level: "Intermediate",
      color: "bg-orange-500"
    },
    {
      icon: <Layers className="w-6 h-6 text-purple-400" />,
      title: "Advanced Operations",
      description: "Master blockchain security, advanced cryptography, and complex attack vectors.",
      challenges: 7,
      duration: "5-6 hours",
      level: "Advanced",
      color: "bg-purple-500"
    }
  ];

  const whyHackOps = [
    { icon: <Shield className="w-6 h-6" />, title: "100% Safe", description: "Practice in a sandbox with no real-world consequences" },
    { icon: <Target className="w-6 h-6" />, title: "Real Techniques", description: "Learn methods used by security professionals" },
    { icon: <BookOpen className="w-6 h-6" />, title: "Guided Learning", description: "Hints and explanations for every challenge" },
    { icon: <Trophy className="w-6 h-6" />, title: "Track Progress", description: "Earn badges and climb the leaderboard" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundFX />
      <SpotlightCursor />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center py-24 px-4 overflow-hidden">
          <CyberGrid />
          <FloatingIcons />

          <div className="container mx-auto text-center relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Open Source Cybersecurity Training</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block mb-2">Learn to</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-[length:200%_auto]">
                Think Like a Hacker
              </span>
            </h1>

            {/* Typed Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto font-mono h-8">
              {typedText}<span className="inline-block w-0.5 h-5 bg-primary animate-cursor-blink ml-1" />
            </p>

            {/* Terminal Preview */}
            <div className="mb-10">
              <TerminalPreview />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="glow"
                size="lg"
                onClick={() => navigate("/challenges")}
                className="text-lg px-8 group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Hacking
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/about")}
                className="text-lg px-8"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>100% free & open source</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Safe sandbox environment</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <AnimatedCounter target="25+" label="Interactive Challenges" icon={Target} />
              <AnimatedCounter target="6" label="Security Categories" icon={Layers} />
              <AnimatedCounter target="1K+" label="Monthly Users" icon={Users} />
              <AnimatedCounter target="15" label="Badges to Earn" icon={Award} />
            </div>
          </div>
        </section>

        {/* Learning Tracks Section */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Structured <span className="text-primary">Learning Paths</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Follow our curated tracks to systematically build your cybersecurity skills from beginner to advanced.
              </p>
            </div>
            <div className="grid gap-4">
              {learningTracks.map((track) => (
                <LearningTrack key={track.title} {...track} />
              ))}
            </div>
          </div>
        </section>

        {/* Challenge Categories */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Challenge <span className="text-primary">Categories</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Dive into six diverse security domains, each designed to teach practical skills through hands-on practice.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/challenges")}
                className="group"
              >
                View All Challenges
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>

        {/* Why HackOps */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-5xl">
            <div className="glass-card p-8 md:p-12 rounded-2xl border border-primary/20">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Why <span className="text-primary">HackOps</span>?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Built by security enthusiasts for the next generation of cybersecurity professionals.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyHackOps.map((item) => (
                  <div key={item.title} className="text-center group">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      {item.icon}
                    </div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 relative">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="glass-card p-10 md:p-14 rounded-2xl border border-primary/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              <div className="relative z-10">
                <Zap className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start?</h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                  Jump into your first challenge and begin building real-world cybersecurity skills today.
                </p>
                <Button
                  variant="glow"
                  size="lg"
                  onClick={() => navigate("/password-game")}
                  className="text-lg px-10 group"
                >
                  <Terminal className="w-5 h-5 mr-2" />
                  Begin Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/10 py-12 border-t border-primary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                  <Terminal size={20} className="text-primary" />
                </div>
                <span className="font-mono text-xl font-bold">HackOps</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-md">
                An open-source cybersecurity learning platform. Practice real security techniques in a safe, gamified environment. Master skills that matter.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Challenges</h4>
              <ul className="space-y-2 text-sm">
                {features.slice(0, 4).map(f => (
                  <li key={f.href}>
                    <a
                      href={f.href}
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                    >
                      {f.icon}
                      {f.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
                <li><a href="/leaderboard" className="text-muted-foreground hover:text-primary transition-colors">Leaderboard</a></li>
                <li><a href="https://github.com/Flamechargerr/HackOps" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">GitHub</a></li>
                <li><a href="https://github.com/Flamechargerr/HackOps#contributing" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Contribute</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} HackOps. Open source under MIT License.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="https://github.com/Flamechargerr/HackOps" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Star className="w-4 h-4 inline mr-1" />
                Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
