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
import { useAuth } from "@/hooks/useAuth";

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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Automatic Bible Verse Detection for Church Services
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                VerseProjection listens to your sermon and automatically detects, identifies and projects Bible verses in real-time. No more manual searching or interruptions.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Trial <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#demo">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Watch Demo
                  </Button>
                </a>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <img 
                  src="https://i.imgur.com/8cwmZQl.png" 
                  alt="VerseProjection in action" 
                  className="w-full rounded-lg"
                />
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-center text-gray-700 dark:text-gray-300 italic">
                    "And the Word became flesh and dwelt among us..."
                  </p>
                  <p className="text-center text-primary font-semibold mt-2">
                    John 1:14 (KJV)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern Churches
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              VerseProjection combines cutting-edge AI technology with intuitive design to enhance your church service experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <Headphones className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Real-time Audio Recognition
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our advanced audio processing captures and transcribes spoken content with high accuracy, even in noisy environments.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <BookOpen className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Advanced Verse Detection
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Identifies both explicit references (John 3:16) and paraphrased quotes with remarkable accuracy.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <MonitorSmartphone className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Multiple Bible Translations
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Support for multiple translations including KJV and World English Bible, with more translations coming soon.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <Zap className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                One-Click Projection
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Select detected verses with a single click to instantly project them on your church display system.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <Clock className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Detection History
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Keep track of all detected verses during your service and access them later for reference.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <Award className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Customizable Display
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
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