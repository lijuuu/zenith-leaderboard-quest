
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks';
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
  X,
  TerminalSquare
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/problems', label: 'Problems', icon: Code },
  { path: '/compiler', label: 'Compiler', icon: TerminalSquare },
  { path: '/challenges', label: 'Challenges', icon: Zap, isHighlighted: true },
  { path: '/leaderboard', label: 'Leaderboard', icon: Award },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const MainNavbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false); // Close mobile nav when route changes
  }, [location.pathname]);

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2 px-3 py-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-zinc-800 hover:bg-zinc-700 transition-colors w-8 h-8 flex items-center justify-center rounded-md">
            <span className="font-bold text-xl text-white">z</span>
          </div>
          <span className="font-bold text-xl text-white">zenx</span>
        </Link>
      </div>

      <div className={cn(
        "flex items-center gap-1",
        isMobile ? "flex-col w-full mt-6" : "ml-6"
      )}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              asChild
              variant="ghost"
              size={isMobile ? "lg" : "sm"}
              className={cn(
                "gap-2 font-medium transition-all duration-200",
                isActive 
                  ? "bg-zinc-800 text-white" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                item.isHighlighted && !isActive && "bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300",
                item.isHighlighted && isActive && "bg-green-500 text-white hover:bg-green-600",
                isMobile && "justify-start w-full"
              )}
            >
              <Link to={item.path} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </div>

      {isMobile ? (
        <div className="mt-auto pt-6 pb-4">
          <Button variant="ghost" size="lg" className="w-full justify-start gap-2 text-zinc-400 hover:text-white">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      ) : (
        <div className="ml-auto pr-4">
          <Button variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-white">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      )}
    </>
  );

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled 
          ? "bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800/70" 
          : "bg-zinc-900 border-b border-zinc-800"
      )}
    >
      <div className="flex items-center justify-between h-14">
        {isMobile ? (
          <>
            <div className="flex items-center gap-2 px-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-zinc-800 w-8 h-8 flex items-center justify-center rounded-md">
                  <span className="font-bold text-lg text-white">z</span>
                </div>
                <span className="font-bold text-lg text-white">zenx</span>
              </Link>
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
          <div className="flex items-center w-full">
            <NavContent />
          </div>
        )}
      </div>
    </header>
  );
};

export default MainNavbar;
