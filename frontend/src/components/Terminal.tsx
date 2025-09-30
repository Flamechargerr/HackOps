
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Button from "./Button";
import { ArrowRight, X, Maximize2, Minimize2 } from "lucide-react";

interface TerminalProps {
  className?: string;
  initialMessages?: TerminalMessage[];
  onCommand?: (command: string) => Promise<TerminalResponse>;
  title?: string;
}

export interface TerminalMessage {
  id: string;
  content: string;
  type: "system" | "user" | "error" | "success" | "warning";
}

export interface TerminalResponse {
  messages: TerminalMessage[];
}

const Terminal = ({
  className,
  initialMessages = [],
  onCommand,
  title = "Hackers Terminal",
}: TerminalProps) => {
  const [messages, setMessages] = useState<TerminalMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when the terminal is clicked
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCommand = async () => {
    if (!input.trim() || isWaiting) return;
    
    // Add user input to messages
    const userMessage: TerminalMessage = {
      id: Date.now().toString(),
      content: input,
      type: "user",
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsWaiting(true);
    
    if (onCommand) {
      try {
        const response = await onCommand(input.trim());
        setMessages((prev) => [...prev, ...response.messages]);
      } catch (error) {
        const errorMessage: TerminalMessage = {
          id: Date.now().toString(),
          content: "An error occurred processing your command.",
          type: "error",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }
    
    setIsWaiting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-md bg-terminal border border-primary/30 shadow-glow-sm overflow-hidden transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-50" : "w-full max-w-3xl h-[500px]",
        className
      )}
    >
      {/* Terminal Header */}
      <div className="flex justify-between items-center p-2 bg-muted/20 border-b border-primary/30">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-terminal-error"></div>
            <div className="w-3 h-3 rounded-full bg-terminal-warning"></div>
            <div className="w-3 h-3 rounded-full bg-terminal-success"></div>
          </div>
          <span className="text-sm font-mono text-terminal-foreground/80">{title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={toggleFullscreen} className="text-terminal-foreground/80 hover:text-terminal-foreground">
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button className="text-terminal-foreground/80 hover:text-terminal-error">
            <X size={14} />
          </button>
        </div>
      </div>
      
      {/* Terminal Body */}
      <div 
        ref={terminalBodyRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-sm"
        onClick={focusInput}
      >
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            {message.type === "user" ? (
              <div className="flex items-start">
                <span className="text-primary mr-2">$</span>
                <span>{message.content}</span>
              </div>
            ) : (
              <div className={cn(
                "pl-4 border-l-2",
                message.type === "error" && "border-terminal-error text-terminal-error",
                message.type === "success" && "border-terminal-success text-terminal-success",
                message.type === "warning" && "border-terminal-warning text-terminal-warning",
                message.type === "system" && "border-primary text-terminal-foreground/90",
              )}>
                {message.content}
              </div>
            )}
          </div>
        ))}
        {isWaiting && (
          <div className="flex items-center space-x-2 text-terminal-foreground/60">
            <span className="inline-block w-4 h-4 rounded-full bg-primary/30 animate-pulse"></span>
            <span>Processing...</span>
          </div>
        )}
      </div>
      
      {/* Terminal Input */}
      <div className="flex items-center p-3 bg-muted/10 border-t border-primary/30">
        <span className="text-primary mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-terminal-foreground font-mono"
          placeholder="Type a command..."
          disabled={isWaiting}
        />
        <Button 
          variant="terminal" 
          size="icon" 
          onClick={handleCommand}
          disabled={isWaiting}
          className="ml-2"
        >
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
};

export default Terminal;
