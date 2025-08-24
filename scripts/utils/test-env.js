// Test script to check environment variables
console.log('🔍 Testing Environment Variables');
console.log('================================');

// Check admin credentials
const adminUsername = process.env.ADMIN_USERNAME;
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

console.log('Admin Username:', adminUsername || 'NOT SET');
console.log('Admin Password Hash:', adminPasswordHash ? `${adminPasswordHash.substring(0, 30)}...` : 'NOT SET');

// Check 2FA configuration
const enabledUsers = process.env.ENABLED_2FA_USERS;
const appName = process.env.NEXT_PUBLIC_APP_NAME;
const appIssuer = process.env.NEXT_PUBLIC_APP_ISSUER;

console.log('Enabled 2FA Users:', enabledUsers || 'NOT SET');
console.log('App Name:', appName || 'NOT SET');
console.log('App Issuer:', appIssuer || 'NOT SET');

// Check debug settings
const debug = process.env.DEBUG;
const publicDebug = process.env.NEXT_PUBLIC_DEBUG;

console.log('Debug:', debug || 'NOT SET');
console.log('Public Debug:', publicDebug || 'NOT SET');

console.log('\n📋 Required .env setup:');
console.log('# Admin credentials');
console.log('ADMIN_USERNAME=admin');
console.log('ADMIN_PASSWORD_HASH=$2b$10$VnRfJ0.BBMKXLzy41.2/1uyxVMv.F7aQOePfmZljg1GfcGvdMVzii');
console.log('');
console.log('# 2FA configuration');
console.log('ENABLED_2FA_USERS=');
console.log('NEXT_PUBLIC_APP_NAME=YourApp');
console.log('NEXT_PUBLIC_APP_ISSUER=YourApp');
console.log('');
console.log('# Debug (optional)');
console.log('DEBUG=true');
console.log('NEXT_PUBLIC_DEBUG=true');
