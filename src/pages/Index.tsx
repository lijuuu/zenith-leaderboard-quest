
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Trophy, Zap, Terminal, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <Code className="w-10 h-10 text-accent-color" />,
      title: "Diverse Problem Set",
      description: "Tackle a wide range of coding challenges across different difficulty levels and categories."
    },
    {
      icon: <Trophy className="w-10 h-10 text-accent-color" />,
      title: "Competitive Leaderboard",
      description: "Compare your progress with peers and climb the ranks as you solve more problems."
    },
    {
      icon: <Terminal className="w-10 h-10 text-accent-color" />,
      title: "Integrated Compiler",
      description: "Write, test, and debug your code in our powerful online compiler environment."
    },
    {
      icon: <Zap className="w-10 h-10 text-accent-color" />,
      title: "Daily Challenges",
      description: "Sharpen your skills with our daily coding challenges and earn bonus points."
    },
    {
      icon: <Users className="w-10 h-10 text-accent-color" />,
      title: "Community Learning",
      description: "Share solutions, discuss approaches, and learn from the community."
    },
    {
      icon: <CheckCircle2 className="w-10 h-10 text-accent-color" />,
      title: "Track Progress",
      description: "Monitor your improvement over time with detailed performance analytics."
    }
  ];

  return (
    <div className="animate-page-in min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-900 to-zinc-900 text-white foggy-grain">
      <Navbar isAuthenticated={false} />
      
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-20">
          <div className="page-container">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
                  Master Coding Skills<br />
                  <span className="text-accent-color">One Challenge</span> at a Time
                </h1>
                
                <p className="text-lg text-zinc-300 max-w-xl">
                  Join thousands of developers improving their coding skills through practical problem-solving, competitive challenges, and an engaged community.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button className="accent-color text-lg px-6 py-6" size="lg" asChild>
                    <Link to="/problems">
                      Start Coding <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="text-white border-zinc-700 hover:bg-zinc-800 text-lg px-6 py-6" size="lg" asChild>
                    <Link to="/challenges">
                      Explore Challenges
                    </Link>
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 overflow-hidden">
                        <img 
                          src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                          alt="User avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-zinc-400">
                    Join <span className="font-bold text-white">10,000+</span> developers worldwide
                  </p>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="aspect-[4/3] w-full max-w-2xl rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm shadow-xl">
                    <div className="absolute top-0 w-full h-10 bg-zinc-800/50 flex items-center px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="pt-10 p-6 h-full font-mono text-sm text-green-400 overflow-hidden">
                      <div className="space-y-2">
                        <p><span className="text-blue-400">function</span> <span className="text-yellow-400">findMaxSum</span>(arr) {`{`}</p>
                        <p className="pl-4"><span className="text-purple-400">let</span> maxSoFar = arr[<span className="text-orange-400">0</span>];</p>
                        <p className="pl-4"><span className="text-purple-400">let</span> maxEndingHere = arr[<span className="text-orange-400">0</span>];</p>
                        <p className="pl-4"></p>
                        <p className="pl-4"><span className="text-blue-400">for</span> (<span className="text-purple-400">let</span> i = <span className="text-orange-400">1</span>; i {'<'} arr.length; i++) {`{`}</p>
                        <p className="pl-8">maxEndingHere = Math.<span className="text-yellow-400">max</span>(arr[i], maxEndingHere + arr[i]);</p>
                        <p className="pl-8">maxSoFar = Math.<span className="text-yellow-400">max</span>(maxSoFar, maxEndingHere);</p>
                        <p className="pl-4">{`}`}</p>
                        <p className="pl-4"></p>
                        <p className="pl-4"><span className="text-blue-400">return</span> maxSoFar;</p>
                        <p>{`}`}</p>
                        <p className="pt-4"><span className="text-zinc-500">// Test the function</span></p>
                        <p><span className="text-purple-400">const</span> arr = [<span className="text-orange-400">-2, 1, -3, 4, -1, 2, 1, -5, 4</span>];</p>
                        <p>console.<span className="text-yellow-400">log</span>(findMaxSum(arr)); <span className="text-zinc-500">// Output: 6</span></p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent-color/20 rounded-full blur-3xl"></div>
                  <div className="absolute -top-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-zinc-900/50">
          <div className="page-container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Everything You Need to <span className="text-accent-color">Excel</span>
              </h2>
              <p className="text-zinc-300">
                Our platform provides all the tools and resources you need to become a better programmer.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-6 hover:border-accent-color/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-color/5 h-full"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-zinc-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-20">
          <div className="page-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "10,000+", label: "Active Users" },
                { value: "500+", label: "Problems" },
                { value: "50+", label: "Daily Challenges" },
                { value: "100K+", label: "Submissions" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-accent-color mb-2">{stat.value}</div>
                  <div className="text-zinc-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900">
          <div className="page-container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
                Ready to Improve Your <span className="text-accent-color">Coding Skills</span>?
              </h2>
              <p className="text-zinc-300 mb-8">
                Join our platform today and start your journey towards becoming a better programmer.
              </p>
              <Button className="accent-color text-lg px-8 py-6" size="lg" asChild>
                <Link to="/problems">
                  Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
