
import React, { useState, useEffect } from 'react';
import { format, parseISO, eachDayOfInterval, subDays, addDays, isSameDay } from 'date-fns';
import { Activity } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

type ActivityDay = {
  date: string;
  count: number;
  isActive: boolean;
};

interface MonthlyActivityHeatmapProps {
  data?: ActivityDay[];
  className?: string;
  showTitle?: boolean;
}

const MonthlyActivityHeatmap: React.FC<MonthlyActivityHeatmapProps> = ({ 
  data, 
  className = "",
  showTitle = true
}) => {
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);
  const [hoveredDay, setHoveredDay] = useState<ActivityDay | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Generate the past 30 days if no data is provided
    if (!data) {
      const today = new Date();
      const startDate = subDays(today, 29); // Get 30 days including today
      
      const days = eachDayOfInterval({ 
        start: startDate, 
        end: today 
      });
      
      const generatedData: ActivityDay[] = days.map(day => {
        // Random activity (70% chance of being active)
        const isActive = Math.random() > 0.3;
        const count = isActive ? Math.floor(Math.random() * 10) + 1 : 0;
        
        return {
          date: format(day, 'yyyy-MM-dd'),
          count,
          isActive
        };
      });
      
      setActivityData(generatedData);
    } else {
      setActivityData(data);
    }
  }, [data]);
  
  // Organize days by week
  const daysByWeek = activityData.reduce<{[key: string]: ActivityDay[]}>((weeks, day) => {
    const date = parseISO(day.date);
    const weekStart = format(date, 'yyyy-MM-dd');
    
    if (!weeks[weekStart]) {
      weeks[weekStart] = [];
    }
    
    weeks[weekStart].push(day);
    return weeks;
  }, {});
  
  const weekRows = Object.values(daysByWeek);
  
  return (
    <Card className={`bg-zinc-900/60 border-zinc-800/50 ${className}`}>
      {showTitle && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-400" />
            Monthly Activity
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <div className="grid grid-cols-7 gap-1 mb-2 justify-items-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                  <div key={day} className="text-xs text-zinc-500">
                    {isMobile ? day.charAt(0) : day}
                  </div>
                ))}
              </div>
              
              <TooltipProvider>
                <div className="space-y-2">
                  {[...Array(Math.ceil(activityData.length / 7))].map((_, weekIndex) => {
                    const weekData = activityData.slice(weekIndex * 7, weekIndex * 7 + 7);
                    return (
                      <div key={weekIndex} className="grid grid-cols-7 gap-1 justify-items-center">
                        {weekData.map((day, dayIndex) => (
                          <Tooltip key={`${weekIndex}-${dayIndex}`}>
                            <TooltipTrigger asChild>
                              <div 
                                className={`w-8 h-8 rounded-md cursor-pointer transition-all duration-200 hover:opacity-80 ${
                                  day.isActive 
                                    ? 'bg-green-500' 
                                    : 'bg-red-500'
                                }`}
                                onMouseEnter={() => setHoveredDay(day)}
                                onMouseLeave={() => setHoveredDay(null)}
                              />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs font-medium bg-zinc-900 border-zinc-700">
                              <p>{format(parseISO(day.date), 'MMMM d, yyyy')}</p>
                              <p>
                                {day.isActive 
                                  ? `${day.count} contribution${day.count !== 1 ? 's' : ''}` 
                                  : 'No activity'
                                }
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </TooltipProvider>
              
              <div className="mt-3 flex items-center justify-between pt-1 text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-md bg-red-500"></div>
                  <span>Inactive</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-md bg-green-500"></div>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyActivityHeatmap;
