# SQL Server Connection Troubleshooting Guide

## Common Connection Issues

### 1. "Could not connect" Error

**Symptoms:**
```
Database operation failed for server ATLAS-CB38B4CQ0: [Error [ConnectionError]: Failed to connect to ATLAS-CB38B4CQ0:1433 - Could not connect (sequence)]
```

**Possible Causes & Solutions:**

#### A. Server Name Issues
- **Problem**: Incorrect server name
- **Solution**: 
  - Verify the server name is correct
  - Try using IP address instead of hostname
  - Check if you need to include instance name (e.g., `SERVERNAME\INSTANCENAME`)

#### B. SQL Server Not Running
- **Problem**: SQL Server service is stopped
- **Solution**:
  - Open SQL Server Configuration Manager
  - Check if SQL Server service is running
  - Start the service if needed

#### C. Port Issues
- **Problem**: Port 1433 is blocked or SQL Server is using a different port
- **Solution**:
  - Check if SQL Server is listening on port 1433
  - Try connecting with explicit port: `SERVERNAME:1433`
  - Check firewall settings

#### D. Firewall Issues
- **Problem**: Windows Firewall blocking connections
- **Solution**:
  - Add SQL Server to Windows Firewall exceptions
  - Open port 1433 in firewall
  - Check corporate firewall policies

### 2. Authentication Issues

#### SQL Server Authentication
- **Problem**: Invalid username/password
- **Solution**:
  - Verify credentials are correct
  - Check if SQL Server Authentication is enabled
  - Ensure user has access to the server

#### Windows Authentication
- **Problem**: Windows Authentication not working
- **Solution**:
  - Use format: `DOMAIN\username`
  - Ensure Windows account has SQL Server access
  - Check if SQL Server allows Windows Authentication

## Testing Connection

### 1. Using SQL Server Management Studio (SSMS)
Try connecting with SSMS first to verify:
- Server name is correct
- Authentication works
- You have proper permissions

### 2. Using Command Line
```bash
# Test if server is reachable
telnet ATLAS-CB38B4CQ0 1433

# Or using PowerShell
Test-NetConnection -ComputerName ATLAS-CB38B4CQ0 -Port 1433
```

### 3. Check SQL Server Configuration
```sql
-- Check if SQL Server is listening
SELECT @@SERVERNAME as ServerName, 
       SERVERPROPERTY('InstanceName') as InstanceName,
       SERVERPROPERTY('IsClustered') as IsClustered;

-- Check authentication modes
SELECT name, value, value_in_use 
FROM sys.configurations 
WHERE name = 'remote access';
```

## Recommended Settings

### For Development/Testing:
1. **Use SQL Server Authentication** (easier to configure)
2. **Enable TCP/IP** in SQL Server Configuration Manager
3. **Set port to 1433** (default)
4. **Disable Windows Firewall** temporarily for testing

### For Production:
1. **Use Windows Authentication** (more secure)
2. **Configure proper service accounts**
3. **Set up firewall rules** properly
4. **Use SSL/TLS encryption**

## Connection String Examples

### SQL Server Authentication:
```
Server=ATLAS-CB38B4CQ0;Database=master;User Id=youruser;Password=yourpassword;TrustServerCertificate=true;
```

### Windows Authentication:
```
Server=ATLAS-CB38B4CQ0;Database=master;Integrated Security=true;TrustServerCertificate=true;
```

## Getting Help

If you're still having issues:

1. **Check SQL Server Error Logs**:
   - Open SQL Server Management Studio
   - Connect to the server
   - Check Error Logs in Management folder

2. **Enable Detailed Logging**:
   - Add `LogLevel=3` to connection string for detailed logging

3. **Contact Your Database Administrator**:
   - They can help with server configuration
   - They can verify your access permissions 