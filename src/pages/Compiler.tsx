
import React from 'react';
import { useTheme } from '@/hooks/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import FileSystem from '@/components/compiler/FileSystem';
import CompilerLayout from '@/components/compiler/CompilerLayout';
import ZenXPlayground from '@/components/playground/ZenXPlayground';

const Compiler = () => {
  // Set root element class for green theme
  React.useEffect(() => {
    const rootElement = document.documentElement;
    rootElement.classList.add('accent-green');
    
    return () => {
      rootElement.classList.remove('accent-green');
    };
  }, []);

  // Check if we're in playground mode by looking for problem_id in URL
  const isPlaygroundMode = window.location.search.includes('problem_id');

  return (
    <SidebarProvider>
      {isPlaygroundMode ? (
        <ZenXPlayground />
      ) : (
        <>
          <FileSystem />
          <CompilerLayout />
        </>
      )}
      <Toaster />
    </SidebarProvider>
  );
};

export default Compiler;
