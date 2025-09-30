
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Terminal, { TerminalMessage, TerminalResponse } from "@/components/Terminal";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Button from "@/components/Button";
import { Progress } from "@/components/ui/progress";
import BackgroundFX from "@/components/FX/BackgroundFX";
import SpotlightCursor from "@/components/FX/SpotlightCursor";

const maxLevel = 5;

const TerminalGamePage = () => {
  const [level, setLevel] = useState(1);
  const [hints, setHints] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);

  const initialMessages: TerminalMessage[] = [
    { id: "welcome-1", content: "Welcome to the Terminal Hacking Challenge.", type: "system" },
    { id: "welcome-2", content: "Your mission is to gain access to a secure system using terminal commands.", type: "system" },
    { id: "welcome-3", content: "Type 'help' to see available commands.", type: "system" },
  ];

  useEffect(() => {
    toast.info("Terminal Hacking Challenge", { description: "Use terminal commands to hack into the system.", icon: "💻" });
    updateHints();
  }, []);

  useEffect(() => { updateHints(); }, [level]);

  const updateHints = () => {
    switch (level) {
      case 1: setHints(["Try using 'ls' to list files.", "Use 'cat [filename]' to read files.", "Look for passwords or clues in configs."]); break;
      case 2: setHints(["Find hidden files with 'ls -la'.", "Look for encoded secrets.", "Password might be encoded or encrypted."]); break;
      case 3: setHints(["Decode base64 strings using 'decode [str]'.", "Multiple layers may exist.", "Some files might hide info."]); break;
      default: setHints(["Explore with 'ls' and 'cat'.", "Type 'help' any time."]); break;
    }
  };

  const handleCommand = async (command: string): Promise<TerminalResponse> => {
    const normalized = command.trim().toLowerCase();

    if (normalized === "help") {
      return { messages: [{ id: Date.now().toString(), content: "Available: help, ls, cat [file], cd [dir], pwd, whoami, clear, hint, decrypt [file] [pass], decode [b64]", type: "system" }] };
    }
    if (normalized === "hint") {
      const random = hints[Math.floor(Math.random() * hints.length)];
      setShowHint(true);
      return { messages: [{ id: Date.now().toString(), content: `HINT: ${random}` , type: "warning" }] };
    }

    if (level === 1) {
      if (normalized === "ls") return { messages: [{ id: Date.now().toString(), content: "config.txt\nsystem.log\nusers.db\naccess_codes.enc", type: "system" }] };
      if (normalized === "cat config.txt") return { messages: [{ id: Date.now().toString(), content: "# System Configuration\n\nADMIN_USER=administrator\nDEBUG_MODE=true\nENCRYPTION_KEY=look_in_access_codes", type: "system" }] };
      if (normalized === "cat access_codes.enc") return { messages: [{ id: Date.now().toString(), content: "File is encrypted. Use password 'debug123' to decrypt.", type: "system" }] };
      if (normalized === "decrypt access_codes.enc debug123") {
        setLevel(2);
        return { messages: [
          { id: Date.now().toString(), content: "File decrypted successfully!", type: "success" },
          { id: Date.now().toString() + "-1", content: "ACCESS_CODE=b1ue5ky\nSECONDARY_SERVER=10.0.14.88\nBACKDOOR_PORT=4422", type: "system" },
          { id: Date.now().toString() + "-2", content: "Level 1 completed! Advancing to Level 2...", type: "success" },
        ] };
      }
    }

    if (level === 2) {
      if (normalized === "ls") return { messages: [{ id: Date.now().toString(), content: "security/\nbackup/\nlog.txt\n.hidden_dir/", type: "system" }] };
      if (normalized === "ls -la" || normalized === "ls -a") return { messages: [{ id: Date.now().toString(), content: ".\n..\nsecurity/\nbackup/\nlog.txt\n.hidden_dir/\n.secret", type: "system" }] };
      if (normalized === "cat .secret") return { messages: [{ id: Date.now().toString(), content: "Base64 encoded: YWNjZXNzX2dyYW50ZWQ=", type: "system" }] };
      if (normalized === "decode ywnjmpzxzxn0x2dyaw50zwq=" || normalized === "base64 -d ywnjmpzxzxn0x2dyaw50zwq=") {
        setLevel(3);
        return { messages: [
          { id: Date.now().toString(), content: "Decoded: access_granted", type: "success" },
          { id: Date.now().toString() + "-1", content: "Level 2 completed! Accessing admin panel...", type: "success" },
        ] };
      }
    }

    return { messages: [{ id: Date.now().toString(), content: `Command not recognized: ${command}. Type 'help' for available commands.`, type: "error" }] };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundFX />
      <SpotlightCursor />
      <Header />

      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <Link to="/" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Home</span>
          </Link>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Terminal Hacking Challenge</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">Use terminal commands to hack into a secure system. Explore files, decrypt secrets, and find the access codes.</p>
          </div>

          <div className="flex items-center justify-between max-w-3xl mx-auto mb-6">
            <div className="flex-1 mr-4">
              <Progress value={(level / maxLevel) * 100} />
              <span className="text-xs text-muted-foreground">Level {level} / {maxLevel}</span>
            </div>
            <Button type="button" variant="outline" size="sm" className="ml-4" onClick={() => setShowHint(v => !v)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </Button>
          </div>

          {showHint && (
            <div className="max-w-3xl mx-auto mb-6 glass-card p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5 animate-fade-in">
              <h3 className="font-medium mb-2 text-yellow-400">Hint:</h3>
              <ul className="list-disc pl-5 text-muted-foreground">{hints.map((h, i) => (<li key={i}>{h}</li>))}</ul>
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            <Terminal initialMessages={initialMessages} onCommand={handleCommand} title={`Secure System - Level ${level}`} />
          </div>
        </div>
      </main>

      <footer className="py-6 bg-muted/10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Challenge yourself with more hacking games on our platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default TerminalGamePage;
