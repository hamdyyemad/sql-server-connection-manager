import { apiClient } from "./api";
import type {
  ApiResponse,
  DatabaseOperationConfig,
  TableOperationConfig,
  TableRowsOperationConfig,
} from "../types/api";

// Database operations
export const databaseApiService = {
  // Test database connection
  testConnection: (config: DatabaseOperationConfig): Promise<ApiResponse> => {
    console.log("🔍 Debug: testConnection called with config:", {
      ...config,
      password: config.password ? "***" : undefined,
    });
    return apiClient.post("/test-connection", config, { timeout: 180000 }); // 3 minutes for database connections
  },

  // Ping database connection (lightweight health check)
  pingConnection: (config: DatabaseOperationConfig): Promise<ApiResponse> => {
    console.log("🔍 Debug: pingConnection called with config:", {
      ...config,
      password: config.password ? "***" : undefined,
    });
    return apiClient.post("/ping", config, { timeout: 30000 }); // 30 seconds for ping
  },

  // List databases
  listDatabases: (config: DatabaseOperationConfig): Promise<ApiResponse> => {
    return apiClient.post("/list-databases", config, { timeout: 120000 }); // 2 minutes
  },

  // List tables in a database
  listTables: (config: TableOperationConfig): Promise<ApiResponse> => {
    return apiClient.post("/list-tables", config, { timeout: 120000 }); // 2 minutes
  },

  // Get table rows
  getTableRows: (config: TableRowsOperationConfig): Promise<ApiResponse> => {
    return apiClient.post("/get-table-rows", config, { timeout: 180000 }); // 3 minutes for data retrieval
  },

  // Get last operations
  getLastOperations: (
    config: DatabaseOperationConfig & {
      page?: number;
      limit?: number;
      search?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<ApiResponse> => {
    return apiClient.post("/get-last-operations", config, { timeout: 180000 }); // 3 minutes for operations retrieval
  },
};
