
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Terminal, Lock, KeyRound, ChevronRight, Code, ShieldAlert } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { cn } from "@/lib/utils";

const Index = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Hack the system.";
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  
  // Typing effect
  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.substring(0, typedText.length + 1));
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [typedText]);
  
  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Features data
  const features = [
    {
      title: "Terminal Hacking",
      description: "Interact with a simulated terminal interface. Solve puzzles, crack codes, and gain system access.",
      icon: <Terminal className="text-primary h-8 w-8" />,
      color: "from-blue-500/20 to-blue-600/20",
      link: "/terminal-game",
    },
    {
      title: "Password Cracker",
      description: "Test your skills at creating complex passwords. Each level adds more challenging requirements.",
      icon: <Lock className="text-primary h-8 w-8" />,
      color: "from-green-500/20 to-green-600/20",
      link: "/password-game",
    },
    {
      title: "Encryption Puzzles",
      description: "Encode and decode messages using various encryption methods. Race against time to decrypt secret messages.",
      icon: <KeyRound className="text-primary h-8 w-8" />,
      color: "from-purple-500/20 to-purple-600/20",
      link: "/encryption",
    },
  ];
  
  const featuredGame = features[currentFeatureIndex];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-6 animate-fade-in">
              <span className="text-xs font-medium text-primary">
                Interactive Hacking Challenges
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-fade-in">
              Master the Art of <br className="hidden md:block" />
              Ethical Hacking
            </h1>
            
            <p className="text-xl md:text-2xl font-mono mb-8 h-8">
              <span className="typing-effect">{typedText}</span>
              <span className="animate-cursor-blink">|</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in">
              <Button variant="glow" size="lg" className="px-8">
                Start Challenge
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Learn More
              </Button>
            </div>
            
            {/* Matrix-inspired animated characters - subtle background effect */}
            <div className="absolute inset-0 overflow-hidden -z-10 opacity-30 pointer-events-none">
              <div className="matrix-animation">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div 
                    key={i}
                    className="matrix-column"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDuration: `${10 + Math.random() * 20}s`,
                      animationDelay: `${Math.random() * 5}s`,
                    }}
                  >
                    {Array.from({ length: 25 }).map((_, j) => (
                      <div 
                        key={j}
                        className="matrix-character text-primary opacity-80"
                        style={{ 
                          animationDelay: `${Math.random() * 5}s`,
                          fontSize: `${Math.max(10, Math.random() * 16)}px`,
                        }}
                      >
                        {String.fromCharCode(33 + Math.floor(Math.random() * 94))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Game Section */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 max-w-2xl">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-4">
                <span className="text-xs font-medium text-primary">
                  Featured Challenge
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-4">{featuredGame.title}</h2>
              <p className="text-muted-foreground mb-6">
                {featuredGame.description}
              </p>
              <Link to={featuredGame.link}>
                <Button variant="default" size="lg" className="group">
                  Try it now
                  <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            <div className="flex-1 w-full max-w-lg">
              <div 
                className={cn(
                  "w-full aspect-video rounded-xl border border-primary/30 shadow-glow-sm overflow-hidden relative",
                  "bg-gradient-to-br", 
                  featuredGame.color
                )}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center animate-float">
                    {featuredGame.icon}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Hacking Challenges</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform offers various interactive hacking challenges designed to test and improve your cybersecurity skills.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Challenge Cards */}
            <FeatureCard 
              title="Terminal Mastery"
              description="Navigate through a Unix-like terminal, execute commands, and solve puzzles to progress."
              icon={<Terminal />}
              href="/terminal-game"
            />
            <FeatureCard 
              title="Password Cracking"
              description="Create complex passwords that meet increasingly difficult security requirements."
              icon={<Lock />}
              href="/password-game"
            />
            <FeatureCard 
              title="Encryption Challenges"
              description="Encrypt and decrypt messages using various algorithms and techniques."
              icon={<KeyRound />}
              href="/encryption"
            />
            <FeatureCard 
              title="XSS Simulator"
              description="Learn about cross-site scripting vulnerabilities in a safe, simulated environment."
              icon={<Code />}
              href="/xss-game"
            />
            <FeatureCard 
              title="SQL Injection"
              description="Practice identifying and exploiting SQL injection vulnerabilities."
              icon={<ShieldAlert />}
              href="/sql-injection"
            />
            <FeatureCard 
              title="Blockchain Puzzles"
              description="Solve cryptographic puzzles similar to those used in blockchain technology."
              icon={<KeyRound />}
              href="/blockchain-puzzles"
            />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted/10 py-10 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Terminal size={20} className="text-primary" />
              <span className="font-mono font-bold">HackerPro</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link to="/challenges" className="text-muted-foreground hover:text-foreground">
                Challenges
              </Link>
              <Link to="/leaderboard" className="text-muted-foreground hover:text-foreground">
                Leaderboard
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} HackerPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  href 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  href: string;
}) => (
  <Link to={href} className="group">
    <div className="h-full glass-card p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300 group-hover:shadow-glow-sm">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      <div className="mt-4 flex items-center text-primary">
        <span className="text-sm font-medium">Try Challenge</span>
        <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  </Link>
);

export default Index;
