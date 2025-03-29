
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  User,
  Code,
  Terminal,
  Zap,
  Award,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useAccentColor } from "@/contexts/AccentColorContext";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NotificationsPopover from "@/components/NotificationsPopover";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

const AppNavigation = () => {
  const { theme, setTheme } = useTheme();
  const { accentColor } = useAccentColor();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems: NavItem[] = [
    { name: "Home", path: "/", icon: <Home className="h-4 w-4" /> },
    { name: "Profile", path: "/profile", icon: <User className="h-4 w-4" /> },
    { name: "Problems", path: "/problems", icon: <Code className="h-4 w-4" /> },
    { name: "Compiler", path: "/compiler", icon: <Terminal className="h-4 w-4" /> },
    { name: "Challenges", path: "/challenges", icon: <Zap className="h-4 w-4" />, highlight: true },
    { name: "Leaderboard", path: "/leaderboard", icon: <Award className="h-4 w-4" /> },
    { name: "Chat", path: "/chat", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="h-4 w-4" /> },
  ];

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
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-zinc-900 border-b border-zinc-800">
      <div className="h-full px-4 mx-auto max-w-[1400px] flex items-center justify-between">
        {/* Logo and desktop navigation */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 mr-6">
            <div className="w-8 h-8 rounded-full bg-accent-color flex items-center justify-center">
              <span className="font-bold text-xl text-white">z</span>
            </div>
            <span className="text-xl font-bold text-accent">zenx</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium",
                    isActive(item.path)
                      ? item.highlight
                        ? "bg-accent-color text-white hover:bg-accent-color/90"
                        : "bg-zinc-800 text-white hover:bg-zinc-700"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <NotificationsPopover />

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-zinc-400 hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center ml-1">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-zinc-900 border-zinc-800 w-[280px] p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center px-4 h-16 border-b border-zinc-800">
                    <Link to="/" className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-accent-color flex items-center justify-center">
                        <span className="font-bold text-xl text-white">z</span>
                      </div>
                      <span className="text-xl font-bold text-accent">zenx</span>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-auto text-zinc-400 hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-auto py-4">
                    <nav className="flex flex-col px-2 space-y-1">
                      {navItems.map((item) => (
                        <Link key={item.name} to={item.path}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start flex items-center gap-3 text-sm font-medium",
                              isActive(item.path)
                                ? item.highlight
                                  ? "bg-accent-color text-white hover:bg-accent-color/90"
                                  : "bg-zinc-800 text-white hover:bg-zinc-700"
                                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                            )}
                          >
                            {item.icon}
                            {item.name}
                          </Button>
                        </Link>
                      ))}
                    </nav>
                  </div>
                  <div className="border-t border-zinc-800 p-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-zinc-400 hover:text-white"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://i.pravatar.cc/300?img=1" alt="User profile" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppNavigation;
