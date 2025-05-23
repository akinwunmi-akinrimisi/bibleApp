import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { 
  Check, 
  Zap, 
  Crown, 
  Sparkles, 
  Users, 
  Globe, 
  Shield,
  Heart,
  Star,
  ArrowRight
} from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limitations: string[];
  popular?: boolean;
  icon: React.ComponentType<any>;
  color: string;
  bibleVersions: string[];
  maxUsers: number | "unlimited";
}

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small churches getting started with automated verse projection",
    monthlyPrice: 29,
    yearlyPrice: 290,
    icon: Heart,
    color: "from-blue-500 to-blue-600",
    maxUsers: 1,
    bibleVersions: ["KJV", "WEB"],
    features: [
      "Real-time verse detection",
      "Basic projection window",
      "KJV & WEB Bible versions",
      "Up to 1 user account",
      "Basic audio capture",
      "Manual verse override",
      "Detection history (30 days)",
      "Email support"
    ],
    limitations: [
      "Limited to public domain Bibles",
      "Basic projection themes",
      "Standard support response time"
    ]
  },
  {
    id: "professional",
    name: "Professional",
    description: "Enhanced features for growing churches with advanced projection needs",
    monthlyPrice: 79,
    yearlyPrice: 790,
    icon: Star,
    color: "from-purple-500 to-purple-600",
    popular: true,
    maxUsers: 5,
    bibleVersions: ["KJV", "WEB", "ESV", "NIV", "NASB"],
    features: [
      "Everything in Starter",
      "Premium Bible versions (ESV, NIV, NASB)",
      "Advanced projection themes",
      "Up to 5 user accounts",
      "Advanced AI detection (95%+ accuracy)",
      "Custom font and styling options",
      "Unlimited detection history",
      "Multiple audio input sources",
      "Priority email support",
      "Performance analytics dashboard"
    ],
    limitations: [
      "Limited concurrent sessions",
      "Standard API rate limits"
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Complete solution for large churches and multi-campus organizations",
    monthlyPrice: 199,
    yearlyPrice: 1990,
    icon: Crown,
    color: "from-gold-500 to-gold-600",
    maxUsers: "unlimited",
    bibleVersions: ["All versions", "Custom translations"],
    features: [
      "Everything in Professional",
      "Unlimited user accounts",
      "All Bible versions & translations",
      "Multi-campus support",
      "Advanced analytics & reporting",
      "Custom branding options",
      "API access for integrations",
      "Dedicated account manager",
      "24/7 phone & chat support",
      "Custom training sessions",
      "SLA guarantee (99.9% uptime)",
      "Advanced security features"
    ],
    limitations: []
  }
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const { toast } = useToast();

  const subscriptionMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest("POST", "/api/create-subscription", {
        planId,
        billing: isYearly ? "yearly" : "monthly"
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast({
          title: "Subscription Created!",
          description: "Your subscription has been activated successfully.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Error",
        description: error.message || "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSelectPlan = (planId: string) => {
    subscriptionMutation.mutate(planId);
  };

  const getPrice = (plan: PricingPlan) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: PricingPlan) => {
    const yearlyTotal = plan.monthlyPrice * 12;
    const savings = yearlyTotal - plan.yearlyPrice;
    return Math.round((savings / yearlyTotal) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Perfect Plan
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your church services with AI-powered Bible verse projection. 
              Start with our Starter plan or upgrade for premium Bible versions and advanced features.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-blue-600"
              />
              <span className={`text-sm font-medium ${isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                Yearly
              </span>
              {isYearly && (
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                  Save up to 17%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  plan.popular 
                    ? 'ring-2 ring-purple-500 ring-opacity-50 shadow-xl scale-105' 
                    : 'hover:shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                      <Sparkles className="inline w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className={`${plan.popular ? 'pt-12' : 'pt-6'}`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.color} text-white`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        {plan.description}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${getPrice(plan)}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </div>
                    {isYearly && (
                      <div className="text-sm text-green-600 font-medium mt-1">
                        Save {getSavings(plan)}% annually
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <Button 
                    className={`w-full mb-6 bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-medium py-3`}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={subscriptionMutation.isPending}
                  >
                    {subscriptionMutation.isPending ? (
                      "Processing..."
                    ) : (
                      <>
                        Get Started
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>

                  {/* Features */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Features included:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bible Versions */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Bible Versions:</h4>
                      <div className="flex flex-wrap gap-1">
                        {plan.bibleVersions.map((version, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {version}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* User Limit */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Team Size:</h4>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {typeof plan.maxUsers === 'number' ? `Up to ${plan.maxUsers} user${plan.maxUsers > 1 ? 's' : ''}` : 'Unlimited users'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Compare All Features
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              See exactly what's included in each plan
            </p>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Enterprise Security
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Bank-level encryption and security measures to protect your church data
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                99.9% Uptime SLA
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Reliable service when you need it most - during Sunday services
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                &lt;2 Second Latency
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Lightning-fast verse detection and projection for seamless services
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}