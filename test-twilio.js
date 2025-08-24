const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });
const twilio = require('twilio');

console.log('Environment Variables:');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? 'Found' : 'Missing');
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? 'Found' : 'Missing');
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER);
console.log('OWNER_PHONE_NUMBER:', process.env.OWNER_PHONE_NUMBER);

// Validate required environment variables
const requiredVars = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER', 'OWNER_PHONE_NUMBER'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Please check your .env file in the server directory');
  process.exit(1);
}

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Test message
const testMessage = {
  body: '🚀 Test SMS from Your Application!',
  from: process.env.TWILIO_PHONE_NUMBER,
  to: process.env.OWNER_PHONE_NUMBER
};

// Send test message
client.messages
  .create(testMessage)
  .then(message => {
    console.log('✅ Test SMS sent successfully!');
    console.log('Message SID:', message.sid);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Failed to send test SMS:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    if (error.moreInfo) console.error('More Info:', error.moreInfo);
    process.exit(1);
  });
