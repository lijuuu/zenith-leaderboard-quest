
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RefreshCw, Clock, CheckCircle, XCircle, ArrowLeft, Plus, Terminal, Server } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import * as monaco from 'monaco-editor';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import MainNavbar from '@/components/MainNavbar';
import { TestCase, TestCaseRunOnly, ProblemMetadata, TestResult, ExecutionResult, ApiResponsePayload, GenericResponse } from '@/api/types/problem-execution';

const API_BASE_URL = 'http://localhost:7000/api/v1';

const mapDifficulty = (difficulty: string): string => {
  switch (difficulty) {
    case 'E': return 'Easy';
    case 'M': return 'Medium';
    case 'H': return 'Hard';
    default: return difficulty;
  }
};

const fetchProblemById = async (problemId: string): Promise<ProblemMetadata> => {
  const response = await fetch(`${API_BASE_URL}/problems/metadata?problem_id=${problemId}`);
  if (!response.ok) throw new Error('Failed to fetch problem');
  const data = await response.json();
  const problemData = data.payload || data;
  return {
    problem_id: problemData.problem_id || '',
    title: problemData.title || 'Untitled',
    description: problemData.description || '',
    tags: problemData.tags || [],
    testcase_run: problemData.testcase_run || { run: [] }, // Ensure testcase_run is always defined
    difficulty: mapDifficulty(problemData.difficulty || ''),
    supported_languages: problemData.supported_languages || [],
    validated: problemData.validated || false,
    placeholder_maps: problemData.placeholder_maps || {},
  };
};

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

const Timer: React.FC = () => {
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
      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/80 backdrop-blur-sm rounded-md shadow-md border border-zinc-700/40" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-1.5 text-sm text-zinc-300">
        <Clock className="h-3.5 w-3.5 text-green-500" />
        <span className="font-medium tracking-wide">{formatTime(time)}</span>
      </div>
      <div className="h-3.5 w-px bg-zinc-700/50 mx-0.5"></div>
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsActive(true)} 
          disabled={isActive} 
          className="h-6 px-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-700"
        >
          Start
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => { setIsActive(false); setTime(0); }} 
          className="h-6 px-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-700"
        >
          Reset
        </Button>
      </div>
    </motion.div>
  );
};

const ProblemDescription: React.FC<{ problem: ProblemMetadata }> = ({ problem }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      className="p-4 overflow-y-auto h-full bg-zinc-900 border-r border-zinc-800 relative" 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">{problem.title}</h2>
        <div className="flex gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
            problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {problem.difficulty}
          </span>
          {problem.tags.map((tag, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
              {tag}
            </span>
          ))}
        </div>
        <div className="text-sm text-zinc-300">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-white mt-5 mb-3" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-lg font-semibold text-white mt-4 mb-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-md font-medium text-white mt-3 mb-1" {...props} />,
              p: ({ node, ...props }) => <p className="text-zinc-300 mb-3" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-4 text-zinc-300 space-y-1 mb-3" {...props} />,
              li: ({ node, ...props }) => <li className="text-zinc-300" {...props} />,
              code: ({ node, ...props }) => <code className="px-1.5 py-0.5 bg-zinc-800 rounded text-sm text-green-400" {...props} />,
              pre: ({ node, ...props }) => <pre className="p-3 bg-zinc-800/80 rounded-md my-3 overflow-x-auto" {...props} />,
            }}
          >
            {problem.description}
          </ReactMarkdown>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/problems')} 
        className="absolute bottom-4 left-4 border-zinc-700 hover:bg-zinc-800 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> View All Problems
      </Button>
    </motion.div>
  );
};

