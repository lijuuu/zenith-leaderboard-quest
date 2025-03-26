
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Puzzle } from "lucide-react";
import MainNavbar from "@/components/MainNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getAllChallenges, getUserChallenges } from "@/api/challengeApi";
import { getUserProfile } from "@/api/userApi";
import { UserProfile, Challenge } from "@/api/types";

// Import our new components
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ChallengesList from "@/components/profile/ChallengesList";
import ActivityHeatmapRounded from "@/components/ActivityHeatmapRounded";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  
  const { 
    data: profile, 
    isLoading: profileLoading, 
    isError: profileError 
  } = useQuery({
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
  
  // Transform the activity data to include the required 'level' property
  const transformActivityData = () => {
    if (!profile?.activityHeatmap?.data) return [];
    
    return profile.activityHeatmap.data.map(item => {
      // Determine level based on count (similar logic to what's in ActivityHeatmapRounded)
      let level = 0;
      if (item.count > 0 && item.count <= 2) level = 1;
      else if (item.count > 2 && item.count <= 5) level = 2;
      else if (item.count > 5 && item.count <= 8) level = 3;
      else if (item.count > 8) level = 4;
      
      return {
        date: item.date,
        count: item.count,
        level: level as 0 | 1 | 2 | 3 | 4
      };
    });
  };
  
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16 pb-8">
        <MainNavbar />
        <main className="page-container py-8">
          <Card className="w-full max-w-5xl mx-auto">
            <CardHeader>
              <div className="h-24 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-20 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                <div className="h-20 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                <div className="h-20 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-40 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                <div className="h-40 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="h-64 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                <div className="h-64 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
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
          <Card className="w-full max-w-5xl mx-auto">
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
        <Card className="w-full max-w-5xl mx-auto">
          <CardContent className="p-6">
            {/* Profile Header Section */}
            <ProfileHeader profile={profile!} username={username} />
            
            <Separator className="my-6" />
            
            {/* Stats Section */}
            <ProfileStats profile={profile!} />
            
            <Separator className="my-6" />
            
            {/* Activity & Challenges Section */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-500" /> Activity Heatmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityHeatmapRounded data={transformActivityData()} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Puzzle className="h-5 w-5 text-blue-500" /> Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChallengesList challenges={challenges} />
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
