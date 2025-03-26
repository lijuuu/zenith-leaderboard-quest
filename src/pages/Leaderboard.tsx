
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Medal, 
  Search, 
  Trophy, 
  Users, 
  Filter, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLeaderboard } from '@/api/leaderboardApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const Leaderboard = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [sortField, setSortField] = useState('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setIsLoading(true);
      const response = await getLeaderboard({ limit: 10 });
      setLeaderboardData(response.leaderboard);
      setFilteredData(response.leaderboard);
      
      toast({
        title: "Leaderboard updated",
        description: "The latest rankings have been loaded.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load leaderboard",
        description: "There was an error loading the leaderboard data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Filter and sort data
    if (leaderboardData.length === 0) return;
    
    let data = [...leaderboardData];
    
    // Apply search filter
    if (searchTerm) {
      data = data.filter(item => 
        item.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    data.sort((a, b) => {
      let fieldA, fieldB;
      
      if (sortField === 'username') {
        fieldA = a.user.username;
        fieldB = b.user.username;
      } else if (sortField === 'fullName') {
        fieldA = a.user.fullName;
        fieldB = b.user.fullName;
      } else {
        fieldA = a[sortField];
        fieldB = b[sortField];
      }
      
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
  }, [searchTerm, sortField, sortDirection, leaderboardData]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const refreshLeaderboard = () => {
    fetchLeaderboardData();
  };

  const RankBadge = ({ rank }: { rank: number }) => {
    if (rank === 1) {
      return <Trophy className="w-5 h-5 text-amber-500" />;
    } else if (rank === 2) {
      return <Medal className="w-5 h-5 text-zinc-400" />;
    } else if (rank === 3) {
      return <Medal className="w-5 h-5 text-amber-700" />;
    } else {
      return <span className="text-sm font-medium text-zinc-400">{rank}</span>;
    }
  };

  return (
    <div className="animate-page-in min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-900 to-zinc-900 text-white foggy-grain">
      <Navbar isAuthenticated={false} />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="page-container">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight mb-2 flex items-center gap-2">
                    <Trophy className="hidden sm:inline h-8 w-8 text-accent-color" />
                    Leaderboard
                  </h1>
                  <p className="text-zinc-400">
                    Track performance metrics and see where you stand among other users.
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="border-zinc-700 hover:bg-zinc-800"
                  onClick={refreshLeaderboard}
                >
                  <RefreshCw className={cn(
                    "mr-2 h-4 w-4", 
                    isLoading && "animate-spin"
                  )} />
                  Refresh
                </Button>
              </div>
            </div>
            
            <div className="bg-zinc-800/50 backdrop-blur-lg rounded-xl border border-zinc-700/50 overflow-hidden shadow-xl mb-8">
              <Tabs defaultValue="global" className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b border-zinc-700/50">
                  <TabsList className="bg-zinc-900/50 border border-zinc-700">
                    <TabsTrigger value="global" className="data-[state=active]:bg-accent-color">
                      <Globe className="w-4 h-4 mr-2" />
                      Global
                    </TabsTrigger>
                    <TabsTrigger value="friends" className="data-[state=active]:bg-accent-color">
                      <Users className="w-4 h-4 mr-2" />
                      Friends
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 w-full">
                      <Search className="w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="bg-transparent border-none outline-none text-sm w-full text-zinc-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="inline-flex bg-zinc-900/50 border border-zinc-700 p-1 rounded-lg">
                      <button
                        onClick={() => setTimeRange('daily')}
                        className={cn(
                          "px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 flex items-center",
                          timeRange === 'daily' 
                            ? "bg-zinc-800 text-white" 
                            : "text-zinc-400 hover:text-white"
                        )}
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Daily
                      </button>
                      <button
                        onClick={() => setTimeRange('weekly')}
                        className={cn(
                          "px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 flex items-center",
                          timeRange === 'weekly' 
                            ? "bg-zinc-800 text-white" 
                            : "text-zinc-400 hover:text-white"
                        )}
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Weekly
                      </button>
                      <button
                        onClick={() => setTimeRange('monthly')}
                        className={cn(
                          "px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 flex items-center",
                          timeRange === 'monthly' 
                            ? "bg-zinc-800 text-white" 
                            : "text-zinc-400 hover:text-white"
                        )}
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Monthly
                      </button>
                    </div>
                  </div>
                </div>
                
                <TabsContent value="global" className="mt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-700/50 bg-zinc-900/30">
                          <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
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
                          <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            <button 
                              className="flex items-center gap-1"
                              onClick={() => handleSort('username')}
                            >
                              User
                              {sortField === 'username' && (
                                sortDirection === 'asc' ? 
                                  <ArrowUp className="w-3 h-3" /> : 
                                  <ArrowDown className="w-3 h-3" />
                              )}
                            </button>
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
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
                          <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            <button 
                              className="flex items-center gap-1 ml-auto"
                              onClick={() => handleSort('problemsSolved')}
                            >
                              Problems
                              {sortField === 'problemsSolved' && (
                                sortDirection === 'asc' ? 
                                  <ArrowUp className="w-3 h-3" /> : 
                                  <ArrowDown className="w-3 h-3" />
                              )}
                            </button>
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            <button 
                              className="flex items-center gap-1 ml-auto"
                              onClick={() => handleSort('streakDays')}
                            >
                              Streak
                              {sortField === 'streakDays' && (
                                sortDirection === 'asc' ? 
                                  <ArrowUp className="w-3 h-3" /> : 
                                  <ArrowDown className="w-3 h-3" />
                              )}
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-700/30">
                        {isLoading ? (
                          Array(5).fill(0).map((_, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Skeleton className="h-6 w-6 bg-zinc-700/50" />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Skeleton className="h-10 w-10 rounded-full bg-zinc-700/50" />
                                  <div className="ml-4">
                                    <Skeleton className="h-4 w-32 bg-zinc-700/50" />
                                    <Skeleton className="h-3 w-24 mt-2 bg-zinc-700/50" />
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <Skeleton className="h-4 w-16 ml-auto bg-zinc-700/50" />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <Skeleton className="h-4 w-12 ml-auto bg-zinc-700/50" />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <Skeleton className="h-4 w-12 ml-auto bg-zinc-700/50" />
                              </td>
                            </tr>
                          ))
                        ) : filteredData.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                              No users found matching your search criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredData.map((user) => (
                            <tr key={user.user.id} className="transition-colors hover:bg-zinc-800/50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900">
                                  <RankBadge rank={user.rank} />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Link to={`/profile/${user.user.id}`} className="flex items-center group">
                                  <div className="h-10 w-10 rounded-full overflow-hidden border border-zinc-700">
                                    <img src={user.user.profileImage} alt={user.user.fullName} className="h-full w-full object-cover" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-white group-hover:text-accent-color transition-colors">
                                      {user.user.fullName}
                                    </div>
                                    <div className="text-xs text-zinc-500 flex items-center gap-1">
                                      @{user.user.username}
                                      {user.user.country && (
                                        <span className="ml-1 inline-flex items-center">
                                          •&nbsp;{user.user.country}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </Link>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="text-sm font-semibold text-white">{user.score.toLocaleString()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="text-sm text-white">{user.problemsSolved}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex justify-end items-center">
                                  <div className="px-2 py-1 rounded bg-zinc-700/50 text-xs font-medium flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    {user.streakDays} days
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="py-4 px-6 border-t border-zinc-700/50 bg-zinc-900/30 flex justify-between items-center">
                    <div className="text-sm text-zinc-500">
                      Showing <span className="font-medium text-white">{filteredData.length}</span> users
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-zinc-700 hover:bg-zinc-800"
                        disabled={true}
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-zinc-700 hover:bg-zinc-800"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="friends" className="mt-0">
                  <div className="py-12 text-center text-zinc-500">
                    <Users className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
                    <h3 className="text-xl font-bold text-zinc-400 mb-2">Friends Leaderboard</h3>
                    <p className="max-w-md mx-auto mb-6">
                      Connect with friends to see how you compare on the leaderboard.
                    </p>
                    <Button className="accent-color">Find Friends</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
