import { ApiError } from "../middleware/error-handler";

const DEFAULT_RETRY_CONFIG = {
  maxRetries: 5,
  initialDelayMs: 500,
  maxDelayMs: 3000,
  factor: 1.5,
};

export async function executeWithRetry(
  pool: any,
  query: string,
  params: Record<string, any> = {},
  retryConfig = DEFAULT_RETRY_CONFIG
) {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      console.log(`Query execution attempt ${attempt}/${retryConfig.maxRetries}`);
      
      // Ensure active connection right before query execution
      await ensureActiveConnection(pool);

      // Create request and execute query in a tight loop to minimize timing issues
      let request;
      let queryResult;
      
      try {
        request = pool.request();
        
        // Add parameters
        for (const [key, value] of Object.entries(params)) {
          request.input(key, value);
        }

        console.log(`Executing query (attempt ${attempt}):`, query);
        queryResult = await request.query(query);
        
        console.log(`Query executed successfully on attempt ${attempt}`);
        return queryResult;
        
      } catch (queryError) {
        const error = queryError as Error;
        
        // If it's a connection error during query execution, try immediate reconnect
        if (isConnectionError(error)) {
          console.log("Connection error during query execution, attempting immediate reconnect...");
          
          try {
            await forceReconnect(pool);
            
            // Retry the query immediately with new connection
            const newRequest = pool.request();
            for (const [key, value] of Object.entries(params)) {
              newRequest.input(key, value);
            }
            
            console.log("Retrying query with fresh connection...");
            queryResult = await newRequest.query(query);
            
            console.log(`Query executed successfully after reconnect on attempt ${attempt}`);
            return queryResult;
            
          } catch (reconnectError) {
            console.error("Immediate reconnect failed:", (reconnectError as Error).message);
            throw error; // Re-throw original error to trigger retry loop
          }
        } else {
          throw error; // Non-connection error, re-throw immediately
        }
      }
      
    } catch (error) {
      lastError = error as Error;
      console.error(`Query attempt ${attempt} failed:`, lastError.message);

      // Check if this is a connection error that we should retry
      if (!isConnectionError(lastError) || attempt === retryConfig.maxRetries) {
        console.error(`Not retrying: isConnectionError=${isConnectionError(lastError)}, finalAttempt=${attempt === retryConfig.maxRetries}`);
        break;
      }

      // For connection errors, attempt force reconnect before next retry
      try {
        console.log("Attempting force reconnect before next retry...");
        await forceReconnect(pool);
        console.log("Force reconnect successful");
      } catch (reconnectError) {
        console.error("Force reconnect failed:", (reconnectError as Error).message);
        // Continue to retry anyway - maybe connection will recover
      }

      const delay = Math.min(
        retryConfig.initialDelayMs * Math.pow(retryConfig.factor, attempt - 1),
        retryConfig.maxDelayMs
      );

      console.log(`Retrying in ${delay}ms... (attempt ${attempt + 1}/${retryConfig.maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw createAppropriateError(lastError);
}

export async function ensureActiveConnection(pool: any) {
  if (!pool) {
    throw new Error("Database pool is null or undefined");
  }

  try {
    console.log(`Pool state check: connected=${pool.connected}, state=${pool.state}`);
    
    // Check multiple connection states that indicate a closed connection
    const isPoolDisconnected = 
      pool.connected === false || 
      pool.state === "closed" || 
      pool.state === "disconnected" ||
      !pool.connected;

    if (isPoolDisconnected) {
      console.log("Pool is disconnected, attempting to connect...");
      try {
        await pool.connect();
        console.log("Pool connected successfully");
      } catch (connectError) {
        console.error("Failed to connect pool:", (connectError as Error).message);
        throw new Error(`Failed to establish connection: ${(connectError as Error).message}`);
      }
    }

    // Always verify connection with a test query to catch stale connections
    try {
      console.log("Verifying connection with test query...");
      const testRequest = pool.request();
      await testRequest.query("SELECT 1 as test");
      console.log("Connection verified successfully");
    } catch (testError) {
      const error = testError as Error;
      console.error("Connection test failed:", error.message);
      
      if (isConnectionError(error)) {
        console.log("Connection test failed due to connection error, forcing reconnect...");
        
        try {
          await forceReconnect(pool);
          
          // Verify the new connection
          console.log("Testing reconnected pool...");
          const retestRequest = pool.request();
          await retestRequest.query("SELECT 1 as test");
          console.log("Reconnection successful and verified");
        } catch (reconnectError) {
          console.error("Force reconnect failed:", (reconnectError as Error).message);
          throw new Error(`Failed to restore connection: ${(reconnectError as Error).message}`);
        }
      } else {
        // Non-connection error during test query
        console.error("Non-connection error during test query:", error.message);
        throw error;
      }
    }
  } catch (error) {
    console.error("Connection establishment failed:", error);
    throw new Error(`Connection not ready: ${(error as Error).message}`);
  }
}

async function forceReconnect(pool: any) {
  if (!pool) {
    throw new Error("Cannot reconnect: pool is null or undefined");
  }

  try {
    console.log(`Force reconnect initiated. Current state: connected=${pool.connected}, state=${pool.state}`);
    
    // Always attempt to close existing connection, regardless of reported state
    try {
      console.log("Attempting to close existing connection...");
      await pool.close();
      console.log("Connection closed successfully");
    } catch (closeError) {
      console.log("Error closing connection (this is often expected):", (closeError as Error).message);
      // Continue anyway - this is often expected when connection is already closed
    }

    // Wait a moment for cleanup
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verify pool state before reconnecting
    console.log(`Pool state after close: connected=${pool.connected}, state=${pool.state}`);

    // Establish new connection with retry
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;
    
    while (reconnectAttempts < maxReconnectAttempts) {
      try {
        reconnectAttempts++;
        console.log(`Establishing new connection (attempt ${reconnectAttempts}/${maxReconnectAttempts})...`);
        
        await pool.connect();
        
        console.log(`Reconnect attempt ${reconnectAttempts} successful. New state: connected=${pool.connected}, state=${pool.state}`);
        
        // Verify the new connection works
        const testRequest = pool.request();
        await testRequest.query("SELECT 1 as reconnect_test");
        
        console.log("Force reconnect successful and verified");
        return;
        
      } catch (connectError) {
        console.error(`Reconnect attempt ${reconnectAttempts} failed:`, (connectError as Error).message);
        
        if (reconnectAttempts >= maxReconnectAttempts) {
          throw connectError;
        }
        
        // Wait before next attempt
        const retryDelay = 1000 * reconnectAttempts;
        console.log(`Waiting ${retryDelay}ms before next reconnect attempt...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
    
  } catch (error) {
    console.error("Force reconnect failed completely:", error);
    throw new Error(`Failed to reconnect after multiple attempts: ${(error as Error).message}`);
  }
}

