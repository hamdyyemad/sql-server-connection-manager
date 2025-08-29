// Test script to check environment variables in Next.js context
console.log('🔍 Testing Environment Variables in Next.js Context');
console.log('==================================================');

// Simulate Next.js environment loading
const path = require('path');
const fs = require('fs');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envLocalPath = path.join(process.cwd(), '.env.local');

console.log('📁 Checking for .env files:');
console.log('  - .env exists:', fs.existsSync(envPath));
console.log('  - .env.local exists:', fs.existsSync(envLocalPath));

if (fs.existsSync(envPath)) {
  console.log('\n📄 .env file content:');
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log(envContent);
}

if (fs.existsSync(envLocalPath)) {
  console.log('\n📄 .env.local file content:');
  const envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
  console.log(envLocalContent);
}

console.log('\n🔍 Current environment variables:');
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - ADMIN_USERNAME:', process.env.ADMIN_USERNAME || 'NOT SET');
console.log('  - ADMIN_PASSWORD_HASH:', process.env.ADMIN_PASSWORD_HASH ? `${process.env.ADMIN_PASSWORD_HASH.substring(0, 30)}...` : 'NOT SET');
console.log('  - ENABLED_2FA_USERS:', process.env.ENABLED_2FA_USERS || 'NOT SET');
console.log('  - DEBUG:', process.env.DEBUG || 'NOT SET');

console.log('\n💡 Next.js automatically loads these files in order:');
console.log('  1. .env.local (always loaded, ignored by git)');
console.log('  2. .env (loaded in all environments)');
console.log('  3. .env.development (loaded in development)');
console.log('  4. .env.production (loaded in production)');
