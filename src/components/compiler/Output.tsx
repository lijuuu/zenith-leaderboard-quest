
import React, { useState, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { RootState } from '@/store';
import { Copy, CheckCheck, ChevronDown, ChevronUp, LightbulbIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface OutputProps {
  className?: string;
}

const isValidJson = (str: string | undefined): boolean => {
  if (!str) return false;
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

function Output({ className }: OutputProps) {
  // Get state from Redux store
  const { loading, result, code, language } = useSelector((state: RootState) => 
    state.xCodeCompiler ? state.xCodeCompiler : { 
      loading: false, 
      result: {}, 
      code: '',
      language: 'javascript'
    }
  );

  const [copied, setCopied] = useState(false);
  const [isErrorExpanded, setIsErrorExpanded] = useState(false);
  const [hints, setHints] = useState<string | null>("");
  const [loadingHints, setLoadingHints] = useState(false);
  const [isHintsModalOpen, setIsHintsModalOpen] = useState(false);

  const handleCopy = async () => {
    const textToCopy = result?.output || result?.status_message || result?.error || '';
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const fetchHints = async () => {
    setLoadingHints(true);
    try {
      const errorContext = result?.error || result?.status_message || '';
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyATP4kvlgboNEPOz60PtvgeqrLurYO6AoM',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `As a coding assistant, provide 3 concise hints to improve or fix this ${language} code:
                    \`\`\`${language}
                    ${code}
                    \`\`\`
                    ${errorContext ? `The code has the following error: ${errorContext}` : ''}
                    Provide logical answers and exact code to fix or replace within a few lines. Format in markdown with code blocks within 2500 tokens`,
                  },
                ],
              },
            ],
            generationConfig: { temperature: 0.4, maxOutputTokens: 3000 },
            safetySettings: [],
          }),
        }
      );

      const data = await response.json();
      setHints(
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Could not generate hints at this time. Please try again later.'
      );
    } catch (error) {
      setHints('Error fetching hints. Please check your API key and try again.');
      console.error('Error fetching hints:', error);
    } finally {
      setLoadingHints(false);
    }
  };

  const handleShowHints = () => {
    if (!hints) fetchHints();
    setIsHintsModalOpen(true);
  };

  const handleRefreshHints = () => {
    setHints(null);
    fetchHints();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isHintsModalOpen) setIsHintsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHintsModalOpen]);

  const renderMarkdownOutput = (text: string | undefined, type: 'output' | 'error' | 'status' | 'hints') => {
    if (!text) return null;
    const className = cn(
      'py-1 px-4',
      type === 'error' && 'text-red-400 whitespace-pre-line',
      type === 'status' && 'text-yellow-400',
      type === 'output' && 'text-gray-400',
      type === 'hints' && 'text-blue-200'
    );
    return (
      <div className={className}>
        <ReactMarkdown
          components={{
            code({ className, children, ...props }) {
              return (
                <code
                  className={cn(
                    'bg-muted/30 px-1 py-0.5 rounded',
                    type === 'error' && 'text-red-400',
                    type === 'status' && 'text-yellow-400',
                    type === 'output' && 'text-gray-400',
                    type === 'hints' && 'bg-blue-300/20 text-zinc-200',
                    className
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            pre({ children, ...props }) {
              return (
                <pre
                  className={cn(
                    'bg-muted/30 p-2 rounded-md overflow-x-auto my-2',
                    type === 'error' && 'bg-red-500/10',
                    type === 'status' && 'bg-yellow-500/10',
                    type === 'hints' && 'bg-blue-500/20'
                  )}
                  {...props}
                >
                  {children}
                </pre>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    );
  };

  const renderJsonOutput = (jsonStr: string) => {
    try {
      const jsonObj = JSON.parse(jsonStr);
      return (
        <pre className="p-4 bg-muted/30 rounded-md overflow-x-auto">
          <code className="text-gray-400">
            {JSON.stringify(jsonObj, null, 2)}
          </code>
        </pre>
      );
    } catch (e) {
      return renderMarkdownOutput(jsonStr, 'output');
    }
  };

  const isLongContent = (text: string | undefined) => (text?.split('\n').length || 0) > 5;

  return (
    <div className={cn('h-full bg-background max-w-full overflow-x-hidden', className)}>
      <div className="p-4 h-full flex flex-col max-w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-2 bg-muted/20 rounded-md border border-border/50">
          <h2 className="text-base font-semibold text-foreground mb-2 md:mb-0">Output</h2>
          <div className="flex flex-row items-center gap-2">
            <Dialog open={isHintsModalOpen} onOpenChange={setIsHintsModalOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={handleShowHints}
                  disabled={loadingHints || !code}
                  className={cn(
                    'px-3 py-1 rounded-md text-sm border flex items-center gap-1 transition-colors',
                    loadingHints
                      ? 'bg-yellow-200/10 text-yellow-600/50 border-yellow-600/10'
                      : 'bg-blue-500/20 text-blue-600 border-blue-600/20 hover:bg-blue-500/30'
                  )}
                  title="Get code suggestions using Gemini"
                >
                  <LightbulbIcon className="h-4 w-4" />
                  {loadingHints ? 'Loading...' : 'Suggest Hints'}
                </button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-[90vw] sm:max-w-[85vw] md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <span>Code Hints</span>
                    <button
                      onClick={handleRefreshHints}
                      disabled={loadingHints}
                      className="p-2 hover:bg-blue-500/20 rounded-md transition-colors"
                      title="Refresh Hints"
                    >
                      <RefreshCw className="h-4 w-4 text-blue-600" />
                    </button>
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh] lg:max-h-[75vh] p-4 overflow-auto">
                  {loadingHints ? (
                    <div className="space-y-2">
                      <Skeleton className="w-full h-4 rounded-full bg-blue-200/30 animate-pulse" />
                      <Skeleton className="w-3/4 h-4 rounded-full bg-blue-200/30 animate-pulse" />
                      <Skeleton className="w-1/2 h-4 rounded-full bg-blue-200/30 animate-pulse" />
                    </div>
                  ) : (
                    <motion.div
                      key={hints}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm"
                    >
                      {renderMarkdownOutput(hints as string, 'hints')}
                    </motion.div>
                  )}
                  <ScrollBar className="w-2" orientation="vertical" />
                </ScrollArea>
              </DialogContent>
            </Dialog>
            {(result?.output || result?.status_message || result?.error) && (
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-muted/30 rounded-md transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckCheck className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}
            {result?.execution_time && (
              <div className="bg-yellow-200/20 text-yellow-600 px-3 py-1 rounded-md text-sm border border-yellow-600/20">
                Time: {String(result.execution_time).split('.')[0]} ms
              </div>
            )}
            <div className="flex justify-center items-center">
              {result?.success === true ? (
                <span className="bg-green-500/20 text-green-600 px-3 py-1 rounded-md text-sm border border-green-600/20">
                  Success
                </span>
              ) : result?.success === false && (result?.status_message || result?.error) ? (
                <span className="bg-red-500/20 text-red-600 px-3 py-1 rounded-md text-sm border border-red-600/20">
                  Error
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 bg-muted/20 rounded-md border border-border/50 overflow-x-hidden">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full space-y-2"
              >
                <Skeleton className="w-3/4 h-4 rounded-full bg-muted animate-pulse" />
                <Skeleton className="w-1/2 h-4 rounded-full bg-muted animate-pulse delay-200" />
                <Skeleton className="w-2/3 h-4 rounded-full bg-muted animate-pulse delay-400" />
              </motion.div>
            ) : result?.success === true ? (
              result?.output ? (
                <motion.div
                  key="output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-mono whitespace-pre-line"
                >
                  {isValidJson(result.output) ? (
                    renderJsonOutput(result.output)
                  ) : (
                    renderMarkdownOutput(result.output, 'output')
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="no-output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center items-center h-full text-muted-foreground"
                >
                  <p>No output available.</p>
                </motion.div>
              )
            ) : result?.success === false && (result?.status_message || result?.error) ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-mono"
              >
                <div className="space-y-2">
                  {result?.status_message && (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 font-semibold">Status:</span>
                        {isLongContent(result.status_message) && (
                          <button
                            onClick={() => setIsErrorExpanded(!isErrorExpanded)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {isErrorExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                      {(isErrorExpanded || !isLongContent(result.status_message)) && (
                        <div className="pl-4">{renderMarkdownOutput(result.status_message, 'status')}</div>
                      )}
                    </div>
                  )}
                  {result?.error && (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-semibold">Error:</span>
                        {isLongContent(result.error) && (
                          <button
                            onClick={() => setIsErrorExpanded(!isErrorExpanded)}
                            className="text-muted-foreground hover:text-foreground whitespace-pre-line"
                          >
                            {isErrorExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                      {(isErrorExpanded || !isLongContent(result.error)) && (
                        <div className="pl-4 border-l-4 border-red-500 whitespace-pre-line">
                          {renderMarkdownOutput(result.error, 'error')}
                        </div>
                      )}
                    </div>
                  )}
                  {result?.output && (
                    <div className="pl-4">
                      {isValidJson(result.output) ? (
                        renderJsonOutput(result.output)
                      ) : (
                        renderMarkdownOutput(
                          result.output.replaceAll('/app/temp/code', 'main'),
                          result.success ? 'output' : 'error'
                        )
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center items-center h-full text-muted-foreground"
              >
                <p>No result yet.</p>
              </motion.div>
            )}
          </AnimatePresence>
          <ScrollBar className="w-2" orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
}

export default Output;
