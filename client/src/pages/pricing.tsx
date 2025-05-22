import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.ts";

export default function PricingPage() {
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
            <Link href="/#features">
              <a className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">Features</a>
            </Link>
            <Link href="/#comparison">
              <a className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">Comparison</a>
            </Link>
            <Link href="/pricing">
              <a className="text-primary font-medium">Pricing</a>
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

      {/* Pricing Hero */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Choose the plan that works best for your church's needs. All plans include our core Bible verse detection technology.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/register">
              <Button size="lg">
                Start Your Free Trial <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
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
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">1 projection screen</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">KJV & WEB translations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Basic customization options</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">7-day detection history</span>
                  </li>
                  <li className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-500 dark:text-gray-400">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-500 dark:text-gray-400">Custom branding</span>
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
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">2 projection screens</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">All Bible translations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Advanced customization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">30-day history</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Email support</span>
                  </li>
                  <li className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-500 dark:text-gray-400">Custom branding</span>
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
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Unlimited projection screens</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">All Bible translations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Full customization suite</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Unlimited history</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
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
      
      {/* Feature Comparison */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Full Feature Comparison
          </h2>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-6 text-left text-gray-900 dark:text-white font-semibold">Feature</th>
                  <th className="py-4 px-6 text-center text-gray-900 dark:text-white font-semibold">Basic</th>
                  <th className="py-4 px-6 text-center text-gray-900 dark:text-white font-semibold">Standard</th>
                  <th className="py-4 px-6 text-center text-gray-900 dark:text-white font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">Projection screens</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">1</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">2</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">Bible translations</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">KJV, WEB</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">All translations</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">All translations</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">Verse detection history</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">7 days</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">30 days</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">Display customization</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">Basic</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">Advanced</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">Full suite</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">Audio capture quality</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">Standard</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">Enhanced</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">Premium</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">Technical support</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">Basic</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">Email support</td>
                  <td className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">Priority support</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">Custom branding</td>
                  <td className="py-4 px-6 text-center">
                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">API access</td>
                  <td className="py-4 px-6 text-center">
                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                How does the free trial work?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Your 14-day free trial gives you full access to all features of the Standard plan. No credit card is required to start. At the end of your trial, you can choose to subscribe to any of our plans or your account will automatically switch to the Basic plan with limited features.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Can I switch plans later?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to the new features. When downgrading, the change will take effect at the start of your next billing cycle.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We accept all major credit cards (Visa, Mastercard, American Express, Discover) as well as PayPal. For annual plans, we can also arrange for invoice payment.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Is there a discount for annual billing?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes, you can save 20% by choosing annual billing instead of monthly. This option is available for all plans and can be selected during the checkout process.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Do you offer special pricing for non-profits?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes, we offer a 15% discount for registered non-profit organizations. Please contact our sales team with proof of your non-profit status to receive this discount.
              </p>
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
                <li><Link href="/#features"><a className="text-gray-400 hover:text-white transition">Features</a></Link></li>
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