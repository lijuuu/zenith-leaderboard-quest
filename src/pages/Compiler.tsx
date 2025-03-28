
import { useState } from 'react';
import Playground from '@/components/playground/Playground';
import { useTheme } from '@/hooks/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const Compiler = () => {
  const { theme } = useTheme();
  
  return (
    <>
      <Playground />
      <Toaster />
    </>
  );
};

export default Compiler;
