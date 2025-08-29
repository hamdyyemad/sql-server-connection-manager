-- Create a test login for SQL Server Authentication
-- Run this script in SQL Server Management Studio or via sqlcmd

-- Create the login
CREATE LOGIN testuser WITH PASSWORD = 'Admin';

-- Add the login to sysadmin role (for testing purposes)
ALTER SERVER ROLE sysadmin ADD MEMBER testuser;

-- Verify the login was created
SELECT name, type_desc, is_disabled 
FROM sys.server_principals 
WHERE name = 'testuser'; 