const { createClient } = require('@libsql/client');
require('dotenv').config();

async function checkTempSecret() {
  console.log('🔍 Checking temp secret for admin user...\n');

  const config = {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  };

  try {
    const db = createClient(config);
    
    // Get admin user's temp secret
    const result = await db.execute({
      sql: 'SELECT username, tempSecret2FA, hasSetup2FA FROM users WHERE username = ?',
      args: ['admin']
    });
    
    if (result.rows.length === 0) {
      console.log('❌ Admin user not found');
      return;
    }
    
    const user = result.rows[0];
    console.log('👤 User:', user.username);
    console.log('🔐 Has 2FA Setup:', user.hasSetup2FA ? 'Yes' : 'No');
    console.log('🔑 Temp Secret:', user.tempSecret2FA || 'NULL');
    
    if (user.tempSecret2FA) {
      console.log('📏 Secret Length:', user.tempSecret2FA.length);
      console.log('🔤 Secret starts with:', user.tempSecret2FA.substring(0, 3));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

if (require.main === module) {
  checkTempSecret();
}
