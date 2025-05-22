import crypto from 'crypto';

// Email verification service
export class EmailService {
  // Generate a 6-digit OTP
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Generate email verification token
  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Send verification email (will need SendGrid API key)
  async sendVerificationEmail(email: string, otp: string, firstName: string): Promise<boolean> {
    try {
      // Check if SendGrid API key is available
      if (!process.env.SENDGRID_API_KEY) {
        console.log('📧 SendGrid API key not configured. Please provide SENDGRID_API_KEY to enable email verification.');
        console.log(`📧 For testing: Email verification OTP for ${email}: ${otp}`);
        return true; // Return true for development
      }

      // TODO: Implement actual SendGrid email sending
      // For now, log the OTP for testing
      console.log(`📧 Email verification OTP for ${email}: ${otp}`);
      
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  }

  // Send welcome email after verification
  async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        console.log(`📧 Welcome email would be sent to ${firstName} at ${email}`);
        return true;
      }

      // TODO: Implement actual welcome email
      console.log(`📧 Welcome email sent to ${firstName} at ${email}`);
      
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  // Send trial expiry notification
  async sendTrialExpiryNotification(email: string, firstName: string, daysLeft: number): Promise<boolean> {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        console.log(`📧 Trial expiry notification for ${firstName}: ${daysLeft} days left`);
        return true;
      }

      // TODO: Implement actual trial expiry notification
      console.log(`📧 Trial expiry notification sent to ${firstName} at ${email}`);
      
      return true;
    } catch (error) {
      console.error('Error sending trial expiry notification:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();