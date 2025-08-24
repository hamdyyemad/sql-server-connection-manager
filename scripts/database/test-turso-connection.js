const { createClient } = require('@libsql/client');
require('dotenv').config();

async function testTursoConnection() {
  console.log('🔍 Testing Turso Database Connection...\n');

  const config = {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  };

  if (!config.url) {
    console.error('❌ TURSO_DATABASE_URL is not set in .env file');
    return;
  }

  if (!config.authToken) {
    console.error('❌ TURSO_AUTH_TOKEN is not set in .env file');
    return;
  }

  try {
    console.log('🔌 Connecting to Turso database...');
    const db = createClient(config);
    
    // Test basic connection
    const result = await db.execute('SELECT 1 as test, datetime("now") as current_time');
    console.log('✅ Connection successful!');
    console.log(`📅 Current time: ${result.rows[0].current_time}`);
    
    // Test if tables exist
    const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log(`📊 Found ${tables.rows.length} tables:`);
    tables.rows.forEach(table => {
      console.log(`   - ${table.name}`);
    });

    // Test users table if it exists
    if (tables.rows.some(t => t.name === 'users')) {
      const userCount = await db.execute('SELECT COUNT(*) as count FROM users WHERE isActive = 1');
      console.log(`👥 Active users: ${userCount.rows[0].count}`);
    }

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

if (require.main === module) {
  testTursoConnection();
}

module.exports = { testTursoConnection };
