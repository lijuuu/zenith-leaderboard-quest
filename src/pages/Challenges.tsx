
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getChallenges } from '@/api/challengeApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainNavbar from '@/components/MainNavbar';
import ChallengeCard from '@/components/ChallengeCard';
import JoinPrivateChallenge from '@/components/JoinPrivateChallenge';
import CreateChallengeForm from '@/components/CreateChallengeForm';
import {
  Trophy,
  Zap,
  Users,
  Search,
  Plus,
  Clock,
  ArrowRight,
  Lock,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Challenge } from '@/api/types';

const Challenges = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPrivateJoin, setShowPrivateJoin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch challenges
  const { data: challenges, isLoading, refetch } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => getChallenges(),
  });

  const filteredChallenges = challenges?.filter(challenge => {
    if (activeTab === "my" && !challenge.isActive) return false; // Changed isParticipant to isActive
    if (activeTab === "public" && challenge.isPrivate) return false;
    if (activeTab === "private" && !challenge.isPrivate) return false;
    
    // Search by title or access code
    if (searchQuery) {
      return challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             (challenge.accessCode && challenge.accessCode.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    return true;
  });

  const handleCreateChallenge = () => {
    setShowCreateForm(false);
    refetch();
    toast({
      title: "Challenge Created",
      description: "Your challenge has been created successfully.",
    });
  };

  const handleJoinPrivate = () => {
    setShowPrivateJoin(false);
    toast({
      title: "Joined Challenge",
      description: "You have successfully joined the private challenge.",
    });
    refetch();
  };

  return (
    <div className="min-h-screen">
      <MainNavbar />
      
      <main className="pt-20 pb-16">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Challenges</h1>
              <p className="text-zinc-400 mt-1">Compete with others and improve your skills</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="gap-2 border-zinc-700 hover:bg-zinc-800"
                onClick={() => setShowPrivateJoin(true)}
              >
                <Lock className="h-4 w-4" />
                Join Private
              </Button>
              
              <Button 
                className="gap-2 bg-green-500 hover:bg-green-600"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4" />
                Create Challenge
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Challenge Lists */}
            <div className="lg:col-span-2 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search challenges by title or access code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-zinc-800/50 border-zinc-700/50"
                />
              </div>
              
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-zinc-800/50">
                  <TabsTrigger value="all" className="data-[state=active]:bg-zinc-700">All</TabsTrigger>
                  <TabsTrigger value="my" className="data-[state=active]:bg-zinc-700">My Challenges</TabsTrigger>
                  <TabsTrigger value="public" className="data-[state=active]:bg-zinc-700">Public</TabsTrigger>
                  <TabsTrigger value="private" className="data-[state=active]:bg-zinc-700">Private</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-4">
                  {isLoading ? (
                    <div className="text-center py-8">Loading challenges...</div>
                  ) : filteredChallenges?.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400">
                      No challenges found. Try adjusting your search or create a new challenge.
                    </div>
                  ) : (
                    filteredChallenges?.map(challenge => (
                      <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="my" className="space-y-4 mt-4">
                  {isLoading ? (
                    <div className="text-center py-8">Loading your challenges...</div>
                  ) : filteredChallenges?.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400">
                      You haven't joined any challenges yet.
                    </div>
                  ) : (
                    filteredChallenges?.map(challenge => (
                      <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="public" className="space-y-4 mt-4">
                  {isLoading ? (
                    <div className="text-center py-8">Loading public challenges...</div>
                  ) : filteredChallenges?.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400">
                      No public challenges found.
                    </div>
                  ) : (
                    filteredChallenges?.map(challenge => (
                      <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="private" className="space-y-4 mt-4">
                  {isLoading ? (
                    <div className="text-center py-8">Loading private challenges...</div>
                  ) : filteredChallenges?.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400">
                      No private challenges found.
                    </div>
                  ) : (
                    filteredChallenges?.map(challenge => (
                      <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right Column - Quick Actions */}
            <div className="space-y-6">
              {/* 1v1 Challenges */}
              <Card className="bg-green-900/20 border-green-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-400" />
                    1v1 Challenges
                  </CardTitle>
                  <CardDescription>
                    Challenge friends or random opponents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-zinc-800/70 border border-zinc-700/50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-500/10 p-2 rounded-lg">
                        <Zap className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium">Quick Match</div>
                        <div className="text-sm text-zinc-400">Find an opponent with similar skill</div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      Start
                    </Button>
                  </div>
                  
                  <div className="bg-zinc-800/70 border border-zinc-700/50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-500/10 p-2 rounded-lg">
                        <User className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">Challenge a Friend</div>
                        <div className="text-sm text-zinc-400">Send a challenge to a specific user</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-zinc-700 hover:bg-zinc-700">
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Upcoming Competitions */}
              <Card className="bg-zinc-800/50 border-zinc-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Upcoming Competitions
                  </CardTitle>
                  <CardDescription>
                    Participate in contests and earn rewards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border border-zinc-700/50 rounded-lg p-4">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-amber-500/10 p-2 rounded-lg">
                          <Trophy className="h-4 w-4 text-amber-500" />
                        </div>
                        <div>
                          <div className="font-medium">Weekly Contest #145</div>
                          <div className="flex items-center text-sm text-zinc-400 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            Tomorrow, 10:00 AM
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-zinc-700 h-8">
                        Register
                      </Button>
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-zinc-400">
                      <div>145 registered</div>
                      <div>Difficulty: Medium</div>
                    </div>
                  </div>
                  
                  <div className="border border-zinc-700/50 rounded-lg p-4">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-500/10 p-2 rounded-lg">
                          <Zap className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <div className="font-medium">Algorithm Battle</div>
                          <div className="flex items-center text-sm text-zinc-400 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            Friday, 7:00 PM
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-zinc-700 h-8">
                        Register
                      </Button>
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-zinc-400">
                      <div>89 registered</div>
                      <div>Difficulty: Hard</div>
                    </div>
                  </div>
                  
                  <Link to="/competitions" className="flex items-center text-sm text-green-400 hover:text-green-300 transition-colors">
                    View all competitions
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </CardContent>
              </Card>
              
              {/* Stats Card */}
              <Card className="bg-zinc-800/50 border-zinc-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Problems Solved</span>
                      <span className="font-medium">124</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Current Streak</span>
                      <span className="font-medium">7 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Longest Streak</span>
                      <span className="font-medium">21 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Current Rating</span>
                      <span className="font-medium">1750 <span className="text-green-500 text-xs">+15</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Global Rank</span>
                      <span className="font-medium">#1,245 <span className="text-green-500 text-xs">+32</span></span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      {/* Modal for joining private challenge */}
      {showPrivateJoin && (
        <JoinPrivateChallenge 
          isOpen={showPrivateJoin} 
          onClose={() => setShowPrivateJoin(false)}
        />
      )}
      
      {/* Modal for creating a challenge */}
      {showCreateForm && (
        <CreateChallengeForm 
          isOpen={showCreateForm} 
          onClose={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};

export default Challenges;
