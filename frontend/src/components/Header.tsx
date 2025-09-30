
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Terminal, Lock, KeyRound, Trophy, Menu, X, User, Sparkles, LogOut, Settings } from "lucide-react";
import Button from "./Button";
import { LoginDialog } from "./auth/LoginDialog";
import { Switch } from "./ui/switch";
import { useAuth } from "../contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
          <NavLink to="/terminal-game" icon={<Terminal size={16} />}>Terminal</NavLink>
          <NavLink to="/password-game" icon={<Lock size={16} />}>Password Crack</NavLink>
          <NavLink to="/encryption" icon={<KeyRound size={16} />}>Encryption</NavLink>
          <NavLink to="/leaderboard" icon={<Trophy size={16} />}>Leaderboard</NavLink>
          <NavLink to="/suggestions" icon={<Sparkles size={16} />}>Suggestions</NavLink>
          <Button variant="glow" size="sm" onClick={() => navigate("/password-game")}>Start Hacking</Button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* User Profile & Toggles */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-xs font-mono text-muted-foreground">🌙</span>
            <Switch
              checked={theme === 'light'}
              onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')}
              aria-label="Toggle light mode"
            />
            <span className="text-xs font-mono text-muted-foreground">☀️</span>
          </div>
          
          {/* Intense Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Sparkles size={16} className="text-accent" />
            <Switch
              checked={intense}
              onCheckedChange={setIntense}
              aria-label="Toggle fun/intense mode"
            />
          </div>

          {/* User Authentication */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-primary font-medium text-sm max-w-[100px] truncate">
                    {user?.profile?.display_name || user?.username}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-white">{user?.username}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem 
                  className="text-slate-200 hover:bg-slate-700 cursor-pointer"
                  onClick={() => navigate('/profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-200 hover:bg-slate-700 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem 
                  className="text-red-400 hover:bg-red-900/20 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginDialog>
              <Button variant="glow" size="sm" className="text-sm">
                <User size={16} className="mr-2" />
                Login
              </Button>
            </LoginDialog>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <MobileNavLink to="/terminal-game" icon={<Terminal size={18} />}>Terminal</MobileNavLink>
            <MobileNavLink to="/password-game" icon={<Lock size={18} />}>Password Crack</MobileNavLink>
            <MobileNavLink to="/encryption" icon={<KeyRound size={18} />}>Encryption</MobileNavLink>
            <MobileNavLink to="/leaderboard" icon={<Trophy size={18} />}>Leaderboard</MobileNavLink>
            <MobileNavLink to="/suggestions" icon={<Sparkles size={18} />}>Suggestions</MobileNavLink>
            {isAuthenticated && (
              <MobileNavLink to="/profile" icon={<User size={18} />}>Profile</MobileNavLink>
            )}
            <Button 
              variant="glow" 
              size="sm" 
              className="w-full mt-4" 
              onClick={() => { 
                setIsMobileMenuOpen(false); 
                navigate("/password-game"); 
              }}
            >
              Start Hacking
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
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
