
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type HeatmapDataPoint = {
  date: string;
  count: number;
  present: boolean;
};

type HeatmapProps = {
  data: HeatmapDataPoint[];
  startDate: string;
  loading?: boolean;
};

const ActivityHeatmap = ({ data, startDate, loading = false }: HeatmapProps) => {
  const [weeks, setWeeks] = useState<HeatmapDataPoint[][]>([]);
  const [months, setMonths] = useState<string[]>([]);
  
  useEffect(() => {
    if (!data || loading) return;

    // Group data into weeks
    const tempWeeks: HeatmapDataPoint[][] = [];
    let currentWeek: HeatmapDataPoint[] = [];

    // Get month labels
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const tempMonths: string[] = [];
    
    let prevMonth = -1;
    
    data.forEach((day, i) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();
      const month = date.getMonth();
      
      // Add month label when month changes
      if (month !== prevMonth) {
        tempMonths.push(monthNames[month]);
        prevMonth = month;
      }
      
      // Start a new week on Sunday or at the beginning
      if (dayOfWeek === 0 || i === 0) {
        if (currentWeek.length > 0) {
          tempWeeks.push(currentWeek);
        }
        currentWeek = [];
        
        // Add empty cells for days before the first day of the week
        if (i === 0 && dayOfWeek !== 0) {
          for (let j = 0; j < dayOfWeek; j++) {
            currentWeek.push({ date: "", count: 0, present: false });
          }
        }
      }
      
      currentWeek.push(day);
      
      // Push the last week
      if (i === data.length - 1) {
        // Fill the remaining days of the last week
        const remainingDays = 7 - currentWeek.length;
        for (let j = 0; j < remainingDays; j++) {
          currentWeek.push({ date: "", count: 0, present: false });
        }
        tempWeeks.push(currentWeek);
      }
    });
    
    setWeeks(tempWeeks);
    setMonths(tempMonths);
  }, [data, loading]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            Activity Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[160px] rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Activity Heatmap</span>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-zinc-600 dark:text-zinc-400">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-zinc-600 dark:text-zinc-400">Present</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-2">
          <div className="min-w-max">
            <div className="flex mb-1 text-xs text-zinc-500">
              {months.map((month, i) => (
                <div key={`month-${i}`} className="pl-2">{month}</div>
              ))}
            </div>
            <div className="flex flex-col gap-[3px]">
              {Array(7).fill(0).map((_, dayIndex) => (
                <div key={`row-${dayIndex}`} className="flex gap-[3px]">
                  {weeks.map((week, weekIndex) => (
                    <div 
                      key={`cell-${weekIndex}-${dayIndex}`} 
                      className={`w-[14px] h-[14px] rounded-full ${
                        !week[dayIndex]?.date 
                          ? "opacity-0" 
                          : week[dayIndex]?.present 
                            ? "bg-green-500" 
                            : "bg-red-500"
                      }`}
                      title={week[dayIndex]?.date ? new Date(week[dayIndex].date).toLocaleDateString() : ""}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityHeatmap;
