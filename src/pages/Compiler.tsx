
import React from 'react';
import { useTheme } from '@/hooks/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import FileSystem from '@/components/compiler/FileSystem';
import CompilerLayout from '@/components/compiler/CompilerLayout';

const Compiler = () => {
  return (
    <SidebarProvider>
      <FileSystem />
      <CompilerLayout />
      <Toaster />
    </SidebarProvider>
  );
};

export default Compiler;
