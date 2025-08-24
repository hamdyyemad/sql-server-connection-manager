# Dashboard Testing Guide

## Quick Test Steps

### 1. Setup Database Tables
First, ensure your database has the required tables:

```sql
-- Run this in your SQL Server Management Studio
-- or copy the contents of create-dashboard-tables.sql
```

### 2. Test Database Connection
Run the test script to verify connectivity:

```bash
node scripts/test-dashboard-connection.js [your-server-name]
```

### 3. Test Dashboard Access

#### Method 1: Direct Access (Current Issue)
1. Navigate directly to `/dashboard`
2. You should see a connection selector if no connection is active
3. Select a connection to view the dashboard

#### Method 2: Through Connection Flow (Recommended)
1. Go to the home page `/`
2. Create or select a database connection
3. Click the chart icon (third icon) in the sidebar
4. Dashboard should load with data

## Troubleshooting

### Issue: "No connection or authentication token available"

**Cause**: Dashboard accessed directly without active connection context

**Solutions**:
1. **Use Connection Flow**: Go through the home page → select connection → dashboard
2. **Select Connection**: Use the connection selector that appears on the dashboard page
3. **Check Authentication**: Ensure you're logged in and have a valid auth token

### Issue: "Failed to fetch dashboard data"

**Causes**:
- Database connection issues
- Missing tables
- Invalid server parameter

**Solutions**:
1. Run the test script: `node scripts/test-dashboard-connection.js [server]`
2. Check browser console for detailed error messages
3. Verify all required tables exist in your database
4. Ensure the connection is online

### Issue: Charts not displaying

**Causes**:
- No data in tables
- Chart rendering issues

**Solutions**:
1. Check if tables have data: `SELECT COUNT(*) FROM employee;`
2. Run the SQL script to insert sample data
3. Check browser console for JavaScript errors

## Expected Behavior

### With Valid Connection:
- Summary cards show counts
- Charts display data
- Connection status indicator shows online/offline
- Refresh button works

### Without Connection:
- Shows connection selector
- Clear error message
- Option to go to home page

### With No Data:
- Charts show empty state
- Summary cards show 0
- No errors, just empty visualizations

## Debug Information

Check browser console for:
- API request/response logs
- Connection status updates
- Chart rendering errors

Check network tab for:
- Dashboard API calls
- Response status codes
- Response data structure
