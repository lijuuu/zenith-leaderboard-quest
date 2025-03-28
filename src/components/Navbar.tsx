
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, User, Code, Terminal, Zap, Award, MessageSquare, Settings, LogOut, Menu, X, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import DarkModeToggle from "./DarkModeToggle";
import { useAccentColor } from "@/contexts/AccentColorContext";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const Navbar = ({ isAuthenticated = true }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { accentColor } = useAccentColor();

  const navItems: NavItem[] = [
    { name: "Home", path: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Problems", path: "/problems", icon: <Code className="w-4 h-4" /> },
    { name: "Compiler", path: "/compiler", icon: <Terminal className="w-4 h-4" /> },
    { name: "Challenges", path: "/challenges", icon: <Zap className="w-4 h-4" /> },
    { name: "Leaderboard", path: "/leaderboard", icon: <Award className="w-4 h-4" /> },
  ];

  // Add authenticated-only items
  const authenticatedItems: NavItem[] = [
    { name: "Profile", path: "/profile", icon: <User className="w-4 h-4" /> },
    { name: "Chat", path: "/chat", icon: <MessageSquare className="w-4 h-4" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  // Combine items based on authentication status
  const allNavItems = isAuthenticated 
    ? [...navItems, ...authenticatedItems]
    : navItems;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled || mobileMenuOpen
          ? "bg-zinc-900/90 backdrop-blur-lg border-b border-zinc-800"
          : "bg-transparent"
      )}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full accent-color flex items-center justify-center text-white font-bold text-lg">
                z
              </div>
              <span className="text-2xl lowercase font-bold font-display tracking-tight text-white">
                zenx
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {allNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "relative px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                  isActive(item.path)
                    ? item.name === "Challenges" 
                      ? "accent-color" 
                      : "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            
            <div className="pl-2">
              <DarkModeToggle />
            </div>
            
            {isAuthenticated ? (
              <Link
                to="/logout"
                className="px-3 py-2 rounded-md text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="px-4 py-2 accent-color rounded-md text-sm font-medium transition-colors text-white"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <DarkModeToggle />
            <button
              className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "transform translate-y-0" : "transform -translate-y-full"
        )}
      >
        <nav className="border-t border-zinc-800 py-4 px-6 space-y-1 backdrop-blur-lg bg-zinc-900/90">
          {allNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors",
                isActive(item.path)
                  ? item.name === "Challenges"
                    ? "accent-color"
                    : "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <Link
              to="/logout"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium accent-color transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
