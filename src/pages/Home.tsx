
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Zap, CheckCircle, ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar isAuthenticated={false} />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
          {/* Background elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-zinc-800/80 rounded-full blur-3xl" />
          </div>

          <div className="page-container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div 
                className="inline-block mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="bg-zinc-800 border border-zinc-700 rounded-full px-4 py-1.5 text-sm font-medium text-green-400">
                  The ultimate coding platform
                </div>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-6 text-balance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span className="block">Master Coding Challenges</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-500">With Real-Time Analytics</span>
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto text-balance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Optimize your coding skills and track progress with our comprehensive problem-solving platform. Designed for professionals who demand excellence.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/dashboard">
                    <Button className="bg-green-500 hover:bg-green-600 text-white py-6 px-8 text-lg font-medium flex items-center gap-2">
                      Get Started
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/problems">
                    <Button variant="outline" className="py-6 px-8 text-lg font-medium border-zinc-700 hover:bg-zinc-800">
                      Explore Problems
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Hero image/dashboard preview */}
            <motion.div 
              className="mt-16 md:mt-20 max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div className="relative">
                <motion.div 
                  className="glass rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] overflow-hidden border border-zinc-800"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.4 }}
                >
                  <img 
                    src="https://framerusercontent.com/images/kfr022WaJ8YJUyZFmdwCB3pXRA.jpg" 
                    alt="Platform Preview" 
                    className="w-full h-auto"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-24 bg-zinc-900 relative overflow-hidden" id="features">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <div className="page-container">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold font-display tracking-tight mb-4 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Features that set us apart
              </motion.h2>
              
              <motion.p 
                className="text-lg text-zinc-400 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Everything you need to take your coding skills to the next level
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.bgColor}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 mb-4">{feature.description}</p>
                  <Link to={feature.linkTo} className="text-green-400 flex items-center gap-1 text-sm hover:text-green-300 transition-colors group">
                    Learn more
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-20 bg-zinc-950">
          <div className="page-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-zinc-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-zinc-800/80 rounded-full blur-3xl" />
          </div>
          
          <div className="page-container">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight mb-6 text-white">
                Ready to take your coding skills to the next level?
              </h2>
              
              <p className="text-lg text-zinc-400 mb-8">
                Join our community of developers and start solving challenges today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/dashboard">
                    <Button className="px-8 py-6 bg-green-500 hover:bg-green-600 text-white text-lg font-medium">
                      Get Started Now
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/problems">
                    <Button variant="outline" className="px-8 py-6 bg-zinc-800 hover:bg-zinc-700 text-white text-lg font-medium border border-zinc-700">
                      Browse Problems
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Feature card data
const features = [
  {
    title: "Interactive Problems",
    description: "Over 500+ coding problems with varying difficulty levels to help you prepare for technical interviews.",
    icon: <Code className="h-6 w-6 text-white" />,
    bgColor: "bg-blue-500/20",
    linkTo: "/problems"
  },
  {
    title: "Real-time Challenges",
    description: "Compete with other developers in real-time challenges to test your skills under pressure.",
    icon: <Zap className="h-6 w-6 text-white" />,
    bgColor: "bg-green-500/20",
    linkTo: "/challenges"
  },
  {
    title: "Performance Analytics",
    description: "Track your progress with detailed analytics and visualizations to identify areas for improvement.",
    icon: <CheckCircle className="h-6 w-6 text-white" />,
    bgColor: "bg-purple-500/20",
    linkTo: "/dashboard"
  }
];

// Stats data
const stats = [
  { value: "500+", label: "Coding Problems" },
  { value: "10K+", label: "Active Users" },
  { value: "1M+", label: "Problems Solved" },
  { value: "150+", label: "Countries" }
];

export default Home;
