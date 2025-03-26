
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Eye, 
  EyeOff, 
  Clock, 
  Award, 
  Send, 
  MessageSquare, 
  ArrowRight,
  UserCheck,
  Zap,
  Check,
  X,
  Lock,
  Share2,
  Users,
  User,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { Challenge } from '@/api/types';

interface ChallengeInterfaceProps {
  challenge?: Challenge;
  isPrivate?: boolean;
  accessCode?: string;
}

const ChallengeInterface: React.FC<ChallengeInterfaceProps> = ({ challenge, isPrivate = false, accessCode }) => {
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState('30:00');
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [myProgress, setMyProgress] = useState(0);
  const [showOpponentCode, setShowOpponentCode] = useState(false);
  
  // Simulate time decreasing
  useEffect(() => {
    const interval = setInterval(() => {
      const [minutes, seconds] = timeRemaining.split(':').map(Number);
      let newMinutes = minutes;
      let newSeconds = seconds - 1;
      
      if (newSeconds < 0) {
        newMinutes -= 1;
        newSeconds = 59;
      }
      
      if (newMinutes < 0) {
        clearInterval(interval);
        toast({
          title: "Challenge completed",
          description: "Time's up! Your results are being calculated...",
        });
        return;
      }
      
      setTimeRemaining(`${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    // Simulate opponent progress
    const progressInterval = setInterval(() => {
      setOpponentProgress(prev => {
        const increase = Math.random() * 5;
        const newValue = prev + increase;
        return newValue > 100 ? 100 : newValue;
      });
      
      setMyProgress(prev => {
        const increase = Math.random() * 3;
        const newValue = prev + increase;
        return newValue > 100 ? 100 : newValue;
      });
    }, 3000);
    
    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [toast, timeRemaining]);
  
  const copyAccessCode = () => {
    if (accessCode) {
      navigator.clipboard.writeText(accessCode);
      toast({
        title: "Copied!",
        description: "Access code copied to clipboard",
      });
    }
  };
  
  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Left side - Code Editor */}
      <div className="flex-1 min-h-[400px] lg:min-h-full flex flex-col">
        {isPrivate && (
          <div className="bg-amber-100 dark:bg-amber-900/30 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="text-amber-500 h-4 w-4" />
              <span className="font-medium text-amber-700 dark:text-amber-400">Private Challenge</span>
              {accessCode && (
                <Badge variant="outline" className="ml-2 border-amber-300 dark:border-amber-700">
                  Code: {accessCode}
                </Badge>
              )}
            </div>
            
            {accessCode && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={copyAccessCode}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy access code</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
        
        <div className="bg-zinc-100 dark:bg-zinc-900 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-amber-500 h-4 w-4" />
            <span className="font-medium">Challenge: Two Sum</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-red-500" />
            <span className="font-medium">{timeRemaining}</span>
          </div>
        </div>
        
        {/* Code editor placeholder */}
        <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 p-4 font-mono text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-zinc-500">// Write your solution here</span>
            <span className="text-zinc-500">JavaScript</span>
          </div>
          <div className="text-zinc-800 dark:text-zinc-200">
            function twoSum(nums, target) {'{'}
              <br />
            &nbsp;&nbsp;// Your code here<br />
            &nbsp;&nbsp;const map = {'{'}{'}'};
              <br />
            &nbsp;&nbsp;for (let i = 0; i &lt; nums.length; i++) {'{'}
              <br />
            &nbsp;&nbsp;&nbsp;&nbsp;const complement = target - nums[i];<br />
            &nbsp;&nbsp;&nbsp;&nbsp;if (map[complement] !== undefined) {'{'}
              <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return [map[complement], i];<br />
            &nbsp;&nbsp;&nbsp;&nbsp;{'}'}
              <br />
            &nbsp;&nbsp;&nbsp;&nbsp;map[nums[i]] = i;<br />
            &nbsp;&nbsp;{'}'}
              <br />
            {'}'}
          </div>
        </div>
        
        <div className="bg-zinc-100 dark:bg-zinc-900 p-3 flex items-center justify-between">
          <Button variant="default" className="bg-green-600 hover:bg-green-700">
            <Play className="h-4 w-4 mr-2" />
            Run Code
          </Button>
          
          <Button variant="default">
            <Send className="h-4 w-4 mr-2" />
            Submit Solution
          </Button>
        </div>
      </div>
      
      {/* Right side - Problem and Chat */}
      <div className="w-full lg:w-[350px] flex flex-col border-l border-zinc-200 dark:border-zinc-800">
        <Tabs defaultValue="problem" className="h-full flex flex-col">
          <TabsList className="grid grid-cols-3 mx-4 mt-2">
            <TabsTrigger value="problem">Problem</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="problem" className="flex-1 overflow-auto p-4">
            <h2 className="text-xl font-bold mb-2">Two Sum</h2>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Easy</Badge>
              <Badge className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">Array</Badge>
              <Badge className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">Hash Table</Badge>
            </div>
            
            <p className="mb-4">
              Given an array of integers <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">nums</code> and an integer <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">target</code>, return indices of the two numbers such that they add up to <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">target</code>.
            </p>
            
            <p className="mb-4">
              You may assume that each input would have exactly one solution, and you may not use the same element twice.
            </p>
            
            <div className="mb-4">
              <h3 className="font-bold mb-2">Example 1:</h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded">
                <code>
                  Input: nums = [2,7,11,15], target = 9<br />
                  Output: [0,1]<br />
                  Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
                </code>
              </pre>
            </div>
            
            <div className="mb-4">
              <h3 className="font-bold mb-2">Example 2:</h3>
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded">
                <code>
                  Input: nums = [3,2,4], target = 6<br />
                  Output: [1,2]
                </code>
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="progress" className="flex-1 overflow-auto p-4 space-y-6">
            {isPrivate && (
              <Card className="shadow-none bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="h-4 w-4 text-amber-500" />
                    Private Challenge
                  </CardTitle>
                  <CardDescription>
                    <span className="text-amber-700 dark:text-amber-400">
                      Only invited participants can join this challenge
                    </span>
                  </CardDescription>
                </CardHeader>
                {accessCode && (
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-amber-100 dark:bg-amber-900/50 p-2 rounded border border-amber-200 dark:border-amber-800/50 font-mono text-center">
                        {accessCode}
                      </div>
                      <Button 
                        size="icon" 
                        variant="outline"
                        className="h-9 w-9 border-amber-200 dark:border-amber-800/50"
                        onClick={copyAccessCode}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                      Share this code with others to invite them to your challenge
                    </p>
                  </CardContent>
                )}
              </Card>
            )}
            
            <Card className="shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  Challenge Progress
                </CardTitle>
                <CardDescription>
                  Track progress against your opponents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                        Y
                      </div>
                      <span className="font-medium">You</span>
                    </div>
                    <span className="text-sm">{Math.round(myProgress)}%</span>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-1000"
                      style={{ width: `${myProgress}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        O
                      </div>
                      <span className="font-medium">Opponent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setShowOpponentCode(!showOpponentCode)}
                      >
                        {showOpponentCode ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="text-sm">{Math.round(opponentProgress)}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-1000"
                      style={{ width: `${opponentProgress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {showOpponentCode && (
              <Card className="shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Opponent's Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-zinc-100 dark:bg-zinc-800 p-3 rounded overflow-x-auto">
                    <code>
                      function twoSum(nums, target) {'{'}<br />
                      &nbsp;&nbsp;for (let i = 0; i &lt; nums.length; i++) {'{'}<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;for (let j = i + 1; j &lt; nums.length; j++) {'{'}<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (nums[i] + nums[j] === target) {'{'}<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return [i, j];<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br />
                      &nbsp;&nbsp;{'}'}<br />
                      &nbsp;&nbsp;return [];<br />
                      {'}'}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            )}
            
            <Card className="shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Test Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm p-2 bg-green-100 dark:bg-green-900/30 rounded">
                    <span>Test Case #1</span>
                    <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
                  </div>
                  <div className="flex items-center justify-between text-sm p-2 bg-green-100 dark:bg-green-900/30 rounded">
                    <span>Test Case #2</span>
                    <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
                  </div>
                  <div className="flex items-center justify-between text-sm p-2 bg-red-100 dark:bg-red-900/30 rounded">
                    <span>Test Case #3</span>
                    <X className="h-4 w-4 text-red-600 dark:text-red-500" />
                  </div>
                  <div className="flex items-center justify-between text-sm p-2 bg-zinc-100 dark:bg-zinc-800 rounded">
                    <span>Test Case #4</span>
                    <Clock className="h-4 w-4 text-zinc-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex -space-x-2 overflow-hidden mb-3">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <Avatar key={idx} className="border-2 border-background w-8 h-8">
                      <AvatarImage src={`https://i.pravatar.cc/300?img=${idx}`} alt="Participant" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-xs border-2 border-background">
                    +3
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Total Participants
                    </span>
                    <span>8</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-500" />
                      Completed
                    </span>
                    <span>2</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-600 dark:text-amber-500" />
                      In Progress
                    </span>
                    <span>6</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chat" className="flex-1 flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex-center flex-shrink-0">
                  O
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Hey, have you solved problems like this before?</p>
                  <span className="text-xs text-zinc-500 mt-1 block">10:30 AM</span>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Yeah, I think we need to use a hash map to optimize this!</p>
                  <span className="text-xs text-zinc-500 mt-1 block">10:32 AM</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-500 text-white flex-center flex-shrink-0">
                  Y
                </div>
              </div>
              
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex-center flex-shrink-0">
                  O
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Good idea! I was thinking of a brute force approach but a hash map would be O(n) instead of O(n²).</p>
                  <span className="text-xs text-zinc-500 mt-1 block">10:33 AM</span>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-full px-3 py-1 text-xs">
                  System: Test case #1 passed by both players
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:outline-none"
                />
                <Button size="icon" className="bg-green-500 hover:bg-green-600">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChallengeInterface;
