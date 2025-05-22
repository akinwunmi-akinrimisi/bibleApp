import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Headphones,
  Laptop,
  ArrowRight,
  ChevronRight,
  Zap,
  MonitorSmartphone,
  Search,
  BarChart,
  SpeakerIcon,
  Mic,
  Lightbulb,
  Braces,
  Server,
  Code
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.ts";

export default function HowItWorksPage() {
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
              <a className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">Features</a>
            </Link>
            <Link href="/pricing">
              <a className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">Pricing</a>
            </Link>
            <Link href="/how-it-works">
              <a className="text-primary font-medium">How It Works</a>
            </Link>
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
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              The Technology Behind VerseProjection
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Discover how our advanced AI and speech recognition technology work together to transform your church service experience.
            </p>
            <div className="flex justify-center">
              <Link href="#process">
                <Button size="lg" className="group">
                  See How It Works <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section id="process" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              The Process: From Speech to Screen
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our innovative technology follows a seamless four-step process
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-20 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <Mic className="h-10 w-10 text-primary" />
                <div className="absolute -top-3 -right-3 bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Audio Capture
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                High-quality audio is captured through your church's sound system or a dedicated microphone.
              </p>
              
              {/* Desktop Arrow */}
              <div className="hidden md:block absolute top-20 right-0 w-full h-4">
                <ArrowRight className="h-8 w-12 text-primary absolute -right-6" />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="text-center relative">
              <div className="bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-20 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <SpeakerIcon className="h-10 w-10 text-primary" />
                <div className="absolute -top-3 -right-3 bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Speech-to-Text
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our advanced AI converts spoken words to text in real-time with high accuracy.
              </p>
              
              {/* Desktop Arrow */}
              <div className="hidden md:block absolute top-20 right-0 w-full h-4">
                <ArrowRight className="h-8 w-12 text-primary absolute -right-6" />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="text-center relative">
              <div className="bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-20 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <BookOpen className="h-10 w-10 text-primary" />
                <div className="absolute -top-3 -right-3 bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Verse Detection
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                The system identifies Bible verses by comparing transcribed text with our comprehensive Bible database.
              </p>
              
              {/* Desktop Arrow */}
              <div className="hidden md:block absolute top-20 right-0 w-full h-4">
                <ArrowRight className="h-8 w-12 text-primary absolute -right-6" />
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-20 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <MonitorSmartphone className="h-10 w-10 text-primary" />
                <div className="absolute -top-3 -right-3 bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                  4
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Projection
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                With one click, you can display the selected verse on your church's projection system beautifully formatted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Deep Dive */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Technology Deep Dive
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The advanced technology making VerseProjection possible
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Speech Recognition */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <Headphones className="h-12 w-12 text-primary mr-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Speech Recognition
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our system uses the latest in AI-powered speech recognition technology, specifically optimized for religious context and terminology. The speech recognition engine:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Processes audio in real-time with minimal latency</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Handles different accents and speaking styles</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Filters out background noise and music</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Recognizes biblical names and specialized terminology</span>
                </li>
              </ul>
              <div className="bg-primary bg-opacity-5 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  "Our speech recognition accuracy exceeds 95% in typical church environments, even with ambient noise."
                </p>
              </div>
            </div>
            
            {/* Natural Language Processing */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <Braces className="h-12 w-12 text-primary mr-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Natural Language Processing
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our advanced NLP algorithms analyze the transcribed text to identify Bible verses, whether explicitly referenced or paraphrased:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Detects explicit references (e.g., "John 3:16")</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Recognizes paraphrased content through semantic matching</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Assigns confidence scores to potential matches</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Continuously learns from your church's speaking patterns</span>
                </li>
              </ul>
              <div className="bg-primary bg-opacity-5 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  "Our AI can identify paraphrased Bible verses with 85% accuracy, even when the wording differs significantly from the original text."
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 mt-12">
            {/* Bible Database */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <Server className="h-12 w-12 text-primary mr-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Comprehensive Bible Database
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                VerseProjection is powered by a comprehensive Bible database:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Complete text of multiple Bible translations</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Optimized for fast verse retrieval and matching</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Includes semantic information for improved matching</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Regularly updated with new translations and improvements</span>
                </li>
              </ul>
              <div className="bg-primary bg-opacity-5 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  "Our database includes over 31,000 verses per translation, with comprehensive coverage of all 66 books of the Bible."
                </p>
              </div>
            </div>
            
            {/* User Interface */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <Laptop className="h-12 w-12 text-primary mr-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Intuitive User Interface
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our user interface is designed for ease of use during live services:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Real-time transcription display with highlighted verse matches</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">One-click projection of selected verses</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Customizable display settings for fonts, colors, and layouts</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Simple controls that require minimal training</span>
                </li>
              </ul>
              <div className="bg-primary bg-opacity-5 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  "Our interface is designed to be operated by volunteers with minimal technical experience, with most users becoming proficient after just 15 minutes of training."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration & Setup */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Setup & Integration
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              VerseProjection integrates easily with your existing church A/V system
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Simple Setup Process
              </h3>
              <div className="space-y-8">
                <div className="flex">
                  <div className="bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-20 h-10 w-10 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Create Your Account
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Sign up for VerseProjection and select your preferred plan. No credit card required for the free trial.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-20 h-10 w-10 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Connect Your Audio Source
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Connect your church's sound system or a dedicated microphone to the computer running VerseProjection.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-20 h-10 w-10 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Connect to Your Display
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Connect your computer to your church's projection system or display screens.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-20 h-10 w-10 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Customize Your Settings
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Configure your display preferences, Bible translation, and sensitivity settings.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-20 h-10 w-10 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <span className="text-primary font-bold">5</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Start Using VerseProjection
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      You're ready to go! VerseProjection will begin detecting and displaying verses immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                System Requirements
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Laptop className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Computer:</span>
                    <p className="text-gray-600 dark:text-gray-300">Windows 10/11, macOS 10.15+, or Linux with Chrome browser</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Headphones className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Audio Input:</span>
                    <p className="text-gray-600 dark:text-gray-300">Direct connection to sound system or quality microphone</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <MonitorSmartphone className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Display Output:</span>
                    <p className="text-gray-600 dark:text-gray-300">HDMI, DisplayPort, or wireless connection to projector/screens</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Globe className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Internet Connection:</span>
                    <p className="text-gray-600 dark:text-gray-300">Broadband connection (5+ Mbps) for optimal performance</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8 p-4 bg-white dark:bg-gray-900 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white">Note:</span> VerseProjection works best with a dedicated computer for operation during services, but can run alongside other presentation software if needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Technical FAQs
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Common questions about VerseProjection's technology
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Does VerseProjection work with all audio setups?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                VerseProjection works with virtually any audio source that can connect to your computer. This includes direct connections from sound boards, USB microphones, or even the computer's built-in microphone (though we recommend an external mic for better quality).
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                How does the AI handle different preaching styles?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our AI is trained on a diverse range of preaching styles and speech patterns. It adapts over time to become more accurate with your specific speakers. For paraphrased verses, the system looks for semantic similarities rather than exact wording matches, allowing it to identify verses even when they're expressed differently.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Can VerseProjection run simultaneously with other presentation software?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes, VerseProjection can run alongside other presentation software like ProPresenter, EasyWorship, or PowerPoint. The projector output can be managed through your computer's display settings or using a video switcher if you prefer to keep them on separate screens.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                What happens if my internet connection drops during a service?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                VerseProjection requires an internet connection for full functionality, as our AI processing happens in the cloud. However, we're developing offline capabilities that will allow basic verse detection to continue working with a locally cached Bible database if your connection is interrupted.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                How does VerseProjection handle privacy and data security?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We take privacy seriously. Audio data is processed in real-time and is not stored permanently. Transcriptions are temporarily cached during your session for functionality purposes and to improve our AI, but no recordings of your services are kept. All data is encrypted in transit and at rest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary bg-opacity-10 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Experience VerseProjection Today
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your church services with automatic Bible verse detection and projection.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/register">
              <Button size="lg">
                Start Your Free Trial <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Request a Demo
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            No credit card required. 14-day free trial on all plans.
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
                <li><Link href="/how-it-works"><a className="text-gray-400 hover:text-white transition">How It Works</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about"><a className="text-gray-400 hover:text-white transition">About Us</a></Link></li>
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