
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PasswordGamePage from "./pages/PasswordGame";
import TerminalGamePage from "./pages/TerminalGame";
import EncryptionGame from "./pages/EncryptionGame";
import XSSGame from "./pages/XSSGame";
import SQLInjectionGame from "./pages/SQLInjectionGame";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/password-game" element={<PasswordGamePage />} />
          <Route path="/terminal-game" element={<TerminalGamePage />} />
          <Route path="/encryption" element={<EncryptionGame />} />
          <Route path="/xss-game" element={<XSSGame />} />
          <Route path="/sql-injection" element={<SQLInjectionGame />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
