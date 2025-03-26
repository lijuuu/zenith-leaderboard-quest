
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Medal, Search, Trophy, Users, Filter, ArrowUp, ArrowDown } from 'lucide-react';

// Sample expanded leaderboard data
const leaderboardData = [
  { 
    id: 1, 
    name: "Alex Johnson", 
    score: 98.7, 
    change: "+2.1", 
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rank: 1,
    level: "Diamond",
    points: 12850,
    achievements: 37,
    streak: 28,
  },
  { 
    id: 2, 
    name: "Taylor Smith", 
    score: 96.2, 
    change: "+1.5", 
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rank: 2,
    level: "Diamond",
    points: 11920,
    achievements: 31,
    streak: 19,
  },
  { 
    id: 3, 
    name: "Jamie Parker", 
    score: 93.8, 
    change: "-0.3", 
    avatar: "https://randomuser.me/api/portraits/men/86.jpg",
    rank: 3,
    level: "Platinum",
    points: 10785,
    achievements: 29,
    streak: 14,
  },
  { 
    id: 4, 
    name: "Casey Reed", 
    score: 92.1, 
    change: "+1.8", 
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rank: 4,
    level: "Platinum",
    points: 9650,
    achievements: 27,
    streak: 12,
  },
  { 
    id: 5, 
    name: "Morgan White", 
    score: 91.5, 
    change: "+0.7", 
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    rank: 5,
    level: "Platinum",
    points: 9320,
    achievements: 25,
    streak: 15,
  },
  { 
    id: 6, 
    name: "Jordan Lee", 
    score: 89.3, 
    change: "+1.2", 
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    rank: 6,
    level: "Gold",
    points: 8750,
    achievements: 23,
    streak: 9,
  },
  { 
    id: 7, 
    name: "Riley Cooper", 
    score: 87.9, 
    change: "-0.5", 
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    rank: 7,
    level: "Gold",
    points: 8210,
    achievements: 22,
    streak: 7,
  },
  { 
    id: 8, 
    name: "Avery Martinez", 
    score: 86.4, 
    change: "+0.9", 
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rank: 8,
    level: "Gold",
    points: 7980,
    achievements: 21,
    streak: 11,
  },
  { 
    id: 9, 
    name: "Quinn Wilson", 
    score: 84.7, 
    change: "+1.7", 
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    rank: 9,
    level: "Silver",
    points: 7650,
    achievements: 19,
    streak: 8,
  },
  { 
    id: 10, 
    name: "Blake Thompson", 
    score: 83.2, 
    change: "-0.2", 
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    rank: 10,
    level: "Silver",
    points: 7410,
    achievements: 18,
    streak: 6,
  },
  { 
    id: 11, 
    name: "Drew Garcia", 
    score: 82.5, 
    change: "+1.1", 
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    rank: 11,
    level: "Silver",
    points: 7290,
    achievements: 17,
    streak: 5,
  },
  { 
    id: 12, 
    name: "Charlie Rivera", 
    score: 81.0, 
    change: "+0.4", 
    avatar: "https://randomuser.me/api/portraits/women/14.jpg",
    rank: 12,
    level: "Silver",
    points: 7120,
    achievements: 16,
    streak: 7,
  },
];

const getLevelColor = (level: string) => {
  switch(level) {
    case 'Diamond':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100';
    case 'Platinum':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-100';
    case 'Gold':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-100';
    case 'Silver':
      return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100';
    default:
      return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100';
  }
};

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) {
    return <Trophy className="w-5 h-5 text-amber-500" />;
  } else if (rank === 2) {
    return <Medal className="w-5 h-5 text-zinc-400" />;
  } else if (rank === 3) {
    return <Medal className="w-5 h-5 text-amber-700" />;
  } else {
    return <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{rank}</span>;
  }
};

