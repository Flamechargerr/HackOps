
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";
import Button from "@/components/Button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-card max-w-md w-full p-8 rounded-xl text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="text-destructive" size={32} />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/">
            <Button variant="outline" className="w-full flex items-center justify-center">
              <Home size={16} className="mr-2" />
              Home
            </Button>
          </Link>
          <Link to="/terminal-game">
            <Button variant="glow" className="w-full">
              Try a Game
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            Error: Route '{location.pathname}' not found
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
