import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useThemeContext } from '@/components/theme-provider';
import { apiRequest } from '@/lib/queryClient';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { theme, toggleTheme } = useThemeContext();
  const { toast } = useToast();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      onLoginSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-surface-light dark:bg-surface-dark shadow-lg">
      <CardContent className="pt-6 px-8 pb-8">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-60 bg-primary-100 dark:bg-primary-900/30 rounded-md flex items-center justify-center">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">VerseProjection</h1>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-center mb-6">Sign in to your account</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your-username" 
                      {...field} 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Password</FormLabel>
                    <a href="#" className="text-sm text-primary-600 hover:underline">Forgot password?</a>
                  </div>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Form>
        
        <div className="relative my-6">
          <Separator />
          <div className="relative flex justify-center -mt-3">
            <span className="px-2 bg-surface-light dark:bg-surface-dark text-sm text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button variant="outline" className="flex items-center justify-center py-2">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" />
            </svg>
            <span>Google</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center py-2">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 6H3V20H21V6ZM17 14H13V18H11V14H7V12H11V8H13V12H17V14Z" />
            </svg>
            <span>Microsoft</span>
          </Button>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">v1.0.0</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleTheme}
            className="text-sm flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            {theme === 'dark' ? (
              <>
                <span className="material-icons mr-1">light_mode</span>
                <span>Light mode</span>
              </>
            ) : (
              <>
                <span className="material-icons mr-1">dark_mode</span>
                <span>Dark mode</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
