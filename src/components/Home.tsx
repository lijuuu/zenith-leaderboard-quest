
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { GitCompare, Sword, Trophy, Code, Flame, ArrowRight, Users, Github } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  
  useEffect(() => {
    // Show a welcome toast when the component mounts
    toast({
      title: "Welcome to CodeBattle!",
      description: "Ready to improve your coding skills?",
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-gradient-to-b from-white to-green-50 dark:from-zinc-900 dark:to-zinc-950">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
                Become a Better Developer Through Challenges
              </h1>
              <p className="text-xl text-zinc-700 dark:text-zinc-300 mb-8 max-w-2xl mx-auto">
                Face real-world coding problems, compete with others, and track your progress to accelerate your growth as a developer.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  onClick={handleQuickMatch}
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white py-6 px-8 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Flame className="h-5 w-5" />
                  Quick Match
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/challenges')}
                  className="py-6 px-8 rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-white flex items-center justify-center gap-2"
                >
                  <Sword className="h-5 w-5" />
                  Browse Challenges
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-green-50 dark:bg-zinc-900">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 hover:dark:bg-green-900/30">
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Everything you need to <span className="text-green-600 dark:text-green-500">excel</span>
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Our platform provides all the tools necessary for tracking, analyzing, and improving your coding skills.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-green-100 dark:border-green-900/30 dark:bg-zinc-800">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-green-600 dark:text-green-500" />
                  </div>
                  <CardTitle>Real-world Problems</CardTitle>
                  <CardDescription>
                    Solve challenges based on actual industry problems that developers face.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-green-100 dark:border-green-900/30 dark:bg-zinc-800">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <GitCompare className="h-6 w-6 text-green-600 dark:text-green-500" />
                  </div>
                  <CardTitle>Live Competition</CardTitle>
                  <CardDescription>
                    Compete with other developers in real-time coding battles and challenges.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-green-100 dark:border-green-900/30 dark:bg-zinc-800">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <Trophy className="h-6 w-6 text-green-600 dark:text-green-500" />
                  </div>
                  <CardTitle>Leaderboard</CardTitle>
                  <CardDescription>
                    Track your progress and see how you rank against other developers.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-500 text-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Ready to challenge yourself?
                </h2>
                <p className="text-lg text-green-50 mb-6">
                  Join thousands of developers who are improving their skills through daily coding challenges.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/register')}
                  size="lg" 
                  className="bg-white text-green-600 hover:bg-green-50 py-6 px-8 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="py-6 px-8 rounded-xl bg-transparent border-white text-white hover:bg-white/10 flex items-center justify-center gap-2"
                >
                  Log In
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-16 bg-white dark:bg-zinc-950">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 hover:dark:bg-green-900/30">
                Community
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Join our growing developer community
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Connect with like-minded developers, share solutions, and learn together.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-green-100 dark:border-green-900/30 dark:bg-zinc-800">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-500" />
                  </div>
                  <CardTitle>10,000+</CardTitle>
                  <CardDescription>
                    Active developers in our community
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-green-100 dark:border-green-900/30 dark:bg-zinc-800">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-green-600 dark:text-green-500" />
                  </div>
                  <CardTitle>500+</CardTitle>
                  <CardDescription>
                    Coding challenges in various languages and difficulty levels
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-green-100 dark:border-green-900/30 dark:bg-zinc-800">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <Github className="h-6 w-6 text-green-600 dark:text-green-500" />
                  </div>
                  <CardTitle>Open Source</CardTitle>
                  <CardDescription>
                    Contribute to our platform and help it grow
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
