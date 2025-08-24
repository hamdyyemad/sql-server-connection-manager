// Simple test to check environment variables
console.log('🔍 Testing Environment Variables');
console.log('================================');

// Check if .env file exists
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
console.log('📁 .env file exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  console.log('\n📄 .env file content:');
  const content = fs.readFileSync(envPath, 'utf8');
  console.log(content);
}

console.log('\n🔍 Environment variables (before dotenv):');
console.log('  - ADMIN_USERNAME:', process.env.ADMIN_USERNAME || 'NOT SET');
console.log('  - ADMIN_PASSWORD_SALT:', process.env.ADMIN_PASSWORD_SALT || 'NOT SET');
console.log('  - ADMIN_PASSWORD_HASH:', process.env.ADMIN_PASSWORD_HASH || 'NOT SET');

console.log('\n💡 Note: These will be loaded by Next.js automatically when the server starts.');
console.log('   Make sure to restart your Next.js development server after changing .env');
