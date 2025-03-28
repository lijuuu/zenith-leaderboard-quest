
import React, { useState, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, CheckCheck, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { RootState } from '@/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface OutputProps {
  className?: string;
}

function Output({ className }: OutputProps) {
  const { loading, result } = useSelector((state: RootState) => state.xCodeCompiler);
  const { code, language } = useSelector((state: RootState) => state.xCodeCompiler);
  const [copied, setCopied] = useState(false);
  const [isErrorExpanded, setIsErrorExpanded] = useState(false);
  const [hints, setHints] = useState<string | null>("");
  const [loadingHints, setLoadingHints] = useState(false);
  const [isHintsModalOpen, setIsHintsModalOpen] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    
    const textToCopy = result.output || result.status_message || result.error || '';
    
    try {
      await navigator.clipboard.writeText(String(textToCopy));
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

  // Fix the isLongContent function to properly handle type checking
  const isLongContent = (text: string | undefined): boolean => {
    if (typeof text !== 'string') return false;
    return text.split('\n').length > 5;
  };

  return (
    <div className={cn('h-full bg-background', className)}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 p-2 bg-muted/20 rounded-md border border-border/50">
          <h2 className="text-base font-semibold text-foreground">Output</h2>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  onClick={handleShowHints}
                  disabled={loadingHints || !code}
                  className={cn(
                    'px-3 py-1 rounded-md text-sm border flex items-center gap-1 transition-colors',
                    loadingHints
                      ? 'bg-yellow-200/10 text-yellow-600/50 border-yellow-600/10'
                      : 'bg-emerald-500/20 text-emerald-600 border-emerald-600/20 hover:bg-emerald-500/30'
                  )}
                  title="Get code suggestions"
                >
                  {loadingHints ? 'Loading...' : 'Suggest Hints'}
                </button>
              </SheetTrigger>
              <SheetContent className="w-[90vw] sm:max-w-md overflow-y-auto bg-zinc-900 border-zinc-800">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-zinc-200">
                    <span>Code Hints</span>
                    <button
                      onClick={handleRefreshHints}
                      disabled={loadingHints}
                      className="p-2 hover:bg-emerald-500/20 rounded-md transition-colors"
                      title="Refresh Hints"
                    >
                      <RefreshCw className="h-4 w-4 text-emerald-500" />
                    </button>
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-10rem)]">
                  {loadingHints ? (
                    <div className="space-y-2 p-4">
                      <Skeleton className="w-full h-4 rounded-full bg-zinc-800 animate-pulse" />
                      <Skeleton className="w-3/4 h-4 rounded-full bg-zinc-800 animate-pulse" />
                      <Skeleton className="w-1/2 h-4 rounded-full bg-zinc-800 animate-pulse" />
                    </div>
                  ) : (
                    <motion.div
                      key={hints}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm p-4 whitespace-pre-wrap text-zinc-300"
                    >
                      {hints}
                    </motion.div>
                  )}
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {result && (result.output || result.status_message || result.error) && (
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
            {result && result.execution_time && (
              <div className="bg-green-200/20 text-green-600 px-3 py-1 rounded-md text-sm border border-green-600/20">
                Time: {typeof result.execution_time === 'string' 
                  ? result.execution_time.split('.')[0] 
                  : result.execution_time} ms
              </div>
            )}
            <div className="flex justify-center items-center">
              {result && result.success === true ? (
                <span className="bg-green-500/20 text-green-600 px-3 py-1 rounded-md text-sm border border-green-600/20">
                  Success
                </span>
              ) : result && result.success === false && (result.status_message || result.error) ? (
                <span className="bg-red-500/20 text-red-600 px-3 py-1 rounded-md text-sm border border-red-600/20">
                  Error
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 bg-muted/20 rounded-md border border-border/50">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <Skeleton className="w-3/4 h-4 rounded-full bg-muted animate-pulse" />
                <Skeleton className="w-1/2 h-4 rounded-full bg-muted animate-pulse" />
                <Skeleton className="w-2/3 h-4 rounded-full bg-muted animate-pulse" />
              </motion.div>
            ) : result && result.success === true ? (
              result.output ? (
                <motion.div
                  key="output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-mono whitespace-pre-line"
                >
                  {result.output}
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
            ) : result && result.success === false && (result.status_message || result.error) ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-mono"
              >
                <div className="space-y-2">
                  {result.status_message && (
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
                        <div className="pl-4 whitespace-pre-line">{result.status_message}</div>
                      )}
                    </div>
                  )}
                  {result.error && (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-semibold">Error:</span>
                        {isLongContent(result.error) && (
                          <button
                            onClick={() => setIsErrorExpanded(!isErrorExpanded)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {isErrorExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                      {(isErrorExpanded || !isLongContent(result.error)) && (
                        <div className="pl-4 border-l-4 border-red-500 whitespace-pre-line">
                          {result.error}
                        </div>
                      )}
                    </div>
                  )}
                  {result.output && (
                    <div className="pl-4 whitespace-pre-line">
                      {result.output}
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
                <p>No result yet. Run your code to see output.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </div>
    </div>
  );
}

export default Output;
