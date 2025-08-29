# Dashboard Database Setup Guide

## 🎯 **Quick Start Options**

### **Option 1: Use Mock Data (Immediate)**
The dashboard works immediately with mock data. No setup required!

**Access:** `http://localhost:3001/dashboard`

### **Option 2: Set Up Real Database (Recommended)**

## 📋 **Prerequisites**

### **1. SQL Server Installation**
- **SQL Server Express** (Free): [Download here](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **SQL Server Developer** (Free for development): Same link
- **SQL Server Management Studio (SSMS)**: [Download here](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)

### **2. Create Database User**
After installing SQL Server, create a user for the application:

```sql
-- Run in SQL Server Management Studio
USE master;
GO

-- Create login
CREATE LOGIN testuser WITH PASSWORD = 'Admin';
GO

-- Create user
CREATE USER testuser FOR LOGIN testuser;
GO

-- Grant permissions
EXEC sp_addrolemember 'dbcreator', 'testuser';
EXEC sp_addrolemember 'public', 'testuser';
GO
```

## 🚀 **Setup Methods**

### **Method 1: Automated Setup (Recommended)**

1. **Start SQL Server** (if not running)
2. **Run the setup script:**
   ```bash
   node scripts/setup-dashboard-database.js
   ```

### **Method 2: Manual Setup**

1. **Open SQL Server Management Studio**
2. **Connect to your SQL Server instance**
3. **Open the SQL script:** `create-dashboard-tables.sql`
4. **Execute the script**

### **Method 3: Command Line Setup**

```bash
# Using sqlcmd (if installed)
sqlcmd -S localhost -U testuser -P Admin -i create-dashboard-tables.sql
```

## 🔧 **Configuration**

### **Default Connection Settings**
- **Server:** `localhost`
- **User:** `testuser`
- **Password:** `Admin`
- **Authentication:** SQL Server

### **Custom Connection**
You can use custom credentials via URL parameters:
```
http://localhost:3001/dashboard?server=YOUR_SERVER&user=YOUR_USER&password=YOUR_PASSWORD&authType=sql
```

## 📊 **Database Schema**

### **Tables Created**

#### **1. employee**
```sql
CREATE TABLE employee (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100),
    department NVARCHAR(50),
    hire_date DATE,
    status NVARCHAR(20) DEFAULT 'Active'
);
```

#### **2. screens**
```sql
CREATE TABLE screens (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(255),
    status NVARCHAR(20) DEFAULT 'Active',
    created_date DATETIME DEFAULT GETDATE()
);
```

#### **3. actions**
```sql
CREATE TABLE actions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    action_type NVARCHAR(50) NOT NULL,
    description NVARCHAR(255),
    created_date DATETIME DEFAULT GETDATE()
);
```

#### **4. employees_actions**
```sql
CREATE TABLE employees_actions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT,
    action_id INT,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES employee(id),
    FOREIGN KEY (action_id) REFERENCES actions(id)
);
```

## 📈 **Sample Data**

The setup script creates:
- **25 employees** across different departments
- **12 screens** with various statuses
- **15 action types** (Login, Logout, Create, Update, etc.)
- **200 employee actions** with realistic timestamps

## 🧪 **Testing**

### **Test Database Connection**
```bash
node scripts/test-dashboard-connection.js localhost
```

### **Test Dashboard API**
```bash
node scripts/test-dashboard-api.js
```

### **Test Dashboard Page**
Visit: `http://localhost:3001/dashboard-test`

## 🔍 **Troubleshooting**

### **Common Issues**

#### **1. "Could not connect" Error**
- **Solution:** Start SQL Server service
- **Check:** SQL Server Configuration Manager

#### **2. "Login failed" Error**
- **Solution:** Create the testuser login
- **Run:** The SQL commands in Prerequisites section

#### **3. "Access denied" Error**
- **Solution:** Grant proper permissions to testuser
- **Check:** Database roles and permissions

#### **4. "Server not found" Error**
- **Solution:** Verify server name
- **Try:** `localhost`, `localhost\SQLEXPRESS`, `(local)`

### **SQL Server Service**
```powershell
# Check SQL Server service status
Get-Service -Name "*SQL*"

# Start SQL Server service (if stopped)
Start-Service -Name "MSSQLSERVER"
# or for SQL Express
Start-Service -Name "MSSQL$SQLEXPRESS"
```

### **Firewall Issues**
- **Windows Firewall:** Add SQL Server to exceptions
- **Port:** Ensure port 1433 is open
- **Antivirus:** Check if blocking connections

## 📝 **Verification**

After setup, you should see:
- ✅ **25 employees** in the employee count
- ✅ **12 screens** in the screen count  
- ✅ **15 actions** in the action count
- ✅ **200 employee actions** in the employee action count
- ✅ **Charts displaying data** instead of zeros
- ✅ **No "Demo Mode" notification** (unless database is unavailable)

## 🎉 **Success!**

Once the database is set up:
1. **Dashboard shows real data** from your database
2. **Charts display actual statistics**
3. **Data updates in real-time**
4. **No more mock data notifications**

## 📞 **Need Help?**

If you encounter issues:
1. **Check the troubleshooting section above**
2. **Verify SQL Server is running**
3. **Confirm testuser login exists**
4. **Test connection manually in SSMS**
5. **Check the console logs for detailed error messages**
