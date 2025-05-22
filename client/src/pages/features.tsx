import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Headphones,
  Zap,
  MonitorSmartphone,
  Laptop,
  History,
  Search,
  Settings,
  ChevronRight,
  Star,
  ChevronDown,
  EyeIcon
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.ts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FeaturesPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">VerseProjection</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features">
              <a className="text-primary font-medium">Features</a>
            </Link>
            <Link href="/pricing">
              <a className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">Pricing</a>
            </Link>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">Support</a>
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
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful Features for Modern Churches
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover how VerseProjection is transforming the way churches present scripture during services with cutting-edge AI technology.
            </p>
          </div>
          
          <div className="flex justify-center mt-8">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Core Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our innovative technology automatically detects and projects Bible verses during your church service.
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
                Our advanced audio processing captures and transcribes spoken content with high accuracy, even in noisy environments. The system automatically converts speech to text in real-time.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <BookOpen className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Advanced Verse Detection
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Identifies both explicit references (John 3:16) and paraphrased quotes with remarkable accuracy. Our AI can recognize verses even when they're not quoted verbatim.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <MonitorSmartphone className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Multiple Bible Translations
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Support for multiple translations including KJV and World English Bible, with more translations coming soon. Choose your preferred version for display.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <Zap className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                One-Click Projection
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Select detected verses with a single click to instantly project them on your church display system. No more manual searching or interrupting the service.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <History className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Detection History
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Keep track of all detected verses during your service and access them later for reference. Perfect for creating sermon notes or sharing with your congregation.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <Settings className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Customizable Display
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Personalize how verses appear on screen with custom fonts, colors, and formatting options. Match your church's branding and aesthetic preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Spotlight */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Feature Spotlight
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Take a closer look at what makes VerseProjection unique
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16">
            {/* Spotlight 1 */}
            <div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg mb-8">
                <img 
                  src="https://i.imgur.com/LQcJEtx.png" 
                  alt="AI-powered verse detection" 
                  className="w-full rounded-lg"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                AI-Powered Verse Detection
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our advanced AI algorithms can recognize Bible verses even when they're paraphrased or only partially quoted. The system continuously learns and improves based on your church's speaking patterns.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Recognizes explicit references (John 3:16)</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Identifies paraphrased content with high accuracy</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Provides confidence scores for each detected verse</span>
                </li>
              </ul>
            </div>
            
            {/* Spotlight 2 */}
            <div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg mb-8">
                <img 
                  src="https://i.imgur.com/P8XtaKU.png" 
                  alt="Multi-screen projection" 
                  className="w-full rounded-lg"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Multi-Screen Projection System
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Project verses to multiple screens simultaneously, with different formatting options for each display. Perfect for churches with main and secondary displays or multi-campus setups.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Support for multiple projection screens</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Independent formatting for each screen</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Simple operator interface for verse selection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How VerseProjection Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our innovative technology seamlessly integrates with your church service
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-20 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Headphones className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                1. Audio Capture
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                The system captures audio through your church's sound system or a dedicated microphone. Works with any standard audio setup.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-20 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                2. Verse Detection
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI transcribes the audio and automatically identifies Bible verses being referenced, showing matches with confidence scores.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-20 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MonitorSmartphone className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                3. Projection
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                With a single click, the selected verse is beautifully displayed on your projection system in your preferred formatting style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to know about VerseProjection
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border-none shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-left text-lg font-medium text-gray-900 dark:text-white hover:no-underline">
                What hardware do I need to use VerseProjection?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                VerseProjection works with your existing church A/V setup. You'll need a computer connected to your projection system, an internet connection, and a way to capture audio (either through your sound system or a dedicated microphone). No special hardware is required.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border-none shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-left text-lg font-medium text-gray-900 dark:text-white hover:no-underline">
                How accurate is the verse detection?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                Our AI-powered system achieves over 90% accuracy for explicit verse references (e.g., "John 3:16") and approximately 75-85% accuracy for paraphrased quotes. The system improves over time as it learns from your church's specific speaking patterns and preferences.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border-none shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-left text-lg font-medium text-gray-900 dark:text-white hover:no-underline">
                Which Bible translations are supported?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                VerseProjection currently supports King James Version (KJV) and World English Bible (WEB) translations. We're actively working on adding more translations including NIV, ESV, NASB, and NLT. Premium and Standard plans will have access to all translations once available.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border-none shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-left text-lg font-medium text-gray-900 dark:text-white hover:no-underline">
                Can I customize how the verses are displayed?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                Yes! All plans include customization options for font styles, sizes, colors, and backgrounds. Premium plans offer additional options like custom templates, animations, and the ability to add your church's logo to the projection.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border-none shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-left text-lg font-medium text-gray-900 dark:text-white hover:no-underline">
                Do I need someone to operate VerseProjection during the service?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                VerseProjection significantly reduces the workload compared to traditional presentation software, but we recommend having someone monitor the system during services. The operator simply needs to click on the correct verse when it's detected, requiring minimal training and effort.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6" className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border-none shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-left text-lg font-medium text-gray-900 dark:text-white hover:no-underline">
                Does VerseProjection work offline?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                VerseProjection requires an internet connection for the AI-powered verse detection. However, we're developing an offline mode for churches with limited connectivity that will offer core functionality with a locally stored Bible database.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary bg-opacity-10 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your Church Services?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of churches already using VerseProjection to enhance their worship experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/register">
              <Button size="lg">
                Start Your Free Trial <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View Pricing Plans
              </Button>
            </Link>
          </div>
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
                <li><Link href="/features"><a className="text-gray-400 hover:text-white transition">Features</a></Link></li>
                <li><Link href="/pricing"><a className="text-gray-400 hover:text-white transition">Pricing</a></Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
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