const CodeEditor: React.FC<{ value: string; onChange: (value: string) => void; language: string }> = ({ value, onChange, language }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  
  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
    
    // Add custom theme styling for better aesthetics
    monaco.editor.defineTheme('zenx-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C678DD' },
        { token: 'string', foreground: '98C379' },
        { token: 'number', foreground: 'D19A66' },
        { token: 'function', foreground: '61AFEF' },
        { token: 'variable', foreground: 'E06C75' },
        { token: 'type', foreground: '56B6C2' }
      ],
      colors: {
        'editor.background': '#1A1D23',
        'editor.foreground': '#ABB2BF',
        'editor.lineHighlightBackground': '#2C313C',
        'editor.selectionBackground': '#3E4452',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorCursor.foreground': '#528BFF',
        'editorWhitespace.foreground': '#3B4048',
        'editorIndentGuide.background': '#3B4048',
        'editor.selectionHighlightBorder': '#3B4048'
      }
    });
    monaco.editor.setTheme('zenx-dark');
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
      className="w-full h-full overflow-hidden rounded-md bg-[#1A1D23] border border-zinc-800 shadow-lg"
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
        theme="zenx-dark"
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
          scrollbar: { 
            verticalScrollbarSize: 6, 
            horizontalScrollbarSize: 6,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            vertical: 'visible',
            horizontal: 'visible',
            verticalSliderSize: 6,
            horizontalSliderSize: 6
          },
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          contextmenu: true,
          suggest: { 
            showMethods: true, 
            showFunctions: true, 
            showConstructors: true, 
            showFields: true, 
            showVariables: true, 
            showClasses: true, 
            showInterfaces: true 
          },
          lineDecorationsWidth: 10,
          renderLineHighlight: 'all',
          colorDecorators: true,
          guides: {
            indentation: true,
            highlightActiveIndentation: true,
            bracketPairs: true
          },
          renderValidationDecorations: 'on',
          fixedOverflowWidgets: true
        }}
      />
    </motion.div>
  );
};

