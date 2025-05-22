import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ChevronRight,
  Users,
  Heart,
  Award,
  Target,
  Globe,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.ts";

export default function AboutPage() {
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
            <Link href="/about">
              <a className="text-primary font-medium">About Us</a>
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
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
              We're on a mission to transform how churches engage with Scripture, making Bible verses more accessible during services through innovative technology.
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                VerseProjection was born from a simple observation: church volunteers were struggling to keep up with pastors' spontaneous Bible references during services. The traditional approach of manually searching for verses was disruptive and often led to delays or missed references.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Founded in 2023 by a team of Christians with backgrounds in technology and church ministry, we set out to create a solution that would enhance the worship experience by making Scripture more accessible in real-time.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                After months of development and testing with partner churches, VerseProjection was launched with a clear vision: to help congregations engage more deeply with God's Word through seamless, intelligent verse projection.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://i.imgur.com/YHPuLbV.jpg" 
                alt="Church service with projection screen" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              These core principles guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <div className="bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-20 h-16 w-16 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Passion for Scripture
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We believe in the transformative power of God's Word and are committed to making it more accessible in worship settings.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <div className="bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-20 h-16 w-16 rounded-full flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Excellence in Innovation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We strive for technical excellence, constantly improving our systems to provide the most accurate and responsive verse detection possible.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <div className="bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-20 h-16 w-16 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Service to Churches
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We're here to serve churches of all sizes, designing our tools to be intuitive, affordable, and adaptable to different ministry contexts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Meet the passionate individuals behind VerseProjection
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="mb-6 overflow-hidden rounded-full inline-block">
                <img 
                  src="https://i.imgur.com/1bnKBtn.png" 
                  alt="Michael Roberts" 
                  className="w-48 h-48 object-cover object-center"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Michael Roberts
              </h3>
              <p className="text-primary font-medium mb-3">Founder & CEO</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Former worship pastor with 15 years of ministry experience and a background in computer science.
              </p>
            </div>
            
            {/* Team Member 2 */}
            <div className="text-center">
              <div className="mb-6 overflow-hidden rounded-full inline-block">
                <img 
                  src="https://i.imgur.com/kJWQKGO.png" 
                  alt="Sarah Chen" 
                  className="w-48 h-48 object-cover object-center"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Sarah Chen
              </h3>
              <p className="text-primary font-medium mb-3">CTO</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                AI specialist with expertise in natural language processing and a passion for applying technology to ministry.
              </p>
            </div>
            
            {/* Team Member 3 */}
            <div className="text-center">
              <div className="mb-6 overflow-hidden rounded-full inline-block">
                <img 
                  src="https://i.imgur.com/yd6IqDm.png" 
                  alt="David Williams" 
                  className="w-48 h-48 object-cover object-center"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                David Williams
              </h3>
              <p className="text-primary font-medium mb-3">Head of Customer Success</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Former church technical director who understands the unique needs of ministry tech teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Churches Love VerseProjection
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from pastors and tech teams using our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <img 
                    src="https://i.imgur.com/4Zp8BuJ.jpg" 
                    alt="Pastor James Thompson" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Pastor James Thompson
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Grace Community Church
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "VerseProjection has revolutionized our Sunday services. I can preach freely without worrying about whether the right verses are being displayed. It's like having an assistant who knows the Bible inside and out."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <img 
                    src="https://i.imgur.com/9QdLSGz.jpg" 
                    alt="Lisa Rodriguez" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Lisa Rodriguez
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tech Director, New Life Fellowship
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "As someone who manages our church's tech team, VerseProjection has been a game-changer. Training new volunteers is so much easier, and we've reduced stress during services. The automatic detection is incredibly accurate."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Churches */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Church Partners
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Serving congregations across the country
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center p-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition duration-300">
              <img 
                src="https://i.imgur.com/1qCZCQm.png" 
                alt="Grace Community Church" 
                className="max-h-16"
              />
            </div>
            <div className="flex items-center justify-center p-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition duration-300">
              <img 
                src="https://i.imgur.com/f1hPI1v.png" 
                alt="Riverside Fellowship" 
                className="max-h-16"
              />
            </div>
            <div className="flex items-center justify-center p-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition duration-300">
              <img 
                src="https://i.imgur.com/Gl0Sm2y.png" 
                alt="New Life Church" 
                className="max-h-16"
              />
            </div>
            <div className="flex items-center justify-center p-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition duration-300">
              <img 
                src="https://i.imgur.com/B2KFH8s.png" 
                alt="Hope Community" 
                className="max-h-16"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-primary bg-opacity-10 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Have Questions?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Our team is here to help. Contact us for more information about VerseProjection or to schedule a personalized demo for your church.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/contact">
              <Button size="lg">
                Contact Us <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">
                Start Free Trial
              </Button>
            </Link>
          </div>
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