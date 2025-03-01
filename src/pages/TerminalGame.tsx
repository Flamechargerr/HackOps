
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Terminal, { TerminalMessage, TerminalResponse } from "@/components/Terminal";
import { ArrowLeft, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Button from "@/components/Button";

const TerminalGamePage = () => {
  const [level, setLevel] = useState(1);
  const [hints, setHints] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  
  // Initial terminal messages
  const initialMessages: TerminalMessage[] = [
    {
      id: "welcome-1",
      content: "Welcome to the Terminal Hacking Challenge.",
      type: "system",
    },
    {
      id: "welcome-2",
      content: "Your mission is to gain access to a secure system using terminal commands.",
      type: "system",
    },
    {
      id: "welcome-3",
      content: "Type 'help' to see available commands.",
      type: "system",
    },
  ];
  
  // Show welcome toast when page loads
  useEffect(() => {
    toast.info("Terminal Hacking Challenge", {
      description: "Use terminal commands to hack into the system.",
      icon: "💻",
    });
    
    // Set hints based on current level
    updateHints();
  }, []);
  
  // Update hints when level changes
  useEffect(() => {
    updateHints();
  }, [level]);
  
  // Update the available hints based on current level
  const updateHints = () => {
    switch (level) {
      case 1:
        setHints([
          "Try using basic Linux commands like 'ls' to list files.",
          "Use 'cat [filename]' to read file contents.",
          "Look for passwords or clues in configuration files.",
        ]);
        break;
      case 2:
        setHints([
          "You might need to find hidden files. Try 'ls -la'.",
          "Look for clues about the encryption used.",
          "The password might be encoded or encrypted.",
        ]);
        break;
      case 3:
        setHints([
          "You'll need to decode a base64 string. Try 'decode [string]'.",
          "Multiple layers of encryption might be used.",
          "Some files might have hidden information.",
        ]);
        break;
      default:
        setHints([
          "Try using basic Linux commands like 'ls' to list files.",
          "Use 'cat [filename]' to read file contents.",
        ]);
    }
  };
  
  // Handle terminal commands
  const handleCommand = async (command: string): Promise<TerminalResponse> => {
    // Normalize command (trim and lowercase)
    const normalizedCommand = command.trim().toLowerCase();
    
    // Basic command processing
    if (normalizedCommand === "help") {
      return {
        messages: [
          {
            id: Date.now().toString(),
            content: "Available commands:\n- help: Show this help message\n- ls: List files\n- cat [filename]: Read file contents\n- cd [directory]: Change directory\n- pwd: Show current directory\n- whoami: Show current user\n- clear: Clear terminal\n- hint: Show a hint for the current level",
            type: "system",
          },
        ],
      };
    }
    
    if (normalizedCommand === "hint") {
      setShowHint(true);
      const randomHint = hints[Math.floor(Math.random() * hints.length)];
      return {
        messages: [
          {
            id: Date.now().toString(),
            content: `HINT: ${randomHint}`,
            type: "warning",
          },
        ],
      };
    }
    
    // Level-specific command handling
    if (level === 1) {
      if (normalizedCommand === "ls") {
        return {
          messages: [
            {
              id: Date.now().toString(),
              content: "config.txt\nsystem.log\nusers.db\naccess_codes.enc",
              type: "system",
            },
          ],
        };
      }
      
      if (normalizedCommand === "cat config.txt") {
        return {
          messages: [
            {
              id: Date.now().toString(),
              content: "# System Configuration\n\nADMIN_USER=administrator\nDEBUG_MODE=true\nENCRYPTION_KEY=look_in_access_codes",
              type: "system",
            },
          ],
        };
      }
      
      if (normalizedCommand === "cat access_codes.enc") {
        return {
          messages: [
            {
              id: Date.now().toString(),
              content: "File is encrypted. Use password 'debug123' to decrypt.",
              type: "system",
            },
          ],
        };
      }
      
      if (normalizedCommand === "decrypt access_codes.enc debug123") {
        setLevel(2);
        return {
          messages: [
            {
              id: Date.now().toString(),
              content: "File decrypted successfully!",
              type: "success",
            },
            {
              id: Date.now().toString() + "-1",
              content: "ACCESS_CODE=b1ue5ky\nSECONDARY_SERVER=10.0.14.88\nBACKDOOR_PORT=4422",
              type: "system",
            },
            {
              id: Date.now().toString() + "-2",
              content: "Level 1 completed! Advancing to Level 2...",
              type: "success",
            },
            {
              id: Date.now().toString() + "-3",
              content: "The system environment has changed. Type 'ls' to explore the new filesystem.",
              type: "system",
            },
          ],
        };
      }
    }
    
    if (level === 2) {
      if (normalizedCommand === "ls") {
        return {
          messages: [
            {
              id: Date.now().toString(),
              content: "security/\nbackup/\nlog.txt\n.hidden_dir/",
              type: "system",
            },
          ],
        };
      }
      
      if (normalizedCommand === "cd security" || normalizedCommand === "cd security/") {
        return {
          messages: [
            {
              id: Date.now().toString(),
              content: "Changed directory to /security",
              type: "system",
            },
          ],
        };
      }
      
      if (normalizedCommand === "ls -la" || normalizedCommand === "ls -a") {
        return {
          messages: [
            {
              id: Date.now().toString(),
              content: ".\n..\nsecurity/\nbackup/\nlog.txt\n.hidden_dir/\n.secret",
              type: "system",
            },
          ],
        };
      }
      
      if (normalizedCommand === "cat .secret") {
        return {
          messages: [
            {
              id: Date.now().toString(),
              content: "Base64 encoded access key: YWNjZXNzX2dyYW50ZWQ=",
              type: "system",
            },
          ],
        };
      }
      
      if (normalizedCommand === "decode YWNjZXNzX2dyYW50ZWQ=" || normalizedCommand === "base64 -d YWNjZXNzX2dyYW50ZWQ=") {
        setLevel(3);
        return {
          messages: [
            {
              id: Date.now().toString(),
              content: "Decoded: access_granted",
              type: "success",
            },
            {
              id: Date.now().toString() + "-1",
              content: "Level 2 completed! Accessing admin panel...",
              type: "success",
            },
            {
              id: Date.now().toString() + "-2",
              content: "You've successfully hacked into the system!",
              type: "success",
            },
          ],
        };
      }
    }
    
    // Default response for unknown commands
    return {
      messages: [
        {
          id: Date.now().toString(),
          content: `Command not recognized: ${command}. Type 'help' for available commands.`,
          type: "error",
        },
      ],
    };
  };

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
            <h1 className="text-3xl font-bold mb-2">Terminal Hacking Challenge</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Use terminal commands to hack into a secure system. Explore files, decrypt secrets, and find the access codes.
            </p>
          </div>
          
          {/* Level indicator */}
          <div className="flex justify-between items-center max-w-3xl mx-auto mb-6">
            <div className="glass-card px-4 py-2 rounded-lg">
              <span className="font-mono">Level: {level}/3</span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowHint(!showHint)}
              className="flex items-center"
            >
              <Info size={16} className="mr-2" />
              {showHint ? "Hide Hint" : "Show Hint"}
            </Button>
          </div>
          
          {/* Hint section */}
          {showHint && (
            <div className="max-w-3xl mx-auto mb-6 glass-card p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5 animate-fade-in">
              <h3 className="font-medium mb-2 text-yellow-400">Hint:</h3>
              <p className="text-muted-foreground">{hints[0]}</p>
            </div>
          )}
          
          {/* Terminal */}
          <div className="max-w-3xl mx-auto">
            <Terminal 
              initialMessages={initialMessages}
              onCommand={handleCommand}
              title={`Secure System - Level ${level}`}
            />
          </div>
          
          {/* Game instructions */}
          <div className="max-w-3xl mx-auto mt-8 glass-card p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-3">How to Play</h2>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>Use terminal commands to interact with the system.</li>
              <li>Type 'help' to see available commands.</li>
              <li>Explore files, find passwords, and decrypt secrets.</li>
              <li>Use 'hint' if you get stuck.</li>
              <li>Complete all 3 levels to master the challenge!</li>
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

export default TerminalGamePage;
