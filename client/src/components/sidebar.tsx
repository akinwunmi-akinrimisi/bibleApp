import React from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useThemeContext } from '@/components/theme-provider';
import { Separator } from '@/components/ui/separator';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface SidebarProps {
  isProjectionActive: boolean;
  toggleProjection: () => void;
  onLogout: () => void;
}

export function Sidebar({ isProjectionActive, toggleProjection, onLogout }: SidebarProps) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useThemeContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/auth/logout', {});
    },
    onSuccess: () => {
      onLogout();
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <aside className="bg-surface-light dark:bg-surface-dark w-full md:w-64 border-r border-gray-200 dark:border-gray-800 md:h-screen md:sticky md:top-0 md:overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary-600">VerseProjection</h1>
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="material-icons">{isMobileMenuOpen ? 'close' : 'menu'}</span>
        </Button>
      </div>
      
      <div className={`md:block ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="p-4">
          <Button 
            onClick={toggleProjection}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-md font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isProjectionActive 
                ? 'bg-destructive text-white hover:bg-red-700 focus:ring-red-500' 
                : 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500'
            }`}
          >
            <span className="material-icons mr-2">{isProjectionActive ? 'stop' : 'play_arrow'}</span>
            <span>{isProjectionActive ? 'Stop Projection' : 'Start Projection'}</span>
          </Button>
        </div>
        
        <nav className="py-2">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Menu
          </div>
          
          <Link href="/">
            <div className={`flex items-center px-4 py-3 cursor-pointer ${
              location === '/' 
                ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}>
              <span className="material-icons mr-3">dashboard</span>
              <span>Dashboard</span>
            </div>
          </Link>
          
          <Link href="/settings">
            <div className={`flex items-center px-4 py-3 cursor-pointer ${
              location === '/settings' 
                ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}>
              <span className="material-icons mr-3">settings</span>
              <span>Settings</span>
            </div>
          </Link>
        </nav>
        
        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost"
              onClick={toggleTheme}
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <span className="material-icons mr-2">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
              <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            </Button>
          </div>
          
          <Button 
            variant="ghost"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <span className="material-icons mr-2">logout</span>
            <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
