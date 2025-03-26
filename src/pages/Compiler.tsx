
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Play, Download, Upload, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { compileAndRun } from "@/api/problemApi";
import { useToast } from "@/hooks/use-toast";

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
    <div className="pt-4 pb-16">
      <div className="container px-4 mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Online Compiler</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
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
                  className="flex items-center gap-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
                  onClick={handleCopyCode}
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
                  onClick={handleClearCode}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
                >
                  <Upload className="h-4 w-4" />
                  Load
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
                >
                  <Download className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
            
            <div className="relative border border-zinc-700 rounded-lg overflow-hidden">
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
                className="font-mono text-sm p-4 rounded-none border-none min-h-[400px] resize-none focus-visible:ring-0 bg-zinc-900 text-white"
                spellCheck={false}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Tabs defaultValue="input" className="w-full">
              <TabsList className="w-full bg-zinc-800 border-zinc-700">
                <TabsTrigger 
                  value="input" 
                  className="flex-1 data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  Input
                </TabsTrigger>
                <TabsTrigger 
                  value="output" 
                  className="flex-1 data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  Output
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="input">
                <div className="border border-zinc-700 rounded-lg overflow-hidden">
                  <div className="bg-zinc-800 px-4 py-2 text-xs font-medium border-b border-zinc-700">
                    Standard Input
                  </div>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter input for your program..."
                    className="font-mono text-sm p-4 rounded-none border-none min-h-[300px] resize-none focus-visible:ring-0 bg-zinc-900 text-white"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="output">
                <div className="border border-zinc-700 rounded-lg overflow-hidden">
                  <div className="bg-zinc-800 px-4 py-2 text-xs font-medium border-b border-zinc-700 flex justify-between">
                    <span>Standard Output</span>
                    {mutation.data?.executionTime && (
                      <span className="text-green-400">
                        Time: {mutation.data.executionTime}
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-sm p-4 bg-zinc-900 min-h-[300px] overflow-auto">
                    {mutation.isPending ? (
                      <div className="text-zinc-400 animate-pulse">
                        Running...
                      </div>
                    ) : mutation.data ? (
                      <pre className="whitespace-pre-wrap">
                        {mutation.data.error ? (
                          <span className="text-red-400">{mutation.data.error}</span>
                        ) : (
                          <span className="text-green-400">{mutation.data.output}</span>
                        )}
                      </pre>
                    ) : (
                      <div className="text-zinc-500">
                        Run your code to see the output here
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="bg-zinc-800/40 border border-zinc-700 rounded-lg p-4">
              <h3 className="font-medium mb-2">Compiler Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Language:</span>
                  <span className="text-white">{language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Version:</span>
                  <span className="text-white">
                    {language === "javascript" && "Node.js 18.15.0"}
                    {language === "python" && "Python 3.11.4"}
                    {language === "java" && "Java 17.0.6"}
                    {language === "cpp" && "C++ 20 (GCC 11.3.0)"}
                    {language === "go" && "Go 1.20.3"}
                    {language === "rust" && "Rust 1.69.0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Memory Limit:</span>
                  <span className="text-white">512 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Time Limit:</span>
                  <span className="text-white">15 seconds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler;