function isConnectionError(error: Error): boolean {
  const connectionErrors = [
    "Connection not yet open",
    "Connection closed",
    "Connection is closed",
    "Connection is closed.",
    "Connection timed out",
    "Connection refused",
    "Connection reset",
    "Connection is not open",
    "Connection not ready",
    "ConnectionError",
    "Connection lost",
    "Connection broken",
    "Connection aborted",
    "Connection failed",
    "Pool is closed",
    "Pool is destroyed",
    "Socket closed",
    "Socket hang up",
    "ECONNRESET",
    "ETIMEDOUT",
    "ENOTFOUND",
    "ECONNREFUSED",
    "EPIPE",
    "EHOSTUNREACH",
    "ENETUNREACH",
    "Request failed",
    "Invalid TDS stream",
  ];

  const errorMessage = error.message.toLowerCase();
  const errorName = error.name?.toLowerCase() || "";
  
  return connectionErrors.some((msg) => 
    errorMessage.includes(msg.toLowerCase()) || 
    errorName.includes("connection") || 
    errorName.includes("timeout")
  );
}

function createAppropriateError(error: Error | null) {
  if (!error) {
    return ApiError.internal("Unknown database error");
  }

  if (isConnectionError(error)) {
    return ApiError.internal(
      "Database connection failed after multiple retries"
    );
  }

  return ApiError.badRequest(`Database query failed: ${error.message}`);
}
