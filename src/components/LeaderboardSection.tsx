
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Medal } from "lucide-react";

// Sample leaderboard data
const leaderboardData = [
  { id: 1, name: "Alex Johnson", score: 98.7, change: "+2.1", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 2, name: "Taylor Smith", score: 96.2, change: "+1.5", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 3, name: "Jamie Parker", score: 93.8, change: "-0.3", avatar: "https://randomuser.me/api/portraits/men/86.jpg" },
  { id: 4, name: "Casey Reed", score: 92.1, change: "+1.8", avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
  { id: 5, name: "Morgan White", score: 91.5, change: "+0.7", avatar: "https://randomuser.me/api/portraits/men/15.jpg" },
];

const LeaderboardSection = () => {
  const [activeTab, setActiveTab] = useState("weekly");

  return (
    <section className="section-spacing">
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <div className="inline-block mb-4">
              <div className="bg-zinc-100 rounded-full px-4 py-1.5 text-sm font-medium text-zinc-800">
                Rankings
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight mb-4">
              Top Performers
            </h2>
            
            <p className="text-lg text-zinc-600 max-w-xl">
              See who's leading the pack and get inspired to improve your own performance.
            </p>
          </div>
          
          <div className="inline-flex bg-zinc-100 p-1 rounded-full">
            <button
              onClick={() => setActiveTab("daily")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                activeTab === "daily" 
                  ? "bg-white shadow-sm text-zinc-900" 
                  : "text-zinc-600 hover:text-zinc-900"
              )}
            >
              Daily
            </button>
            <button
              onClick={() => setActiveTab("weekly")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                activeTab === "weekly" 
                  ? "bg-white shadow-sm text-zinc-900" 
                  : "text-zinc-600 hover:text-zinc-900"
              )}
            >
              Weekly
            </button>
            <button
              onClick={() => setActiveTab("monthly")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                activeTab === "monthly" 
                  ? "bg-white shadow-sm text-zinc-900" 
                  : "text-zinc-600 hover:text-zinc-900"
              )}
            >
              Monthly
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {leaderboardData.map((user, index) => (
                  <tr key={user.id} className="transition-colors hover:bg-zinc-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index === 0 ? (
                          <Trophy className="w-5 h-5 text-amber-500" />
                        ) : index === 1 ? (
                          <Medal className="w-5 h-5 text-zinc-400" />
                        ) : index === 2 ? (
                          <Medal className="w-5 h-5 text-amber-700" />
                        ) : (
                          <span className="text-sm font-medium text-zinc-700">{index + 1}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden border border-zinc-200">
                          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-zinc-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-zinc-900">{user.score}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={cn(
                        "text-sm font-medium",
                        user.change.startsWith("+") ? "text-emerald-600" : "text-red-600"
                      )}>
                        {user.change}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="py-4 px-6 border-t border-zinc-200 bg-zinc-50">
            <Link 
              to="/leaderboard"
              className="text-sm font-medium text-zenblue hover:text-zenblue/80 flex items-center gap-1 transition-colors"
            >
              View full leaderboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
