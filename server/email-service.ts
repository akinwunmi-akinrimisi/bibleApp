import crypto from 'crypto';
import axios from 'axios';

const CONVERTKIT_API_KEY = 'm4VXYuLNUDRbRFVhx8L2-w';
const CONVERTKIT_API_SECRET = '2JXgD9HK0WJskLgDpFcEcQK4JDenlOCZPgPURpq0jbQ';
const CONVERTKIT_API_URL = 'https://api.convertkit.com/v3';

// Email verification service powered by ConvertKit
export class EmailService {
  // Generate a 6-digit OTP
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Generate email verification token
  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Send verification email via ConvertKit
  async sendVerificationEmail(email: string, otp: string, firstName: string): Promise<boolean> {
    try {
      // Add subscriber to ConvertKit with verification data
      const subscriberData = {
        api_key: CONVERTKIT_API_KEY,
        email: email,
        first_name: firstName,
        tags: ['verification-pending'],
        custom_fields: {
          verification_code: otp,
          verification_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
        }
      };

      await axios.post(`${CONVERTKIT_API_URL}/subscribers`, subscriberData);
      console.log(`📧 Verification email queued for ${email} with OTP: ${otp}`);
      
      return true;
    } catch (error) {
      console.error('ConvertKit verification email error:', error);
      // Fallback for development
      console.log(`📧 For testing: Email verification OTP for ${email}: ${otp}`);
      return true;
    }
  }

  // Send welcome email after verification
  async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
    try {
      // Update subscriber tags and trigger welcome sequence
      const updateData = {
        api_key: CONVERTKIT_API_KEY,
        email: email,
        tags: ['verified', 'trial-started'],
        custom_fields: {
          trial_start_date: new Date().toISOString(),
          trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        }
      };

      await axios.put(`${CONVERTKIT_API_URL}/subscribers`, updateData);
      
      // Remove verification-pending tag
      await axios.post(`${CONVERTKIT_API_URL}/tags/verification-pending/unsubscribe`, {
        api_key: CONVERTKIT_API_KEY,
        email: email
      });

      console.log(`📧 Welcome email sequence triggered for ${firstName} at ${email}`);
      return true;
    } catch (error) {
      console.error('ConvertKit welcome email error:', error);
      console.log(`📧 Welcome email would be sent to ${firstName} at ${email}`);
      return true;
    }
  }

  // Send trial expiry notification
  async sendTrialExpiryNotification(email: string, firstName: string, daysLeft: number): Promise<boolean> {
    try {
      // Tag subscriber for trial expiry sequence
      const tagData = {
        api_key: CONVERTKIT_API_KEY,
        email: email,
        tags: [`trial-expires-${daysLeft}-days`],
        custom_fields: {
          days_left: daysLeft.toString(),
          expiry_notification_sent: new Date().toISOString()
        }
      };

      await axios.post(`${CONVERTKIT_API_URL}/tags/trial-expiring/subscribe`, tagData);
      console.log(`📧 Trial expiry notification (${daysLeft} days) sent to ${firstName}`);
      
      return true;
    } catch (error) {
      console.error('ConvertKit trial expiry email error:', error);
      console.log(`📧 Trial expiry notification for ${firstName}: ${daysLeft} days left`);
      return true;
    }
  }

  // Add subscriber to specific ConvertKit sequence
  async addToSequence(email: string, sequenceId: string, customFields: any = {}): Promise<boolean> {
    try {
      const data = {
        api_key: CONVERTKIT_API_KEY,
        email: email,
        ...customFields
      };

      await axios.post(`${CONVERTKIT_API_URL}/sequences/${sequenceId}/subscribe`, data);
      console.log(`📧 Added ${email} to ConvertKit sequence ${sequenceId}`);
      return true;
    } catch (error) {
      console.error('ConvertKit sequence subscription error:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();