const { createClient } = require('@libsql/client');
require('dotenv').config();

async function clearTempSecret() {
  console.log('🔍 Clearing temp secret for admin user...\n');

  const config = {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  };

  try {
    const db = createClient(config);
    
    // Clear temp secret
    await db.execute({
      sql: 'UPDATE users SET tempSecret2FA = NULL WHERE username = ?',
      args: ['admin']
    });
    
    console.log('✅ Temp secret cleared successfully!');
    console.log('🔄 Now refresh your 2FA setup page to get a fresh QR code');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

if (require.main === module) {
  clearTempSecret();
}
