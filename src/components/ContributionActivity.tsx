
import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContributionProps {
  className?: string;
}

const ContributionActivity = ({ className }: ContributionProps) => {
  // Generate mock activity data
  const generateActivityData = () => {
    const activityLevels = [0, 1, 2, 3, 4]; // 0 = no activity, 1-4 = activity levels
    const cells = [];
    
    for (let i = 0; i < 365; i++) {
      // More activity on weekends and random distribution
      const isWeekend = i % 7 >= 5;
      let randomWeight = Math.random();
      if (isWeekend) randomWeight *= 1.5;
      
      // Higher chance of activity in recent days
      const recencyBoost = Math.min(1, (365 - i) / 100);
      randomWeight *= recencyBoost;
      
      let level;
      if (randomWeight < 0.3) level = 0;
      else if (randomWeight < 0.5) level = 1;
      else if (randomWeight < 0.7) level = 2;
      else if (randomWeight < 0.9) level = 3;
      else level = 4;
      
      cells.push(level);
    }
    
    return cells;
  };
  
  const activityData = generateActivityData();
  
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-400" />
          Contribution Activity
        </CardTitle>
        <p className="text-sm text-zinc-400">Your coding activity in the past year</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden">
          <div className="flex flex-wrap gap-1">
            {activityData.map((level, i) => (
              <div 
                key={i}
                className={cn(
                  "w-3 h-3 rounded-sm",
                  level === 0 && "bg-zinc-700/50",
                  level === 1 && "bg-green-900/70",
                  level === 2 && "bg-green-700/70",
                  level === 3 && "bg-green-500/70",
                  level === 4 && "bg-green-400"
                )}
                title={`${level} contributions`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContributionActivity;
