import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { Terminal, Lock, KeyRound, Code, ShieldAlert, Medal } from "lucide-react";

const games = [
  {
    title: "Terminal Hacking",
    description: "Simulate a Unix terminal, solve puzzles, and gain system access.",
    icon: <Terminal className="text-primary h-8 w-8" />,
    link: "/terminal-game",
  },
  {
    title: "Password Cracker",
    description: "Create complex passwords to meet security requirements.",
    icon: <Lock className="text-primary h-8 w-8" />,
    link: "/password-game",
  },
  {
    title: "Encryption Puzzles",
    description: "Encode and decode messages using various encryption methods.",
    icon: <KeyRound className="text-primary h-8 w-8" />,
    link: "/encryption",
  },
  {
    title: "XSS Simulator",
    description: "Find and exploit XSS vulnerabilities in a safe environment.",
    icon: <Code className="text-primary h-8 w-8" />,
    link: "/xss-game",
  },
  {
    title: "SQL Injection",
    description: "Practice identifying and exploiting SQL injection vulnerabilities.",
    icon: <ShieldAlert className="text-primary h-8 w-8" />,
    link: "/sql-injection",
  },
  {
    title: "Blockchain Puzzles",
    description: "Solve cryptographic puzzles inspired by blockchain technology.",
    icon: <Medal className="text-primary h-8 w-8" />,
    link: "/blockchain-puzzles",
  },
];

const Challenges = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 flex flex-col items-center justify-center py-16 px-4">
      <h1 className="text-4xl font-bold mb-8">Choose a Challenge</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {games.map((game) => (
          <Link to={game.link} key={game.title} className="group">
            <div className="glass-card p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300 group-hover:shadow-glow-sm h-full flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary/20 transition-colors">
                {game.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{game.title}</h3>
              <p className="text-muted-foreground mb-4">{game.description}</p>
              <span className="text-primary font-medium group-hover:underline">Play</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  </div>
);

export default Challenges; 