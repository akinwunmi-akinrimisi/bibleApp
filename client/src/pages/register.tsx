import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterForm } from "@/components/register-form";
import { LoginForm } from "@/components/login-form";
import { BookOpen, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<string>("register");
  
  // Extract plan from URL parameters if any
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    if (plan) {
      setSelectedPlan(plan);
    }
  }, []);

  const handleLoginSuccess = () => {
    setLocation("/dashboard");
  };

  const handleRegisterSuccess = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">VerseProjection</span>
              </a>
            </Link>
            <Link href="/">
              <Button variant="ghost">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Authentication Section */}
            <div className="md:col-span-2">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <Tabs value={authMode} onValueChange={setAuthMode} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                      <TabsTrigger value="register">Register</TabsTrigger>
                      <TabsTrigger value="login">Login</TabsTrigger>
                    </TabsList>
                    <TabsContent value="register">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create your account</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                          Join VerseProjection today and transform your church service experience.
                        </p>
                      </div>
                      <RegisterForm 
                        onRegisterSuccess={handleRegisterSuccess} 
                        onSwitchToLogin={() => setAuthMode("login")} 
                      />
                    </TabsContent>
                    <TabsContent value="login">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                          Log in to your VerseProjection account to continue.
                        </p>
                      </div>
                      <LoginForm 
                        onLoginSuccess={handleLoginSuccess} 
                        onSwitchToRegister={() => setAuthMode("register")} 
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Plans Section */}
            <div className="md:col-span-3">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose your plan</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  All plans include a 14-day free trial. No credit card required to start.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Basic Plan */}
                <Card className={`border-2 ${selectedPlan === 'basic' ? 'border-primary' : 'border-transparent'} cursor-pointer hover:border-primary transition-all`}
                  onClick={() => setSelectedPlan('basic')}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Basic</h3>
                      {selectedPlan === 'basic' && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex items-end mb-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">$29</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">/month</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>1 projection screen</span>
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>KJV & WEB translations</span>
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Basic customization</span>
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>7-day history</span>
                      </li>
                    </ul>
                    <Button className="w-full" variant={selectedPlan === 'basic' ? 'default' : 'outline'}>
                      {selectedPlan === 'basic' ? 'Selected' : 'Select Basic'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Standard Plan */}
                <Card className={`border-2 ${selectedPlan === 'standard' ? 'border-primary' : 'border-transparent'} cursor-pointer hover:border-primary transition-all relative`}
                  onClick={() => setSelectedPlan('standard')}>
                  <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                    Popular
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Standard</h3>
                      {selectedPlan === 'standard' && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex items-end mb-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">$49</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">/month</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>2 projection screens</span>
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>All Bible translations</span>
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Advanced customization</span>
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>30-day history</span>
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Email support</span>
                      </li>
                    </ul>
                    <Button className="w-full" variant={selectedPlan === 'standard' ? 'default' : 'outline'}>
                      {selectedPlan === 'standard' ? 'Selected' : 'Select Standard'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Premium Plan */}
                <Card className={`border-2 ${selectedPlan === 'premium' ? 'border-primary' : 'border-transparent'} cursor-pointer hover:border-primary transition-all`}
                  onClick={() => setSelectedPlan('premium')}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Premium</h3>
                      {selectedPlan === 'premium' && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex items-end mb-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">$99</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">/month</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Unlimited screens</span>
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>All Bible translations</span>
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Full customization</span>
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Unlimited history</span>
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Priority support</span>
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Custom branding</span>
                      </li>
                    </ul>
                    <Button className="w-full" variant={selectedPlan === 'premium' ? 'default' : 'outline'}>
                      {selectedPlan === 'premium' ? 'Selected' : 'Select Premium'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} VerseProjection. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}