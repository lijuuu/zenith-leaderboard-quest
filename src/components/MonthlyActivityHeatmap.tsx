
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
      const startDate = subDays(today, 27); // Get 4 weeks (28 days) including today
      
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
  
  // Create a 7x4 grid for days of the week
  const createWeekGrid = () => {
    const grid: (ActivityDay | null)[][] = Array(7).fill(null).map(() => Array(4).fill(null));
    let currentDay = 0;
    
    // Populate the grid
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 7; row++) {
        if (currentDay < activityData.length) {
          grid[row][col] = activityData[currentDay];
          currentDay++;
        }
      }
    }
    
    return grid;
  };
  
  const grid = createWeekGrid();
  
  // Days of the week labels
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <Card className={`bg-zinc-950 border-zinc-800/50 ${className}`}>
      {showTitle && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Monthly Activity
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="flex justify-center">
            <div className="w-full">
              <div className="grid grid-cols-7 gap-1 mb-3 justify-items-center">
                {daysOfWeek.map((day, i) => (
                  <div key={day} className="text-xs text-zinc-500">
                    {isMobile ? day.charAt(0) : day}
                  </div>
                ))}
              </div>
              
              <TooltipProvider>
                <div className="grid grid-cols-7 gap-1 justify-items-center">
                  {grid.map((row, rowIndex) => (
                    // For each day of the week (row)
                    row.map((day, colIndex) => {
                      if (!day) return <div key={`empty-${rowIndex}-${colIndex}`} className="w-10 h-10 opacity-0" />;
                      
                      return (
                        <Tooltip key={`${rowIndex}-${colIndex}`}>
                          <TooltipTrigger asChild>
                            <div 
                              className={`w-10 h-10 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-130 hover:z-10 ${
                                day.isActive 
                                  ? 'bg-green-500 hover:bg-green-400' 
                                  : 'bg-red-500 hover:bg-red-400'
                              }`}
                              onMouseEnter={() => setHoveredDay(day)}
                              onMouseLeave={() => setHoveredDay(null)}
                              style={{ transformOrigin: 'center' }}
                            />
                          </TooltipTrigger>
                          <TooltipContent 
                            side="top" 
                            className="text-xs font-medium bg-zinc-900 border-zinc-700 z-50 shadow-lg animate-in fade-in-50 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                          >
                            <p>{format(parseISO(day.date), 'MMMM d, yyyy')}</p>
                            <p>
                              {day.isActive 
                                ? `${day.count} contribution${day.count !== 1 ? 's' : ''}` 
                                : 'No activity'
                              }
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })
                  ))}
                </div>
              </TooltipProvider>
              
              <div className="mt-4 flex items-center justify-between pt-1 text-xs text-zinc-500">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyActivityHeatmap;
