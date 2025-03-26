
import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, parseISO, subDays, eachDayOfInterval } from 'date-fns';

interface ContributionProps {
  className?: string;
}

type ActivityLevel = 0 | 1 | 2 | 3 | 4;

interface ActivityDay {
  date: string;
  count: number;
  level: ActivityLevel;
}

const ContributionActivity = ({ className }: ContributionProps) => {
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [hoveredDay, setHoveredDay] = useState<ActivityDay | null>(null);
  
  useEffect(() => {
    // Generate mock activity data for the past year
    const today = new Date();
    const startDate = subDays(today, 365);
    
    const days = eachDayOfInterval({ 
      start: startDate, 
      end: today 
    });
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const tempMonths: string[] = [];
    let prevMonth = -1;
    
    const generatedData: ActivityDay[] = days.map(day => {
      const month = day.getMonth();
      
      // Add month label when month changes
      if (month !== prevMonth) {
        tempMonths.push(monthNames[month]);
        prevMonth = month;
      }
      
      // More activity on weekends and random distribution
      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
      let randomWeight = Math.random();
      if (isWeekend) randomWeight *= 1.5;
      
      // Higher chance of activity in recent days
      const recencyBoost = Math.min(1, (365 - days.indexOf(day)) / 100);
      randomWeight *= recencyBoost;
      
      // Random activity count between 0 and 10
      const count = Math.floor(randomWeight * 10);
      
      // Determine activity level based on count
      let level: ActivityLevel = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count > 2 && count <= 5) level = 2;
      else if (count > 5 && count <= 8) level = 3;
      else if (count > 8) level = 4;
      
      return {
        date: format(day, 'yyyy-MM-dd'),
        count,
        level
      };
    });
    
    setActivityData(generatedData);
    setMonths(tempMonths);
  }, []);

  // Split data into weeks
  const weeks: ActivityDay[][] = [];
  let currentWeek: ActivityDay[] = [];

  for (let i = 0; i < activityData.length; i++) {
    const date = parseISO(activityData[i].date);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
    currentWeek.push(activityData[i]);
    
    if (i === activityData.length - 1) {
      weeks.push(currentWeek);
    }
  }

  // Function to get color based on activity level
  const getColor = (level: ActivityLevel) => {
    switch (level) {
      case 0: return 'bg-zinc-800/70 hover:bg-zinc-800';
      case 1: return 'bg-green-900/80 hover:bg-green-900';
      case 2: return 'bg-green-700/80 hover:bg-green-700';
      case 3: return 'bg-green-600/80 hover:bg-green-600';
      case 4: return 'bg-green-500/90 hover:bg-green-500';
      default: return 'bg-zinc-800/70 hover:bg-zinc-800';
    }
  };
  
  return (
    <Card className={cn("bg-zinc-900/60 border-zinc-800/50", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-400" />
          Contribution Activity
        </CardTitle>
        <p className="text-sm text-zinc-400">Your coding activity in the past year</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-2">
          <div className="min-w-max">
            <div className="flex mb-1 text-xs text-zinc-500">
              {months.map((month, i) => (
                <div key={`month-${i}`} className="pl-2">{month}</div>
              ))}
            </div>
            
            <TooltipProvider>
              <div className="flex gap-[2px]">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[2px]">
                    {Array(7).fill(0).map((_, dayIndex) => {
                      const day = week[dayIndex];
                      if (!day) return <div key={dayIndex} className="w-2 h-2 opacity-0" />;
                      
                      return (
                        <Tooltip key={dayIndex}>
                          <TooltipTrigger asChild>
                            <div 
                              className={`w-2 h-2 rounded-sm ${getColor(day.level)} cursor-pointer transition-all duration-200 hover:scale-110`}
                              onMouseEnter={() => setHoveredDay(day)}
                              onMouseLeave={() => setHoveredDay(null)}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs font-medium bg-zinc-900 border-zinc-700">
                            <p>{format(parseISO(day.date), 'MMMM d, yyyy')}</p>
                            <p>{day.count} {day.count === 1 ? 'contribution' : 'contributions'}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </div>
        
        {hoveredDay && (
          <div className="mt-2 text-sm font-medium animate-fade-in">
            <span className="mr-2 text-zinc-400">{format(parseISO(hoveredDay.date), 'MMMM d, yyyy')}:</span>
            <span className="text-green-400">{hoveredDay.count} {hoveredDay.count === 1 ? 'contribution' : 'contributions'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContributionActivity;
