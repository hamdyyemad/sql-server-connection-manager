-- Dashboard Database Setup Script
-- Run this script in SQL Server Management Studio or sqlcmd

-- Create employee table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='employee' AND xtype='U')
CREATE TABLE employee (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100),
    department NVARCHAR(50),
    hire_date DATE,
    status NVARCHAR(20) DEFAULT 'Active'
);

-- Create screens table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='screens' AND xtype='U')
CREATE TABLE screens (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(255),
    status NVARCHAR(20) DEFAULT 'Active',
    created_date DATETIME DEFAULT GETDATE()
);

-- Create actions table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='actions' AND xtype='U')
CREATE TABLE actions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    action_type NVARCHAR(50) NOT NULL,
    description NVARCHAR(255),
    created_date DATETIME DEFAULT GETDATE()
);

-- Create employees_actions table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='employees_actions' AND xtype='U')
CREATE TABLE employees_actions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT,
    action_id INT,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES employee(id),
    FOREIGN KEY (action_id) REFERENCES actions(id)
);

-- Insert sample employees (only if table is empty)
IF (SELECT COUNT(*) FROM employee) = 0
BEGIN
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
    ('Andrew Perez', 'andrew.perez@company.com', 'Marketing', '2025-01-30', 'Active');
    
    PRINT 'Sample employees inserted successfully';
END

-- Insert sample screens (only if table is empty)
IF (SELECT COUNT(*) FROM screens) = 0
BEGIN
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
    ('Archive', 'Archived data screen', 'Maintenance');
    
    PRINT 'Sample screens inserted successfully';
END

-- Insert sample actions (only if table is empty)
IF (SELECT COUNT(*) FROM actions) = 0
BEGIN
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
    ('Configure Settings', 'Configure', 'Settings configured');
    
    PRINT 'Sample actions inserted successfully';
END

-- Insert sample employee actions (only if table is empty)
IF (SELECT COUNT(*) FROM employees_actions) = 0
BEGIN
    -- Generate sample employee actions for the last 6 months
    DECLARE @i INT = 0;
    DECLARE @employee_id INT;
    DECLARE @action_id INT;
    DECLARE @random_date DATETIME;
    
    WHILE @i < 200
    BEGIN
        -- Get random employee and action
        SELECT @employee_id = id FROM employee ORDER BY NEWID() OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;
        SELECT @action_id = id FROM actions ORDER BY NEWID() OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;
        
        -- Random date within last 6 months
        SET @random_date = DATEADD(DAY, -ABS(CHECKSUM(NEWID())) % 180, GETDATE());
        
        INSERT INTO employees_actions (employee_id, action_id, created_at)
        VALUES (@employee_id, @action_id, @random_date);
        
        SET @i = @i + 1;
    END
    
    PRINT 'Sample employee actions inserted successfully';
END

-- Show final counts
SELECT 
    (SELECT COUNT(*) FROM employee) as employee_count,
    (SELECT COUNT(*) FROM screens) as screen_count,
    (SELECT COUNT(*) FROM actions) as action_count,
    (SELECT COUNT(*) FROM employees_actions) as employee_action_count;

PRINT 'Dashboard database setup completed successfully!';
