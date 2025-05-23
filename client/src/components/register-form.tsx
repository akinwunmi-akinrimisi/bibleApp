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

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  organizationName: z.string().min(1, 'Organization or individual name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  confirmPassword: z.string(),
  trialAccess: z.boolean().default(true)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onRegisterSuccess: (email: string, requiresVerification: boolean) => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onRegisterSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { theme, toggleTheme } = useThemeContext();
  const { toast } = useToast();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      organizationName: '',
      password: '',
      username: '',
      confirmPassword: '',
      trialAccess: true,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: Omit<RegisterFormValues, 'confirmPassword'>) => {
      const response = await apiRequest('POST', '/api/auth/register', data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.requiresVerification) {
        toast({
          title: "Registration successful! 📧",
          description: "Please check your email for verification code.",
        });
        onRegisterSuccess(data.email || '', true);
      } else {
        toast({
          title: "Registration successful! 🎉",
          description: "Welcome to VerseProjection!",
        });
        onRegisterSuccess(data.email || '', false);
      }
    },
    onError: (error) => {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Username may already be taken',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-surface-light dark:bg-surface-dark shadow-lg">
      <CardContent className="pt-6 px-8 pb-8">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-60 bg-primary-100 dark:bg-primary-900/30 rounded-md flex items-center justify-center">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">VerseProjection</h1>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-center mb-6">Create an account</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John" 
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Doe" 
                        {...field} 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="you@example.com" 
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
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization or Individual Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Church Name or Your Name" 
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
                  <FormLabel>Password</FormLabel>
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
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
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
            
            <FormField
              control={form.control}
              name="trialAccess"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-gray-50 dark:bg-gray-800/50 mt-4">
                  <FormControl>
                    <input 
                      type="checkbox"
                      checked={field.value as boolean}
                      onChange={field.onChange}
                      className="h-4 w-4 mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">Start with 14-day full access trial</FormLabel>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Try all premium features for free. No credit card required.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md mt-6"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Button 
              variant="link" 
              className="p-0 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              onClick={onSwitchToLogin}
            >
              Sign in
            </Button>
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-6">
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