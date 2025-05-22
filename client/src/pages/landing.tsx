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
                <img 
                  src="https://i.imgur.com/8cwmZQl.png" 
                  alt="VerseProjection in action" 
                  className="w-full rounded-t-lg"
                />
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

      {/* Comparison Section */}
      <section id="comparison" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How We Compare to Traditional Solutions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See why churches are switching to VerseProjection for their scripture presentation needs.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700">
              <div className="p-6 col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Feature</h3>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">VerseProjection</h3>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Traditional Software</h3>
              </div>
            </div>
            
            {/* Row 1 */}
            <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700">
              <div className="p-6 col-span-2">
                <p className="text-gray-700 dark:text-gray-300">Automatic verse detection</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <XCircle className="h-6 w-6 text-red-500 mx-auto" />
              </div>
            </div>
            
            {/* Row 2 */}
            <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700">
              <div className="p-6 col-span-2">
                <p className="text-gray-700 dark:text-gray-300">Real-time transcription</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <XCircle className="h-6 w-6 text-red-500 mx-auto" />
              </div>
            </div>
            
            {/* Row 3 */}
            <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700">
              <div className="p-6 col-span-2">
                <p className="text-gray-700 dark:text-gray-300">Paraphrased verse recognition</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <XCircle className="h-6 w-6 text-red-500 mx-auto" />
              </div>
            </div>
            
            {/* Row 4 */}
            <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700">
              <div className="p-6 col-span-2">
                <p className="text-gray-700 dark:text-gray-300">Operator required</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300">Minimal</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300">Full-time</p>
              </div>
            </div>
            
            {/* Row 5 */}
            <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700">
              <div className="p-6 col-span-2">
                <p className="text-gray-700 dark:text-gray-300">Setup time</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300">Minutes</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300">Hours</p>
              </div>
            </div>
            
            {/* Row 6 */}
            <div className="grid grid-cols-4">
              <div className="p-6 col-span-2">
                <p className="text-gray-700 dark:text-gray-300">Learning curve</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300">Low</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300">High</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the plan that works best for your church's needs. All plans include our core features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Basic</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Perfect for small churches just getting started.</p>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">$29</span>
                  <span className="text-gray-600 dark:text-gray-300 ml-2">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">1 projection screen</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">KJV & WEB translations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Basic customization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">7-day history</span>
                  </li>
                </ul>
                <Link href="/register?plan=basic">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
            
            {/* Standard Plan */}
            <div className="bg-primary bg-opacity-5 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-primary relative">
              <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                Most Popular
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Standard</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Ideal for medium-sized congregations.</p>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">$49</span>
                  <span className="text-gray-600 dark:text-gray-300 ml-2">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">2 projection screens</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">All Bible translations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Advanced customization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">30-day history</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Email support</span>
                  </li>
                </ul>
                <Link href="/register?plan=standard">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Premium</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">For large churches with advanced needs.</p>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">$99</span>
                  <span className="text-gray-600 dark:text-gray-300 ml-2">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Unlimited projection screens</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">All Bible translations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Full customization suite</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Unlimited history</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Custom branding</span>
                  </li>
                </ul>
                <Link href="/register?plan=premium">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary bg-opacity-10 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your Church Services?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of churches already using VerseProjection to enhance their worship experience.
          </p>
          <Link href="/register">
            <Button size="lg">
              Start Your Free 14-Day Trial <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">VerseProjection</span>
              </div>
              <p className="text-gray-400 mb-4">
                Automatic Bible verse detection and projection for modern churches.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Release Notes</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} VerseProjection. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}