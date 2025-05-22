import React, { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/theme-provider';
import NotFound from '@/pages/not-found';
import LoginPage from '@/pages/login';
import LandingPage from '@/pages/landing';
import RegisterPage from '@/pages/register';
import PricingPage from '@/pages/pricing';
import FeaturesPage from '@/pages/features';
import Dashboard from '@/pages/dashboard';
import Settings from '@/pages/settings';
import { ProjectionWindow } from '@/components/projection-window';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from '@/components/sidebar';
import { useProjection } from '@/hooks/use-projection';
import { useAuth } from './hooks/useAuth';
import { EnhancedProjectionWindow } from '@/components/enhanced-projection-window';

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

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/register', '/login', '/projection', '/pricing', '/features'];

  useEffect(() => {
    // Redirect to login if not authenticated and trying to access protected route
    if (isLoggedIn === false && !publicRoutes.includes(location)) {
      setLocation('/login');
    }
    // Redirect to dashboard if authenticated but on login/register page
    else if (isLoggedIn === true && (location === '/login' || location === '/register')) {
      setLocation('/dashboard');
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

  // Enhanced projection window route
  if (location === '/enhanced-projection') {
    return <EnhancedProjectionWindow />;
  }

  // Public routes - Landing, Login, Register, Pricing
  if (location === '/') {
    return <LandingPage />;
  }

  if (location === '/register') {
    return <RegisterPage />;
  }
  
  if (location === '/pricing') {
    return <PricingPage />;
  }
  
  if (location === '/features') {
    return <FeaturesPage />;
  }

  if (location === '/login' || !isLoggedIn) {
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
          <Route path="/dashboard" component={Dashboard} />
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
