
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  CheckCircle, XCircle, ChevronLeft, Play, Clock, 
  RefreshCw, Plus, Code, FileText, Terminal, Server
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { getProblem, compileAndRun, runTestCases } from "@/api/problemApi";
import MainNavbar from "@/components/MainNavbar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import * as monaco from "monaco-editor";

type TestCase = {
  input: string;
  expected: string;
};

type TestResult = {
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed: boolean;
  error?: string;
};

const Timer = () => {
  const [time, setTime] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isActive) interval = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="flex items-center gap-3 px-4 py-2 bg-zinc-900 rounded-md shadow-md" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 text-sm text-zinc-300">
        <Clock className="h-4 w-4 text-green-500" />
        <span className="font-medium">{formatTime(time)}</span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsActive(true)} 
        disabled={isActive} 
        className="h-7 px-3 text-xs font-medium"
      >
        Start
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => { setIsActive(false); setTime(0); }} 
        className="h-7 px-3 text-xs font-medium"
      >
        Reset
      </Button>
    </motion.div>
  );
};

const ProblemDescription = ({ problem }: { problem: any }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="p-4 overflow-y-auto h-full bg-zinc-900/70 border-r border-zinc-800 relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">{problem.title}</h2>
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full text-white ${
            problem.difficulty === "Easy" 
              ? "bg-green-600" 
              : problem.difficulty === "Medium" 
              ? "bg-yellow-600" 
              : "bg-red-600"
          }`}>
            {problem.difficulty}
          </span>
          {problem.tags.map((tag: string, i: number) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-300">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="text-sm text-zinc-300/90">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-green-500 mt-4 mb-2" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-md font-semibold text-white mt-4 mb-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-sm font-medium text-white mt-3 mb-1" {...props} />,
              p: ({ node, ...props }) => <p className="text-zinc-300/90 mb-2" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-4 text-green-500 space-y-1 mb-2" {...props} />,
              li: ({ node, ...props }) => <li className="text-zinc-300/90" {...props} />,
              code: ({ node, ...props }) => <code className="text-green-500 rounded-md my-2" {...props} />,
            }}
          >
            {problem.description}
          </ReactMarkdown>
        </div>
        
        {problem.examples.map((example: any, index: number) => (
          <div key={index} className="mt-4 border border-zinc-800 rounded-md overflow-hidden">
            <div className="bg-zinc-800 p-2">
              <span className="text-sm font-medium text-white">Example {index + 1}</span>
            </div>
            <div className="p-3 space-y-3">
              <div className="bg-zinc-900 p-2 rounded-md">
                <div className="text-xs text-zinc-500 mb-1">Input:</div>
                <div className="font-mono text-sm text-zinc-300">{example.input}</div>
              </div>
              <div className="bg-zinc-900 p-2 rounded-md">
                <div className="text-xs text-zinc-500 mb-1">Output:</div>
                <div className="font-mono text-sm text-zinc-300">{example.output}</div>
              </div>
              {example.explanation && (
                <div className="bg-zinc-900 p-2 rounded-md">
                  <div className="text-xs text-zinc-500 mb-1">Explanation:</div>
                  <div className="font-mono text-sm text-zinc-300">{example.explanation}</div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {problem.constraints && problem.constraints.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-white mb-2">Constraints:</h3>
            <ul className="list-disc list-inside space-y-1">
              {problem.constraints.map((constraint: string, index: number) => (
                <li key={index} className="font-mono text-xs text-zinc-400">{constraint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate("/problems")} 
        className="absolute bottom-4 left-4 right-4 w-[calc(100%-2rem)] bg-zinc-800 text-green-500 hover:bg-zinc-700 hover:text-green-400 border-zinc-700"
      >
        <ChevronLeft className="h-4 w-4 mr-2" /> View All Problems
      </Button>
    </motion.div>
  );
};

const MonacoCodeEditor = ({ 
  value, 
  onChange, 
  language = "javascript" 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  language?: string;
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [theme, setTheme] = useState<string>("vs-dark");
  
  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => { 
      if (editorRef.current) editorRef.current.layout(); 
    });
    const container = document.getElementById('editor-container');
    if (container) resizeObserver.observe(container);
    return () => { 
      if (container) resizeObserver.unobserve(container); 
    };
  }, []);

  return (
    <motion.div 
      id="editor-container" 
      className="w-full h-full overflow-hidden rounded-md bg-zinc-900 border border-zinc-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(v) => onChange(v || '')}
        onMount={handleEditorDidMount}
        theme={theme}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineHeight: 22,
          fontFamily: '"JetBrains Mono", monospace, Consolas, "Courier New"',
          tabSize: 2,
          wordWrap: 'on',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          padding: { top: 12, bottom: 12 },
          scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          contextmenu: true,
          suggest: { showMethods: true, showFunctions: true, showConstructors: true, showFields: true, showVariables: true, showClasses: true, showInterfaces: true },
        }}
        className="monaco-editor"
      />
    </motion.div>
  );
};

const Console = ({
  output = [],
  testResults = null,
  isRunning = false,
  onReset,
  testCases = [],
  customTestCases = [],
  onAddCustomTestCase,
  activeTab = 'output',
  setActiveTab,
}: {
  output: string[];
  testResults: any | null;
  isRunning?: boolean;
  onReset: () => void;
  testCases: any[];
  customTestCases: TestCase[];
  onAddCustomTestCase: (input: string, expected: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const [customInput, setCustomInput] = useState('');
  const [customExpected, setCustomExpected] = useState('');
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleEndRef.current && activeTab === 'output') {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, activeTab]);

  const handleAddCustomTestCase = () => {
    if (customInput && customExpected) {
      onAddCustomTestCase(customInput, customExpected);
      setCustomInput('');
      setCustomExpected('');
    }
  };

  return (
    <motion.div 
      className="h-full overflow-hidden flex flex-col bg-zinc-900 border-t border-zinc-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
          <h3 className="text-sm font-medium text-white">Console</h3>
          <div className="flex text-xs">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setActiveTab('output')} 
              className={`px-2 py-1 h-7 rounded-l-md ${activeTab === 'output' ? 'bg-green-600 text-white hover:bg-green-700' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Terminal className="h-3.5 w-3.5 mr-1" />
              Output
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveTab('tests')} 
              className={`px-2 py-1 h-7 ${activeTab === 'tests' ? 'bg-green-600 text-white hover:bg-green-700' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Server className="h-3.5 w-3.5 mr-1" />
              Test Cases
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveTab('custom')} 
              className={`px-2 py-1 h-7 rounded-r-md ${activeTab === 'custom' ? 'bg-green-600 text-white hover:bg-green-700' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Custom Tests
            </Button>
          </div>
        </div>
        <motion.button 
          onClick={onReset} 
          className="px-2 py-1 rounded-md flex items-center gap-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
        >
          <RefreshCw className="h-4 w-4" /> Reset
        </motion.button>
      </div>
      
      <div className="overflow-y-auto p-3 font-mono text-sm flex-grow bg-zinc-950">
        {activeTab === 'output' ? (
          output.length > 0 ? (
            <div className="space-y-1">
              {output.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap break-all">
                  {line.startsWith('[Error]') ? 
                    <span className="text-red-400">{line}</span> : 
                    line.match(/Array|Object/) ? 
                    <span className="text-green-500">{line}</span> : 
                    <span className="text-zinc-300">{line}</span>
                  }
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>
          ) : (
            <div className="text-zinc-500 italic">Run your code to see output here...</div>
          )
        ) : activeTab === 'tests' ? (
          <div>
            <h4 className="text-white font-medium mb-2">Test Cases</h4>
            {testCases.length > 0 ? (
              <div className="space-y-2">
                {testCases.map((tc, i) => (
                  <div key={i} className="p-2 rounded-md bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300">Test Case {i + 1}</span>
                      {testResults && testResults.results && testResults.results[i] ? (
                        testResults.results[i].passed ? 
                          <CheckCircle className="h-4 w-4 text-green-500" /> : 
                          <XCircle className="h-4 w-4 text-red-500" />
                      ) : null}
                    </div>
                    <div className="ml-4 mt-1 text-xs space-y-1">
                      <div>Input: <span className="text-green-500">{tc.input}</span></div>
                      <div>Expected: <span className="text-green-500">{tc.output}</span></div>
                      {testResults && testResults.results && testResults.results[i] && !testResults.results[i].passed && (
                        <>
                          <div>Received: <span className="text-red-400">{testResults.results[i].actualOutput}</span></div>
                          {testResults.results[i].error && <div>Error: <span className="text-red-400">{testResults.results[i].error}</span></div>}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-zinc-500 italic">No test cases available.</div>
            )}
            
            {testResults && (
              <div className="mt-4 p-3 bg-zinc-900 border border-zinc-800 rounded-md">
                <div className="mb-2">
                  <span className="text-zinc-300">Total Test Cases: {testResults.results?.length || 0}</span><br />
                  <span className="text-green-500">Passed: {testResults.results?.filter((r: any) => r.passed).length || 0}</span><br />
                  <span className="text-red-500">Failed: {testResults.results?.filter((r: any) => !r.passed).length || 0}</span>
                </div>
                {testResults.passed === false && (
                  <div className="p-2 rounded-md bg-red-900/20">
                    <h4 className="text-red-400 font-medium">Test Cases Failed</h4>
                    <div className="text-xs text-zinc-400 mt-1">
                      Check the failed test cases above for more details.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h4 className="text-white font-medium mb-2">Add Custom Test Case</h4>
              <Input
                placeholder='e.g., { "nums": [2,7,11,15], "target": 9 }'
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="mb-2 bg-zinc-900 text-zinc-300 border-zinc-800"
              />
              <Input
                placeholder="e.g., [0,1]"
                value={customExpected}
                onChange={(e) => setCustomExpected(e.target.value)}
                className="mb-2 bg-zinc-900 text-zinc-300 border-zinc-800"
              />
              <Button 
                onClick={handleAddCustomTestCase} 
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Test Case
              </Button>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Custom Test Cases</h4>
              {customTestCases.length > 0 ? (
                <div className="space-y-2">
                  {customTestCases.map((tc, i) => (
                    <div key={i} className="p-2 rounded-md bg-zinc-900 border border-zinc-800">
                      <div>Input: <span className="text-green-500">{tc.input}</span></div>
                      <div>Expected: <span className="text-green-500">{tc.expected}</span></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-zinc-500 italic">No custom test cases added yet...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ProblemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [code, setCode] = useState("function solution(nums, target) {\n  // Write your solution here\n}");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consoleTab, setConsoleTab] = useState("tests");
  const [customTestCases, setCustomTestCases] = useState<TestCase[]>([]);
  const [testResults, setTestResults] = useState<any | null>(null);
  
  const { data: problem, isLoading } = useQuery({
    queryKey: ["problem", id],
    queryFn: () => getProblem(id || ""),
    enabled: !!id,
  });

  // Load/save code from localStorage
  useEffect(() => {
    if (problem && id) {
      const storageKey = `zenx-code-${id}-${language}`;
      const savedCode = localStorage.getItem(storageKey);
      if (savedCode) {
        setCode(savedCode);
      } else {
        // Set default starter code based on language
        const defaultCode = {
          javascript: `function solution(nums, target) {\n  // Write your solution here\n}`,
          python: `def solution(nums, target):\n  # Write your solution here\n  pass`,
          java: `class Solution {\n  public int[] solution(int[] nums, int target) {\n    // Write your solution here\n    return new int[0];\n  }\n}`,
          cpp: `#include <vector>\nclass Solution {\npublic:\n  std::vector<int> solution(std::vector<int>& nums, int target) {\n    // Write your solution here\n    return {};\n  }\n};`
        };
        setCode(defaultCode[language as keyof typeof defaultCode] || defaultCode.javascript);
      }
    }
  }, [problem, id, language]);
  
  // Save code to localStorage when it changes
  useEffect(() => {
    if (id && code) {
      const storageKey = `zenx-code-${id}-${language}`;
      localStorage.setItem(storageKey, code);
    }
  }, [id, code, language]);

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setOutput(["Running code..."]);
      setTestResults(null);
      
      const response = await compileAndRun({
        code,
        language,
        input: problem?.examples[0]?.input || ""
      });
      
      if (response.error) {
        setOutput([`[Error] ${response.error}`]);
      } else {
        setOutput([
          "Code executed successfully!",
          `Input: ${problem?.examples[0]?.input || ""}`,
          `Output: ${response.output || "No output"}`,
          response.executionTime ? `Execution time: ${response.executionTime}` : "",
          response.memory ? `Memory used: ${response.memory}` : ""
        ].filter(Boolean));
        setConsoleTab("output");
      }
    } catch (error) {
      setOutput([`[Error] ${(error as Error).message || "An unknown error occurred"}`]);
      console.error("Run error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setOutput(["Submitting solution..."]);
      setTestResults(null);
      
      if (!id) return;
      
      const result = await runTestCases(id, code, language);
      
      setTestResults(result);
      setConsoleTab("tests");
      
      if (result.passed) {
        toast.success("All test cases passed!", {
          description: "Your solution was accepted!"
        });
        setOutput([
          "Solution accepted!",
          "All test cases passed.",
          `Total test cases: ${result.results?.length || 0}`
        ]);
      } else {
        toast.error("Some test cases failed", {
          description: "Check the details in the test cases tab."
        });
        setOutput([
          "[Error] Some test cases failed.",
          `Passed: ${result.results?.filter((r: any) => r.passed).length || 0}/${result.results?.length || 0} test cases.`
        ]);
      }
    } catch (error) {
      setOutput([`[Error] ${(error as Error).message || "An unknown error occurred"}`]);
      setTestResults(null);
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetCode = () => {
    if (id) {
      const storageKey = `zenx-code-${id}-${language}`;
      localStorage.removeItem(storageKey);
      
      // Reset to default code for the language
      const defaultCode = {
        javascript: `function solution(nums, target) {\n  // Write your solution here\n}`,
        python: `def solution(nums, target):\n  # Write your solution here\n  pass`,
        java: `class Solution {\n  public int[] solution(int[] nums, int target) {\n    // Write your solution here\n    return new int[0];\n  }\n}`,
        cpp: `#include <vector>\nclass Solution {\npublic:\n  std::vector<int> solution(std::vector<int>& nums, int target) {\n    // Write your solution here\n    return {};\n  }\n};`
      };
      
      setCode(defaultCode[language as keyof typeof defaultCode] || defaultCode.javascript);
      setOutput([]);
      setTestResults(null);
      setCustomTestCases([]);
      
      toast.info("Code reset to default", {
        description: "Your code has been reset to the starter template."
      });
    }
  };

  const handleAddCustomTestCase = (input: string, expected: string) => {
    setCustomTestCases(prev => [...prev, { input, expected }]);
    toast.success("Custom test case added", {
      description: "Your test case has been added successfully."
    });
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
    <div className="min-h-screen bg-zinc-950 text-white pt-16">
      <MainNavbar />
      
      <main className="h-[calc(100vh-4rem)] pt-4 px-4">
        <ResizablePanelGroup
          direction={isMobile ? "vertical" : "horizontal"}
          className="h-full rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/30"
        >
          <ResizablePanel defaultSize={40} minSize={20}>
            <ProblemDescription problem={problem} />
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-zinc-800" />
          
          <ResizablePanel defaultSize={60} minSize={30}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70} minSize={30}>
                <motion.div 
                  className="p-4 space-y-4 h-full flex flex-col bg-zinc-900"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <motion.button
                        onClick={handleRun}
                        disabled={isRunning || isSubmitting}
                        className="px-3 py-1.5 rounded-md flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {isRunning ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        <span className="text-sm">Run</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={handleSubmit}
                        disabled={isRunning || isSubmitting}
                        className="px-3 py-1.5 rounded-md flex items-center gap-2 text-white bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50"
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {isSubmitting ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Code className="h-4 w-4" />
                        )}
                        <span className="text-sm">Submit</span>
                      </motion.button>
                    </div>
                    
                    <Timer />
                    
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-zinc-800 text-zinc-200 px-3 py-1.5 rounded-md border border-zinc-700 focus:border-green-500 focus:outline-none text-sm"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                  
                  <div className="flex-grow">
                    <MonacoCodeEditor
                      value={code}
                      onChange={setCode}
                      language={language}
                    />
                  </div>
                </motion.div>
              </ResizablePanel>
              
              <ResizableHandle withHandle className="bg-zinc-800" />
              
              <ResizablePanel defaultSize={30} minSize={15}>
                <Console
                  output={output}
                  testResults={testResults}
                  isRunning={isRunning || isSubmitting}
                  onReset={handleResetCode}
                  testCases={problem.examples}
                  customTestCases={customTestCases}
                  onAddCustomTestCase={handleAddCustomTestCase}
                  activeTab={consoleTab}
                  setActiveTab={setConsoleTab}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
};

export default ProblemDetail;
