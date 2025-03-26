
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import DarkModeToggle from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  LogOut, 
  User, 
  Settings, 
  Search, 
  Home, 
  Code, 
  Terminal,
  Zap,
  Award,
  MessageSquare,
  Menu,
  X
} from "lucide-react";
import { useAccentColor } from "@/contexts/AccentColorContext";
import { cn } from "@/lib/utils";
import NotificationsPopover from "@/components/NotificationsPopover";

const MainNavbar = () => {
  const { accentColor } = useAccentColor();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigationItems = [
    { name: "Home", path: "/", icon: <Home className="h-4 w-4" /> },
    { name: "Profile", path: "/profile", icon: <User className="h-4 w-4" /> },
    { name: "Problems", path: "/problems", icon: <Code className="h-4 w-4" /> },
    { name: "Compiler", path: "/compiler", icon: <Terminal className="h-4 w-4" /> },
    { name: "Challenges", path: "/challenges", icon: <Zap className="h-4 w-4" /> },
    { name: "Leaderboard", path: "/leaderboard", icon: <Award className="h-4 w-4" /> },
    { name: "Chat", path: "/chat", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="h-4 w-4" /> },
  ];
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };
  
  // Close mobile menu when path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-900 border-b border-zinc-800 z-50">
      <div className="page-container h-full flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 mr-4 md:mr-8">
            <div className="bg-zinc-800 w-8 h-8 flex items-center justify-center rounded-full">
              <span className="font-bold text-lg text-white">z</span>
            </div>
            <span className="text-xl font-bold text-white">
              zenx
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path}
              >
                <Button 
                  variant="ghost" 
                  className={cn(
                    "gap-2 font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                    isActive(item.path) && (item.name === "Challenges" 
                      ? "bg-green-500 text-white hover:bg-green-600 hover:text-white" 
                      : "bg-zinc-800 text-white hover:bg-zinc-800 hover:text-white")
                  )}
                >
                  {item.icon}
                  <span className="hidden lg:inline">{item.name}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search" className="text-zinc-400 hover:text-white">
            <Search className="h-5 w-5" />
          </Button>
          
          <NotificationsPopover />
          
          <DarkModeToggle />
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] bg-zinc-900 border-zinc-800 p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between px-4 h-16 border-b border-zinc-800">
                    <Link to="/" className="flex items-center gap-2">
                      <div className="bg-zinc-800 w-8 h-8 flex items-center justify-center rounded-full">
                        <span className="font-bold text-lg text-white">z</span>
                      </div>
                      <span className="text-xl font-bold text-white">zenx</span>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-zinc-400 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 overflow-auto py-4">
                    <nav className="flex flex-col px-2 space-y-1">
                      {navigationItems.map((item) => (
                        <Link key={item.name} to={item.path}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start flex items-center gap-3 text-sm font-medium",
                              isActive(item.path)
                                ? item.name === "Challenges"
                                  ? "bg-green-500 text-white hover:bg-green-600"
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
          
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://i.pravatar.cc/300?img=1" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
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
                <Link to="/profile/johndoe" className="cursor-pointer w-full flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer w-full flex items-center">
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

export default MainNavbar;
