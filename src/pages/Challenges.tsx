
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  PlusCircle, 
  Users, 
  Activity, 
  Zap, 
  Trophy, 
  ChevronRight, 
  Calendar, 
  Clock, 
  User, 
  Cpu 
} from "lucide-react";
import MainNavbar from "@/components/MainNavbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import ActivityHeatmapRounded from "@/components/ActivityHeatmapRounded";
import ReferralBanner from "@/components/ReferralBanner";
import SubmissionHistory from "@/components/SubmissionHistory";
import ChallengeInterface from "@/components/ChallengeInterface";

// Sample challenge data
const activeChallenge = {
  id: "c1",
  title: "Two Sum Challenge",
  difficulty: "Easy",
  opponent: {
    name: "Alex J.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 1850
  },
  timeRemaining: "28:45",
  progress: 65
};

const upcomingChallenges = [
  {
    id: "c2",
    title: "Weekly Contest #145",
    time: "Tomorrow, 10:00 AM",
    participants: 128,
    type: "Contest"
  },
  {
    id: "c3",
    title: "1v1 with Robin M.",
    time: "Today, 4:30 PM",
    participants: 2,
    type: "1v1"
  }
];

const pastChallenges = [
  {
    id: "p1",
    title: "Daily Challenge: Merge Sort",
    date: "Yesterday",
    result: "Won",
    score: 95
  },
  {
    id: "p2",
    title: "Weekly Contest #144",
    date: "Last week",
    result: "7th place",
    score: 1250
  },
  {
    id: "p3",
    title: "1v1 with Taylor S.",
    date: "3 days ago",
    result: "Lost",
    score: 75
  }
];

const Challenges = () => {
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>("c1");
  
  return (
    <div className="min-h-screen bg-background text-foreground pt-16 pb-8">
      <MainNavbar />
      
      {activeChallengeId ? (
        <main className="page-container py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Active Challenge</h1>
            <Button 
              variant="outline" 
              onClick={() => setActiveChallengeId(null)}
              className="text-sm"
            >
              Exit Challenge
            </Button>
          </div>
          
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden shadow-sm h-[calc(100vh-180px)] min-h-[600px]">
            <ChallengeInterface />
          </div>
        </main>
      ) : (
        <main className="page-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Challenges</h1>
                <Button className="bg-green-500 hover:bg-green-600">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Challenge
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bento-card shadow-green-500/5 hover:shadow-green-500/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-green-500" />
                      1v1 Challenges
                    </CardTitle>
                    <CardDescription>
                      Challenge friends or random opponents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Quick Match</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Find an opponent with similar skill</p>
                      </div>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600">
                        Start
                      </Button>
                    </div>
                    
                    <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Challenge a Friend</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Send a challenge to a specific user</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bento-card shadow-blue-500/5 hover:shadow-blue-500/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Trophy className="h-5 w-5 text-blue-500" />
                      Competitions
                    </CardTitle>
                    <CardDescription>
                      Participate in contests and earn rewards
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Weekly Contest #145</p>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <Clock className="h-3 w-3" />
                          <span>Tomorrow, 10:00 AM</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Register
                      </Button>
                    </div>
                    
                    <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                        <Cpu className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Algorithm Battle</p>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <Clock className="h-3 w-3" />
                          <span>Friday, 7:00 PM</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Register
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <ReferralBanner />
              
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="space-y-4">
                  {activeChallenge && (
                    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveChallengeId(activeChallenge.id)}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>{activeChallenge.title}</CardTitle>
                          <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded dark:bg-green-900/30 dark:text-green-300">
                            {activeChallenge.difficulty}
                          </div>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Time Remaining: {activeChallenge.timeRemaining}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={activeChallenge.opponent.avatar} alt={activeChallenge.opponent.name} className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="text-sm font-medium">{activeChallenge.opponent.name}</p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">Rating: {activeChallenge.opponent.rating}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Your Progress</p>
                            <Progress value={activeChallenge.progress} className="h-2 w-32" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          Continue Challenge
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                  
                  {!activeChallenge && (
                    <div className="text-center py-10">
                      <p className="text-zinc-500 dark:text-zinc-400">No active challenges</p>
                      <Button className="mt-4 bg-green-500 hover:bg-green-600">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Find Challenge
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="upcoming" className="space-y-4">
                  {upcomingChallenges.map(challenge => (
                    <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>{challenge.title}</CardTitle>
                          <div className={cn(
                            "px-2 py-1 text-xs font-medium rounded",
                            challenge.type === "Contest" 
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          )}>
                            {challenge.type}
                          </div>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {challenge.time}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                          <span className="text-sm">{challenge.participants} participants</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  {upcomingChallenges.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-zinc-500 dark:text-zinc-400">No upcoming challenges</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="past" className="space-y-4">
                  {pastChallenges.map(challenge => (
                    <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>{challenge.title}</CardTitle>
                          <div className={cn(
                            "px-2 py-1 text-xs font-medium rounded",
                            challenge.result === "Won" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : challenge.result.includes("place") 
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          )}>
                            {challenge.result}
                          </div>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {challenge.date}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-amber-500" />
                          <span className="text-sm">Score: {challenge.score}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button size="sm" variant="outline">
                          View Results
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  {pastChallenges.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-zinc-500 dark:text-zinc-400">No past challenges</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <SubmissionHistory />
            </div>
            
            <div className="space-y-8">
              <Card className="bento-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-green-500" />
                    Contribution Activity
                  </CardTitle>
                  <CardDescription>
                    Your coding activity in the past year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityHeatmapRounded />
                </CardContent>
              </Card>
              
              <Card className="bento-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Problems Solved</span>
                    <span className="font-semibold">124</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Current Streak</span>
                    <span className="font-semibold">7 days</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Longest Streak</span>
                    <span className="font-semibold">21 days</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Current Rating</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">1750</span>
                      <span className="text-xs text-green-500">+15</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Global Rank</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">#1,245</span>
                      <span className="text-xs text-green-500">+32</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bento-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-blue-500" />
                    Friends Online
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Friend" className="w-8 h-8 rounded-full" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                      </div>
                      <span className="text-sm font-medium">Alex Johnson</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Challenge
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Friend" className="w-8 h-8 rounded-full" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                      </div>
                      <span className="text-sm font-medium">Taylor Smith</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Challenge
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="Friend" className="w-8 h-8 rounded-full" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-zinc-300 rounded-full border-2 border-white dark:border-zinc-900"></span>
                      </div>
                      <span className="text-sm font-medium">Jamie Parker</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">Away</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Message
                    </Button>
                  </div>
                  
                  <Link to="/profile" className="flex items-center justify-center gap-1 text-sm font-medium text-zenblue mt-2 hover:underline">
                    View All Friends
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Challenges;
