
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AccentColorProvider } from '@/contexts/AccentColorContext';
import { store } from '@/store';
import App from './App';
import './index.css';
import './styles/accent-colors.css';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="zenx-theme">
          <AccentColorProvider defaultColor="green" storageKey="zenx-accent-color">
            <BrowserRouter>
              <Toaster position="top-right" />
              <App />
            </BrowserRouter>
          </AccentColorProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
