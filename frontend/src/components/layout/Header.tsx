import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Terminal,
  Lock,
  KeyRound,
  Trophy,
  Menu,
  X,
  User,
  Sparkles,
  LogOut,
  Settings,
  Code,
  Database,
  Layers,
  ChevronDown
} from "lucide-react";
import Button from "@/components/common/Button";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  const [intense, setIntense] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('intense') === 'true';
    }
    return false;
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
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle('intense', intense);
    localStorage.setItem('intense', intense ? 'true' : 'false');
  }, [intense]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const challenges = [
    { name: "Terminal", icon: <Terminal size={16} />, href: "/terminal-game", description: "Unix command line simulation" },
    { name: "Password", icon: <Lock size={16} />, href: "/password-game", description: "Password security challenge" },
    { name: "Encryption", icon: <KeyRound size={16} />, href: "/encryption", description: "Cryptography puzzles" },
    { name: "XSS", icon: <Code size={16} />, href: "/xss-game", description: "Cross-site scripting" },
    { name: "SQL Injection", icon: <Database size={16} />, href: "/sql-injection", description: "Database exploitation" },
    { name: "Blockchain", icon: <Layers size={16} />, href: "/blockchain-puzzles", description: "Smart contract security" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "py-2 bg-background/80 backdrop-blur-xl border-b border-border shadow-lg"
          : "py-4 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-glow-sm">
            <Terminal size={18} className="text-primary" />
          </div>
          <span className="font-mono text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            HackOps
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {/* Challenges Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-1 px-3 py-2 text-foreground/70 hover:text-foreground transition-colors rounded-md hover:bg-muted/20">
                <Layers size={16} className="text-primary/80" />
                <span className="font-medium">Challenges</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-background/95 backdrop-blur-xl border-primary/20" align="start">
              <DropdownMenuLabel className="text-primary">Security Challenges</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-primary/10" />
              <DropdownMenuGroup>
                {challenges.map((challenge) => (
                  <DropdownMenuItem
                    key={challenge.href}
                    className="cursor-pointer focus:bg-primary/10"
                    onClick={() => navigate(challenge.href)}
                  >
                    <div className="flex items-start gap-3 py-1">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {challenge.icon}
                      </div>
                      <div>
                        <div className="font-medium">{challenge.name}</div>
                        <div className="text-xs text-muted-foreground">{challenge.description}</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-primary/10" />
              <DropdownMenuItem
                className="cursor-pointer focus:bg-primary/10"
                onClick={() => navigate("/challenges")}
              >
                <span className="text-primary font-medium">View All Challenges →</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <NavLink to="/leaderboard" icon={<Trophy size={16} />}>Leaderboard</NavLink>
          <NavLink to="/about">About</NavLink>

          <div className="ml-4">
            <Button
              variant="glow"
              size="sm"
              onClick={() => navigate("/password-game")}
              className="font-medium"
            >
              Start Hacking
            </Button>
          </div>
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle - Desktop */}
          <div className="hidden md:flex items-center space-x-2 px-2 py-1 rounded-full bg-muted/20">
            <span className="text-xs">🌙</span>
            <Switch
              checked={theme === 'light'}
              onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')}
              aria-label="Toggle light mode"
              className="data-[state=checked]:bg-primary"
            />
            <span className="text-xs">☀️</span>
          </div>

          {/* Intense Mode Toggle */}
          <div className="hidden sm:flex items-center space-x-2 px-2 py-1 rounded-full bg-muted/20" title="Intense Mode">
            <Sparkles size={14} className="text-accent" />
            <Switch
              checked={intense}
              onCheckedChange={setIntense}
              aria-label="Toggle intense mode"
              className="data-[state=checked]:bg-accent"
            />
          </div>

          {/* User Authentication */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity p-1 rounded-full hover:bg-muted/20">
                  <Avatar className="w-8 h-8 border-2 border-primary/30">
                    <AvatarImage src={user?.profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm font-medium">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                    {user?.profile?.display_name || user?.username}
                  </span>
                  <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-xl border-primary/20" align="end">
                <div className="px-3 py-2 border-b border-primary/10">
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuGroup className="py-1">
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-primary/10"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="mr-2 h-4 w-4 text-primary" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer focus:bg-primary/10">
                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-primary/10" />
                <DropdownMenuItem
                  className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginDialog>
              <Button variant="outline" size="sm" className="text-sm">
                <User size={16} className="mr-2" />
                Login
              </Button>
            </LoginDialog>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted/20 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-border animate-fade-in shadow-xl">
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
              Challenges
            </div>
            {challenges.map((challenge) => (
              <MobileNavLink
                key={challenge.href}
                to={challenge.href}
                icon={challenge.icon}
              >
                {challenge.name}
              </MobileNavLink>
            ))}
            <div className="h-px bg-primary/10 my-2" />
            <MobileNavLink to="/leaderboard" icon={<Trophy size={18} />}>Leaderboard</MobileNavLink>
            <MobileNavLink to="/about" icon={<User size={18} />}>About</MobileNavLink>
            {isAuthenticated && (
              <MobileNavLink to="/profile" icon={<User size={18} />}>Profile</MobileNavLink>
            )}
            <div className="pt-4">
              <Button
                variant="glow"
                size="sm"
                className="w-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/password-game");
                }}
              >
                Start Hacking
              </Button>
            </div>

            {/* Mobile Theme Toggle */}
            <div className="pt-4 flex items-center justify-between px-3">
              <span className="text-sm text-muted-foreground">Dark Mode</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">🌙</span>
                <Switch
                  checked={theme === 'light'}
                  onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')}
                  aria-label="Toggle light mode"
                />
                <span className="text-sm">☀️</span>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

// Desktop Navigation Link
const NavLink = ({ to, icon, children }: { to: string; icon?: React.ReactNode; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "relative flex items-center space-x-1.5 px-3 py-2 rounded-md transition-all duration-200",
        isActive
          ? "text-primary bg-primary/10"
          : "text-foreground/70 hover:text-foreground hover:bg-muted/20"
      )}
    >
      {icon && <span className={cn("transition-colors", isActive ? "text-primary" : "text-primary/80")}>{icon}</span>}
      <span className="font-medium">{children}</span>
    </Link>
  );
};

// Mobile Navigation Link
const MobileNavLink = ({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200",
        isActive
          ? "text-primary bg-primary/10"
          : "text-foreground/70 hover:text-foreground hover:bg-muted/20"
      )}
    >
      <span className={cn("text-primary/80", isActive && "text-primary")}>{icon}</span>
      <span className="font-medium">{children}</span>
    </Link>
  );
};

export default Header;
