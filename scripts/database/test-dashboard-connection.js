const sql = require('mssql');

async function testDashboardConnection() {
  const config = {
    server: process.argv[2] || 'localhost',
    user: 'testuser',
    password: 'Admin',
    options: {
      trustServerCertificate: true,
      enableArithAbort: true,
      encrypt: false,
      connectTimeout: 30000,
    },
  };

  console.log('Testing dashboard database connection...');
  console.log(`Server: ${config.server}`);

  try {
    // Connect to database
    const pool = await sql.connect(config);
    console.log('✅ Database connection successful');

    // Test table existence and structure
    const tables = ['employee', 'screens', 'actions', 'employees_actions'];
    
    for (const table of tables) {
      try {
        const result = await pool.request().query(`SELECT TOP 1 * FROM ${table}`);
        console.log(`✅ Table '${table}' exists and accessible`);
        
        // Get column information
        const columnsResult = await pool.request().query(`
          SELECT COLUMN_NAME, DATA_TYPE 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_NAME = '${table}'
          ORDER BY ORDINAL_POSITION
        `);
        
        console.log(`   Columns: ${columnsResult.recordset.map(col => `${col.COLUMN_NAME} (${col.DATA_TYPE})`).join(', ')}`);
      } catch (error) {
        console.log(`❌ Table '${table}' error: ${error.message}`);
      }
    }

    // Test dashboard queries
    console.log('\nTesting dashboard queries...');

    // Employee count
    try {
      const employeeResult = await pool.request().query('SELECT COUNT(*) as count FROM employee');
      console.log(`✅ Employee count: ${employeeResult.recordset[0].count}`);
    } catch (error) {
      console.log(`❌ Employee count error: ${error.message}`);
    }

    // Screen count
    try {
      const screenResult = await pool.request().query('SELECT COUNT(*) as count FROM screens');
      console.log(`✅ Screen count: ${screenResult.recordset[0].count}`);
    } catch (error) {
      console.log(`❌ Screen count error: ${error.message}`);
    }

    // Action count
    try {
      const actionResult = await pool.request().query('SELECT COUNT(*) as count FROM actions');
      console.log(`✅ Action count: ${actionResult.recordset[0].count}`);
    } catch (error) {
      console.log(`❌ Action count error: ${error.message}`);
    }

    // Employee action count
    try {
      const employeeActionResult = await pool.request().query('SELECT COUNT(*) as count FROM employees_actions');
      console.log(`✅ Employee action count: ${employeeActionResult.recordset[0].count}`);
    } catch (error) {
      console.log(`❌ Employee action count error: ${error.message}`);
    }

    // Test complex queries
    console.log('\nTesting complex dashboard queries...');

    // Employee actions by month
    try {
      const monthlyResult = await pool.request().query(`
        SELECT 
          FORMAT(created_at, 'yyyy-MM') as month,
          COUNT(*) as count
        FROM employees_actions
        WHERE created_at >= DATEADD(month, -6, GETDATE())
        GROUP BY FORMAT(created_at, 'yyyy-MM')
        ORDER BY month
      `);
      console.log(`✅ Employee actions by month: ${monthlyResult.recordset.length} records`);
      monthlyResult.recordset.forEach(row => {
        console.log(`   ${row.month}: ${row.count}`);
      });
    } catch (error) {
      console.log(`❌ Employee actions by month error: ${error.message}`);
    }

    // Actions by type
    try {
      const typeResult = await pool.request().query(`
        SELECT 
          action_type as type,
          COUNT(*) as count
        FROM actions
        GROUP BY action_type
        ORDER BY count DESC
      `);
      console.log(`✅ Actions by type: ${typeResult.recordset.length} records`);
      typeResult.recordset.forEach(row => {
        console.log(`   ${row.type}: ${row.count}`);
      });
    } catch (error) {
      console.log(`❌ Actions by type error: ${error.message}`);
    }

    // Screens by status
    try {
      const statusResult = await pool.request().query(`
        SELECT 
          status,
          COUNT(*) as count
        FROM screens
        GROUP BY status
        ORDER BY count DESC
      `);
      console.log(`✅ Screens by status: ${statusResult.recordset.length} records`);
      statusResult.recordset.forEach(row => {
        console.log(`   ${row.status}: ${row.count}`);
      });
    } catch (error) {
      console.log(`❌ Screens by status error: ${error.message}`);
    }

    await pool.close();
    console.log('\n✅ Dashboard connection test completed successfully');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testDashboardConnection().catch(console.error);
}

module.exports = { testDashboardConnection };
