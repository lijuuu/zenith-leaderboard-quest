
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { GitCompare, Sword, Trophy, Code, Flame, ArrowRight, Users, Github } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import LeaderboardSection from './LeaderboardSection';
import ChallengeBattleInvite from './chat/ChallengeBattleInvite';
import ChatBattleNotification from './chat/ChatBattleNotification';

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDemo, setShowDemo] = useState(true);
  
  const handleQuickMatch = () => {
    navigate('/quick-match');
  };
  
  const handleChallengeAccept = () => {
    toast({
      title: "Challenge accepted",
      description: "You've joined the coding battle",
    });
    navigate('/challenges');
  };
  
  const mockChallenge = {
    id: "battle-1",
    title: "Algorithm Battle",
    isPrivate: true,
    accessCode: "XYZ123",
    expiresIn: "30 min",
    participants: 2,
    difficulty: "medium" as "easy" | "medium" | "hard"
  };
  
  const mockChatChallenge = {
    id: "chat-battle-1",
    title: "Data Structure Duel",
    isPrivate: true,
    difficulty: "hard" as "easy" | "medium" | "hard",
    expiresIn: "15 min",
    sender: {
      name: "Sophie Williams",
      avatar: "https://i.pravatar.cc/300?img=9",
    },
    timestamp: "2 min ago"
  };

  useEffect(() => {
    // Show a welcome toast when the component mounts
    toast({
      title: "Welcome to ZenX!",
      description: "The ultimate coding challenge platform",
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        
        <section className="bg-white dark:bg-zinc-950 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">New Challenge Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Sword className="h-5 w-5 text-orange-500" />
                  Challenge Battle Invites
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Send and receive coding battle invites to compete with friends in real-time challenges.
                </p>
                
                <div className="mt-4">
                  <ChallengeBattleInvite 
                    challenge={mockChallenge}
                    onAccept={handleChallengeAccept}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Battle Notifications in Chat
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Receive and respond to battle invitations directly in your chat conversations.
                </p>
                
                <div className="mt-4">
                  <ChatBattleNotification challenge={mockChatChallenge} />
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-10">
              <Button 
                size="lg" 
                className="accent-color"
                onClick={() => navigate('/challenges')}
              >
                Explore Challenge Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        
        <FeatureSection />
        <LeaderboardSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
