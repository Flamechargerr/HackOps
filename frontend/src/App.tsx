import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Core Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Challenges from "./pages/Challenges";
import Leaderboard from "./pages/Leaderboard";
import { ProfilePage } from "./pages/ProfilePage";

// Game Pages
import {
  PasswordGamePage,
  TerminalGamePage,
  EncryptionGame,
  XSSGame,
  SQLInjectionGame,
  BlockchainPuzzles
} from "./pages/games";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Core Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Game Routes */}
            <Route path="/password-game" element={<PasswordGamePage />} />
            <Route path="/terminal-game" element={<TerminalGamePage />} />
            <Route path="/encryption" element={<EncryptionGame />} />
            <Route path="/xss-game" element={<XSSGame />} />
            <Route path="/sql-injection" element={<SQLInjectionGame />} />
            <Route path="/blockchain-puzzles" element={<BlockchainPuzzles />} />

            {/* Legacy redirects */}
            <Route path="/HackOps" element={<Navigate to="/" replace />} />
            <Route path="/HackOps/" element={<Navigate to="/" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
