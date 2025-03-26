
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Play, Download, Upload, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { compileAndRun } from "@/api/problemApi";
import { useToast } from "@/hooks/use-toast";
import MainNavbar from "@/components/MainNavbar";

const Compiler = () => {
  const { toast } = useToast();
  const [code, setCode] = useState(
    "// Write your code here\nconsole.log('Hello, world!');"
  );
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isCompiling, setIsCompiling] = useState(false);
  
  // Compile and run mutation
  const mutation = useMutation({
    mutationFn: (data: { code: string; language: string; input?: string }) =>
      compileAndRun(data),
    onSuccess: (data) => {
      toast({
        title: "Code executed successfully",
        description: data.executionTime 
          ? `Execution time: ${data.executionTime}` 
          : undefined,
      });
    },
    onError: (error) => {
      toast({
        title: "Error executing code",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });
  
  const handleCompile = async () => {
    setIsCompiling(true);
    
    mutation.mutate({
      code,
      language,
      input: input.trim() ? input : undefined,
    });
    
    setIsCompiling(false);
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied to clipboard",
    });
  };
  
  const handleClearCode = () => {
    setCode("");
    toast({
      title: "Code cleared",
    });
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <MainNavbar />
      
      <main className="page-container py-8">
        <h1 className="text-3xl font-bold mb-6">Online Compiler</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-background border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleCopyCode}
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleClearCode}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Load
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
            
            <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
              <div className="bg-zinc-800 text-white px-4 py-2 text-xs flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 uppercase">{language}</span>
                </div>
                
                <Button
                  variant="default"
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                  onClick={handleCompile}
                  disabled={isCompiling || mutation.isPending}
                >
                  <Play className="h-3 w-3" />
                  Run
                </Button>
              </div>
              
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-sm p-4 rounded-none border-none min-h-[400px] resize-none focus-visible:ring-0"
                spellCheck={false}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Tabs defaultValue="input">
              <TabsList className="w-full">
                <TabsTrigger value="input" className="flex-1">Input</TabsTrigger>
                <TabsTrigger value="output" className="flex-1">Output</TabsTrigger>
              </TabsList>
              
              <TabsContent value="input">
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                  <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-xs font-medium border-b border-zinc-200 dark:border-zinc-800">
                    Standard Input
                  </div>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter input for your program..."
                    className="font-mono text-sm p-4 rounded-none border-none min-h-[300px] resize-none focus-visible:ring-0"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="output">
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                  <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-xs font-medium border-b border-zinc-200 dark:border-zinc-800 flex justify-between">
                    <span>Standard Output</span>
                    {mutation.data?.executionTime && (
                      <span className="text-muted-foreground">
                        Time: {mutation.data.executionTime}
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-sm p-4 bg-white dark:bg-zinc-900 min-h-[300px] overflow-auto">
                    {mutation.isPending ? (
                      <div className="text-muted-foreground animate-pulse">
                        Running...
                      </div>
                    ) : mutation.data ? (
                      <pre className="whitespace-pre-wrap">
                        {mutation.data.error ? (
                          <span className="text-red-500">{mutation.data.error}</span>
                        ) : (
                          mutation.data.output
                        )}
                      </pre>
                    ) : (
                      <div className="text-muted-foreground">
                        Run your code to see the output here
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
              <h3 className="font-medium mb-2">Compiler Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language:</span>
                  <span>{language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span>
                    {language === "javascript" && "Node.js 18.15.0"}
                    {language === "python" && "Python 3.11.4"}
                    {language === "java" && "Java 17.0.6"}
                    {language === "cpp" && "C++ 20 (GCC 11.3.0)"}
                    {language === "go" && "Go 1.20.3"}
                    {language === "rust" && "Rust 1.69.0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Memory Limit:</span>
                  <span>512 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Limit:</span>
                  <span>15 seconds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Compiler;
