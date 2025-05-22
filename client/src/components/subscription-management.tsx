import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Zap, Shield, Clock, Users, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  description: string;
}

interface SubscriptionManagementProps {
  currentPlan?: string;
  trialDaysLeft?: number;
  onUpgrade: (planId: string) => void;
}

export function SubscriptionManagement({ currentPlan, trialDaysLeft, onUpgrade }: SubscriptionManagementProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const plans: SubscriptionPlan[] = [
    {
      id: 'trial',
      name: 'Free Trial',
      price: 0,
      interval: 'month',
      description: 'Perfect for trying out VerseProjection',
      icon: <Clock className="w-5 h-5" />,
      features: [
        'Real-time verse detection',
        'Basic projection display',
        'KJV & WEB Bible versions',
        'Manual verse search',
        '14-day trial period'
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 9,
      interval: 'month',
      description: 'Essential features for small churches',
      icon: <Shield className="w-5 h-5" />,
      features: [
        'Everything in Free Trial',
        'Unlimited verse detection',
        'Custom display themes',
        'Detection history',
        'Email support'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 19,
      interval: 'month',
      description: 'Advanced features for growing churches',
      icon: <Zap className="w-5 h-5" />,
      popular: true,
      features: [
        'Everything in Basic',
        'Multiple Bible versions',
        'Advanced AI detection',
        'Custom backgrounds',
        'Multiple projection screens',
        'Priority support'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 49,
      interval: 'month',
      description: 'Full-featured solution for large organizations',
      icon: <Crown className="w-5 h-5" />,
      features: [
        'Everything in Professional',
        'Multi-campus support',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated support',
        'Training sessions'
      ]
    }
  ];

  const handleUpgrade = async (planId: string) => {
    setIsLoading(planId);
    
    try {
      await onUpgrade(planId);
      toast({
        title: "Subscription Updated! 🎉",
        description: "Your plan has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(null);
    }
  };

  const formatPrice = (price: number, interval: string) => {
    if (price === 0) return 'Free';
    return `$${price}/${interval}`;
  };

  return (
    <div className="space-y-6">
      {/* Trial Status Banner */}
      {trialDaysLeft !== undefined && trialDaysLeft > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                  Free Trial Active
                </h3>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  {trialDaysLeft} days remaining • Upgrade anytime to continue using VerseProjection
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative ${
              plan.popular 
                ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg' 
                : ''
            } ${
              currentPlan === plan.id 
                ? 'bg-green-50 dark:bg-green-900/10 border-green-500' 
                : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-4">
                {plan.icon}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm">{plan.description}</CardDescription>
              <div className="text-3xl font-bold mt-4">
                {formatPrice(plan.price, plan.interval)}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  currentPlan === plan.id
                    ? 'bg-green-500 hover:bg-green-600'
                    : plan.popular
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : ''
                }`}
                onClick={() => handleUpgrade(plan.id)}
                disabled={isLoading === plan.id || currentPlan === plan.id}
              >
                {isLoading === plan.id ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : currentPlan === plan.id ? (
                  'Current Plan'
                ) : plan.id === 'trial' ? (
                  'Start Free Trial'
                ) : (
                  'Upgrade'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Compare Features
          </CardTitle>
          <CardDescription>
            See what's included with each plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Feature</th>
                  <th className="text-center py-3">Trial</th>
                  <th className="text-center py-3">Basic</th>
                  <th className="text-center py-3">Pro</th>
                  <th className="text-center py-3">Enterprise</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {[
                  { name: 'Verse Detection', trial: true, basic: true, pro: true, enterprise: true },
                  { name: 'Custom Themes', trial: false, basic: true, pro: true, enterprise: true },
                  { name: 'Multiple Versions', trial: false, basic: false, pro: true, enterprise: true },
                  { name: 'AI Enhancement', trial: false, basic: false, pro: true, enterprise: true },
                  { name: 'Multi-Campus', trial: false, basic: false, pro: false, enterprise: true },
                ].map((feature, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-medium">{feature.name}</td>
                    <td className="text-center py-2">
                      {feature.trial ? <Check className="w-4 h-4 mx-auto text-green-500" /> : '—'}
                    </td>
                    <td className="text-center py-2">
                      {feature.basic ? <Check className="w-4 h-4 mx-auto text-green-500" /> : '—'}
                    </td>
                    <td className="text-center py-2">
                      {feature.pro ? <Check className="w-4 h-4 mx-auto text-green-500" /> : '—'}
                    </td>
                    <td className="text-center py-2">
                      {feature.enterprise ? <Check className="w-4 h-4 mx-auto text-green-500" /> : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}