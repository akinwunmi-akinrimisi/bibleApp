import React, { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/theme-provider';
import NotFound from '@/pages/not-found';
import LoginPage from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import Settings from '@/pages/settings';
import { ProjectionWindow } from '@/components/projection-window';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from '@/components/sidebar';
import { useProjection } from '@/hooks/use-projection';

function AppRouter() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [location, setLocation] = useLocation();
  const { isProjectionActive, toggleProjection } = useProjection();

  // Check authentication status
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string, {
        credentials: 'include',
      });
      
      if (res.status === 401) {
        setIsLoggedIn(false);
        return null;
      }
      
      const data = await res.json();
      setIsLoggedIn(true);
      return data;
    },
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (isLoggedIn === false && location !== '/login' && location !== '/projection') {
      setLocation('/login');
    }
    // Redirect to dashboard if authenticated but on login page
    else if (isLoggedIn === true && location === '/login') {
      setLocation('/');
    }
  }, [isLoggedIn, location, setLocation]);

  // Show loading state
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Special route for projection window (separate window)
  if (location === '/projection') {
    return <ProjectionWindow />;
  }

  // Login page (when not authenticated)
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  // Main application layout (when authenticated)
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
      <Sidebar 
        isProjectionActive={isProjectionActive} 
        toggleProjection={toggleProjection} 
        onLogout={() => setIsLoggedIn(false)} 
      />
      
      <main className="flex-1 overflow-x-hidden">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
