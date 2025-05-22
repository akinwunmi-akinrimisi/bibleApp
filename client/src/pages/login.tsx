import React, { useState } from 'react';
import { LoginForm } from '@/components/login-form';
import { RegisterForm } from '@/components/register-form';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [showLogin, setShowLogin] = useState(true);
  
  const handleSwitchToRegister = () => setShowLogin(false);
  const handleSwitchToLogin = () => setShowLogin(true);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
      {showLogin ? (
        <div className="w-full max-w-md">
          <LoginForm 
            onLoginSuccess={onLoginSuccess} 
            onSwitchToRegister={handleSwitchToRegister} 
          />
        </div>
      ) : (
        <RegisterForm 
          onRegisterSuccess={handleSwitchToLogin} 
          onSwitchToLogin={handleSwitchToLogin} 
        />
      )}
    </div>
  );
}
