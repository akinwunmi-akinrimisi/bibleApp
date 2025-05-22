import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Shield, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface EmailVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
}

export function EmailVerification({ email, onVerificationSuccess }: EmailVerificationProps) {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      const response = await apiRequest('POST', '/api/verify-email', { otp });
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Email Verified! 🎉",
          description: "Welcome to VerseProjection! Your account is now active.",
        });
        onVerificationSuccess();
      } else {
        const error = await response.json();
        toast({
          title: "Verification Failed",
          description: error.message || "Invalid verification code",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    
    try {
      const response = await apiRequest('POST', '/api/resend-verification', {});
      
      if (response.ok) {
        toast({
          title: "Code Resent",
          description: "A new verification code has been sent to your email.",
        });
        
        // Start countdown
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast({
          title: "Error",
          description: "Failed to resend verification code.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend verification code.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            We've sent a 6-digit verification code to<br />
            <span className="font-semibold text-blue-600 dark:text-blue-400">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Verification Code
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-wider font-mono"
                maxLength={6}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              disabled={isVerifying || otp.length !== 6}
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </Button>
          </form>

          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive the code?
            </p>
            
            <Button
              variant="ghost"
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {isResending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Sending...
                </div>
              ) : countdown > 0 ? (
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  Resend in {countdown}s
                </div>
              ) : (
                'Resend Code'
              )}
            </Button>
          </div>

          <div className="text-xs text-center text-gray-500 dark:text-gray-400 space-y-1">
            <p>• Check your spam folder if you don't see the email</p>
            <p>• The verification code expires in 30 minutes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}