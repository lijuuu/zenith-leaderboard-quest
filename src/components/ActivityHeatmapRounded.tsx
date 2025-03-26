
import { useEffect, useState } from 'react';
import { format, parseISO, eachDayOfInterval, addDays, subDays } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ActivityLevel = 0 | 1 | 2 | 3 | 4;

interface ActivityDay {
  date: string;
  count: number;
  level: ActivityLevel;
}

interface ActivityHeatmapRoundedProps {
  data?: ActivityDay[];
  daysToShow?: number;
}

const ActivityHeatmapRounded: React.FC<ActivityHeatmapRoundedProps> = ({ 
  data = [], 
  daysToShow = 365 
}) => {
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);
  const [hoveredDay, setHoveredDay] = useState<ActivityDay | null>(null);

  useEffect(() => {
    // If no data is provided, generate random activity data
    if (data.length === 0) {
      const today = new Date();
      const startDate = subDays(today, daysToShow);
      
      const days = eachDayOfInterval({ 
        start: startDate, 
        end: today 
      });
      
      const generatedData: ActivityDay[] = days.map(day => {
        // More activity on weekends and random distribution
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
        let randomWeight = Math.random();
        if (isWeekend) randomWeight *= 1.5;
        
        // Higher chance of activity in recent days
        const recencyBoost = Math.min(1, (daysToShow - days.indexOf(day)) / 100);
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
    } else {
      setActivityData(data);
    }
  }, [data, daysToShow]);

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

  // Calculate weeks for display
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

  return (
    <div className="w-full overflow-x-auto">
      <div className="py-2">
        <TooltipProvider>
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <Tooltip key={dayIndex}>
                    <TooltipTrigger asChild>
                      <div 
                        className={`w-3 h-3 rounded-sm ${getColor(day.level)} cursor-pointer transition-all duration-200 hover:scale-110`}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs font-medium bg-zinc-900 border-zinc-700">
                      <p>{format(parseISO(day.date), 'MMMM d, yyyy')}</p>
                      <p>{day.count} {day.count === 1 ? 'contribution' : 'contributions'}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </TooltipProvider>
      </div>
      
      {hoveredDay && (
        <div className="mt-3 text-sm font-medium animate-fade-in">
          <span className="mr-2 text-zinc-400">{format(parseISO(hoveredDay.date), 'MMMM d, yyyy')}:</span>
          <span className="text-green-400">{hoveredDay.count} {hoveredDay.count === 1 ? 'contribution' : 'contributions'}</span>
        </div>
      )}
    </div>
  );
};

export default ActivityHeatmapRounded;
