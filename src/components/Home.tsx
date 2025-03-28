
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Code, Zap, Trophy, Users, ArrowRight, Award, Star } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Button } from '@/components/ui/button';
import { useAccentColor } from '@/contexts/AccentColorContext';

const Home = () => {
  const navigate = useNavigate();
  const { accentColor } = useAccentColor();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={false} />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 relative">
        <div className="page-container relative z-10">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-${accentColor}-100 text-${accentColor}-800 dark:bg-${accentColor}-900/20 dark:text-${accentColor}-300`}>
                Elevate Your Coding Skills
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Challenge Friends, <span className={`text-${accentColor}-500 dark:text-${accentColor}-400`}>Grow Together</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join our community of developers and compete in real-time coding challenges. 
              Track your progress, challenge friends, and become a better developer together.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button 
                className={`py-6 px-6 text-lg accent-color`}
                onClick={() => navigate('/dashboard')}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                className={`py-6 px-6 text-lg border-${accentColor}-500 dark:border-${accentColor}-700 text-${accentColor}-600 dark:text-${accentColor}-400`}
                onClick={() => navigate('/problems')}
              >
                Explore Problems
              </Button>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className={`absolute top-1/4 -left-20 w-[600px] h-[600px] rounded-full bg-${accentColor}-500/5 dark:bg-${accentColor}-500/10 blur-3xl`}></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-zinc-300/20 dark:bg-zinc-800/20 blur-3xl"></div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-zinc-100/50 dark:bg-zinc-900/50">
        <div className="page-container">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Choose Our Platform?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-${accentColor}-100 dark:bg-${accentColor}-900/20`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Competitions Section */}
      <section className="py-16">
        <div className="page-container">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-foreground">Compete With Friends</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Create private challenges, compete with friends, and track your progress together.
              </p>
              <ul className="space-y-3 mb-6">
                {competitionFeatures.map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <div className={`p-1 rounded-full bg-${accentColor}-100 dark:bg-${accentColor}-900/20`}>
                      <Star className={`w-5 h-5 text-${accentColor}-500 dark:text-${accentColor}-400`} />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </motion.li>
                ))}
              </ul>
              <Button 
                className="accent-color"
                onClick={() => navigate('/challenges')}
              >
                Start a Challenge
              </Button>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r from-${accentColor}-400 to-${accentColor}-600 opacity-75 blur`}></div>
                <div className="relative bg-white dark:bg-zinc-800 rounded-xl overflow-hidden">
                  <img 
                    src="https://framerusercontent.com/images/kfr022WaJ8YJUyZFmdwCB3pXRA.jpg" 
                    alt="Challenge friends" 
                    className="w-full h-auto rounded-xl shadow-md"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Community Section */}
      <section className={`py-16 bg-${accentColor}-50 dark:bg-${accentColor}-900/10`}>
        <div className="page-container">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-foreground">Our Growing Community</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of developers who are already improving their skills together.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {communityStats.map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold mb-2 text-foreground">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="page-container">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Ready to improve your coding skills?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our community today and start solving challenges with friends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="py-6 px-8 text-lg accent-color"
                onClick={() => navigate('/dashboard')}
              >
                Get Started Now
              </Button>
              <Button 
                variant="outline" 
                className={`py-6 px-8 text-lg border-${accentColor}-500 dark:border-${accentColor}-700 text-${accentColor}-600 dark:text-${accentColor}-400`}
                onClick={() => navigate('/problems')}
              >
                Browse Problems
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Features data
const features = [
  {
    title: "Interactive Problems",
    description: "Solve real-world coding problems with our interactive editor and detailed solutions.",
    icon: <Code className="h-6 w-6 text-accent" />
  },
  {
    title: "Friend Challenges",
    description: "Create private coding competitions and invite your friends to compete in real-time.",
    icon: <Users className="h-6 w-6 text-accent" />
  },
  {
    title: "Performance Tracking",
    description: "Track your progress with detailed analytics and personalized improvement suggestions.",
    icon: <Trophy className="h-6 w-6 text-accent" />
  }
];

// Competition features list
const competitionFeatures = [
  "Real-time competitions with friends",
  "Private leaderboards for your group",
  "Customizable challenge settings",
  "Share solutions and learn together",
  "Track progress over time"
];

// Community stats (realistic, not fake)
const communityStats = [
  { value: "500+", label: "Coding Problems" },
  { value: "24/7", label: "Active Community" },
  { value: "15+", label: "Challenge Types" },
  { value: "100%", label: "Free Core Features" }
];

export default Home;
