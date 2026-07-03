// Simple script to verify environment variables are loaded correctly
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Environment Variables Check:');
console.log('============================');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
console.log('PORT:', process.env.PORT || 'NOT SET');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ SET (hidden for security)' : '❌ NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET (hidden for security)' : '❌ NOT SET');
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE || 'NOT SET');
console.log('CLIENT_URL:', process.env.CLIENT_URL || 'NOT SET');
console.log('============================');

if (!process.env.MONGODB_URI) {
  console.error('\n❌ ERROR: MONGODB_URI is not set!');
  console.error('Please make sure:');
  console.error('1. For local development: Create a .env file in the backend-node directory');
  console.error('2. For production (Render): Set environment variables in Render dashboard');
  process.exit(1);
}

console.log('\n✅ All required environment variables are set!');
