
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Timer = () => {
  const [time, setTime] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isActive) interval = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="flex items-center gap-3 px-4 py-2 bg-zinc-900 rounded-md shadow-md" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 text-sm text-zinc-300">
        <Clock className="h-4 w-4 text-green-500" />
        <span className="font-medium">{formatTime(time)}</span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsActive(true)} 
        disabled={isActive} 
        className="h-7 px-3 text-xs font-medium"
      >
        Start
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => { setIsActive(false); setTime(0); }} 
        className="h-7 px-3 text-xs font-medium"
      >
        Reset
      </Button>
    </motion.div>
  );
};

export default Timer;
