
import React, { useState, useEffect } from 'react';
import { format, parseISO, eachDayOfInterval, subDays, addDays, isSameDay } from 'date-fns';
import { Activity } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ActivityDay = {
  date: string;
  count: number;
  isActive: boolean;
};

interface MonthlyActivityHeatmapProps {
  data?: ActivityDay[];
  className?: string;
}

const MonthlyActivityHeatmap: React.FC<MonthlyActivityHeatmapProps> = ({ data, className }) => {
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);
  const [hoveredDay, setHoveredDay] = useState<ActivityDay | null>(null);
  
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
  
  // Group the days into weeks for display
  const groupedByWeek = activityData.reduce<ActivityDay[][]>((acc, day, index) => {
    const weekIndex = Math.floor(index / 7);
    if (!acc[weekIndex]) {
      acc[weekIndex] = [];
    }
    acc[weekIndex].push(day);
    return acc;
  }, []);
  
  return (
    <Card className="bg-zinc-900/60 border-zinc-800/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-400" />
          Monthly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-xs text-zinc-500 text-center">
                {day}
              </div>
            ))}
          </div>
          
          <TooltipProvider>
            <div className="space-y-1">
              {groupedByWeek.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                  {week.map((day) => (
                    <Tooltip key={day.date}>
                      <TooltipTrigger asChild>
                        <div 
                          className={`aspect-square rounded-full transition-all cursor-pointer ${
                            day.isActive 
                              ? 'bg-green-500 hover:scale-110' 
                              : 'bg-red-500 hover:scale-110'
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
              ))}
            </div>
          </TooltipProvider>
          
          {hoveredDay && (
            <div className="mt-3 text-sm font-medium animate-fade-in">
              <span className="mr-2 text-zinc-400">{format(parseISO(hoveredDay.date), 'MMMM d, yyyy')}:</span>
              {hoveredDay.isActive ? (
                <span className="text-green-400">{hoveredDay.count} {hoveredDay.count === 1 ? 'contribution' : 'contributions'}</span>
              ) : (
                <span className="text-red-400">No activity</span>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2 text-xs text-zinc-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Inactive</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Active</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyActivityHeatmap;
