import type { DatabaseHandler } from '../middleware/database';

export const testConnectionHandler: DatabaseHandler = async (req, pool) => {
  // 🔍 Backend Debugging - Handler entry point
  // console.log('🔍 Debug: testConnectionHandler called');
  // console.log('📊 Request config:', req.dbConfig);
  // console.log('🔗 Pool connected:', pool.connected);
  
  try {
    // The connection is already established by the middleware
    // Test a simple query to verify connection
    let version = 'Unknown';
    
    try {
      const testResult = await pool.request().query('SELECT @@VERSION as version');
      version = testResult.recordset[0]?.version || 'Unknown';
    } catch (queryError) {
      console.warn('⚠️ Debug: Query test failed, but connection is established:', queryError);
    }
    
    // console.log('✅ Debug: Connection test successful');
    
    return {
      success: true,
      data: {
        message: `Successfully connected to ${req.dbConfig.server} using ${req.dbConfig.authenticationType} authentication`,
        serverInfo: {
          server: req.dbConfig.server,
          authType: req.dbConfig.authenticationType,
          version: version
        }
      }
    };
  } catch (error) {
    // 🔍 Backend Debugging - Error handling
    console.error('❌ Debug: Connection test failed:', error);
    console.error('❌ Debug: Error details:', {
      message: (error as Error).message,
      stack: (error as Error).stack
    });
    
    throw error; // Re-throw to let middleware handle it
  }
}; 