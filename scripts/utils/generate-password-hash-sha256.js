#!/usr/bin/env node

const crypto = require('crypto');

function generateSalt(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

function hashPassword(password, salt) {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

function generatePasswordHash(password) {
  const salt = generateSalt();
  const hash = hashPassword(password, salt);
  return { salt, hash };
}

function main() {
  const password = process.argv[2] || 'admin123';
  console.log('🔐 Generating SHA-256 hash for password:', password);
  
  try {
    const { salt, hash } = generatePasswordHash(password);
    
    console.log('\n✅ Generated credentials:');
    console.log('Salt:', salt);
    console.log('Hash:', hash);
    
    console.log('\n📝 Add to your .env file:');
    console.log(`ADMIN_USERNAME=admin`);
    console.log(`ADMIN_PASSWORD_SALT=${salt}`);
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    
    console.log('\n🧪 Testing hash verification...');
    const testHash = hashPassword(password, salt);
    const isValid = testHash === hash;
    console.log('Hash verification test:', isValid ? '✅ PASSED' : '❌ FAILED');
    
    console.log('\n📋 Complete .env setup:');
    console.log('# Admin credentials');
    console.log('ADMIN_USERNAME=admin');
    console.log(`ADMIN_PASSWORD_SALT=${salt}`);
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('');
    console.log('# 2FA configuration');
    console.log('ENABLED_2FA_USERS=');
    console.log('NEXT_PUBLIC_APP_NAME=SQL_MANAGER');
    console.log('NEXT_PUBLIC_APP_ISSUER=SQL_MANAGER');
    console.log('');
    console.log('# Debug (optional)');
    console.log('DEBUG=true');
    console.log('NEXT_PUBLIC_DEBUG=true');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generatePasswordHash, hashPassword, generateSalt };
