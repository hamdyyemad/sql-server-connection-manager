#!/usr/bin/env node

const bcrypt = require('bcrypt');

// Function to generate password hash
async function generatePasswordHash(password, saltRounds = 10) {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    console.error('Error generating hash:', error);
    throw error;
  }
}

// Function to split hash for environment variables
function splitHashForEnv(hash) {
  // If hash is longer than typical env var limits, split it
  const maxLength = 100; // Conservative limit for env vars
  const parts = [];
  
  for (let i = 0; i < hash.length; i += maxLength) {
    parts.push(hash.slice(i, i + maxLength));
  }
  
  return parts;
}

// Main function
async function main() {
  const password = process.argv[2] || 'admin123';
  
  console.log('🔐 Generating bcrypt hash for password:', password);
  
  try {
    // Generate the hash
    const hash = await generatePasswordHash(password);
    console.log('\n✅ Generated hash:');
    console.log(hash);
    
    // Check if hash needs to be split
    const hashParts = splitHashForEnv(hash);
    
    if (hashParts.length === 1) {
      console.log('\n📝 Add to your .env file:');
      console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    } else {
      console.log('\n📝 Hash needs to be split. Add to your .env file:');
      console.log(`ADMIN_PASSWORD_HASH=${hashParts[0]}`);
      for (let i = 1; i < hashParts.length; i++) {
        console.log(`ADMIN_PASSWORD_HASH_${i}=${hashParts[i]}`);
      }
    }
    
    // Test the hash
    console.log('\n🧪 Testing hash verification...');
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash verification test:', isValid ? '✅ PASSED' : '❌ FAILED');
    
    // Show example .env setup
    console.log('\n📋 Example .env setup:');
    console.log('# Admin credentials');
    console.log(`ADMIN_USERNAME=admin`);
    if (hashParts.length === 1) {
      console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    } else {
      console.log(`ADMIN_PASSWORD_HASH=${hashParts[0]}`);
      for (let i = 1; i < hashParts.length; i++) {
        console.log(`ADMIN_PASSWORD_HASH_${i}=${hashParts[i]}`);
      }
    }
    console.log('');
    console.log('# 2FA configuration');
    console.log('ENABLED_2FA_USERS=');
    console.log('NEXT_PUBLIC_APP_NAME=YourApp');
    console.log('NEXT_PUBLIC_APP_ISSUER=YourApp');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { generatePasswordHash, splitHashForEnv };

