
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import PasswordGamePage from "./pages/PasswordGame";
import TerminalGamePage from "./pages/TerminalGame";
import EncryptionGame from "./pages/EncryptionGame";
import XSSGame from "./pages/XSSGame";
import SQLInjectionGame from "./pages/SQLInjectionGame";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Challenges from "./pages/Challenges";
import BlockchainPuzzles from "./pages/BlockchainPuzzles";
import Suggestions from "./pages/Suggestions";
import { ProfilePage } from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Handle both base variants in case old base was cached */}
            <Route path="/" element={<Index />} />
            <Route path="/HackOps" element={<Navigate to="/" replace />} />
            <Route path="/HackOps/" element={<Navigate to="/" replace />} />

            <Route path="/password-game" element={<PasswordGamePage />} />
            <Route path="/terminal-game" element={<TerminalGamePage />} />
            <Route path="/encryption" element={<EncryptionGame />} />
            <Route path="/xss-game" element={<XSSGame />} />
            <Route path="/sql-injection" element={<SQLInjectionGame />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/blockchain-puzzles" element={<BlockchainPuzzles />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
