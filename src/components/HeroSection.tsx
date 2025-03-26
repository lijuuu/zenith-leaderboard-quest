
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-zenblue/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-zinc-100 rounded-full blur-3xl" />
      </div>

      <div className="page-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 animate-fade-down opacity-0" style={{ animationDelay: "100ms" }}>
            <div className="bg-zinc-100 border border-zinc-200 rounded-full px-4 py-1.5 text-sm font-medium text-zinc-800">
              The ultimate performance platform
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-6 animate-fade-up opacity-0 text-balance" style={{ animationDelay: "300ms" }}>
            <span className="block">Elevate Your Performance With</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-zenblue to-[#0A84FF]">Real-Time Analytics</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-600 mb-8 max-w-2xl mx-auto animate-fade-up opacity-0 text-balance" style={{ animationDelay: "500ms" }}>
            Optimize your workflow and track progress with our comprehensive leaderboard system. Designed for professionals who demand excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up opacity-0" style={{ animationDelay: "700ms" }}>
            <Link
              to="/leaderboard"
              className={cn(
                "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium",
                "bg-zinc-900 text-white hover:bg-black",
                "shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]",
                "transition-all duration-300 ease-in-out"
              )}
            >
              View Leaderboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            
            <Link
              to="/#features"
              className={cn(
                "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium",
                "bg-white text-zinc-800 hover:bg-zinc-100",
                "border border-zinc-200 hover:border-zinc-300",
                "transition-all duration-300 ease-in-out"
              )}
            >
              Explore Features
            </Link>
          </div>
        </div>
        
        {/* Hero image/dashboard preview */}
        <div className="mt-16 md:mt-20 max-w-5xl mx-auto animate-fade-up opacity-0" style={{ animationDelay: "900ms" }}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 rounded-2xl" />
            <div className="glass rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12)] overflow-hidden border border-white/40">
              <img 
                src="https://framerusercontent.com/images/kfr022WaJ8YJUyZFmdwCB3pXRA.jpg" 
                alt="Dashboard Preview" 
                className="w-full h-auto transition-all duration-700 ease-in-out"
                onLoad={(e) => e.currentTarget.classList.add('animate-blur-in')}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
