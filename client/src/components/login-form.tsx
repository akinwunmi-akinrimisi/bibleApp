import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/theme-provider';
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
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLoginSuccess: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onLoginSuccess, onSwitchToRegister }: LoginFormProps) {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
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
              name="email"
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
        
        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button 
            variant="outline" 
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center justify-center py-2.5 rounded-lg transition-colors"
            onClick={() => window.location.href = '/api/auth/google'}
            type="button"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
              />
              <path
                fill="#34A853"
                d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
              />
              <path
                fill="#4A90E2"
                d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1272727,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.0127005 17.2662994,17.2212847 16.0407269,18.0125889 L19.834192,20.9995801 Z"
              />
              <path
                fill="#FBBC05"
                d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
              />
            </svg>
            Google
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center justify-center py-2.5 rounded-lg transition-colors"
            onClick={() => window.location.href = '/api/auth/facebook'}
            type="button"
          >
            <svg className="w-5 h-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
            </svg>
            Facebook
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center justify-center py-2.5 rounded-lg transition-colors"
            onClick={() => window.location.href = '/api/auth/github'}
            type="button"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.602-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.252-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12c0-5.523-4.477-10-10-10z" />
            </svg>
            GitHub
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center justify-center py-2.5 rounded-lg transition-colors"
            onClick={() => window.location.href = '/api/auth/twitter'}
            type="button"
          >
            <svg className="w-5 h-5 mr-2 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 5.89c-.7.31-1.45.52-2.25.62.81-.48 1.43-1.25 1.72-2.16-.76.45-1.59.78-2.49.95-.72-.76-1.74-1.23-2.87-1.23-2.17 0-3.93 1.76-3.93 3.93 0 .31.03.61.1.9-3.27-.16-6.18-1.73-8.12-4.12-.34.58-.53 1.25-.53 1.97 0 1.36.69 2.56 1.75 3.27-.64-.02-1.25-.2-1.78-.49v.05c0 1.9 1.35 3.49 3.15 3.85-.33.09-.68.14-1.04.14-.25 0-.5-.02-.74-.07.5 1.56 1.95 2.7 3.68 2.73-1.35 1.06-3.04 1.69-4.89 1.69-.32 0-.63-.02-.94-.06 1.74 1.12 3.81 1.77 6.02 1.77 7.23 0 11.18-5.99 11.18-11.18 0-.17 0-.34-.01-.51.77-.55 1.43-1.24 1.96-2.03z" />
            </svg>
            Twitter
          </Button>
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
