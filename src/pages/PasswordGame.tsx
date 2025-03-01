
import { useEffect } from "react";
import Header from "@/components/Header";
import PasswordGame from "@/components/PasswordGame";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const PasswordGamePage = () => {
  useEffect(() => {
    // Show a welcome toast when the page loads
    toast.info("Welcome to the Password Challenge!", {
      description: "Create a password that meets all the security requirements.",
      icon: "🔐",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Back navigation */}
          <Link to="/" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Home</span>
          </Link>
          
          {/* Page title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Password Challenge</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Create a password that meets an increasing set of security requirements. 
              Each level adds a new challenge to overcome.
            </p>
          </div>
          
          {/* Game container */}
          <div className="max-w-2xl mx-auto">
            <PasswordGame />
          </div>
          
          {/* Game instructions */}
          <div className="max-w-2xl mx-auto mt-8 glass-card p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-3">How to Play</h2>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>Type a password that satisfies all the visible requirements.</li>
              <li>As you complete each level, new requirements will be added.</li>
              <li>The difficulty increases with each level.</li>
              <li>Try to complete all 8 levels to master the challenge!</li>
            </ul>
          </div>
        </div>
      </main>
      
      {/* Simple footer */}
      <footer className="py-6 bg-muted/10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Challenge yourself with more hacking games on our platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default PasswordGamePage;
