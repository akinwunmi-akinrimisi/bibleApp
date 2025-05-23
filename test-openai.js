// Quick test of OpenAI integration
import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function testOpenAI() {
  try {
    console.log('🤖 Testing OpenAI connection...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a Bible verse detection system. Analyze the following text and identify any Bible verses mentioned."
        },
        {
          role: "user", 
          content: "For God so loved the world that he gave his one and only Son"
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 200
    });

    console.log('✅ OpenAI API working!');
    console.log('Response:', response.choices[0].message.content);
    
    return true;
  } catch (error) {
    console.error('❌ OpenAI API Error:', error.message);
    return false;
  }
}

testOpenAI();