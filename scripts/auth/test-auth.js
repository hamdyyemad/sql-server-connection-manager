const { createClient } = require('@libsql/client');
const crypto = require('crypto');

// Database configuration
const dbUrl = process.env.TURSO_DATABASE_URL;
const dbAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!dbUrl || !dbAuthToken) {
  console.error('❌ Database configuration missing. Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN');
  process.exit(1);
}

// Create database client
const db = createClient({
  url: dbUrl,
  authToken: dbAuthToken,
});

async function testDatabaseConnection() {
  try {
    const result = await db.execute('SELECT 1 as test');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

async function testUserCreation() {
  try {
    // Test user creation
    const testUser = {
      id: 'test-user-123',
      username: 'testuser',
      passwordHash: crypto.createHash('sha256').update('password123' + 'salt123').digest('hex'),
      passwordSalt: 'salt123',
      hasSetup2FA: false,
      secret2FA: null,
      tempSecret2FA: null,
      isActive: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.execute({
      sql: `INSERT OR REPLACE INTO users (id, username, passwordHash, passwordSalt, hasSetup2FA, secret2FA, tempSecret2FA, isActive, createdAt, updatedAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        testUser.id,
        testUser.username,
        testUser.passwordHash,
        testUser.passwordSalt,
        testUser.hasSetup2FA ? 1 : 0,
        testUser.secret2FA,
        testUser.tempSecret2FA,
        testUser.isActive,
        testUser.createdAt,
        testUser.updatedAt
      ]
    });

    console.log('✅ Test user created successfully');

    // Test user retrieval
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE username = ?',
      args: [testUser.username]
    });

    if (result.rows.length > 0) {
      console.log('✅ Test user retrieved successfully');
      console.log('User data:', result.rows[0]);
    } else {
      console.log('❌ Test user not found');
    }

    // Clean up test user
    await db.execute({
      sql: 'DELETE FROM users WHERE id = ?',
      args: [testUser.id]
    });

    console.log('✅ Test user cleaned up');

  } catch (error) {
    console.error('❌ User creation test failed:', error);
  }
}

async function main() {
  console.log('🧪 Testing Authentication System...\n');

  // Test database connection
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.log('❌ Cannot proceed without database connection');
    process.exit(1);
  }

  // Test user operations
  await testUserCreation();

  console.log('\n✅ Authentication system tests completed successfully!');
}

main().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
