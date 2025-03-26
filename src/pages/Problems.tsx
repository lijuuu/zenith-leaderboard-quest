
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Search, BarChart2, Zap, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProblemCard from "@/components/ProblemCard";
import { getProblems } from "@/api/problemApi";
import { Problem } from "@/api/types";
import Navbar from "@/components/Navbar";

const Problems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Get all problems
  const { data: problems, isLoading } = useQuery({
    queryKey: ["problems"],
    queryFn: () => getProblems(),
  });
  
  // Extract all unique tags from problems
  const allTags = problems
    ? Array.from(new Set(problems.flatMap(problem => problem.tags)))
    : [];
  
  // Filter problems based on search, difficulty, status, and tags
  const filteredProblems = problems
    ? problems.filter(problem => {
        // Filter by search query
        const matchesSearch = searchQuery
          ? problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          : true;
        
        // Filter by difficulty
        const matchesDifficulty = difficulty === "All" 
          ? true 
          : problem.difficulty === difficulty;
        
        // Filter by status
        const matchesStatus = status === "All"
          ? true
          : (status === "Solved" && problem.solved) ||
            (status === "Unsolved" && !problem.solved);
        
        // Filter by tags
        const matchesTags = selectedTags.length === 0
          ? true
          : selectedTags.some(tag => problem.tags.includes(tag));
        
        return matchesSearch && matchesDifficulty && matchesStatus && matchesTags;
      })
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <Navbar />
      
      <main className="page-container py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar */}
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" />
                <h2 className="text-lg font-bold">Filters</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Difficulty</h3>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Easy", "Medium", "Hard"].map(level => (
                      <Button
                        key={level}
                        variant={difficulty === level ? "default" : "outline"}
                        className={
                          difficulty === level
                            ? level === "Easy"
                              ? "bg-green-500 hover:bg-green-600"
                              : level === "Medium"
                              ? "bg-amber-500 hover:bg-amber-600"
                              : level === "Hard"
                              ? "bg-red-500 hover:bg-red-600"
                              : ""
                            : ""
                        }
                        onClick={() => setDifficulty(level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Solved", "Unsolved"].map(statusOption => (
                      <Button
                        key={statusOption}
                        variant={status === statusOption ? "default" : "outline"}
                        onClick={() => setStatus(statusOption)}
                      >
                        {statusOption}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Tags</h3>
                  <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-2">
                      {allTags.map(tag => (
                        <div key={tag} className="flex items-center">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              className="rounded border-zinc-300 dark:border-zinc-700"
                              checked={selectedTags.includes(tag)}
                              onChange={() => {
                                if (selectedTags.includes(tag)) {
                                  setSelectedTags(selectedTags.filter(t => t !== tag));
                                } else {
                                  setSelectedTags([...selectedTags, tag]);
                                }
                              }}
                            />
                            <span>{tag}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold font-display mb-2">Problem Collection</h1>
              <p className="text-muted-foreground">
                Practice coding problems and track your progress
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative w-full md:w-[400px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search problems..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" />
                  Statistics
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Challenge Mode
                </Button>
                <Button className="flex items-center gap-2 accent-color">
                  <Code className="w-4 h-4" />
                  New Problem
                </Button>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-muted-foreground">
                {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''} found
              </p>
              <Separator className="mt-2" />
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[180px] bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProblems.map((problem: Problem) => (
                  <ProblemCard
                    key={problem.id}
                    id={problem.id}
                    title={problem.title}
                    difficulty={problem.difficulty}
                    tags={problem.tags}
                    solved={problem.solved}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Problems;