const Leaderboard = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [sortField, setSortField] = useState('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(leaderboardData);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
    
    // Simulate loading data
    const timer = setTimeout(() => {
      toast({
        title: "Leaderboard updated",
        description: "The latest rankings have been loaded.",
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    // Filter and sort data
    let data = [...leaderboardData];
    
    // Apply search filter
    if (searchTerm) {
      data = data.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    data.sort((a, b) => {
      const fieldA = a[sortField as keyof typeof a];
      const fieldB = b[sortField as keyof typeof b];
      
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      }
      
      return 0;
    });
    
    setFilteredData(data);
  }, [searchTerm, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="animate-page-in min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-300/20 via-white to-white dark:from-zinc-800/20 dark:via-zinc-900 dark:to-zinc-900 foggy-grain">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="page-container">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight mb-4">
                Leaderboard
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Track performance metrics and see where you stand among other users.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden shadow-sm mb-8">
              <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-2 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-lg px-3 py-2 w-full sm:w-auto">
                  <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="bg-transparent border-none outline-none text-sm w-full dark:text-zinc-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <button className="bg-zinc-100/80 dark:bg-zinc-800/80 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                  
                  <div className="inline-flex bg-zinc-100/80 dark:bg-zinc-800/80 p-1 rounded-lg">
                    <button
                      onClick={() => setTimeRange('daily')}
                      className={cn(
                        "px-3 py-1 text-sm font-medium rounded-md transition-all duration-200",
                        timeRange === 'daily' 
                          ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-100" 
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      )}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => setTimeRange('weekly')}
                      className={cn(
                        "px-3 py-1 text-sm font-medium rounded-md transition-all duration-200",
                        timeRange === 'weekly' 
                          ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-100" 
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      )}
                    >
                      Weekly
                    </button>
                    <button
                      onClick={() => setTimeRange('monthly')}
                      className={cn(
                        "px-3 py-1 text-sm font-medium rounded-md transition-all duration-200",
                        timeRange === 'monthly' 
                          ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-100" 
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      )}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/80 dark:bg-zinc-800/30">
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        <button 
                          className="flex items-center gap-1"
                          onClick={() => handleSort('rank')}
                        >
                          Rank
                          {sortField === 'rank' && (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="w-3 h-3" /> : 
                              <ArrowDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        <button 
                          className="flex items-center gap-1"
                          onClick={() => handleSort('name')}
                        >
                          User
                          {sortField === 'name' && (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="w-3 h-3" /> : 
                              <ArrowDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        <button 
                          className="flex items-center gap-1"
                          onClick={() => handleSort('level')}
                        >
                          Level
                          {sortField === 'level' && (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="w-3 h-3" /> : 
                              <ArrowDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        <button 
                          className="flex items-center gap-1 ml-auto"
                          onClick={() => handleSort('points')}
                        >
                          Points
                          {sortField === 'points' && (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="w-3 h-3" /> : 
                              <ArrowDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        <button 
                          className="flex items-center gap-1 ml-auto"
                          onClick={() => handleSort('score')}
                        >
                          Score
                          {sortField === 'score' && (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="w-3 h-3" /> : 
                              <ArrowDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
                    {filteredData.map((user) => (
                      <tr key={user.id} className="transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <RankBadge rank={user.rank} />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden border border-zinc-200/50 dark:border-zinc-700/50">
                              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{user.name}</div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {user.achievements} achievements
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            getLevelColor(user.level)
                          )}>
                            {user.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{user.points.toLocaleString()}</div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">{user.streak} day streak</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{user.score}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className={cn(
                            "text-sm font-medium",
                            user.change.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                          )}>
                            {user.change}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="py-4 px-6 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/80 dark:bg-zinc-800/30 flex justify-between items-center">
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Showing <span className="font-medium">{filteredData.length}</span> of <span className="font-medium">{leaderboardData.length}</span> users
                </div>
                
                <div className="flex gap-2">
                  <button className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none" disabled>
                    Previous
                  </button>
                  <button className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-3 py-1 rounded text-sm font-medium transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
