import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Code, KeyRound, Lock, ShieldAlert, Terminal } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { cn } from "@/lib/utils";
import BackgroundFX from "@/components/FX/BackgroundFX";
import SpotlightCursor from "@/components/FX/SpotlightCursor";
import TiltCard from "@/components/TiltCard";
import DailyChallengeBanner from "@/components/DailyChallengeBanner";

const Index = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Hack the system.";
  const [featureIdx, setFeatureIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (typedText.length < fullText.length) {
      const t = setTimeout(() => setTypedText(fullText.substring(0, typedText.length + 1)), 80);
      return () => clearTimeout(t);
    }
  }, [typedText]);

  useEffect(() => {
    const i = setInterval(() => setFeatureIdx((p) => (p + 1) % features.length), 5000);
    return () => clearInterval(i);
  }, []);

  const features = [
    {
      title: "Terminal Hacking",
      description: "Interact with a simulated terminal. Solve puzzles, crack codes, and gain system access.",
      icon: <Terminal className="text-primary h-8 w-8" />,
      color: "from-blue-500/20 to-blue-600/20",
      link: "/terminal-game",
    },
    {
      title: "Password Cracker",
      description: "Create complex passwords that meet increasingly difficult security rules.",
      icon: <Lock className="text-primary h-8 w-8" />,
      color: "from-green-500/20 to-green-600/20",
      link: "/password-game",
    },
    {
      title: "Encryption Puzzles",
      description: "Encode and decode messages using various methods. Race against time to decrypt secrets.",
      icon: <KeyRound className="text-primary h-8 w-8" />,
      color: "from-purple-500/20 to-purple-600/20",
      link: "/encryption",
    },
  ];

  const featured = features[featureIdx];

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundFX />
      <SpotlightCursor />
      <Header />
      <DailyChallengeBanner />

      {/* HERO */}
      <section className="relative pt-28 md:pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">Interactive Hacking Challenges</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            A Cyber Arena for Modern Hackers
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Sharpen your skills with terminal puzzles, password forensics, and real‑world web vulns — all in a stylish, safe sandbox.
          </p>
          <p className="text-2xl font-mono mt-6 h-8">
            <span className="typing-effect">{typedText}</span>
            <span className="animate-cursor-blink">|</span>
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="glow" size="lg" onClick={() => navigate("/password-game")} className="group">
              Start Challenge
              <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/challenges")}>
              Explore All Games
            </Button>
          </div>

          {/* floating hero preview */}
          <div className="relative mx-auto mt-14 w-full max-w-3xl">
            <TiltCard>
              <div className="relative w-full aspect-[16/9] rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                <div className="absolute inset-0 cyber-grid opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center animate-float">
                    {featured.icon}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/80 to-transparent text-left">
                  <div className="text-sm text-primary mb-1">Featured</div>
                  <div className="text-xl font-bold">{featured.title}</div>
                  <div className="text-sm text-muted-foreground">{featured.description}</div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Choose Your Vector</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Master realistic scenarios — from password crafting to XSS and SQL injection — with safe simulations and instant feedback.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard title="Terminal Mastery" description="Explore a Unix‑like system and escalate access." icon={<Terminal />} href="/terminal-game" />
            <FeatureCard title="Password Cracking" description="Create passwords that defeat layered defenses." icon={<Lock />} href="/password-game" />
            <FeatureCard title="Encryption Challenges" description="Decode secrets using classic and modern ciphers." icon={<KeyRound />} href="/encryption" />
            <FeatureCard title="XSS Simulator" description="Find and exploit XSS in a safe environment." icon={<Code />} href="/xss-game" />
            <FeatureCard title="SQL Injection" description="Practice exploiting SQL injection vulnerabilities." icon={<ShieldAlert />} href="/sql-injection" />
            <FeatureCard title="Blockchain Puzzles" description="Hash mining, Merkle roots, and more." icon={<KeyRound />} href="/blockchain-puzzles" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-muted/10 py-10 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Terminal size={20} className="text-primary" />
              <span className="font-mono font-bold">HackerPro</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <Link to="/challenges" className="text-muted-foreground hover:text-foreground">Challenges</Link>
              <Link to="/leaderboard" className="text-muted-foreground hover:text-foreground">Leaderboard</Link>
              <Link to="/suggestions" className="text-muted-foreground hover:text-foreground">Suggestions</Link>
            </div>
          </div>
          <div className="mt-6 text-center text-muted-foreground text-sm">&copy; {new Date().getFullYear()} HackerPro. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, description, icon, href }: { title: string; description: string; icon: React.ReactNode; href: string }) => (
  <Link to={href} className="group">
    <TiltCard>
      <div className="h-full glass-card p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300 group-hover:shadow-glow-sm">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-center text-primary">
          <span className="text-sm font-medium">Open</span>
          <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </TiltCard>
  </Link>
);

export default Index;
