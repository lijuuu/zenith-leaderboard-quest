
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy, CheckCheck, PlayIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Editor from "@monaco-editor/react";
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@/hooks/theme-provider';
import { cn } from '@/lib/utils';
import { RootState } from '@/store';
import { toast } from 'sonner';
import { File, languages } from './CompilerLayout';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
  className?: string;
  isMobile: boolean;
}

const CodeEditor = ({ className, isMobile }: CodeEditorProps) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  
  // Get state from Redux store
  const { code, language, files, currentFile } = useSelector((state: RootState) => 
    state.xCodeCompiler ? state.xCodeCompiler : { code: '', language: 'javascript', files: [], currentFile: null }
  );

  const [fontSize, setFontSize] = useState(14);
  const [copied, setCopied] = useState(false);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleRun = () => {
    if (dispatch) {
      const reqLang = languages.find((lang) => lang.value === language)?.req || '';
      dispatch({ type: 'xCodeCompiler/runCode', payload: { code, reqLang } });
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    if (dispatch) {
      dispatch({ type: 'xCodeCompiler/setCode', payload: value || '' });
    }
  };

  const handleDownload = () => {
    const currentLang = languages.find(l => l.value === language);
    const extension = currentLang?.file || 'txt';
    const filename = `code.${extension}`;

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className={cn("w-full h-full flex flex-col p-4 bg-background", className)}>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-foreground">
          {currentFile ? files.find((f: File) => f.id === currentFile)?.name || 'Editor' : 'Editor'}
        </div>
        <div className="flex space-x-2">
          {!isMobile && (
            <div className="flex items-center gap-2 opacity-60 hover:opacity-85">
              <label htmlFor="font-size-slider" className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Font Size:
              </label>
              <input
                id="font-size-slider"
                type="range"
                min="8"
                max="30"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-40 h-2 bg-black dark:bg-white rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{fontSize}px</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="border-border/50 hover:bg-muted"
          >
            {copied ? (
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
            ) : (
              <Copy className="h-3.5 w-3.5 mr-1" />
            )}
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="border-border/50 hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            Download
          </Button>
          <Button
            onClick={handleRun}
            disabled={!code.trim()}
            size="sm"
            className="gap-1 bg-primary hover:bg-primary/90"
          >
            <PlayIcon className="h-3.5 w-3.5" />
            <span>Run</span>
          </Button>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 rounded-md overflow-hidden border border-border/50"
      >
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
          onMount={handleEditorDidMount}
          options={{
            automaticLayout: true,
            minimap: { enabled: true },
            fontSize: fontSize,
            lineNumbers: 'on',
            padding: { top: 10 },
            scrollBeyondLastLine: false,
          }}
          loading={<div className="bg-background w-full h-full" />}
        />
      </motion.div>
    </div>
  );
};

export default CodeEditor;
