
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Download, Copy, Play, FilePlus, Lightbulb, Settings, Terminal } from 'lucide-react';

const Compiler = () => {
  const [fontSize, setFontSize] = useState(14);
  const [activeLanguage, setActiveLanguage] = useState("go");
  const [activeFile, setActiveFile] = useState("NewFile9.go");
  const [files, setFiles] = useState([
    { id: 1, name: "NewFile1.js", language: "javascript" },
    { id: 2, name: "NewFile2.py", language: "python" },
    { id: 3, name: "NewFile3.py", language: "python" },
    { id: 4, name: "NewFile4.go", language: "go" },
    { id: 5, name: "NewFile5.py", language: "python" },
    { id: 6, name: "NewFile6.js", language: "javascript" },
    { id: 7, name: "tmpAlter.go", language: "go" },
    { id: 8, name: "NewFile8.js", language: "javascript" },
    { id: 9, name: "NewFile9.go", language: "go" },
  ]);

  const goCode = `package main

import (
  "encoding/json"
  "fmt"
)

type TestCase struct {
  ID       string \`json:"id"\`
  Input    string \`json:"input"\`    // JSON string, e.g., {"nums":[1,2],"target":9}
  Expected string \`json:"expected"\` // JSON string, e.g., "[0,1]"
}

type Input struct {
  Nums   []int \`json:"nums"\`   // Changed from "input" to "nums" to match JSON
  Target int   \`json:"target"\`
}

type TestCaseResult struct {
  TestCaseIndex int         \`json:"testCaseIndex"\`
  Input         interface{} \`json:"input"\`
  Expected      interface{} \`json:"expected"\`
  Received      interface{} \`json:"received"\`
  Passed        bool        \`json:"passed"\`
  Error         string      \`json:"error,omitempty"\`
}

type UniversalExecutionResult struct {
  TotalTestCases    int             \`json:"totalTestCases"\`
  PassedTestCases   int             \`json:"passedTestCases"\`
  FailedTestCases   int             \`json:"failedTestCases"\`
  FailedTestCase    *TestCaseResult \`json:"failedTestCase,omitempty"\`
}`;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - File Explorer */}
          <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-zinc-800">
              <h2 className="text-lg font-medium">Files</h2>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-white">
                <FilePlus className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-2 text-xs text-zinc-500">
              Ctrl+B to Hide/Unhide
            </div>
            <div className="overflow-y-auto flex-1">
              {files.map((file) => (
                <div 
                  key={file.id}
                  className={`flex items-center px-4 py-2 cursor-pointer ${activeFile === file.name ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}`}
                  onClick={() => setActiveFile(file.name)}
                >
                  <div className="w-4 h-4 mr-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col">
            {/* Editor Header */}
            <div className="bg-zinc-900 border-b border-zinc-800 p-3 flex items-center justify-between">
              <div className="flex items-center">
                <Terminal className="h-5 w-5 mr-2 text-zinc-400" />
                <span className="text-zinc-400">xcode</span>
                <span className="ml-1 text-zinc-600">compiler</span>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                  <span className="mr-2">Go</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex flex-1">
              <div className="flex-1 flex flex-col bg-zinc-950">
                {/* File Tab and Controls */}
                <div className="flex items-center justify-between border-b border-zinc-800 p-3">
                  <div className="text-sm text-zinc-400">{activeFile}</div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-zinc-400">Font Size:</span>
                      <div className="w-36 flex items-center">
                        <Slider 
                          value={[fontSize]} 
                          min={8} 
                          max={24} 
                          step={1} 
                          onValueChange={(value) => setFontSize(value[0])} 
                          className="w-full" 
                        />
                        <span className="ml-2 text-sm text-zinc-400">{fontSize}px</span>
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8 border-zinc-700 text-zinc-400 hover:text-white">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy code</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8 border-zinc-700 text-zinc-400 hover:text-white">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download file</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button className="bg-green-600 hover:bg-green-700 gap-2">
                      <Play className="h-4 w-4" />
                      Run
                    </Button>
                  </div>
                </div>

                {/* Code Editor */}
                <div className="flex-1 overflow-auto p-4 font-mono" style={{ fontSize: `${fontSize}px` }}>
                  <div className="flex">
                    {/* Line Numbers */}
                    <div className="text-zinc-600 text-right pr-4 select-none">
                      {Array.from({ length: goCode.split('\n').length }).map((_, i) => (
                        <div key={i + 1} className="leading-6">{i + 1}</div>
                      ))}
                    </div>
                    {/* Code Content */}
                    <pre className="flex-1 text-left overflow-auto">
                      <code className="language-go">
                        {goCode.split('\n').map((line, i) => {
                          const coloredLine = line
                            .replace(/package\s+(\w+)/g, '<span class="text-blue-400">package</span> <span class="text-blue-300">$1</span>')
                            .replace(/import\s+\(/g, '<span class="text-blue-400">import</span> (')
                            .replace(/"([^"]+)"/g, '<span class="text-green-400">"$1"</span>')
                            .replace(/type\s+(\w+)\s+struct/g, '<span class="text-blue-400">type</span> <span class="text-purple-400">$1</span> <span class="text-blue-400">struct</span>')
                            .replace(/\bstruct\b/g, '<span class="text-blue-400">struct</span>')
                            .replace(/\b(int|string|bool|interface{}|\[\]int)\b/g, '<span class="text-blue-400">$1</span>')
                            .replace(/\/\/\s+(.*)/g, '<span class="text-green-600">// $1</span>');
                          return (
                            <div key={i} className="leading-6" dangerouslySetInnerHTML={{ __html: coloredLine }} />
                          );
                        })}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
              
              {/* Right Panel - Output */}
              <div className="w-1/3 bg-zinc-900 border-l border-zinc-800 flex flex-col">
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                  <h2 className="text-lg font-medium">Output</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 border-zinc-700 text-blue-400 hover:text-blue-300 gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Suggest Hints
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Get AI hints for your code</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex-1 p-4 overflow-auto">
                  <div className="flex items-center justify-center h-full text-zinc-500">
                    No result yet.
                  </div>
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
