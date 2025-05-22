import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Mic, 
  Monitor, 
  Settings, 
  BookOpen, 
  Play,
  Volume2,
  Eye,
  Zap
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  action?: () => void;
}

interface UserOnboardingProps {
  onComplete: () => void;
}

export function UserOnboarding({ onComplete }: UserOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to VerseProjection!',
      description: 'Your AI-powered Bible verse detection and projection system',
      icon: <BookOpen className="w-8 h-8" />,
      content: (
        <div className="space-y-6 text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Let's get you started!</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              VerseProjection uses advanced AI to detect Bible verses in real-time speech 
              and project them beautifully for your congregation.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mic className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium">AI Detection</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Monitor className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium">Live Projection</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium">Real-time</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'audio-setup',
      title: 'Set Up Audio Input',
      description: 'Configure your microphone for verse detection',
      icon: <Mic className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Audio Input Setup</h3>
            <p className="text-gray-600 dark:text-gray-300">
              VerseProjection will listen to your microphone and detect Bible verses as you speak.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Tips for best results:</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Speak clearly and at normal volume</li>
                <li>• Position microphone 6-12 inches from speaker</li>
                <li>• Minimize background noise</li>
                <li>• Test with common verses like "John 3:16"</li>
              </ul>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">Microphone Access</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Click "Allow" when prompted</p>
                </div>
              </div>
              <Badge variant="outline">Required</Badge>
            </div>
          </div>
        </div>
      ),
      action: async () => {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          setCompletedSteps(prev => new Set(Array.from(prev).concat([currentStep])));
        } catch (error) {
          console.warn('Microphone access denied');
        }
      }
    },
    {
      id: 'projection-setup',
      title: 'Projection Display',
      description: 'Learn how to set up your projection screen',
      icon: <Monitor className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Projection Setup</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Set up a secondary display for your congregation to see the verses.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold">Projection Window</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Click "Open Projection" to launch a new window for your projector or second screen.
              </p>
              <Button size="sm" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Test Projection
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold">Display Settings</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Customize fonts, colors, and themes to match your church's style.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'preferences',
      title: 'Customize Your Experience',
      description: 'Set your Bible version and display preferences',
      icon: <Settings className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Preferences</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Customize VerseProjection to work perfectly for your ministry.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Bible Version</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Choose your preferred Bible translation for verse detection and display.
              </p>
              <div className="flex gap-2">
                <Badge variant="default">KJV</Badge>
                <Badge variant="outline">WEB</Badge>
                <Badge variant="outline">More coming soon</Badge>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Detection Sensitivity</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Adjust how confident the AI should be before showing a verse.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm">Lower</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-sm">Higher</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Start using VerseProjection in your services',
      icon: <CheckCircle className="w-8 h-8" />,
      content: (
        <div className="space-y-6 text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Congratulations! 🎉</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              VerseProjection is ready to enhance your worship services with 
              intelligent Bible verse detection and projection.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200">Ready to use:</h4>
                <ul className="text-sm text-green-700 dark:text-green-300 mt-2 space-y-1">
                  <li>✓ Audio detection</li>
                  <li>✓ Projection display</li>
                  <li>✓ AI verse matching</li>
                </ul>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">Need help?</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                  <li>📧 Email support</li>
                  <li>📖 User guide</li>
                  <li>💬 Live chat</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const executeStepAction = async () => {
    const step = steps[currentStep];
    if (step.action) {
      await step.action();
    }
    nextStep();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
            <div className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </div>
          </div>
          <Progress value={progress} className="mb-6" />
          
          <div className="flex items-center justify-center mb-4">
            {steps[currentStep].icon}
          </div>
          
          <CardTitle className="text-2xl font-bold">
            {steps[currentStep].title}
          </CardTitle>
          <CardDescription>
            {steps[currentStep].description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep].content}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-500'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={steps[currentStep].action ? executeStepAction : nextStep}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {currentStep === steps.length - 1 ? (
                'Get Started'
              ) : steps[currentStep].action ? (
                'Test & Continue'
              ) : (
                'Continue'
              )}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}