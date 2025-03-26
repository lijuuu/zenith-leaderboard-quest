
import React from "react";
import { Link } from "react-router-dom";
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
import { LogOut, User, Settings, Search } from "lucide-react";
import NotificationsPopover from "@/components/NotificationsPopover";
import { useAccentColor } from "@/contexts/AccentColorContext";

const MainNavbarWithNotifications = () => {
  const { accentColor } = useAccentColor();
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-sm z-50">
      <div className="page-container h-full flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center mr-8">
            <span className={`text-xl font-bold text-accent-color`}>
              zenx
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/problems">
              <Button variant="ghost">Problems</Button>
            </Link>
            <Link to="/challenges">
              <Button variant="ghost">Challenges</Button>
            </Link>
            <Link to="/compiler">
              <Button variant="ghost">Compiler</Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="ghost">Leaderboard</Button>
            </Link>
            <Link to="/chat">
              <Button variant="ghost">Chat</Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          
          <NotificationsPopover />
          
          <DarkModeToggle />
          
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
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default MainNavbarWithNotifications;
