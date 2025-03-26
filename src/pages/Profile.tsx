import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Trophy, 
  Flame, 
  Puzzle, 
  Calendar, 
  Github, 
  Link, 
  MapPin, 
  CheckCircle,
  ShieldAlert,
  Mail,
  Copy,
  Edit,
  Loader2,
  UserPlus,
  UserMinus,
  MessageSquare,
  Bell,
  MoreHorizontal
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { getAllChallenges, getUserChallenges } from "@/api/challengeApi";
import { getUserProfile } from "@/api/userApi";
import { UserProfile, Challenge } from "@/api/types";
import ActivityHeatmapRounded from "@/components/ActivityHeatmapRounded";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  
  const { 
    data: profile, 
    isLoading: profileLoading, 
    isError: profileError 
  } = useQuery<UserProfile>({
    queryKey: ["profile", username],
    queryFn: () => getUserProfile(username!),
    retry: false,
  });
  
  useEffect(() => {
    const loadChallenges = async () => {
      if (profile) {
        try {
          const userChallenges = await getUserChallenges(profile.id);
          setChallenges(userChallenges);
        } catch (error) {
          console.error("Failed to load user challenges:", error);
          toast({
            title: "Error",
            description: "Failed to load user challenges. Please try again.",
            variant: "destructive",
          });
        }
      }
    };
    
    loadChallenges();
  }, [profile, toast]);
  
  const handleFollow = async () => {
    setLoading(true);
    
    // Simulate follow/unfollow action
    setTimeout(() => {
      setIsFollowing(!isFollowing);
      setLoading(false);
      
      toast({
        title: isFollowing ? "Unfollowed" : "Followed",
        description: isFollowing 
          ? `You have unfollowed @${username}`
          : `You are now following @${username}`,
      });
    }, 500);
  };
  
  const copyProfileLink = () => {
    const profileLink = window.location.href;
    navigator.clipboard.writeText(profileLink);
    toast({
      title: "Copied!",
      description: "Profile link copied to clipboard",
    });
  };
  
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16 pb-8">
        <MainNavbar />
        <main className="page-container py-8">
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">
                <Skeleton className="h-8 w-[200px]" />
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open dropdown menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" /> Message
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" /> Follow
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <ShieldAlert className="mr-2 h-4 w-4" /> Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px] mt-2" />
                </div>
                <div>
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px] mt-2" />
                </div>
                <div>
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px] mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  
  if (profileError) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16 pb-8">
        <MainNavbar />
        <main className="page-container py-8">
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Failed to load profile</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground pt-16 pb-8">
      <MainNavbar />
      <main className="page-container py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">{profile?.fullName}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open dropdown menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" /> Message
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleFollow} disabled={loading}>
                  {isFollowing ? (
                    <>
                      <UserMinus className="mr-2 h-4 w-4" /> Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" /> Follow
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <ShieldAlert className="mr-2 h-4 w-4" /> Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.profileImage || `https://avatar.vercel.sh/${username}.png`} alt={profile?.fullName} />
                <AvatarFallback>{profile?.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div>
                  <h3 className="text-lg font-semibold">{profile?.username}</h3>
                  <div className="flex items-center space-x-2">
                    {profile?.isVerified && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Verified Account</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {profile?.isBanned && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ShieldAlert className="h-4 w-4 text-red-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Banned Account</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{profile?.bio || "No bio available"}</p>
                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={copyProfileLink}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy profile link</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium">Problems Solved</h4>
                <p className="text-2xl font-bold">{profile?.problemsSolved}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Current Streak</h4>
                <p className="text-2xl font-bold">{profile?.dayStreak} days</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Ranking</h4>
                <p className="text-2xl font-bold">#{profile?.ranking}</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-amber-500" /> Achievements
                </h4>
                <ul className="list-none space-y-2 mt-2">
                  <li className="flex items-center justify-between">
                    <span>Weekly Contests</span>
                    <span>{profile?.achievements.weeklyContests}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Monthly Contests</span>
                    <span>{profile?.achievements.monthlyContests}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Special Events</span>
                    <span>{profile?.achievements.specialEvents}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <Flame className="h-4 w-4 text-red-500" /> Stats
                </h4>
                <ul className="list-none space-y-2 mt-2">
                  <li className="flex items-center justify-between">
                    <span>Easy</span>
                    <span>{profile?.stats.easy.solved} / {profile?.stats.easy.total}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Medium</span>
                    <span>{profile?.stats.medium.solved} / {profile?.stats.medium.total}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Hard</span>
                    <span>{profile?.stats.hard.solved} / {profile?.stats.hard.total}</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex flex-col md:flex-row gap-4">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-green-500" /> Activity Heatmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityHeatmapRounded data={profile?.activityHeatmap} />
                </CardContent>
              </Card>
              
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-1">
                    <Puzzle className="h-4 w-4 text-blue-500" /> Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">{challenge.title}</span>
                      </div>
                      <span className="text-xs text-zinc-500">{challenge.participants} participants</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
