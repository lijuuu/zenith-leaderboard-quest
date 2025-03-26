
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  User, 
  MapPin, 
  Calendar, 
  Award, 
  Code, 
  Zap, 
  Trophy, 
  Github, 
  Twitter, 
  Linkedin, 
  ExternalLink 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getUserProfile } from "@/api/userApi";
import { getUserSubmissions } from "@/api/submissionApi";
import { getChallenges } from "@/api/challengeApi";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import SubmissionHistory from "@/components/SubmissionHistory";
import MainNavbar from "@/components/MainNavbar";
import { format } from "date-fns";

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(userId || "1"),
  });
  
  const { data: submissions, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["submissions", userId],
    queryFn: () => getUserSubmissions(userId || "1"),
  });
  
  const { data: challenges, isLoading: isLoadingChallenges } = useQuery({
    queryKey: ["challenges", userId],
    queryFn: () => getChallenges({ participated: true }),
  });
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white pt-14">
      <MainNavbar />
      
      <main className="page-container py-8">
        {isLoadingProfile ? (
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
            <div className="bg-zinc-800/50 rounded-lg h-[400px] animate-pulse" />
            <div className="space-y-4">
              <div className="bg-zinc-800/50 rounded-lg h-12 animate-pulse" />
              <div className="bg-zinc-800/50 rounded-lg h-32 animate-pulse" />
              <div className="bg-zinc-800/50 rounded-lg h-[200px] animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
            {/* Profile Sidebar */}
            <div className="space-y-6">
              <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg p-6 space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-zinc-700 overflow-hidden">
                      <img 
                        src={profile?.profileImage || "https://randomuser.me/api/portraits/men/32.jpg"} 
                        alt={profile?.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-zinc-800"></div>
                  </div>
                  
                  <div className="mt-4">
                    <h1 className="text-xl font-bold">{profile?.fullName}</h1>
                    <p className="text-zinc-400">@{profile?.username}</p>
                  </div>
                  
                  <div className="mt-4 flex gap-3">
                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8 bg-zinc-800 border-zinc-700">
                      <Github className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8 bg-zinc-800 border-zinc-700">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8 bg-zinc-800 border-zinc-700">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Separator className="bg-zinc-700/50" />
                
                <div className="space-y-3">
                  {profile?.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-zinc-500" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-zinc-500" />
                    <span>Joined {profile?.joinedDate ? format(new Date(profile.joinedDate), 'MMMM yyyy') : 'January 2023'}</span>
                  </div>
                </div>
                
                <Separator className="bg-zinc-700/50" />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-zinc-400">Global Rank</span>
                    </div>
                    <span className="font-medium">#{profile?.ranking || 354}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-zinc-400">Rating</span>
                    </div>
                    <span className="font-medium">{profile?.ranking || 1750}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-zinc-400">Problems Solved</span>
                    </div>
                    <span className="font-medium">{profile?.problemsSolved || 124}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-400" />
                      <span className="text-sm text-zinc-400">Current Streak</span>
                    </div>
                    <span className="font-medium">{profile?.dayStreak || 7} days</span>
                  </div>
                </div>
                
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  <User className="h-4 w-4 mr-2" />
                  Follow
                </Button>
              </div>
              
              <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">About</h2>
                <p className="text-zinc-400 text-sm">
                  {profile?.bio || 
                    "Software engineer passionate about algorithms and data structures. I love solving complex problems and participating in coding competitions."}
                </p>
              </div>
              
              <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Skills & Interests</h2>
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-1 bg-zinc-700/50 rounded-full text-xs">JavaScript</div>
                  <div className="px-3 py-1 bg-zinc-700/50 rounded-full text-xs">Python</div>
                  <div className="px-3 py-1 bg-zinc-700/50 rounded-full text-xs">React</div>
                  <div className="px-3 py-1 bg-zinc-700/50 rounded-full text-xs">Node.js</div>
                  <div className="px-3 py-1 bg-zinc-700/50 rounded-full text-xs">Algorithms</div>
                  <div className="px-3 py-1 bg-zinc-700/50 rounded-full text-xs">Data Structures</div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="space-y-6">
              <ActivityHeatmap loading={isLoadingProfile} />
              
              <Tabs defaultValue="submissions" className="w-full">
                <TabsList className="bg-zinc-800/40 border border-zinc-700/40 w-full">
                  <TabsTrigger 
                    value="submissions" 
                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                  >
                    Submissions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="challenges" 
                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                  >
                    Challenges
                  </TabsTrigger>
                  <TabsTrigger 
                    value="achievements" 
                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                  >
                    Achievements
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="submissions" className="mt-4">
                  <SubmissionHistory isLoading={isLoadingSubmissions} submissions={submissions} />
                </TabsContent>
                
                <TabsContent value="challenges" className="mt-4">
                  <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg p-6">
                    <h2 className="text-lg font-medium mb-4">Recent Challenges</h2>
                    
                    {isLoadingChallenges ? (
                      <div className="space-y-4">
                        {Array(3).fill(0).map((_, i) => (
                          <div key={i} className="bg-zinc-700/30 h-20 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : challenges && challenges.length > 0 ? (
                      <div className="space-y-4">
                        {challenges.map((challenge) => (
                          <div 
                            key={challenge.id} 
                            className="bg-zinc-800/60 border border-zinc-700/40 rounded-lg p-4 hover:bg-zinc-800/80 transition-colors cursor-pointer"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{challenge.title}</h3>
                                <p className="text-sm text-zinc-400 mt-1">{challenge.description}</p>
                              </div>
                              <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                {challenge.type}
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                  {challenge.participants?.map((participant, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full overflow-hidden border-2 border-zinc-800">
                                      <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover" />
                                    </div>
                                  ))}
                                </div>
                                <span className="text-xs text-zinc-400">
                                  {challenge.participantCount || challenge.participants?.length || 2} participants
                                </span>
                              </div>
                              <div className="text-xs text-zinc-400">
                                {challenge.date || '3 days ago'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-zinc-400">No challenges found</p>
                        <Button className="mt-4 bg-green-500 hover:bg-green-600">Find Challenges</Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="achievements" className="mt-4">
                  <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg p-6">
                    <h2 className="text-lg font-medium mb-4">Achievements</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-lg p-4 text-center flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
                          <Trophy className="h-8 w-8 text-amber-500" />
                        </div>
                        <h3 className="font-medium">Problem Solver</h3>
                        <p className="text-xs text-zinc-400 mt-1">Solved 100+ problems</p>
                      </div>
                      
                      <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-lg p-4 text-center flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                          <Zap className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="font-medium">Streak Master</h3>
                        <p className="text-xs text-zinc-400 mt-1">Maintained a 7+ day streak</p>
                      </div>
                      
                      <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-lg p-4 text-center flex flex-col items-center opacity-60">
                        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                          <Award className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="font-medium">Top Contributor</h3>
                        <p className="text-xs text-zinc-400 mt-1">Reached top 100 global rank</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
