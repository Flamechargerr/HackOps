import { useState, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import Terminal, { TerminalMessage, TerminalResponse } from "@/components/common/Terminal";
import { ArrowLeft, Terminal as TerminalIcon, Lightbulb, Target, Zap, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import { Progress } from "@/components/ui/progress";
import BackgroundFX from "@/components/FX/BackgroundFX";
import SpotlightCursor from "@/components/FX/SpotlightCursor";
import { cn } from "@/lib/utils";
import { useGame } from "@/contexts/GameContext";
import { AISecurityAdvisor } from "@/components/ai/AISecurityAdvisor";

const maxLevel = 5;

const levelDescriptions = [
  "Navigate the filesystem and decrypt the access codes",
  "Find hidden files and decode Base64 secrets",
  "Access the admin panel with decoded credentials",
  "Escalate privileges and find the master key",
  "Gain root access to the system"
];

const TerminalGamePage = () => {
  const { completeChallenge } = useGame();
  const [level, setLevel] = useState(1);
  const [hints, setHints] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [commandsUsed, setCommandsUsed] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const startTimeRef = useRef(Date.now());

  const initialMessages: TerminalMessage[] = [
    { id: "welcome-1", content: "╔══════════════════════════════════════════════════════════╗", type: "system" },
    { id: "welcome-2", content: "║       HACKOPS TERMINAL - SECURE SYSTEM v2.0              ║", type: "system" },
    { id: "welcome-3", content: "║       Your mission: Gain access to the secure system      ║", type: "system" },
    { id: "welcome-4", content: "╚══════════════════════════════════════════════════════════╝", type: "system" },
    { id: "welcome-5", content: "", type: "system" },
    { id: "welcome-6", content: "Type 'help' to see available commands.", type: "success" },
    { id: "welcome-7", content: "Type 'hint' if you need assistance.", type: "warning" },
  ];

  useEffect(() => {
    toast.info("Terminal Hacking Challenge", {
      description: "Use terminal commands to hack into the system.",
      icon: "💻"
    });
    updateHints();
  }, []);

  useEffect(() => {
    updateHints();
  }, [level]);

  const updateHints = () => {
    switch (level) {
      case 1:
        setHints([
          "Use 'ls' to list files in the current directory",
          "Use 'cat [filename]' to read file contents",
          "Look for configuration files that might contain passwords"
        ]);
        break;
      case 2:
        setHints([
          "Hidden files start with a dot (.)",
          "Try 'ls -la' to see all files including hidden ones",
          "The .secret file might contain encoded information"
        ]);
        break;
      case 3:
        setHints([
          "Use 'decode [string]' to decode Base64",
          "The decoded text is your access key",
          "Some systems use layered encoding"
        ]);
        break;
      case 4:
        setHints([
          "Check for privilege escalation opportunities",
          "Look for SUID binaries or sudo permissions",
          "Configuration files often contain sensitive data"
        ]);
        break;
      case 5:
        setHints([
          "You're almost at root access",
          "Previous credentials might work at higher levels",
          "Check for backup files and logs"
        ]);
        break;
      default:
        setHints(["Explore with 'ls' and 'cat'.", "Type 'help' any time."]);
        break;
    }
  };

  const handleCommand = async (command: string): Promise<TerminalResponse> => {
    setCommandsUsed(prev => prev + 1);
    const normalized = command.trim().toLowerCase();

    if (normalized === "help") {
      return {
        messages: [
          { id: `help-${Date.now()}`, content: "╔═══════════════════════════════════════╗", type: "system" },
          { id: `help-${Date.now()}-1`, content: "║         AVAILABLE COMMANDS            ║", type: "system" },
          { id: `help-${Date.now()}-2`, content: "╠═══════════════════════════════════════╣", type: "system" },
          { id: `help-${Date.now()}-3`, content: "║  help     - Show this help message    ║", type: "system" },
          { id: `help-${Date.now()}-4`, content: "║  ls       - List files                ║", type: "system" },
          { id: `help-${Date.now()}-5`, content: "║  ls -la   - List all files (hidden)   ║", type: "system" },
          { id: `help-${Date.now()}-6`, content: "║  cat      - Read file content         ║", type: "system" },
          { id: `help-${Date.now()}-7`, content: "║  cd       - Change directory          ║", type: "system" },
          { id: `help-${Date.now()}-8`, content: "║  pwd      - Print working directory   ║", type: "system" },
          { id: `help-${Date.now()}-9`, content: "║  whoami   - Show current user         ║", type: "system" },
          { id: `help-${Date.now()}-10`, content: "║  decode   - Decode Base64 string      ║", type: "system" },
          { id: `help-${Date.now()}-11`, content: "║  decrypt  - Decrypt file with pass    ║", type: "system" },
          { id: `help-${Date.now()}-12`, content: "║  clear    - Clear terminal            ║", type: "system" },
          { id: `help-${Date.now()}-13`, content: "║  hint     - Get a helpful hint        ║", type: "system" },
          { id: `help-${Date.now()}-14`, content: "╚═══════════════════════════════════════╝", type: "system" },
        ]
      };
    }

    if (normalized === "hint") {
      const random = hints[Math.floor(Math.random() * hints.length)];
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
      return {
        messages: [
          { id: `hint-${Date.now()}`, content: `💡 HINT: ${random}`, type: "warning" }
        ]
      };
    }

    if (normalized === "whoami") {
      const users = ["guest", "user", "operator", "admin", "root"];
      return {
        messages: [
          { id: `whoami-${Date.now()}`, content: users[Math.min(level - 1, users.length - 1)], type: "system" }
        ]
      };
    }

    if (normalized === "pwd") {
      const paths = ["/home/guest", "/home/user", "/var/admin", "/root", "/"];
      return {
        messages: [
          { id: `pwd-${Date.now()}`, content: paths[Math.min(level - 1, paths.length - 1)], type: "system" }
        ]
      };
    }

    if (level === 1) {
      if (normalized === "ls") {
        return { messages: [{ id: `ls-${Date.now()}`, content: "config.txt\nsystem.log\nusers.db\naccess_codes.enc", type: "system" }] };
      }
      if (normalized === "cat config.txt") {
        return { messages: [{ id: `cat-${Date.now()}`, content: "# System Configuration\n\nADMIN_USER=administrator\nDEBUG_MODE=true\nENCRYPTION_KEY=look_in_access_codes\nPASSWORD_HINT=debug123", type: "system" }] };
      }
      if (normalized === "cat access_codes.enc") {
        return { messages: [{ id: `cat2-${Date.now()}`, content: "⚠ File is encrypted. Use 'decrypt [filename] [password]' to decrypt.", type: "warning" }] };
      }
      if (normalized === "cat system.log") {
        return { messages: [{ id: `log-${Date.now()}`, content: "[INFO] System started\n[WARN] Debug mode enabled - password: debug123\n[INFO] Encryption enabled", type: "system" }] };
      }
      if (normalized === "decrypt access_codes.enc debug123") {
        handleLevelComplete(1);
        return {
          messages: [
            { id: `dec-${Date.now()}`, content: "✓ File decrypted successfully!", type: "success" },
            { id: `dec-${Date.now()}-1`, content: "ACCESS_CODE=b1ue5ky\nSECONDARY_SERVER=10.0.14.88\nBACKDOOR_PORT=4422", type: "system" },
            { id: `dec-${Date.now()}-2`, content: "🎉 Level 1 completed! Advancing to Level 2...", type: "success" },
          ]
        };
      }
    }

    if (level === 2) {
      if (normalized === "ls") {
        return { messages: [{ id: `ls2-${Date.now()}`, content: "security/\nbackup/\nlog.txt\n.hidden_dir/", type: "system" }] };
      }
      if (normalized === "ls -la" || normalized === "ls -a") {
        return { messages: [{ id: `lsa-${Date.now()}`, content: ".\n..\nsecurity/\nbackup/\nlog.txt\n.hidden_dir/\n.secret", type: "system" }] };
      }
      if (normalized === "cat .secret") {
        return { messages: [{ id: `sec-${Date.now()}`, content: "🔐 Encoded data: YWNjZXNzX2dyYW50ZWQ=\n\nHint: This looks like Base64 encoding...", type: "system" }] };
      }
      if (normalized.startsWith("decode ") && normalized.includes("ywnjzxnzx2dyyw50zwq=")) {
        handleLevelComplete(2);
        return {
          messages: [
            { id: `deco-${Date.now()}`, content: "✓ Decoded: access_granted", type: "success" },
            { id: `deco-${Date.now()}-1`, content: "🎉 Level 2 completed! Accessing admin panel...", type: "success" },
          ]
        };
      }
      // Accept the actual base64 decode
      if (normalized === "decode ywnjzxnzx2dyyw50zwq=" || normalized === "decode access_granted") {
        handleLevelComplete(2);
        return {
          messages: [
            { id: `deco-${Date.now()}`, content: "✓ Decoded: access_granted", type: "success" },
            { id: `deco-${Date.now()}-1`, content: "🎉 Level 2 completed! Accessing admin panel...", type: "success" },
          ]
        };
      }
    }

    if (level === 3) {
      if (normalized === "ls") {
        return { messages: [{ id: `ls3-${Date.now()}`, content: "admin_panel.sh\nmaster_key.enc\nusers.db\nlogs/", type: "system" }] };
      }
      if (normalized === "cat admin_panel.sh") {
        return { messages: [{ id: `ap-${Date.now()}`, content: "#!/bin/bash\n# Admin Panel Loader\n# Password required: check master_key.enc\necho 'Enter password: '\nread pass\nif [ \"$pass\" = \"$MASTER_KEY\" ]; then\n  echo 'Access granted'\nfi", type: "system" }] };
      }
      if (normalized === "decrypt master_key.enc access_granted") {
        handleLevelComplete(3);
        return {
          messages: [
            { id: `mk-${Date.now()}`, content: "✓ Master key decrypted!", type: "success" },
            { id: `mk-${Date.now()}-1`, content: "MASTER_KEY=r00t_4cc3ss_2024", type: "system" },
            { id: `mk-${Date.now()}-2`, content: "🎉 Level 3 completed! Privilege escalation available...", type: "success" },
          ]
        };
      }
    }

    if (level >= 4) {
      if (normalized === "ls") {
        return { messages: [{ id: `ls4-${Date.now()}`, content: "system_core/\nroot_access.key\nfinal_challenge.txt", type: "system" }] };
      }
      if (normalized === "cat final_challenge.txt") {
        handleLevelComplete(level);
        return {
          messages: [
            { id: `fin-${Date.now()}`, content: "╔═══════════════════════════════════════╗", type: "success" },
            { id: `fin-${Date.now()}-1`, content: "║   🎉 CONGRATULATIONS! ROOT ACCESS!    ║", type: "success" },
            { id: `fin-${Date.now()}-2`, content: "║   You have completed all challenges   ║", type: "success" },
            { id: `fin-${Date.now()}-3`, content: "╚═══════════════════════════════════════╝", type: "success" },
          ]
        };
      }
    }

    return { messages: [{ id: `err-${Date.now()}`, content: `Command not recognized: ${command}\nType 'help' for available commands.`, type: "error" }] };
  };

  const handleLevelComplete = (completedLevel: number) => {
    if (!completedLevels.includes(completedLevel)) {
      setCompletedLevels(prev => [...prev, completedLevel]);
      const score = Math.max(100 - commandsUsed * 5, 50);
      completeChallenge({
        challengeId: `terminal-${completedLevel}`,
        score,
        hintsUsed,
        attempts: commandsUsed,
        timeMs: Date.now() - startTimeRef.current,
        completedAt: new Date().toISOString(),
      });
      if (completedLevel < maxLevel) {
        setTimeout(() => setLevel(completedLevel + 1), 1500);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundFX />
      <SpotlightCursor />
      <Header />

      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link to="/" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Home</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-4">
              <TerminalIcon className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">System Penetration</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Terminal <span className="text-primary">Challenge</span></h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Use terminal commands to navigate a simulated Unix-like system, decrypt secrets, and gain system access.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="glass-card p-4 rounded-xl mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Level</div>
                  <div className="text-xl font-bold text-primary">{level}/{maxLevel}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Commands</div>
                  <div className="text-xl font-bold">{commandsUsed}</div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs text-muted-foreground mb-1">Objective</div>
                  <div className="text-sm text-primary/80 max-w-[200px] truncate">{levelDescriptions[level - 1]}</div>
                </div>
              </div>
              <Progress value={(level / maxLevel) * 100} className="w-full sm:w-48 h-2" />
            </div>
          </div>

          {/* Level Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: maxLevel }).map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  completedLevels.includes(idx + 1)
                    ? "bg-green-500"
                    : idx + 1 === level
                      ? "bg-primary animate-pulse"
                      : "bg-muted"
                )}
                title={`Level ${idx + 1}`}
              />
            ))}
          </div>

          {/* Hint Toggle */}
          <div className="flex justify-center mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHint(v => !v)}
              className={showHint ? "border-yellow-400/50" : ""}
            >
              <Lightbulb size={16} className={cn("mr-2", showHint && "text-yellow-400")} />
              {showHint ? "Hide Hints" : "Show Hints"}
            </Button>
          </div>

          {/* Hints Panel */}
          {showHint && (
            <div className="glass-card p-4 rounded-xl mb-6 border border-yellow-500/30 bg-yellow-500/5 animate-fade-in">
              <h3 className="flex items-center gap-2 font-medium text-yellow-400 mb-3">
                <Lightbulb size={16} />
                Level {level} Hints
              </h3>
              <ul className="space-y-2">
                {hints.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-yellow-400">•</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Terminal */}
          <div className="shadow-2xl rounded-xl overflow-hidden">
            <Terminal
              initialMessages={initialMessages}
              onCommand={handleCommand}
              title={`HackOps Terminal - Level ${level}`}
            />
          </div>

          {/* AI Security Advisor */}
          <div className="mt-6">
            <AISecurityAdvisor
              challengeType="Terminal Hacking"
              level={level}
              lastInput={lastCommand}
              wasSuccessful={completedLevels.includes(level)}
              context={`Level objective: ${levelDescriptions[level - 1]}`}
            />
          </div>

          {/* Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-sm">Explore Everything</div>
                  <div className="text-xs text-muted-foreground">Check all files and directories</div>
                </div>
              </div>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-sm">Use Hints Wisely</div>
                  <div className="text-xs text-muted-foreground">Type 'hint' when stuck</div>
                </div>
              </div>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-400/10 flex items-center justify-center text-green-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-sm">5 Levels Total</div>
                  <div className="text-xs text-muted-foreground">From guest to root access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-muted/10 border-t border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TerminalIcon size={18} className="text-primary" />
            <span className="font-mono font-bold">HackOps</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Learn terminal skills in a safe, simulated environment.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TerminalGamePage;
