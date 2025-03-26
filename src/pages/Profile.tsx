
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Activity, Trophy, Award, Code, BarChart2, Users,
  Calendar, PenSquare, Github, Globe, MapPin, Mail
} from "lucide-react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserProfile } from "@/api/userApi";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import MainNavbar from "@/components/MainNavbar";

const Profile = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [activeTab, setActiveTab] = useState("stats");
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(userId || "1"), // Default to user ID 1 if not provided
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16">
        <MainNavbar />
        <main className="page-container py-8">
          <div className="flex flex-col items-center justify-center">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-8 w-64 mt-4" />
            <Skeleton className="h-4 w-48 mt-2" />
            
            <div className="w-full max-w-4xl mt-8">
              <Skeleton className="h-12 w-full rounded-md" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Skeleton className="h-64 w-full rounded-md" />
                <Skeleton className="h-64 w-full rounded-md" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16">
        <MainNavbar />
        <main className="page-container py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="text-xl">User not found</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <MainNavbar />
      
      <main className="page-container py-8">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-green-500 p-1 bg-background">
              <Avatar className="w-full h-full">
                <AvatarImage src={profile.profileImage || "https://i.pravatar.cc/300?img=1"} alt={profile.fullName} />
                <AvatarFallback>{profile.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            
            <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full bg-background">
              <PenSquare className="h-4 w-4" />
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold mt-4">{profile.fullName}</h1>
          <div className="text-muted-foreground flex items-center gap-1">
            @{profile.username} • Joined {new Date(profile.joinedDate).getFullYear()}
          </div>
          
          <div className="grid grid-cols-3 gap-12 mt-8 text-center">
            <div>
              <div className="text-4xl font-bold">{profile.problemsSolved}</div>
              <div className="text-muted-foreground">Problems Solved</div>
            </div>
            
            <div>
              <div className="text-4xl font-bold">{profile.dayStreak}</div>
              <div className="text-muted-foreground">Day Streak</div>
            </div>
            
            <div>
              <div className="text-4xl font-bold">{profile.ranking}</div>
              <div className="text-muted-foreground">Ranking</div>
            </div>
          </div>
          
          <div className="w-full max-w-4xl mt-10">
            <Tabs defaultValue="stats" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto">
                <TabsTrigger value="stats" className="py-2 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500">
                  Stats
                </TabsTrigger>
                <TabsTrigger value="submissions" className="py-2 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500">
                  Submissions
                </TabsTrigger>
                <TabsTrigger value="badges" className="py-2 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500">
                  Badges
                </TabsTrigger>
                <TabsTrigger value="friends" className="py-2 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500">
                  Friends
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Code className="w-5 h-5 text-zenblue" />
                        Problem Solving
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Easy</span>
                            <span className="text-sm text-muted-foreground">
                              {profile.stats.easy.solved}/{profile.stats.easy.total}
                            </span>
                          </div>
                          <Progress value={(profile.stats.easy.solved / profile.stats.easy.total) * 100} className="h-2 bg-zinc-200 dark:bg-zinc-700">
                            <div className="h-full bg-green-500" style={{ width: `${(profile.stats.easy.solved / profile.stats.easy.total) * 100}%` }} />
                          </Progress>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Medium</span>
                            <span className="text-sm text-muted-foreground">
                              {profile.stats.medium.solved}/{profile.stats.medium.total}
                            </span>
                          </div>
                          <Progress value={(profile.stats.medium.solved / profile.stats.medium.total) * 100} className="h-2 bg-zinc-200 dark:bg-zinc-700">
                            <div className="h-full bg-amber-500" style={{ width: `${(profile.stats.medium.solved / profile.stats.medium.total) * 100}%` }} />
                          </Progress>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Hard</span>
                            <span className="text-sm text-muted-foreground">
                              {profile.stats.hard.solved}/{profile.stats.hard.total}
                            </span>
                          </div>
                          <Progress value={(profile.stats.hard.solved / profile.stats.hard.total) * 100} className="h-2 bg-zinc-200 dark:bg-zinc-700">
                            <div className="h-full bg-red-500" style={{ width: `${(profile.stats.hard.solved / profile.stats.hard.total) * 100}%` }} />
                          </Progress>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-zenblue" />
                        Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-amber-500" />
                            <span>Weekly Contests</span>
                          </div>
                          <span className="font-bold">{profile.achievements.weeklyContests}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-purple-500" />
                            <span>Monthly Challenges</span>
                          </div>
                          <span className="font-bold">{profile.achievements.monthlyContests}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <BarChart2 className="w-5 h-5 text-blue-500" />
                            <span>Special Events</span>
                          </div>
                          <span className="font-bold">{profile.achievements.specialEvents}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="md:col-span-2">
                    <ActivityHeatmap 
                      data={profile.activityHeatmap.data} 
                      startDate={profile.activityHeatmap.startDate}
                    />
                  </div>
                  
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Activity className="w-5 h-5 text-zenblue" />
                        Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-zinc-100 dark:bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center">
                            <Code className="w-5 h-5 text-zenblue" />
                          </div>
                          <div>
                            <div className="font-medium">Solved "Add Two Numbers" problem</div>
                            <div className="text-sm text-muted-foreground">2 hours ago</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="bg-zinc-100 dark:bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-amber-500" />
                          </div>
                          <div>
                            <div className="font-medium">Earned badge "20-Day Streak"</div>
                            <div className="text-sm text-muted-foreground">Yesterday</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="bg-zinc-100 dark:bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-500" />
                          </div>
                          <div>
                            <div className="font-medium">Joined "Algorithm Sprint" challenge</div>
                            <div className="text-sm text-muted-foreground">3 days ago</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="submissions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Submissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden">
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 flex justify-between items-center">
                          <div className="font-medium">Two Sum</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Accepted
                            </Badge>
                            <span className="text-sm text-muted-foreground">2 hours ago</span>
                          </div>
                        </div>
                        <div className="p-3 flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Language:</span>
                            <span className="ml-1 font-medium">JavaScript</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Runtime:</span>
                            <span className="ml-1 font-medium">76 ms</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Memory:</span>
                            <span className="ml-1 font-medium">42.4 MB</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden">
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 flex justify-between items-center">
                          <div className="font-medium">Add Two Numbers</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Accepted
                            </Badge>
                            <span className="text-sm text-muted-foreground">1 day ago</span>
                          </div>
                        </div>
                        <div className="p-3 flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Language:</span>
                            <span className="ml-1 font-medium">Python</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Runtime:</span>
                            <span className="ml-1 font-medium">68 ms</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Memory:</span>
                            <span className="ml-1 font-medium">14.2 MB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="badges" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.badges.map((badge, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4 flex items-center justify-center">
                            {badge.icon === 'trophy' && <Trophy className="w-8 h-8 text-amber-500" />}
                            {badge.icon === 'flame' && <Activity className="w-8 h-8 text-red-500" />}
                            {badge.icon === 'award' && <Award className="w-8 h-8 text-purple-500" />}
                          </div>
                          
                          <h3 className="text-lg font-semibold mb-1">{badge.name}</h3>
                          <p className="text-muted-foreground text-sm text-center mb-2">{badge.description}</p>
                          
                          <div className="text-xs text-muted-foreground">
                            Earned on {new Date(badge.earnedDate).toLocaleDateString()}
                          </div>
                          
                          <Badge className="mt-3" variant="outline">
                            {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="friends" className="mt-6">
                <Card>
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Friends & Following</CardTitle>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Find Friends
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <div>Following: {profile.following || 0}</div>
                        <div>Followers: {profile.followers || 0}</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-md">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src="https://i.pravatar.cc/300?img=3" />
                              <AvatarFallback>MC</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">Michael Chen</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                Online
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Message</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-md">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src="https://i.pravatar.cc/300?img=9" />
                              <AvatarFallback>SL</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">Sophia Lee</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                In a match
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Message</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-md">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src="https://i.pravatar.cc/300?img=13" />
                              <AvatarFallback>AJ</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">Alex Johnson</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                Coding
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Message</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="w-full max-w-4xl mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{profile.email}</span>
              </div>
              
              {profile.website && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:text-foreground transition-colors"
                  >
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              
              {profile.githubProfile && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Github className="w-4 h-4" />
                  <a 
                    href={`https://github.com/${profile.githubProfile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-foreground transition-colors"
                  >
                    {profile.githubProfile}
                  </a>
                </div>
              )}
              
              {profile.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-md p-4">
                <h3 className="font-medium mb-2">Bio</h3>
                <p className="text-sm text-muted-foreground">
                  {profile.bio || "No bio provided yet."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
