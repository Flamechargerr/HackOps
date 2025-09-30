
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Terminal, Lock, KeyRound, Trophy, Menu, X, User } from "lucide-react";
import Button from "./Button";
import ProfileModal from "./ProfileModal";
import { Switch } from "./ui/switch";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<{nickname: string, avatar: string} | null>(null);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    }
    return 'dark';
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("hackops-profile");
    if (saved) setProfile(JSON.parse(saved));
  }, [showProfile]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "py-2 bg-background/80 backdrop-blur-lg border-b border-border"
          : "py-4 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-md bg-primary/20 border border-primary/30 group-hover:border-primary/50 transition-colors">
            <Terminal size={18} className="text-primary animate-pulse-subtle" />
          </div>
          <span className="font-mono text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            HackerPro
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/terminal-game" icon={<Terminal size={16} />}>
            Terminal
          </NavLink>
          <NavLink to="/password-game" icon={<Lock size={16} />}>
            Password Crack
          </NavLink>
          <NavLink to="/encryption" icon={<KeyRound size={16} />}>
            Encryption
          </NavLink>
          <NavLink to="/leaderboard" icon={<Trophy size={16} />}>
            Leaderboard
          </NavLink>
          <Button variant="glow" size="sm" onClick={() => navigate("/password-game")}>
            Start Hacking
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Dark/Light Mode Toggle */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-muted-foreground">🌙</span>
            <Switch
              checked={theme === 'light'}
              onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')}
              aria-label="Toggle light mode"
            />
            <span className="text-xs font-mono text-muted-foreground">☀️</span>
          </div>
          <button
            type="button"
            className="rounded-full bg-primary/10 p-2 hover:bg-primary/20 transition-colors flex items-center space-x-2"
            onClick={() => setShowProfile(true)}
            aria-label="Open Profile"
          >
            {profile?.avatar ? (
              <span className="text-2xl leading-none">{profile.avatar}</span>
            ) : (
              <User size={20} className="text-primary" />
            )}
            {profile?.nickname && (
              <span className="ml-2 text-primary font-bold text-sm max-w-[100px] truncate">{profile.nickname}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <MobileNavLink to="/terminal-game" icon={<Terminal size={18} />}>
              Terminal
            </MobileNavLink>
            <MobileNavLink to="/password-game" icon={<Lock size={18} />}>
              Password Crack
            </MobileNavLink>
            <MobileNavLink to="/encryption" icon={<KeyRound size={18} />}>
              Encryption
            </MobileNavLink>
            <MobileNavLink to="/leaderboard" icon={<Trophy size={18} />}>
              Leaderboard
            </MobileNavLink>
            <Button variant="glow" size="sm" className="w-full mt-4" onClick={() => { setIsMobileMenuOpen(false); navigate("/password-game"); }}>
              Start Hacking
            </Button>
          </nav>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <ProfileModal onClose={() => setShowProfile(false)} />
        </div>
      )}
    </header>
  );
};

// Desktop Navigation Link
const NavLink = ({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <Link
    to={to}
    className="relative flex items-center space-x-1 text-foreground/70 hover:text-foreground group"
  >
    <span className="text-primary/80 group-hover:text-primary">{icon}</span>
    <span>{children}</span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

// Mobile Navigation Link
const MobileNavLink = ({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <Link
    to={to}
    className="flex items-center space-x-3 p-3 rounded-md text-foreground/70 hover:text-foreground hover:bg-muted/20"
  >
    <span className="text-primary/80">{icon}</span>
    <span>{children}</span>
  </Link>
);

export default Header;
