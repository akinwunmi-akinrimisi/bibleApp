import React from 'react';
import { LoginForm } from '@/components/login-form';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
}