const Console: React.FC<{
  output: string[];
  executionResult: ExecutionResult | null;
  onReset: () => void;
  testCases: TestCase[];
  customTestCases: TestCase[];
  onAddCustomTestCase: (input: string, expected: string) => void;
  activeTab: 'output' | 'tests' | 'custom';
  setActiveTab: (tab: 'output' | 'tests' | 'custom') => void;
}> = ({ 
  output = [], 
  executionResult, 
  onReset, 
  testCases = [], 
  customTestCases = [], 
  onAddCustomTestCase, 
  activeTab, 
  setActiveTab 
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

  // Function to prettify JSON but keep formatting
  const formatTestCase = (jsonString: string) => {
    try {
      // We're displaying the raw JSON string as requested
      return jsonString;
    } catch (e) {
      return jsonString;
    }
  };

  return (
    <motion.div 
      className="h-full overflow-hidden flex flex-col bg-zinc-900 border-t border-zinc-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2 bg-zinc-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
          <h3 className="text-sm font-medium text-white">Console</h3>
          <div className="flex text-xs ml-2">
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
      
      <div className="overflow-y-auto p-3 font-mono text-sm flex-grow bg-[#1A1D23]">
        {activeTab === 'output' ? (
          output.length > 0 ? (
            <div className="space-y-1">
              {output.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap break-all">
                  {line.startsWith('[Error]') ? 
                    <span className="text-red-400">{line}</span> : 
                    line.match(/Array|Object|ProblemID|Language|IsRunTestcase|ExecutionResult/) ? 
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
                  <div key={tc.id || i} className="p-2.5 rounded-md bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300 font-medium">Test Case {i + 1}</span>
                      {executionResult && executionResult.failedTestCase && executionResult.failedTestCase.testCaseIndex === i ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : executionResult && executionResult.passedTestCases > i ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                    <div className="ml-4 mt-1.5 text-xs space-y-1.5">
                      <div className="flex flex-col">
                        <span className="text-zinc-500 mb-1">Input:</span>
                        <pre className="text-green-500 font-mono bg-black/30 p-2 rounded overflow-x-auto">{formatTestCase(tc.input)}</pre>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-zinc-500 mb-1">Expected:</span>
                        <pre className="text-green-500 font-mono bg-black/30 p-2 rounded overflow-x-auto">{formatTestCase(tc.expected)}</pre>
                      </div>
                      {executionResult && executionResult.failedTestCase && executionResult.failedTestCase.testCaseIndex === i && (
                        <>
                          {JSON.stringify(executionResult.failedTestCase.received) && 
                            <div className="flex flex-col">
                              <span className="text-zinc-500 mb-1">Received:</span>
                              <pre className="text-red-400 font-mono bg-black/30 p-2 rounded overflow-x-auto">{JSON.stringify(executionResult.failedTestCase.received, null, 2)}</pre>
                            </div>
                          }
                          {executionResult.failedTestCase.error && 
                            <div className="flex flex-col">
                              <span className="text-zinc-500 mb-1">Error:</span>
                              <pre className="text-red-400 font-mono bg-black/30 p-2 rounded overflow-x-auto">{executionResult.failedTestCase.error}</pre>
                            </div>
                          }
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
              <div className="mt-4 p-3 bg-zinc-900/70 border border-zinc-800/80 rounded-md">
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-zinc-300 font-medium">Test Results Summary</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${executionResult.overallPass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {executionResult.overallPass ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="p-2 rounded bg-zinc-800/50">
                      <div className="text-zinc-500 text-xs">Total</div>
                      <div className="text-white font-medium">{executionResult.totalTestCases}</div>
                    </div>
                    <div className="p-2 rounded bg-green-900/20">
                      <div className="text-green-400 text-xs">Passed</div>
                      <div className="text-green-300 font-medium">{executionResult.passedTestCases}</div>
                    </div>
                    <div className="p-2 rounded bg-red-900/20">
                      <div className="text-red-400 text-xs">Failed</div>
                      <div className="text-red-300 font-medium">{executionResult.failedTestCases}</div>
                    </div>
                  </div>
                </div>
                
                {executionResult.failedTestCase?.testCaseIndex !== undefined && executionResult.failedTestCase?.testCaseIndex !== -1 && (
                  <div className="p-3 rounded-md bg-red-900/20 border border-red-900/30 mt-3">
                    <h4 className="text-red-400 font-medium mb-2">Failed Test Case Details</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex">
                        <span className="text-zinc-400 w-24 inline-block">Test Case:</span>
                        <span className="text-zinc-300">{executionResult.failedTestCase?.testCaseIndex + 1}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-zinc-400 mb-1">Input:</span>
                        <pre className="text-green-500 font-mono bg-black/30 p-2 rounded overflow-x-auto">{JSON.stringify(executionResult.failedTestCase?.input, null, 2)}</pre>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-zinc-400 mb-1">Expected:</span>
                        <pre className="text-green-500 font-mono bg-black/30 p-2 rounded overflow-x-auto">{JSON.stringify(executionResult.failedTestCase?.expected, null, 2)}</pre>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-zinc-400 mb-1">Received:</span>
                        <pre className="text-red-400 font-mono bg-black/30 p-2 rounded overflow-x-auto">{JSON.stringify(executionResult.failedTestCase?.received, null, 2)}</pre>
                      </div>
                      {executionResult.failedTestCase?.error && 
                        <div className="flex flex-col">
                          <span className="text-zinc-400 mb-1">Error:</span>
                          <pre className="text-red-400 font-mono bg-black/30 p-2 rounded overflow-x-auto">{executionResult.failedTestCase?.error}</pre>
                        </div>
                      }
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-5 p-3 rounded-md border border-zinc-800/80 bg-zinc-900/40">
              <h4 className="text-white font-medium mb-3">Add Custom Test Case</h4>
              <Input
                placeholder='e.g., { "nums": [2,7,11,15], "target": 9 }'
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="mb-2 bg-zinc-900/80 text-zinc-300 border-zinc-800/80 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20"
              />
              <Input
                placeholder="e.g., [0,1]"
                value={customExpected}
                onChange={(e) => setCustomExpected(e.target.value)}
                className="mb-3 bg-zinc-900/80 text-zinc-300 border-zinc-800/80 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20"
              />
              <Button 
                onClick={handleAddCustomTestCase} 
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Test Case
              </Button>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2 flex items-center">
                <span>Custom Test Cases</span>
                {customTestCases.length > 0 && 
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                    {customTestCases.length}
                  </span>
                }
              </h4>
              
              {customTestCases.length > 0 ? (
                <div className="space-y-2">
                  {customTestCases.map((tc, i) => (
                    <div key={i} className="p-2.5 rounded-md bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors">
                      <div className="text-xs font-medium text-zinc-400 mb-1.5">Custom Test #{i+1}</div>
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-zinc-500 text-xs mb-1">Input:</span>
                          <pre className="text-green-500 font-mono bg-black/30 p-2 rounded text-xs overflow-x-auto">{formatTestCase(tc.input)}</pre>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-zinc-500 text-xs mb-1">Expected:</span>
                          <pre className="text-green-500 font-mono bg-black/30 p-2 rounded text-xs overflow-x-auto">{formatTestCase(tc.expected)}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-zinc-500 italic py-4 text-center bg-zinc-900/20 rounded-md border border-dashed border-zinc-800/50">
                  No custom test cases added yet...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Playground: React.FC = () => {
  const [problemId, setProblemId] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string[]>([]);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [problem, setProblem] = useState<ProblemMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customTestCases, setCustomTestCases] = useState<TestCase[]>([]);
  const [consoleTab, setConsoleTab] = useState<'output' | 'tests' | 'custom'>('tests');
  const isMobile = useIsMobile();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlProblemId = queryParams.get('problem_id') || '';
    setProblemId(urlProblemId);

    if (!urlProblemId) {
      setIsLoading(false);
      return;
    }

    const storedLanguage = localStorage.getItem('language');

    setIsLoading(true);
    fetchProblemById(urlProblemId)
      .then(data => {
        setProblem(data);
        const firstLang = storedLanguage && data.supported_languages.includes(storedLanguage)
          ? storedLanguage
          : data.supported_languages[0] || 'go';
        setLanguage(firstLang);
        localStorage.setItem('language', firstLang);

        const codeKey = `${urlProblemId}_${firstLang}`;
        const storedCode = localStorage.getItem(codeKey);
        setCode(storedCode || data.placeholder_maps[firstLang] || '');
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching problem:', error);
        // Set a default problem to prevent undefined states
        setProblem({
          problem_id: '',
          title: 'Error Loading Problem',
          description: 'Failed to load problem data. Please try again later.',
          tags: [],
          testcase_run: { run: [] },
          difficulty: 'Unknown',
          supported_languages: ['javascript', 'go', 'python', 'cpp'],
          placeholder_maps: {
            javascript: '// Write your JavaScript solution here\n',
            go: '// Write your Go solution here\npackage main\n',
            python: '# Write your Python solution here\n',
            cpp: '// Write your C++ solution here\n#include <string>\n',
          },
        });
        setLanguage(storedLanguage || 'javascript');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (problem && language) {
      const codeKey = `${problem.problem_id}_${language}`;
      const storedCode = localStorage.getItem(codeKey);
      setCode(storedCode || problem.placeholder_maps[language] || '');
      setOutput([]);
      setExecutionResult(null);
      localStorage.setItem('language', language);
    }
  }, [problem, language]);

  useEffect(() => {
    if (problemId && language && code) {
      const codeKey = `${problemId}_${language}`;
      localStorage.setItem(codeKey, code);
    }
  }, [code, problemId, language]);

  const handleCodeExecution = useCallback(async (type: string) => {
    if (!problem) return;

    setIsExecuting(true);
    setOutput([]);
    setExecutionResult(null);

    const allTestCases = type === 'run' ? [...problem.testcase_run.run, ...customTestCases] : problem.testcase_run.run;

    try {
      const response = await fetch(`${API_BASE_URL}/problems/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_id: problem.problem_id,
          language: language,
          user_code: code,
          is_run_testcase: type === 'run',
        }),
      });

      const data: GenericResponse = await response.json();
      const payload: ApiResponsePayload = data.payload;
      const executionResult: ExecutionResult = payload.rawoutput;

      if (!data.success) {
        let errorMessage = executionResult.failedTestCase?.error || 'Unknown error';
        if (executionResult.syntaxError) {
          errorMessage = `Syntax Error: ${executionResult.syntaxError}`;
        } else if (data.error) {
          errorMessage = `${data.error.errorType}: ${data.error.message}`;
        }

        setOutput([`[Error] ${errorMessage}`]);
        setExecutionResult(executionResult);
        setConsoleTab('output');

        toast.error(`${type === 'run' ? 'Run' : 'Submit'} Failed`, {
          description: errorMessage,
        });
      } else {
        setOutput([
          `ProblemID: ${payload.problem_id}`,
          `Language: ${payload.language}`,
          `IsRunTestcase: ${payload.is_run_testcase}`,
          `ExecutionResult: ${JSON.stringify(executionResult, null, 2)}`,
        ]);
        setExecutionResult(executionResult);

        if (type === 'run') {
          if (executionResult.overallPass) {
            toast.success('Run Successful', {
              description: `All ${executionResult.totalTestCases} test cases passed!`,
            });
            setConsoleTab('output');
          } else {
            toast.warning('Run Partially Successful', {
              description: `${executionResult.passedTestCases} of ${executionResult.totalTestCases} test cases passed.`,
            });
            setConsoleTab('tests');
          }
        } else if (type === 'submit') {
          if (executionResult.overallPass) {
            toast.success('Submission Accepted', {
              description: 'All test cases passed! Great job!',
            });
            setConsoleTab('output');
          } else {
            toast.error('Submission Failed', {
              description: `${executionResult.failedTestCases} test case(s) failed. Check the details.`,
            });
            setConsoleTab('tests');
          }
        }
      }
    } catch (error) {
      const errorMsg = (error as Error).message || 'Network error occurred';
      setOutput([`[Error] ${errorMsg}`]);
      setExecutionResult({
        totalTestCases: allTestCases.length,
        passedTestCases: 0,
        failedTestCases: 0,
        overallPass: false,
        failedTestCase: { testCaseIndex: -1, input: null, expected: null, received: null, passed: false, error: errorMsg },
      });
      setConsoleTab('output');

      toast.error(`${type === 'run' ? 'Run' : 'Submit'} Failed`, {
        description: errorMsg,
      });
    } finally {
      setIsExecuting(false);
    }
  }, [code, problem, language, customTestCases]);

  const handleResetCode = () => {
    if (problem && language) {
      const codeKey = `${problem.problem_id}_${language}`;
      localStorage.removeItem(codeKey);
      setCode(problem.placeholder_maps[language] || '');
      setOutput([]);
      setExecutionResult(null);
      setCustomTestCases([]);
      setConsoleTab('tests');
      toast.info('Code Reset', { description: 'Editor reset to default code.' });
    }
  };

  const handleAddCustomTestCase = (input: string, expected: string) => {
    setCustomTestCases(prev => [...prev, { input, expected }]);
    toast.success('Custom Test Case Added', { description: 'Added to your test cases.' });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-zinc-300">Loading...</div>;
  if (!problem) return <div className="min-h-screen flex items-center justify-center text-zinc-300">No problem specified or failed to load.</div>;

  return (
    <motion.div className="min-h-screen flex flex-col bg-zinc-950 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <ResizablePanelGroup direction={isMobile ? 'vertical' : 'horizontal'} className="flex-grow">
        <ResizablePanel defaultSize={isMobile ? 40 : 35} minSize={20} className="relative">
          <ProblemDescription problem={problem} />
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-zinc-800" />
        <ResizablePanel defaultSize={isMobile ? 60 : 65} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70} minSize={30}>
              <motion.div className="p-3 space-y-3 h-full flex flex-col bg-zinc-900" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <motion.button 
                      onClick={() => handleCodeExecution("run")} 
                      disabled={isExecuting} 
                      className="px-3 py-1.5 rounded-md flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {isExecuting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                      <span className="text-sm font-medium">Run</span>
                    </motion.button>
                    <motion.button 
                      onClick={() => handleCodeExecution("submit")} 
                      disabled={isExecuting} 
                      className="px-3 py-1.5 rounded-md flex items-center gap-2 bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {isExecuting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                      <span className="text-sm font-medium">Submit</span>
                    </motion.button>
                  </div>
                  <Timer />
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)} 
                    className="bg-zinc-800 text-zinc-300 px-2.5 py-1.5 rounded-md border border-zinc-700 focus:border-green-500/50 focus:outline-none text-sm"
                  >
                    {problem.supported_languages.map(lang => (
                      <option key={lang} value={lang} className="bg-zinc-800 text-zinc-300">
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-grow">
                  <CodeEditor value={code} onChange={setCode} language={language} />
                </div>
              </motion.div>
            </ResizablePanel>
            <ResizableHandle withHandle className="bg-zinc-800" />
            <ResizablePanel defaultSize={30} minSize={5}>
              <Console
                output={output}
                executionResult={executionResult}
                onReset={handleResetCode}
                testCases={problem.testcase_run.run || []} 
                customTestCases={customTestCases}
                onAddCustomTestCase={handleAddCustomTestCase}
                activeTab={consoleTab}
                setActiveTab={setConsoleTab}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </motion.div>
  );
};

export default Playground;
