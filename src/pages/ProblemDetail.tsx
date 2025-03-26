
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Check, PlayCircle, LayoutList, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getProblem, compileAndRun, runTestCases } from "@/api/problemApi";
import MainNavbar from "@/components/MainNavbar";
import { toast } from "sonner";

// Mock code editor (in a real app, you would use a full-featured editor like Monaco)
const CodeEditor = ({ code, language, onChange }: { code: string; language: string; onChange: (code: string) => void }) => {
  return (
    <div className="relative rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-1 bg-zinc-800 p-2 text-xs text-white">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="ml-2 uppercase">{language}</div>
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[400px] bg-zinc-900 text-white font-mono text-sm p-4 focus:outline-none"
        spellCheck={false}
      />
    </div>
  );
};

const ProblemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState("description");
  const [code, setCode] = useState(
    "function solution(nums, target) {\n  // Write your solution here\n}"
  );
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState("javascript");
  
  const { data: problem, isLoading } = useQuery({
    queryKey: ["problem", id],
    queryFn: () => getProblem(id || ""),
    enabled: !!id,
  });
  
  const handleRun = async () => {
    try {
      setIsRunning(true);
      setOutput(null);
      
      const response = await compileAndRun({
        code,
        language,
        input: "// Example test case input"
      });
      
      if (response.error) {
        setOutput(`Error: ${response.error}`);
      } else {
        setOutput(response.output);
      }
    } catch (error) {
      setOutput("An error occurred while running the code.");
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      if (!id) return;
      
      const result = await runTestCases(id, code, language);
      
      if (result.passed) {
        toast.success("All test cases passed! Solution accepted.");
      } else {
        toast.error("Some test cases failed. See results for details.");
      }
      
      // Navigate to results tab
      setTab("results");
      
    } catch (error) {
      toast.error("An error occurred while submitting your solution.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16">
        <MainNavbar />
        <main className="page-container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-[600px] w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16">
        <MainNavbar />
        <main className="page-container py-8">
          <Alert>
            <AlertDescription>
              Problem not found. <Button variant="link" onClick={() => navigate("/problems")}>Go back to problems</Button>
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <MainNavbar />
      
      <main className="page-container py-8">
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-4"
          onClick={() => navigate("/problems")}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Problems
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem description panel */}
          <div className="bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 text-xs rounded-md text-white ${
                  problem.difficulty === "Easy" 
                    ? "bg-green-500" 
                    : problem.difficulty === "Medium" 
                    ? "bg-amber-500" 
                    : "bg-red-500"
                }`}>
                  {problem.difficulty}
                </div>
                {problem.solved && (
                  <div className="flex items-center gap-1 text-xs text-green-500">
                    <Check className="w-3 h-3" />
                    Solved
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Acceptance Rate: {problem.acceptanceRate}%
                </div>
              </div>
              
              <h1 className="text-2xl font-bold mt-2">{problem.title}</h1>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {problem.tags.map((tag, index) => (
                  <div key={index} className="tag-pill">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
            
            <Tabs defaultValue="description" value={tab} onValueChange={setTab}>
              <TabsList className="w-full rounded-none border-b border-zinc-200 dark:border-zinc-800">
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="test-cases" className="flex-1">Test Cases</TabsTrigger>
                <TabsTrigger value="results" className="flex-1">Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="p-6">
                <div className="prose dark:prose-invert prose-zinc max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, '<br />') }} />
                  
                  {problem.examples.map((example, index) => (
                    <div key={index} className="mt-6">
                      <h3 className="text-lg font-semibold">Example {index + 1}:</h3>
                      <div className="mt-2 mb-4">
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-md mb-2">
                          <div className="font-mono text-sm">{`Input: ${example.input}`}</div>
                        </div>
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-md">
                          <div className="font-mono text-sm">{`Output: ${example.output}`}</div>
                        </div>
                        {example.explanation && (
                          <div className="mt-2">
                            <span className="font-mono text-sm">Explanation: {example.explanation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {problem.constraints && problem.constraints.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold">Constraints:</h3>
                      <ul className="list-disc list-inside mt-2">
                        {problem.constraints.map((constraint, index) => (
                          <li key={index} className="font-mono text-sm">{constraint}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="test-cases" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Custom Test Cases</h3>
                  <div className="space-y-3">
                    <textarea
                      placeholder="Enter your test case input..."
                      className="w-full h-24 p-3 border border-zinc-300 dark:border-zinc-700 rounded-md bg-background font-mono text-sm resize-none"
                    ></textarea>
                    <Button variant="outline" className="w-full">
                      Run Custom Test
                    </Button>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Example Test Cases</h3>
                    <div className="space-y-4">
                      {problem.examples.map((example, index) => (
                        <div key={index} className="border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden">
                          <div className="bg-zinc-100 dark:bg-zinc-800 p-3 font-semibold text-sm">
                            Example {index + 1}
                          </div>
                          <div className="p-3 grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Input:</div>
                              <div className="font-mono text-sm bg-zinc-50 dark:bg-zinc-900 p-2 rounded-md">
                                {example.input}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Expected Output:</div>
                              <div className="font-mono text-sm bg-zinc-50 dark:bg-zinc-900 p-2 rounded-md">
                                {example.output}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="results" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Submission Results</h3>
                  
                  <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-medium">All test cases passed</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-md">
                          <span className="text-muted-foreground">Runtime:</span>
                          <span className="font-semibold ml-2">76 ms</span>
                        </div>
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-md">
                          <span className="text-muted-foreground">Memory:</span>
                          <span className="font-semibold ml-2">42.4 MB</span>
                        </div>
                      </div>
                      
                      <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-md">
                        <div className="text-xs text-muted-foreground mb-2">Your code beat 85% of submissions in runtime and 72% in memory usage.</div>
                        
                        <Button variant="outline" size="sm" className="w-full">
                          <LayoutList className="w-4 h-4 mr-2" />
                          View All Submissions
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Test Case Results</h3>
                    <div className="space-y-3">
                      {problem.examples.map((example, index) => (
                        <div key={index} className="border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden">
                          <div className="bg-zinc-100 dark:bg-zinc-800 p-3 font-medium text-sm flex items-center justify-between">
                            <span>Test Case {index + 1}</span>
                            <div className="flex items-center text-green-500">
                              <Check className="w-4 h-4 mr-1" />
                              Passed
                            </div>
                          </div>
                          <div className="p-3 grid grid-cols-3 gap-2">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Input:</div>
                              <div className="font-mono text-sm bg-zinc-50 dark:bg-zinc-900 p-2 rounded-md truncate">
                                {example.input}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Expected:</div>
                              <div className="font-mono text-sm bg-zinc-50 dark:bg-zinc-900 p-2 rounded-md truncate">
                                {example.output}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Output:</div>
                              <div className="font-mono text-sm bg-zinc-50 dark:bg-zinc-900 p-2 rounded-md truncate">
                                {example.output}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Code editor panel */}
          <div className="bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-background border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 text-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleRun}
                  disabled={isRunning || isSubmitting}
                  className="flex items-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  Run
                </Button>
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  disabled={isRunning || isSubmitting}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  <Check className="w-4 h-4" />
                  Submit
                </Button>
              </div>
            </div>
            
            <CodeEditor 
              code={code} 
              language={language} 
              onChange={setCode} 
            />
            
            {output !== null && (
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-medium mb-2">Output:</h3>
                <pre className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-md font-mono text-sm overflow-auto max-h-[200px]">
                  {output}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemDetail;
