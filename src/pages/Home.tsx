
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const Home = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar isAuthenticated={false} />
      <main>
        <HeroSection />
        <FeatureSection />
        
        {/* Testimonials Section */}
        <section className="py-24 bg-zinc-900">
          <div className="page-container">
            <div className="text-center mb-16">
              <motion.div 
                className="inline-block mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-zenblue/10 rounded-full px-4 py-1.5 text-sm font-medium text-zenblue">
                  Testimonials
                </div>
              </motion.div>
              
              <motion.h2 
                className="text-3xl md:text-4xl font-bold font-display tracking-tight mb-4 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                What our users are saying
              </motion.h2>
              
              <motion.p 
                className="text-lg text-zinc-400 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Join thousands of developers who have improved their skills with our platform.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-6 shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{testimonial.name}</h3>
                      <p className="text-sm text-zinc-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-zinc-300 italic">"{testimonial.quote}"</p>
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
          
          <div className="page-container relative z-10">
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
                <motion.button 
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started for Free
                </motion.button>
                
                <motion.button 
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-medium border border-zinc-700 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Documentation
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Testimonial data
const testimonials = [
  {
    name: "Alex Chen",
    role: "Senior Developer",
    quote: "ZenX has completely transformed how I approach coding challenges. The leaderboard keeps me motivated.",
    image: "https://i.pravatar.cc/150?img=11"
  },
  {
    name: "Sarah Johnson",
    role: "Full Stack Engineer",
    quote: "The real-time analytics have helped me identify weaknesses in my problem-solving approach.",
    image: "https://i.pravatar.cc/150?img=5"
  },
  {
    name: "Miguel Rodriguez",
    role: "Software Architect",
    quote: "I recommend ZenX to all the junior developers on my team. It's the perfect platform to grow.",
    image: "https://i.pravatar.cc/150?img=68"
  }
];

export default Home;
