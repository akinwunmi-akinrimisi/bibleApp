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
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onLoginSuccess, onSwitchToRegister }: LoginFormProps) {
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
        
        <div className="mt-6 mb-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            For testing and demonstration purposes, you can use these credentials:
          </p>
          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
            <p className="text-sm"><strong>Username:</strong> demo</p>
            <p className="text-sm"><strong>Password:</strong> password123</p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Button 
              variant="link" 
              className="p-0 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              onClick={onSwitchToRegister}
            >
              Create an account
            </Button>
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
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
