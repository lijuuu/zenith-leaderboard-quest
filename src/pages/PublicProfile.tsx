
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/api/userApi";
import MainNavbar from "@/components/MainNavbar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ContributionActivity from "@/components/ContributionActivity";
import RecentSubmissions from "@/components/profile/RecentSubmissions";
import ChallengesList from "@/components/profile/ChallengesList";
import ProfileAchievements from "@/components/profile/ProfileAchievements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Code, Star, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserProfile, Challenge, Badge } from "@/api/types";

// Mock user data to supplement API data
const mockUsers: Record<string, UserProfile> = {
  "user1": {
    id: "user1",
    username: "sarahcodes",
    fullName: "Sarah Johnson",
    profileImage: "https://i.pravatar.cc/300?img=5",
    bio: "Full stack developer | React & Node.js enthusiast",
    joinedDate: "2021-06-15T10:30:00Z",
    isVerified: true,
    isOnline: true,
    isBanned: false,
    country: "United States",
    countryCode: "US",
    problemsSolved: 187,
    dayStreak: 14,
    followers: 245,
    following: 123,
    ranking: 65,
    email: "sarah.johnson@example.com",
    stats: {
      easy: { solved: 75, total: 100 },
      medium: { solved: 84, total: 150 },
      hard: { solved: 28, total: 80 }
    },
    achievements: {
      weeklyContests: 12,
      monthlyContests: 5,
      specialEvents: 3
    },
    badges: [],
    activityHeatmap: {
      startDate: "2023-01-01T00:00:00Z",
      data: []
    }
  },
  "user2": {
    id: "user2",
    username: "mikecoder",
    fullName: "Michael Chen",
    profileImage: "https://i.pravatar.cc/300?img=3",
    bio: "Algorithm specialist | Competitive programmer",
    joinedDate: "2020-03-22T14:15:00Z",
    isVerified: true,
    isOnline: false,
    isBanned: false,
    country: "Canada",
    countryCode: "CA",
    problemsSolved: 320,
    dayStreak: 21,
    followers: 412,
    following: 87,
    ranking: 27,
    email: "michael.chen@example.com",
    stats: {
      easy: { solved: 100, total: 100 },
      medium: { solved: 120, total: 150 },
      hard: { solved: 100, total: 150 }
    },
    achievements: {
      weeklyContests: 45,
      monthlyContests: 12,
      specialEvents: 8
    },
    badges: [],
    activityHeatmap: {
      startDate: "2023-01-01T00:00:00Z",
      data: []
    }
  },
  "user3": {
    id: "user3",
    username: "devjane",
    fullName: "Jane Williams",
    profileImage: "https://i.pravatar.cc/300?img=9",
    bio: "Front-end developer | UI/UX enthusiast",
    joinedDate: "2022-01-10T09:45:00Z",
    isVerified: false,
    isOnline: true,
    isBanned: false,
    country: "United Kingdom",
    countryCode: "GB",
    problemsSolved: 145,
    dayStreak: 9,
    followers: 198,
    following: 215,
    ranking: 132,
    email: "jane.williams@example.com",
    stats: {
      easy: { solved: 65, total: 100 },
      medium: { solved: 60, total: 150 },
      hard: { solved: 20, total: 150 }
    },
    achievements: {
      weeklyContests: 8,
      monthlyContests: 3,
      specialEvents: 1
    },
    badges: [],
    activityHeatmap: {
      startDate: "2023-01-01T00:00:00Z",
      data: []
    }
  },
  "user4": {
    id: "user4",
    username: "alexdev",
    fullName: "Alex Rodriguez",
    profileImage: "https://i.pravatar.cc/300?img=4",
    bio: "Python developer | ML engineer",
    joinedDate: "2020-11-05T16:20:00Z",
    isVerified: true,
    isOnline: false,
    isBanned: false,
    country: "Spain",
    countryCode: "ES",
    problemsSolved: 210,
    dayStreak: 5,
    followers: 276,
    following: 143,
    ranking: 85,
    email: "alex.rodriguez@example.com",
    stats: {
      easy: { solved: 85, total: 100 },
      medium: { solved: 95, total: 150 },
      hard: { solved: 30, total: 150 }
    },
    achievements: {
      weeklyContests: 18,
      monthlyContests: 6,
      specialEvents: 4
    },
    badges: [],
    activityHeatmap: {
      startDate: "2023-01-01T00:00:00Z",
      data: []
    }
  },
  "user5": {
    id: "user5",
    username: "emmawilson",
    fullName: "Emma Wilson",
    profileImage: "https://i.pravatar.cc/300?img=2",
    bio: "Backend developer | Database expert",
    joinedDate: "2021-09-18T11:10:00Z",
    isVerified: false,
    isOnline: true,
    isBanned: false,
    country: "Australia",
    countryCode: "AU",
    problemsSolved: 163,
    dayStreak: 11,
    followers: 217,
    following: 96,
    ranking: 118,
    email: "emma.wilson@example.com",
    stats: {
      easy: { solved: 70, total: 100 },
      medium: { solved: 73, total: 150 },
      hard: { solved: 20, total: 150 }
    },
    achievements: {
      weeklyContests: 15,
      monthlyContests: 4,
      specialEvents: 2
    },
    badges: [],
    activityHeatmap: {
      startDate: "2023-01-01T00:00:00Z",
      data: []
    }
  }
};

