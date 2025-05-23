// Quick test of ConvertKit integration
import axios from 'axios';

const CONVERTKIT_API_KEY = 'm4VXYuLNUDRbRFVhx8L2-w';
const CONVERTKIT_API_SECRET = '2JXgD9HK0WJskLgDpFcEcQK4JDenlOCZPgPURpq0jbQ';
const CONVERTKIT_API_URL = 'https://api.convertkit.com/v3';

async function testConvertKit() {
  try {
    console.log('📧 Testing ConvertKit connection...');
    
    // Test API connection by getting account info
    const response = await axios.get(`${CONVERTKIT_API_URL}/account?api_secret=${CONVERTKIT_API_SECRET}`);
    
    console.log('✅ ConvertKit API working!');
    console.log('Account:', response.data.account?.name || 'Connected');
    
    return true;
  } catch (error) {
    console.error('❌ ConvertKit API Error:', error.response?.data || error.message);
    return false;
  }
}

testConvertKit();