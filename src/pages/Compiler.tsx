
import React from 'react';
import { useTheme } from '@/hooks/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import FileSystem from '@/components/compiler/FileSystem';
import CompilerLayout from '@/components/compiler/CompilerLayout';

const Compiler = () => {
  // Set root element class for green theme
  React.useEffect(() => {
    const rootElement = document.documentElement;
    rootElement.classList.add('accent-green');
    
    return () => {
      rootElement.classList.remove('accent-green');
    };
  }, []);

  return (
    <SidebarProvider>
      <FileSystem />
      <CompilerLayout />
      <Toaster />
    </SidebarProvider>
  );
};

export default Compiler;