// Mock challenges data
const mockChallenges: Challenge[] = [
  {
    id: "challenge1",
    title: "Algorithm Marathon",
    difficulty: "Medium",
    createdBy: {
      id: "user1",
      username: "sarahcodes",
      profileImage: "https://i.pravatar.cc/300?img=5"
    },
    participants: 24,
    problemCount: 8,
    createdAt: "2023-05-15T10:30:00Z",
    isActive: true,
    isPrivate: false
  },
  {
    id: "challenge2",
    title: "Data Structures Challenge",
    difficulty: "Hard",
    createdBy: {
      id: "user2",
      username: "mikecoder",
      profileImage: "https://i.pravatar.cc/300?img=3"
    },
    participants: 18,
    problemCount: 5,
    createdAt: "2023-06-20T14:15:00Z",
    isActive: true,
    isPrivate: true,
    accessCode: "DS123"
  }
];

// Mock badges data
const mockBadges: Badge[] = [
  {
    id: "badge1",
    name: "Top Performer",
    description: "Ranked in the top 10% of users",
    icon: "trophy",
    earnedDate: "2023-04-10T08:30:00Z",
    rarity: "rare"
  },
  {
    id: "badge2",
    name: "Code Master",
    description: "Solved over 100 problems",
    icon: "code",
    earnedDate: "2023-02-05T14:20:00Z",
    rarity: "uncommon"
  },
  {
    id: "badge3",
    name: "Problem Solver",
    description: "Solved problems from all difficulty levels",
    icon: "award",
    earnedDate: "2023-01-15T11:45:00Z",
    rarity: "common"
  }
];

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  // Fetch profile data
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserProfile(userId || '')
  });

  // Use mock data if API doesn't return data
  const userProfile = profile || (userId && mockUsers[userId]);
  
  useEffect(() => {
    // Load mock challenges
    if (userProfile) {
      setChallenges(mockChallenges);
    }
    
    window.scrollTo(0, 0);
  }, [userId, userProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <MainNavbar />
        <main className="pt-20 pb-16">
          <div className="page-container">
            <div className="text-center py-8">Loading profile...</div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !userProfile) {
    return (
      <div className="min-h-screen">
        <MainNavbar />
        <main className="pt-20 pb-16">
          <div className="page-container">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold">User not found</h2>
              <p className="text-zinc-400 mt-2">The profile you are looking for does not exist.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <MainNavbar />
      
      <main className="pt-20 pb-16">
        <div className="page-container">
          {/* Profile Header */}
          <section className="mb-8">
            <ProfileHeader profile={userProfile} userId={userId} />
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs for different sections */}
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-zinc-800/50 border-zinc-700/50">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="submissions">Submissions</TabsTrigger>
                  <TabsTrigger value="challenges">Challenges</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <ProfileStats profile={userProfile} />
                  
                  <Card className="bg-zinc-800/50 border-zinc-700/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-500" />
                        Top Skills
                      </CardTitle>
                      <CardDescription>
                        Areas where {userProfile.fullName} excels
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="h-4 w-4 text-blue-400" />
                            <span className="font-medium">Data Structures</span>
                          </div>
                          <div className="bg-zinc-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-zinc-400">
                            <span>Proficiency</span>
                            <span>85%</span>
                          </div>
                        </div>
                        
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="h-4 w-4 text-green-400" />
                            <span className="font-medium">Algorithms</span>
                          </div>
                          <div className="bg-zinc-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full" style={{ width: '78%' }}></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-zinc-400">
                            <span>Proficiency</span>
                            <span>78%</span>
                          </div>
                        </div>
                        
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="h-4 w-4 text-purple-400" />
                            <span className="font-medium">Dynamic Programming</span>
                          </div>
                          <div className="bg-zinc-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full rounded-full" style={{ width: '72%' }}></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-zinc-400">
                            <span>Proficiency</span>
                            <span>72%</span>
                          </div>
                        </div>
                        
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="h-4 w-4 text-amber-400" />
                            <span className="font-medium">Problem Solving</span>
                          </div>
                          <div className="bg-zinc-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: '90%' }}></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-zinc-400">
                            <span>Proficiency</span>
                            <span>90%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <RecentSubmissions userId={userId} />
                </TabsContent>
                
                <TabsContent value="submissions" className="space-y-6">
                  <RecentSubmissions userId={userId} />
                </TabsContent>
                
                <TabsContent value="challenges" className="space-y-6">
                  <ChallengesList challenges={challenges} />
                </TabsContent>
                
                <TabsContent value="achievements" className="space-y-6">
                  <ProfileAchievements badges={mockBadges} />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <ContributionActivity />
              
              <Card className="bg-zinc-800/50 border-zinc-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-amber-500" />
                      </div>
                      <span className="text-xs mt-1 text-center">Top Performer</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Code className="h-6 w-6 text-green-500" />
                      </div>
                      <span className="text-xs mt-1 text-center">Code Master</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Award className="h-6 w-6 text-blue-500" />
                      </div>
                      <span className="text-xs mt-1 text-center">Problem Solver</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-800/50 border-zinc-700/50">
                <CardHeader>
                  <CardTitle className="text-lg">Top Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>JavaScript</span>
                        <span className="text-sm text-zinc-400">45%</span>
                      </div>
                      <div className="bg-zinc-700/50 h-2 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Python</span>
                        <span className="text-sm text-zinc-400">30%</span>
                      </div>
                      <div className="bg-zinc-700/50 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Java</span>
                        <span className="text-sm text-zinc-400">15%</span>
                      </div>
                      <div className="bg-zinc-700/50 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>C++</span>
                        <span className="text-sm text-zinc-400">10%</span>
                      </div>
                      <div className="bg-zinc-700/50 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicProfile;
