
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Home, 
  User, 
  Code, 
  Zap, 
  Award, 
  MessageCircle, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/problems', label: 'Problems', icon: Code },
  { path: '/compiler', label: 'Compiler', icon: Code },
  { path: '/challenges', label: 'Challenges', icon: Zap, isHighlighted: true },
  { path: '/leaderboard', label: 'Leaderboard', icon: Award },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const MainNavigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false); // Close mobile nav when route changes
  }, [location.pathname]);

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2 px-3 py-3">
        <div className="bg-zinc-800 w-10 h-10 flex items-center justify-center rounded-full">
          <span className="font-bold text-xl text-white">z</span>
        </div>
        <span className="font-bold text-xl text-white">zenx</span>
      </div>

      <div className={cn(
        "flex items-center gap-1",
        isMobile ? "flex-col w-full mt-6" : "ml-10"
      )}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              asChild
              variant="ghost"
              size={isMobile ? "lg" : "default"}
              className={cn(
                "gap-2 font-medium",
                isActive 
                  ? "bg-zinc-800 text-white" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                item.isHighlighted && !isActive && "bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300",
                item.isHighlighted && isActive && "bg-green-500 text-white hover:bg-green-600",
                isMobile && "justify-start w-full"
              )}
            >
              <Link to={item.path}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </div>

      {isMobile && (
        <div className="mt-auto pt-6 pb-4">
          <Button variant="ghost" size="lg" className="w-full justify-start gap-2 text-zinc-400 hover:text-white">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      )}
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800">
      <div className="flex items-center justify-between h-16">
        {isMobile ? (
          <>
            <div className="flex items-center gap-2 px-4">
              <div className="bg-zinc-800 w-8 h-8 flex items-center justify-center rounded-full">
                <span className="font-bold text-lg text-white">z</span>
              </div>
              <span className="font-bold text-lg text-white">zenx</span>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5 text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80 border-r border-zinc-800 bg-zinc-900">
                <NavContent />
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <div className="flex items-center w-full px-4">
            <NavContent />
            <div className="ml-auto">
              <Button variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-white">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default MainNavigation;
