#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking environment setup...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file exists');
  
  const content = fs.readFileSync(envPath, 'utf8');
  console.log('\n📄 File contents:');
  console.log('================');
  console.log(content);
  
  // Parse environment variables
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key] = valueParts.join('=');
      }
    }
  });
  
  console.log('\n🔧 Parsed environment variables:');
  console.log('===============================');
  Object.keys(env).forEach(key => {
    const value = key.includes('PASSWORD') ? '[HIDDEN]' : env[key];
    console.log(`${key}: ${value}`);
  });
  
  // Check required variables
  const required = [
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_ISSUER',
    'NEXT_ADMIN_USERNAME',
    'NEXT_ADMIN_PASSWORD_HASH'
  ];
  
  console.log('\n✅ Required variables check:');
  console.log('===========================');
  required.forEach(key => {
    if (env[key]) {
      console.log(`✅ ${key}: SET`);
    } else {
      console.log(`❌ ${key}: MISSING`);
    }
  });
  
} else {
  console.log('❌ .env.local file not found');
  console.log('\n📝 Create .env.local with this content:');
  console.log(`
# 2FA Configuration
NEXT_PUBLIC_APP_NAME=YourApp
NEXT_PUBLIC_APP_ISSUER=YourApp

# User 2FA Secrets (will be auto-generated)
ADMIN_2FA_SECRET=JBSWY3DPEHPK3PXP

# 2FA Enabled Users (leave empty for new setup)
ENABLED_2FA_USERS=

# 2FA Setup Date
ADMIN_2FA_SETUP_DATE=2024-01-01

# Your existing login credentials
NEXT_ADMIN_USERNAME=admin
NEXT_ADMIN_PASSWORD_HASH=your_existing_password_hash
  `);
}

console.log('\n🚀 Next steps:');
console.log('1. Make sure your development server is running: npm run dev');
console.log('2. Visit: http://localhost:3000/api/v1/debug-env');
console.log('3. Visit: http://localhost:3000/api/v1/test-2fa');
console.log('4. Log in and check the browser console for debug logs');
