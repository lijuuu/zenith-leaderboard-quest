
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RefreshCw, CheckCircle, XCircle, Plus, Terminal, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TestCase, ExecutionResult } from "@/api/types/problem-execution";

interface ConsoleProps {
  output: string[];
  executionResult: ExecutionResult | null;
  onReset: () => void;
  testCases: TestCase[];
  customTestCases: TestCase[];
  onAddCustomTestCase: (input: string, expected: string) => void;
  activeTab: 'output' | 'tests' | 'custom';
  setActiveTab: (tab: 'output' | 'tests' | 'custom') => void;
}

export const Console = ({ 
  output = [], 
  executionResult, 
  onReset, 
  testCases = [], 
  customTestCases = [], 
  onAddCustomTestCase, 
  activeTab, 
  setActiveTab 
}: ConsoleProps) => {
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
            <h4 className="text-white font-medium mb-2">Run Test Cases</h4>
            {testCases.length > 0 ? (
              <div className="space-y-2">
                {testCases.map((tc, i) => (
                  <div key={tc.id || i} className="p-2 rounded-md bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300">Test Case {i + 1}</span>
                      {executionResult && executionResult.failedTestCase && executionResult.failedTestCase.testCaseIndex === i ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : executionResult && executionResult.passedTestCases > i ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                    <div className="ml-4 mt-1 text-xs space-y-1">
                      <div>Input: <span className="text-green-500">{tc.input}</span></div>
                      <div>Expected: <span className="text-green-500">{tc.expected}</span></div>
                      {executionResult && executionResult.failedTestCase && executionResult.failedTestCase.testCaseIndex === i && (
                        <>
                          {JSON.stringify(executionResult.failedTestCase.received) && <div>Received: <span className="text-red-400">{JSON.stringify(executionResult.failedTestCase.received)}</span></div>}
                          {executionResult.failedTestCase.error && <div>Error: <span className="text-red-400">{executionResult.failedTestCase.error}</span></div>}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-zinc-500 italic">No run test cases available.</div>
            )}
            
            {executionResult && (
              <div className="mt-4 p-3 bg-zinc-900 border border-zinc-800 rounded-md">
                <div className="mb-2">
                  <span className="text-zinc-300">Total Test Cases: {executionResult.totalTestCases}</span><br />
                  <span className="text-green-500">Passed: {executionResult.passedTestCases}</span><br />
                  <span className="text-red-500">Failed: {executionResult.failedTestCases}</span>
                </div>
                {executionResult.failedTestCase?.testCaseIndex !== -1 && (
                  <div className="p-2 rounded-md bg-red-900/20">
                    <h4 className="text-red-400 font-medium">Failed Test Case Details</h4>
                    <div className="ml-2 mt-1 text-xs space-y-1">
                      <div>Test Case Index: <span className="text-zinc-300">{executionResult.failedTestCase?.testCaseIndex}</span></div>
                      <div>Input: <span className="text-green-500">{JSON.stringify(executionResult.failedTestCase?.input)}</span></div>
                      <div>Expected: <span className="text-green-500">{JSON.stringify(executionResult.failedTestCase?.expected)}</span></div>
                      <div>Received: <span className="text-red-400">{JSON.stringify(executionResult.failedTestCase?.received)}</span></div>
                      {executionResult.failedTestCase?.error && <div>Error: <span className="text-red-400">{executionResult.failedTestCase?.error}</span></div>}
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

export default Console;
