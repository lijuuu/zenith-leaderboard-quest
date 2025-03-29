
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Profile from "./pages/Profile";
import Challenges from "./pages/Challenges";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import Compiler from "./pages/Compiler";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import MainNavbar from "@/components/MainNavbar";
import QuickMatch from "./components/challenges/QuickMatch";
import AdminDashboard from "./pages-admin/AdminDashboard";
import SmoothScroll from "./components/SmoothScroll/SmoothScroll";

// Create the query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const AppContent = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Add dark class to document by default
    document.documentElement.classList.add('dark');
  }, [location.pathname]);
  
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-zinc-950 text-white">
        <MainNavbar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/quick-match" element={<QuickMatch />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/compiler" element={<Compiler />} />
            
            {/* Auth Routes */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/*Admin Dashboard*/}
            <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster />
        <Sonner />
      </div>
    </SmoothScroll>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
