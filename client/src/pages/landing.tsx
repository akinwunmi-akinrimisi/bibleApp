import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  Award,
  Zap,
  Headphones,
  MonitorSmartphone,
  BookOpen,
  Clock
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.ts";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">VerseProjection</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">Features</a>
            <a href="#comparison" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">Comparison</a>
            <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">Pricing</a>
          </nav>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section - Enhanced with glass morphism and animations */}
      <section className="glass-hero py-24 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float delay-300"></div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 animate-slideInLeft">
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                <span className="highlighted-text">Automatic</span> Bible Verse Detection for Church Services
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                VerseProjection listens to your sermon and automatically detects, identifies and projects Bible verses in real-time. No more manual searching or interruptions.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/register">
                  <button className="gradient-button py-3 px-6 text-lg font-medium flex items-center">
                    <span>Start Free Trial</span> 
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                <a href="#demo">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto hover-glow">
                    Watch Demo
                  </Button>
                </a>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10 animate-slideInRight">
              <div className="sleek-card relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary rounded-full opacity-40 blur-md"></div>
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 text-white text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">"For God so loved the world..."</div>
                  <div className="text-sm opacity-90">John 3:16 (KJV)</div>
                </div>

                <div className="p-6 bg-white dark:bg-gray-800">
                  <p className="text-center text-gray-700 dark:text-gray-300 italic text-lg">
                    "And the Word became flesh and dwelt among us..."
                  </p>
                  <p className="text-center text-primary font-semibold mt-2 text-lg">
                    John 1:14 (KJV)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced with animations and modern styling */}
      <section id="features" className="py-28 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full"></div>
        <div className="absolute top-1/2 right-0 w-32 h-96 bg-primary/5 rounded-l-full"></div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-20 animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 relative inline-block">
              Powerful Features for Modern Churches
              <div className="absolute -bottom-3 left-0 h-1 w-24 bg-primary rounded-full mx-auto right-0"></div>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              VerseProjection combines cutting-edge AI technology with intuitive design to enhance your church service experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="sleek-card p-8 hover-lift group animate-fadeIn delay-100">
              <div className="gradient-primary-subtle p-4 rounded-full inline-block mb-6 group-hover:animate-pulse-custom">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                Real-time Audio Recognition
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our advanced audio processing captures and transcribes spoken content with high accuracy, even in noisy environments.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="sleek-card p-8 hover-lift group animate-fadeIn delay-200">
              <div className="gradient-primary-subtle p-4 rounded-full inline-block mb-6 group-hover:animate-pulse-custom">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                Advanced Verse Detection
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Identifies both explicit references (John 3:16) and paraphrased quotes with remarkable accuracy.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="sleek-card p-8 hover-lift group animate-fadeIn delay-300">
              <div className="gradient-primary-subtle p-4 rounded-full inline-block mb-6 group-hover:animate-pulse-custom">
                <MonitorSmartphone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                Multiple Bible Translations
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Support for multiple translations including KJV and World English Bible, with more translations coming soon.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="sleek-card p-8 hover-lift group animate-fadeIn delay-100">
              <div className="gradient-primary-subtle p-4 rounded-full inline-block mb-6 group-hover:animate-pulse-custom">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                One-Click Projection
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Select detected verses with a single click to instantly project them on your church display system.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="sleek-card p-8 hover-lift group animate-fadeIn delay-200">
              <div className="gradient-primary-subtle p-4 rounded-full inline-block mb-6 group-hover:animate-pulse-custom">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                Detection History
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Keep track of all detected verses during your service and access them later for reference.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="sleek-card p-8 hover-lift group animate-fadeIn delay-300">
              <div className="gradient-primary-subtle p-4 rounded-full inline-block mb-6 group-hover:animate-pulse-custom">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                Customizable Display
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Personalize how verses appear on screen with custom fonts, colors, and formatting options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section - Enhanced with advanced styling */}
      <section id="comparison" className="py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 relative inline-block">
              How We Compare
              <div className="absolute -bottom-3 left-0 h-1 w-24 bg-primary rounded-full mx-auto right-0"></div>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              See why churches are switching to VerseProjection for their scripture presentation needs.
            </p>
          </div>
          
          <div className="sleek-card border-0 shadow-2xl overflow-hidden animate-fadeIn delay-200">
            {/* Header */}
            <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="p-6 col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Feature</h3>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold gradient-text bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">VerseProjection</h3>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">Traditional Software</h3>
              </div>
            </div>
            
            {/* Row 1 */}
            <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="p-6 col-span-2">
                <p className="text-gray-700 dark:text-gray-300 font-medium">Automatic verse detection</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <div className="flex justify-center">
                  <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-green-500 dark:text-green-400" />
                  </div>
                </div>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <div className="flex justify-center">
                  <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-full">
                    <XCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Row 2 */}
            <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="p-6 col-span-2">
                <p className="text-gray-700 dark:text-gray-300 font-medium">Real-time transcription</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <div className="flex justify-center">
                  <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-green-500 dark:text-green-400" />
                  </div>
                </div>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <div className="flex justify-center">
                  <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-full">
                    <XCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Row 3 */}
            <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="p-6 col-span-2">
                <p className="text-gray-700 dark:text-gray-300 font-medium">Paraphrased verse recognition</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <div className="flex justify-center">
                  <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-green-500 dark:text-green-400" />
                  </div>
                </div>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <div className="flex justify-center">
                  <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-full">
                    <XCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Row 4 */}
            <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="p-6 col-span-2">
                <p className="text-gray-700 dark:text-gray-300 font-medium">Operator required</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <p className="text-primary font-medium">Minimal</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">Full-time</p>
              </div>
            </div>
            
            {/* Row 5 */}
            <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="p-6 col-span-2">
                <p className="text-gray-700 dark:text-gray-300 font-medium">Setup time</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <p className="text-primary font-medium">Minutes</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">Hours</p>
              </div>
            </div>
            
            {/* Row 6 */}
            <div className="grid grid-cols-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="p-6 col-span-2">
                <p className="text-gray-700 dark:text-gray-300 font-medium">Learning curve</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <p className="text-primary font-medium">Low</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">High</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Enhanced with premium styling */}
      <section id="pricing" className="py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-20 animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 relative inline-block">
              Simple, Transparent Pricing
              <div className="absolute -bottom-3 left-0 h-1 w-24 bg-primary rounded-full mx-auto right-0"></div>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Choose the plan that works best for your church's needs. All plans include our core features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {/* Basic Plan */}
            <div className="sleek-card hover-lift group animate-fadeIn delay-100 relative bg-white dark:bg-gray-800 overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent dark:from-gray-700/30 dark:to-transparent opacity-50"></div>
              
              <div className="p-8 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Basic</h3>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Starter</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Perfect for small churches just getting started.</p>
                <div className="flex items-end mb-8">
                  <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">$29</span>
                  <span className="text-gray-600 dark:text-gray-300 ml-2 mb-1">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">1 projection screen</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">KJV & WEB translations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Basic customization</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">7-day history</span>
                  </li>
                </ul>
                <Link href="/register?plan=basic">
                  <button className="w-full py-3 px-6 rounded-lg font-medium text-primary border-2 border-primary hover:bg-primary hover:text-white transition-colors duration-300">Get Started</button>
                </Link>
              </div>
            </div>
            
            {/* Standard Plan */}
            <div className="sleek-card border-0 shadow-2xl hover-lift group animate-fadeIn delay-200 relative z-20 bg-white dark:bg-gray-800 overflow-hidden transform scale-105 lg:scale-110 -translate-y-3">
              {/* Popular tag */}
              <div className="absolute top-0 right-0">
                <div className="relative overflow-hidden w-28 h-28">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-primary transform rotate-45 translate-x-10 -translate-y-6"></div>
                  <span className="absolute top-4 right-1 text-xs font-bold text-white transform rotate-45">POPULAR</span>
                </div>
              </div>
              
              {/* Subtle gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent"></div>
              
              <div className="p-8 pt-10 relative z-10">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Standard</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Ideal for medium-sized congregations.</p>
                <div className="flex items-end mb-8">
                  <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">$49</span>
                  <span className="text-gray-600 dark:text-gray-300 ml-2 mb-1">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">2 projection screens</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">All Bible translations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Advanced customization</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">30-day history</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Email support</span>
                  </li>
                </ul>
                <Link href="/register?plan=standard">
                  <button className="gradient-button w-full py-3 px-6 rounded-lg font-medium">Get Started</button>
                </Link>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="sleek-card hover-lift group animate-fadeIn delay-300 relative bg-white dark:bg-gray-800 overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent dark:from-gray-700/30 dark:to-transparent opacity-50"></div>
              
              <div className="p-8 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Premium</h3>
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full px-3 py-1">
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-300">Advanced</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">For large churches with advanced needs.</p>
                <div className="flex items-end mb-8">
                  <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-primary">$99</span>
                  <span className="text-gray-600 dark:text-gray-300 ml-2 mb-1">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Unlimited projection screens</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">All Bible translations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Full customization suite</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Unlimited history</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Custom branding</span>
                  </li>
                </ul>
                <Link href="/register?plan=premium">
                  <button className="w-full py-3 px-6 rounded-lg font-medium text-purple-600 border-2 border-purple-600 hover:bg-purple-600 hover:text-white transition-colors duration-300 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-purple-500 dark:hover:text-white">Get Started</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced with premium styling */}
      <section className="py-32 relative overflow-hidden">
        {/* Background gradient with overlay pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>
        
        {/* Floating elements in background */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float delay-200"></div>
        
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <div className="glass-effect rounded-2xl p-12 shadow-2xl backdrop-blur-lg">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fadeIn">
              Ready to Transform Your Church Services?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fadeIn delay-100">
              Join hundreds of churches already using VerseProjection to enhance their worship experience.
            </p>
            <div className="animate-fadeIn delay-200">
              <Link href="/register">
                <button className="bg-white text-primary hover:bg-white/90 transition-colors duration-300 text-lg font-medium py-4 px-8 rounded-xl shadow-lg hover:shadow-xl flex items-center mx-auto">
                  Start Your Free 14-Day Trial
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <p className="mt-6 text-white/70">
                No credit card required. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced with premium styling */}
      <footer className="bg-gray-900 text-white pt-20 pb-12 relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Footer content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">VerseProjection</span>
              </div>
              <p className="text-gray-400 mb-6 text-lg max-w-md">
                Automatic Bible verse detection and projection for modern churches. Enhancing worship experiences through innovative technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-gray-800 hover:bg-primary/20 rounded-full transition-colors duration-300">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="p-2 bg-gray-800 hover:bg-primary/20 rounded-full transition-colors duration-300">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="p-2 bg-gray-800 hover:bg-primary/20 rounded-full transition-colors duration-300">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858-.182-.466-.398-.8-.748-1.15-.35-.35-.683-.566-1.15-.748-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="p-2 bg-gray-800 hover:bg-primary/20 rounded-full transition-colors duration-300">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Product</h3>
              <ul className="space-y-4">
                <li><Link href="/features"><a className="text-gray-400 hover:text-white transition">Features</a></Link></li>
                <li><Link href="/pricing"><a className="text-gray-400 hover:text-white transition">Pricing</a></Link></li>
                <li><Link href="/how-it-works"><a className="text-gray-400 hover:text-white transition">How It Works</a></Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
              <ul className="space-y-4">
                <li><Link href="/about"><a className="text-gray-400 hover:text-white transition">About Us</a></Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Legal</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© {new Date().getFullYear()} VerseProjection. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}