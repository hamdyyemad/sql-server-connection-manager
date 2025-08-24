const sql = require('mssql');

// Database configuration
const config = {
  server: 'localhost',
  user: 'testuser',
  password: 'Admin',
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    encrypt: false,
    connectTimeout: 30000,
  },
};

async function setupDashboardDatabase() {
  let pool;
  
  try {
    console.log('🔗 Connecting to SQL Server...');
    pool = await sql.connect(config);
    console.log('✅ Connected to SQL Server successfully!');
    
    // Create tables if they don't exist
    console.log('📋 Creating tables...');
    
    // Create employee table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='employee' AND xtype='U')
      CREATE TABLE employee (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(100),
        department NVARCHAR(50),
        hire_date DATE,
        status NVARCHAR(20) DEFAULT 'Active'
      )
    `);
    console.log('✅ Employee table ready');
    
    // Create screens table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='screens' AND xtype='U')
      CREATE TABLE screens (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        description NVARCHAR(255),
        status NVARCHAR(20) DEFAULT 'Active',
        created_date DATETIME DEFAULT GETDATE()
      )
    `);
    console.log('✅ Screens table ready');
    
    // Create actions table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='actions' AND xtype='U')
      CREATE TABLE actions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        action_type NVARCHAR(50) NOT NULL,
        description NVARCHAR(255),
        created_date DATETIME DEFAULT GETDATE()
      )
    `);
    console.log('✅ Actions table ready');
    
    // Create employees_actions table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='employees_actions' AND xtype='U')
      CREATE TABLE employees_actions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        employee_id INT,
        action_id INT,
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (employee_id) REFERENCES employee(id),
        FOREIGN KEY (action_id) REFERENCES actions(id)
      )
    `);
    console.log('✅ Employees_actions table ready');
    
    // Check if data already exists
    const employeeCount = await pool.request().query('SELECT COUNT(*) as count FROM employee');
    const screenCount = await pool.request().query('SELECT COUNT(*) as count FROM screens');
    const actionCount = await pool.request().query('SELECT COUNT(*) as count FROM actions');
    
    if (employeeCount.recordset[0].count === 0) {
      console.log('📊 Inserting sample data...');
      
      // Insert sample employees
      await pool.request().query(`
        INSERT INTO employee (name, email, department, hire_date, status) VALUES
        ('John Smith', 'john.smith@company.com', 'IT', '2023-01-15', 'Active'),
        ('Sarah Johnson', 'sarah.johnson@company.com', 'HR', '2023-02-20', 'Active'),
        ('Mike Davis', 'mike.davis@company.com', 'Sales', '2023-03-10', 'Active'),
        ('Lisa Wilson', 'lisa.wilson@company.com', 'Marketing', '2023-04-05', 'Active'),
        ('David Brown', 'david.brown@company.com', 'IT', '2023-05-12', 'Active'),
        ('Emma Taylor', 'emma.taylor@company.com', 'Finance', '2023-06-18', 'Active'),
        ('James Anderson', 'james.anderson@company.com', 'Sales', '2023-07-22', 'Active'),
        ('Maria Garcia', 'maria.garcia@company.com', 'HR', '2023-08-30', 'Active'),
        ('Robert Martinez', 'robert.martinez@company.com', 'IT', '2023-09-14', 'Active'),
        ('Jennifer Lee', 'jennifer.lee@company.com', 'Marketing', '2023-10-08', 'Active'),
        ('Christopher White', 'christopher.white@company.com', 'Finance', '2023-11-25', 'Active'),
        ('Amanda Clark', 'amanda.clark@company.com', 'Sales', '2023-12-03', 'Active'),
        ('Daniel Lewis', 'daniel.lewis@company.com', 'IT', '2024-01-10', 'Active'),
        ('Nicole Rodriguez', 'nicole.rodriguez@company.com', 'HR', '2024-02-15', 'Active'),
        ('Kevin Hall', 'kevin.hall@company.com', 'Marketing', '2024-03-20', 'Active'),
        ('Rachel Young', 'rachel.young@company.com', 'Finance', '2024-04-12', 'Active'),
        ('Steven King', 'steven.king@company.com', 'Sales', '2024-05-18', 'Active'),
        ('Michelle Scott', 'michelle.scott@company.com', 'IT', '2024-06-25', 'Active'),
        ('Jason Green', 'jason.green@company.com', 'HR', '2024-07-30', 'Active'),
        ('Stephanie Baker', 'stephanie.baker@company.com', 'Marketing', '2024-08-05', 'Active'),
        ('Ryan Adams', 'ryan.adams@company.com', 'Finance', '2024-09-10', 'Active'),
        ('Laura Nelson', 'laura.nelson@company.com', 'Sales', '2024-10-15', 'Active'),
        ('Thomas Carter', 'thomas.carter@company.com', 'IT', '2024-11-20', 'Active'),
        ('Jessica Mitchell', 'jessica.mitchell@company.com', 'HR', '2024-12-25', 'Active'),
        ('Andrew Perez', 'andrew.perez@company.com', 'Marketing', '2025-01-30', 'Active')
      `);
      console.log('✅ Sample employees inserted');
    }
    
    if (screenCount.recordset[0].count === 0) {
      // Insert sample screens
      await pool.request().query(`
        INSERT INTO screens (name, description, status) VALUES
        ('Dashboard', 'Main dashboard screen', 'Active'),
        ('User Management', 'User administration screen', 'Active'),
        ('Reports', 'Reporting and analytics screen', 'Active'),
        ('Settings', 'Application settings screen', 'Active'),
        ('Profile', 'User profile management', 'Active'),
        ('Notifications', 'System notifications screen', 'Active'),
        ('Help', 'Help and support screen', 'Active'),
        ('Admin Panel', 'Administrative panel', 'Active'),
        ('Analytics', 'Data analytics screen', 'Active'),
        ('Calendar', 'Calendar and scheduling', 'Active'),
        ('Messages', 'Internal messaging system', 'Inactive'),
        ('Archive', 'Archived data screen', 'Maintenance')
      `);
      console.log('✅ Sample screens inserted');
    }
    
    if (actionCount.recordset[0].count === 0) {
      // Insert sample actions
      await pool.request().query(`
        INSERT INTO actions (name, action_type, description) VALUES
        ('User Login', 'Login', 'User logged into the system'),
        ('User Logout', 'Logout', 'User logged out of the system'),
        ('Create Record', 'Create', 'New record created'),
        ('Update Record', 'Update', 'Existing record updated'),
        ('Delete Record', 'Delete', 'Record deleted'),
        ('View Report', 'View', 'Report viewed'),
        ('Export Data', 'Export', 'Data exported'),
        ('Import Data', 'Import', 'Data imported'),
        ('Send Message', 'Send', 'Message sent'),
        ('Download File', 'Download', 'File downloaded'),
        ('Upload File', 'Upload', 'File uploaded'),
        ('Generate Report', 'Generate', 'Report generated'),
        ('Backup Data', 'Backup', 'Data backup created'),
        ('Restore Data', 'Restore', 'Data restored'),
        ('Configure Settings', 'Configure', 'Settings configured')
      `);
      console.log('✅ Sample actions inserted');
    }
    
    // Insert sample employee actions (with realistic dates)
    const employeeActionCount = await pool.request().query('SELECT COUNT(*) as count FROM employees_actions');
    if (employeeActionCount.recordset[0].count === 0) {
      console.log('📈 Inserting sample employee actions...');
      
      // Get employee and action IDs
      const employees = await pool.request().query('SELECT id FROM employee');
      const actions = await pool.request().query('SELECT id FROM actions');
      
      const employeeIds = employees.recordset.map(row => row.id);
      const actionIds = actions.recordset.map(row => row.id);
      
      // Generate sample employee actions for the last 6 months
      const sampleActions = [];
      const now = new Date();
      
      for (let i = 0; i < 200; i++) {
        const randomEmployeeId = employeeIds[Math.floor(Math.random() * employeeIds.length)];
        const randomActionId = actionIds[Math.floor(Math.random() * actionIds.length)];
        
        // Random date within last 6 months
        const randomDate = new Date(now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000);
        const dateString = randomDate.toISOString().slice(0, 19).replace('T', ' ');
        
        sampleActions.push(`(${randomEmployeeId}, ${randomActionId}, '${dateString}')`);
      }
      
      // Insert in batches
      const batchSize = 50;
      for (let i = 0; i < sampleActions.length; i += batchSize) {
        const batch = sampleActions.slice(i, i + batchSize);
        await pool.request().query(`
          INSERT INTO employees_actions (employee_id, action_id, created_at) VALUES
          ${batch.join(',\n')}
        `);
      }
      
      console.log('✅ Sample employee actions inserted');
    }
    
    // Show final counts
    const finalCounts = await pool.request().query(`
      SELECT 
        (SELECT COUNT(*) FROM employee) as employee_count,
        (SELECT COUNT(*) FROM screens) as screen_count,
        (SELECT COUNT(*) FROM actions) as action_count,
        (SELECT COUNT(*) FROM employees_actions) as employee_action_count
    `);
    
    const counts = finalCounts.recordset[0];
    console.log('\n📊 Database Setup Complete!');
    console.log(`✅ Employees: ${counts.employee_count}`);
    console.log(`✅ Screens: ${counts.screen_count}`);
    console.log(`✅ Actions: ${counts.action_count}`);
    console.log(`✅ Employee Actions: ${counts.employee_action_count}`);
    
    console.log('\n🎉 Dashboard database is ready!');
    console.log('You can now access the dashboard with real data.');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    
    if (error.code === 'ELOGIN') {
      console.log('\n💡 Possible solutions:');
      console.log('1. Make sure SQL Server is running');
      console.log('2. Check if the testuser login exists');
      console.log('3. Verify the password is correct');
      console.log('4. Try running as administrator');
    } else if (error.code === 'ESOCKET') {
      console.log('\n💡 SQL Server is not running or not accessible');
      console.log('1. Start SQL Server service');
      console.log('2. Check if SQL Server is installed');
      console.log('3. Verify the server name is correct');
    }
  } finally {
    if (pool) {
      await pool.close();
      console.log('🔗 Database connection closed');
    }
  }
}

// Run the setup
if (require.main === module) {
  setupDashboardDatabase().catch(console.error);
}

module.exports = { setupDashboardDatabase };
