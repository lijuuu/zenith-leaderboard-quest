
import { motion } from "framer-motion";
import { Play, RefreshCw, ChevronLeft, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ReactMarkdown from "react-markdown";
import MainNavbar from "@/components/MainNavbar";
import { useProblemDetail } from "@/hooks/use-problem-detail";
import Timer from "@/components/problem/Timer";
import CodeEditor from "@/components/problem/CodeEditor";
import Console from "@/components/problem/Console";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const ProblemDescription = ({ problem }: { problem: any }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="p-4 overflow-y-auto h-full bg-zinc-900/70 border-r border-zinc-800 relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="space-y-4 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-2xl font-semibold text-green-500">{problem.title}</h2>
          <div className={`text-xs px-2.5 py-1 rounded-full text-white inline-flex items-center w-fit ${
            problem.difficulty === "Easy" ? "bg-green-600" : 
            problem.difficulty === "Medium" ? "bg-yellow-600" : "bg-red-600"
          }`}>
            {problem.difficulty}
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {problem.tags.map((tag: string, i: number) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/50">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="text-sm text-zinc-300/90 pt-2">
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
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate("/problems")} 
        className="absolute bottom-4 left-4 right-4 w-[calc(100%-2rem)] bg-zinc-800 text-green-500 hover:bg-zinc-700 hover:text-green-400 border-zinc-700"
      >
        <ChevronLeft className="h-4 w-4 mr-2" /> Back to Problems
      </Button>
    </motion.div>
  );
};

const ProblemDetail = () => {
  const {
    isLoading,
    problem,
    language,
    setLanguage,
    code,
    setCode,
    output,
    executionResult,
    isExecuting,
    customTestCases,
    consoleTab,
    setConsoleTab,
    isMobile,
    handleCodeExecution,
    handleResetCode,
    handleAddCustomTestCase
  } = useProblemDetail();
  
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white pt-16">
        <MainNavbar />
        <main className="page-container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 bg-zinc-800 rounded"></div>
            <div className="h-4 w-full bg-zinc-800 rounded"></div>
            <div className="h-[600px] w-full bg-zinc-800 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white pt-16">
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
          className="h-full rounded-lg overflow-hidden border border-zinc-800 bg-[#141519] shadow-xl"
        >
          <ResizablePanel defaultSize={40} minSize={20}>
            <ProblemDescription problem={problem} />
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-zinc-800" />
          
          <ResizablePanel defaultSize={60} minSize={30}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70} minSize={30}>
                <motion.div 
                  className="p-4 space-y-4 h-full flex flex-col bg-[#141519]"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handleCodeExecution('run')}
                        disabled={isExecuting}
                        className="px-3 py-1.5 rounded-md flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 border border-green-500/20 shadow-sm shadow-green-900/20 transition-colors"
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {isExecuting ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">Run</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => handleCodeExecution('submit')}
                        disabled={isExecuting}
                        className="px-3 py-1.5 rounded-md flex items-center gap-2 text-white bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 border border-zinc-600/20 shadow-sm"
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {isExecuting ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Code className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">Submit</span>
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center justify-between gap-3">
                      <Timer />
                      
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-zinc-800 text-zinc-200 px-3 py-1.5 rounded-md border border-zinc-700 focus:border-green-500 focus:outline-none text-sm"
                      >
                        {problem.supported_languages.map((lang: string) => (
                          <option key={lang} value={lang} className="capitalize">{lang}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <CodeEditor
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
                  executionResult={executionResult}
                  onReset={handleResetCode}
                  testCases={problem.testcase_run.run}
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
