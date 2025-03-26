import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Tag, 
  ChevronRight, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import MainNavbar from "@/components/MainNavbar";
import { getProblems } from "@/api/problemApi";
import { Problem } from "@/api/types";

type SortField = "title" | "difficulty" | "acceptance" | "solved";
type SortOrder = "asc" | "desc";

const DIFFICULTY_COLORS = {
  Easy: "bg-green-500/20 text-green-400",
  Medium: "bg-amber-500/20 text-amber-400",
  Hard: "bg-red-500/20 text-red-400"
};

const Problems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [showSolved, setShowSolved] = useState(true);
  const [sortBy, setSortBy] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  
  const { data: problems, isLoading, refetch } = useQuery({
    queryKey: ["problems"],
    queryFn: () => getProblems(),
  });
  
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);
  
  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };
  
  // Derived state for filtered and sorted problems
  const filteredProblems = problems
    ? problems.filter((problem: Problem) => {
        // Text search
        const matchesSearch = 
          searchQuery === "" || 
          problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Difficulty filter
        const matchesDifficulty = !difficulty || problem.difficulty === difficulty;
        
        // Tags filter
        const matchesTags = tags.length === 0 || 
          tags.every(tag => problem.tags.includes(tag));
        
        // Solved filter
        const matchesSolved = showSolved || !problem.solved;
        
        return matchesSearch && matchesDifficulty && matchesTags && matchesSolved;
      })
    : [];
  
  // Sort filtered problems
  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (sortBy === "title") {
      return sortOrder === "asc" 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortBy === "difficulty") {
      const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
      return sortOrder === "asc"
        ? difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
        : difficultyOrder[b.difficulty as keyof typeof difficultyOrder] - difficultyOrder[a.difficulty as keyof typeof difficultyOrder];
    } else if (sortBy === "acceptance") {
      return sortOrder === "asc"
        ? a.acceptanceRate - b.acceptanceRate
        : b.acceptanceRate - a.acceptanceRate;
    } else if (sortBy === "solved") {
      // Sort by solved status (boolean value)
      return sortOrder === "asc"
        ? (a.solved ? 1 : 0) - (b.solved ? 1 : 0)
        : (b.solved ? 1 : 0) - (a.solved ? 1 : 0);
    }
    return 0;
  });
  
  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />;
  };
  
  // Get unique tags from all problems
  const allTags = problems
    ? Array.from(new Set(problems.flatMap(problem => problem.tags)))
    : [];
  
  return (
    <div className="min-h-screen bg-zinc-900 text-white pt-14">
      <MainNavbar />
      
      <main className="page-container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Problem Set</h1>
            <p className="text-zinc-400 mt-1">
              Practice your coding skills by solving our carefully curated problems
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button className="bg-green-500 hover:bg-green-600">
              <Code className="h-4 w-4 mr-2" />
              Create Problem
            </Button>
          </div>
        </div>
        
        <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
              <Input 
                placeholder="Search problems by title or tag" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-800 border-zinc-700 focus-visible:ring-green-500"
              />
            </div>
            
            <Select value={difficulty || ''} onValueChange={(value) => setDifficulty(value || null)}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" className="border-zinc-700 hover:bg-zinc-800">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            
            {tags.length > 0 ? (
              tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-zinc-700/50 hover:bg-zinc-700 cursor-pointer"
                  onClick={() => setTags(tags.filter(t => t !== tag))}
                >
                  {tag}
                  <span className="ml-1 text-xs">×</span>
                </Badge>
              ))
            ) : (
              <span className="text-sm text-zinc-500">No tags selected</span>
            )}
            
            <div className="ml-auto flex items-center gap-2">
              <Checkbox 
                id="showSolved" 
                checked={showSolved} 
                onCheckedChange={(checked) => setShowSolved(!!checked)} 
                className="border-zinc-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <label htmlFor="showSolved" className="text-sm cursor-pointer">
                Show solved problems
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-800/80">
                <TableRow className="hover:bg-transparent border-zinc-700/50">
                  <TableHead className="w-16 text-center text-zinc-400">Status</TableHead>
                  <TableHead 
                    className="cursor-pointer text-zinc-400"
                    onClick={() => toggleSort("title")}
                  >
                    <div className="flex items-center">
                      Title
                      {getSortIcon("title")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-zinc-400"
                    onClick={() => toggleSort("difficulty")}
                  >
                    <div className="flex items-center">
                      Difficulty
                      {getSortIcon("difficulty")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-zinc-400"
                    onClick={() => toggleSort("acceptance")}
                  >
                    <div className="flex items-center">
                      Acceptance
                      {getSortIcon("acceptance")}
                    </div>
                  </TableHead>
                  <TableHead className="text-zinc-400">Tags</TableHead>
                  <TableHead className="w-24 text-zinc-400"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i} className="border-zinc-800/50 hover:bg-zinc-800/50">
                      <TableCell className="px-4 py-4">
                        <div className="w-6 h-6 rounded-full bg-zinc-700/50 animate-pulse mx-auto" />
                      </TableCell>
                      <TableCell>
                        <div className="h-6 bg-zinc-700/50 rounded w-full max-w-[200px] animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-6 bg-zinc-700/50 rounded w-20 animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-6 bg-zinc-700/50 rounded w-16 animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <div className="h-6 bg-zinc-700/50 rounded w-16 animate-pulse" />
                          <div className="h-6 bg-zinc-700/50 rounded w-16 animate-pulse" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-8 bg-zinc-700/50 rounded w-full animate-pulse" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : sortedProblems.length > 0 ? (
                  sortedProblems.map((problem: Problem) => (
                    <TableRow key={problem.id} className="border-zinc-800/50 hover:bg-zinc-800/50">
                      <TableCell className="px-4 py-4">
                        {problem.solved ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="w-5 h-5 border border-zinc-700 rounded-full mx-auto" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Link to={`/problems/${problem.id}`} className="hover:text-green-400 transition-colors">
                          {problem.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex px-2 py-1 rounded-full text-xs ${DIFFICULTY_COLORS[problem.difficulty as keyof typeof DIFFICULTY_COLORS]}`}>
                          {problem.difficulty}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {problem.acceptanceRate.toFixed(1)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {problem.tags.slice(0, 2).map(tag => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="border-zinc-700 text-zinc-400 cursor-pointer hover:bg-zinc-800"
                              onClick={() => !tags.includes(tag) && setTags([...tags, tag])}
                            >
                              <Tag className="h-3 w-3 mr-1" /> {tag}
                            </Badge>
                          ))}
                          {problem.tags.length > 2 && (
                            <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                              +{problem.tags.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          asChild
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-zinc-700/50 hover:text-green-400 w-full"
                        >
                          <Link to={`/problems/${problem.id}`}>
                            Solve <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-zinc-800/50">
                    <TableCell colSpan={6} className="h-52 text-center text-zinc-400">
                      <div className="flex flex-col items-center justify-center h-full">
                        <p>No problems found matching your criteria</p>
                        <Button 
                          variant="outline" 
                          className="mt-4 border-zinc-700 hover:bg-zinc-800"
                          onClick={() => {
                            setSearchQuery("");
                            setDifficulty(null);
                            setTags([]);
                            setShowSolved(true);
                          }}
                        >
                          Clear filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Problems;
