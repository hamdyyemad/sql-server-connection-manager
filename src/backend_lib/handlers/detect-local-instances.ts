// Import the regular mssql driver
let sql: any;

export interface LocalInstanceInfo {
  connectionString: string;
  serverName: string;
  instanceName?: string;
  edition?: string;
  version?: string;
}

// Function to create test login if it doesn't exist
async function ensureTestLogin(pool: any, server: string) {
  try {
    console.log(`🔧 Debug: Checking if testuser login exists on ${server}...`);
    
    // Check if testuser login exists
    const checkResult = await pool.request().query(`
      SELECT name, type_desc, is_disabled 
      FROM sys.server_principals 
      WHERE name = 'testuser'
    `);
    
    if (checkResult.recordset.length === 0) {
      console.log(`🔧 Debug: Creating testuser login on ${server}...`);
      
      // Create the login
      await pool.request().query(`
        CREATE LOGIN testuser WITH PASSWORD = 'Admin'
      `);
      
      // Add to sysadmin role for testing
      await pool.request().query(`
        ALTER SERVER ROLE sysadmin ADD MEMBER testuser
      `);
      
      console.log(`✅ Debug: Successfully created testuser login on ${server}`);
    } else {
      console.log(`✅ Debug: testuser login already exists on ${server}`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Debug: Failed to create/check testuser login on ${server}:`, error);
    return false;
  }
}

export async function detectLocalInstances(): Promise<LocalInstanceInfo[]> {
  console.log('🔍 Debug: Starting local SQL Server instance detection');
  
  // Import the regular mssql driver
  try {
    sql = await import('mssql');
    console.log('🔐 Debug: Using regular mssql driver for local instance detection');
  } catch (importError) {
    console.error('❌ Debug: Failed to import mssql driver:', importError);
    return [];
  }
  
  const commonInstances = [
    'localhost',
    'localhost\\SQLEXPRESS',
    'localhost\\MSSQLSERVER',
    '127.0.0.1',
    '127.0.0.1\\SQLEXPRESS',
    '127.0.0.1\\MSSQLSERVER',
    '(local)',
    '(local)\\SQLEXPRESS',
    '(local)\\MSSQLSERVER'
  ];
  
  const detectedInstances: LocalInstanceInfo[] = [];
  
  for (const instance of commonInstances) {
    try {
      console.log(`🔍 Debug: Trying to connect to ${instance}`);
      
      // Use SQL Authentication with testuser for all instances
      const config = {
        server: instance,
        user: 'testuser',
        password: 'Admin',
        database: 'master',
        options: { 
          trustServerCertificate: true,
          enableArithAbort: true,
          encrypt: false,
          connectTimeout: 3000
        }
      };
      
      try {
        console.log(`🔧 Debug: Trying config for ${instance}:`, JSON.stringify(config, null, 2));
        
        // Try a simple connection first
        console.log(`🔗 Debug: Creating connection pool for ${instance}...`);
        const pool = new sql.ConnectionPool(config);
        
        console.log(`🔗 Debug: Attempting to connect to ${instance}...`);
        await pool.connect();
        console.log(`✅ Debug: Successfully connected to ${instance}`);
        
        // Ensure testuser login exists
        await ensureTestLogin(pool, instance);
        
        // Get instance information
        console.log(`🔍 Debug: Querying server properties for ${instance}...`);
        const result = await pool.request().query(`
          SELECT 
            SERVERPROPERTY('ServerName') as ServerName,
            SERVERPROPERTY('InstanceName') as InstanceName,
            SERVERPROPERTY('Edition') as Edition,
            SERVERPROPERTY('ProductVersion') as ProductVersion
        `);
        
        console.log(`📊 Debug: Query result:`, result.recordset);
        
        await pool.close();
        console.log(`🔗 Debug: Connection closed for ${instance}`);
        
        const instanceInfo = result.recordset[0];
        const serverName = instanceInfo.ServerName;
        const instanceName = instanceInfo.InstanceName;
        
        // Build the connection string
        const connectionString = instanceName 
          ? `${serverName}\\${instanceName}`
          : serverName;
        
        console.log(`✅ Debug: Successfully detected local instance: ${connectionString}`);
        
        detectedInstances.push({
          connectionString,
          serverName,
          instanceName,
          edition: instanceInfo.Edition,
          version: instanceInfo.ProductVersion
        });
        
        // Found a working instance, no need to try others
        break;
        
      } catch (configError) {
        const configErrorMessage = configError instanceof Error ? configError.message : String(configError);
        console.log(`❌ Debug: Config failed for ${instance}: ${configErrorMessage}`);
        
        // Continue to next instance
      }
      
    } catch (instanceError) {
      const instanceErrorMessage = instanceError instanceof Error ? instanceError.message : String(instanceError);
      console.log(`❌ Debug: Instance ${instance} failed: ${instanceErrorMessage}`);
      // Continue to next instance
    }
  }
  
  console.log(`✅ Debug: Detection complete. Found ${detectedInstances.length} local instances:`, detectedInstances);
  return detectedInstances;
} 