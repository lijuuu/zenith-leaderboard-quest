
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Filter, RefreshCw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ChallengeCard from "@/components/ChallengeCard";
import { getChallenges } from "@/api/challengeApi";
import MainNavbar from "@/components/MainNavbar";

const Challenges = () => {
  const [activeTab, setActiveTab] = useState("active");
  
  const { data: challenges, isLoading } = useQuery({
    queryKey: ["challenges", { active: activeTab === "active" }],
    queryFn: () => getChallenges({ active: activeTab === "active" }),
  });
  
  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <MainNavbar />
      
      <main className="page-container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold font-display">Challenge Mode</h1>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <p className="text-muted-foreground mt-1">
              Compete with friends in coding challenges
            </p>
          </div>
          
          <Button className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Challenge
          </Button>
        </div>
        
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <TabsList className="bg-zinc-100 dark:bg-zinc-800">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Active Challenges
              </TabsTrigger>
              <TabsTrigger value="invites" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Invites
                <Badge className="ml-1 bg-green-500 text-white">1</Badge>
              </TabsTrigger>
              <TabsTrigger value="history">
                <RefreshCw className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Search challenges..." 
                className="w-full md:w-[280px]" 
              />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="active" className="mt-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-[200px] bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges?.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    id={challenge.id}
                    title={challenge.title}
                    difficulty={challenge.difficulty}
                    createdBy={challenge.createdBy}
                    participants={challenge.participants}
                    problemCount={challenge.problemCount}
                    createdAt={challenge.createdAt}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="invites" className="mt-4">
            <div className="bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Data Structure Masters</h3>
                  <p className="text-muted-foreground mt-1">
                    Sophia Lee has invited you to join this challenge
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline">Decline</Button>
                  <Button className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">
                    Accept
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-md p-3 flex flex-col items-center justify-center">
                  <div className="text-muted-foreground text-sm">Difficulty</div>
                  <div className="font-semibold text-amber-500">Hard</div>
                </div>
                
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-md p-3 flex flex-col items-center justify-center">
                  <div className="text-muted-foreground text-sm">Participants</div>
                  <div className="font-semibold">6</div>
                </div>
                
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-md p-3 flex flex-col items-center justify-center">
                  <div className="text-muted-foreground text-sm">Problems</div>
                  <div className="font-semibold">5</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <div className="bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Weekly Contest #42</h3>
              
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <div className="text-muted-foreground text-sm">Rank</div>
                    <div className="font-semibold">12 / 128</div>
                  </div>
                  
                  <div>
                    <div className="text-muted-foreground text-sm">Score</div>
                    <div className="font-semibold">1840</div>
                  </div>
                  
                  <div>
                    <div className="text-muted-foreground text-sm">Problems Solved</div>
                    <div className="font-semibold">3 / 4</div>
                  </div>
                </div>
                
                <div className="text-muted-foreground text-sm">
                  Participated on March 28, 2023
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Reverse a String</div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Solved
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Time: 3:45</div>
                </div>
                
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Add Two Numbers</div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Solved
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Time: 12:20</div>
                </div>
                
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Longest Palindromic Substring</div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Solved
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Time: 28:15</div>
                </div>
                
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Median of Two Sorted Arrays</div>
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Unsolved
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Time: --:--</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Challenges;
