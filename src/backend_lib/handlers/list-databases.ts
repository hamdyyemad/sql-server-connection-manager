import type { DatabaseHandler } from '../middleware/database';

export const listDatabasesHandler: DatabaseHandler = async (req, pool) => {
  console.log("🔍 Debug: Executing list databases query...");
  
  // Create a request with increased timeout
  const request = pool.request();
  request.timeout = 30000; // 30 seconds timeout
  
  const result = await request.query("SELECT name FROM sys.databases");
  console.log(`✅ Debug: Found ${result.recordset.length} databases on server: ${req.dbConfig.server}`);
  
  return {
    success: true,
    data: {
      databases: result.recordset
    }
  };
}; 