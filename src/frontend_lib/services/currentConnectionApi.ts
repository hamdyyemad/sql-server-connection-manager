import { apiClient } from "./api";
import { useConnectionsStore } from "../store/useConnectionsStore";
import { useDatabaseConnectionStore } from "../store/useDatabaseConnectionStore";
import type {
  ApiResponse,
  DatabaseOperationConfig,
  TableOperationConfig,
  TableRowsOperationConfig,
} from "../types/api";

// API service that uses the current active connection
export const currentConnectionApiService = {
  // Get the current connection configuration
  getCurrentConnectionConfig: (): DatabaseOperationConfig | null => {
    // First try to get from the database connection store (more specific)
    const currentDatabaseConnection = useDatabaseConnectionStore
      .getState()
      .getCurrentDatabaseConnection();

    if (currentDatabaseConnection) {
      console.log("🔍 Debug: Using database connection store for API call");
      return {
        server: currentDatabaseConnection.server,
        user: currentDatabaseConnection.user,
        password: currentDatabaseConnection.password,
        authenticationType: currentDatabaseConnection.authenticationType,
      };
    }

    // Fallback to the general connections store
    const currentConnection = useConnectionsStore
      .getState()
      .getCurrentConnection();
    if (!currentConnection) {
      console.warn("No current connection selected");
      return null;
    }

    console.log("🔍 Debug: Using general connections store for API call");
    return {
      server: currentConnection.server,
      user: currentConnection.user,
      password: currentConnection.password,
      authenticationType: currentConnection.authenticationType,
    };
  },

  // Test current database connection
  testConnection: async (): Promise<ApiResponse> => {
    const config = currentConnectionApiService.getCurrentConnectionConfig();
    if (!config) {
      return {
        success: false,
        error: "No current connection selected",
      };
    }

    console.log("🔍 Debug: testConnection called with current connection:", {
      ...config,
      password: config.password ? "***" : undefined,
    });

    const response = await apiClient.post("/test-connection", config, {
      timeout: 180000,
    });
    return response.data;
  },

  // Ping current database connection (lightweight health check)
  pingConnection: async (): Promise<ApiResponse> => {
    const config = currentConnectionApiService.getCurrentConnectionConfig();
    if (!config) {
      return {
        success: false,
        error: "No current connection selected",
      };
    }

    console.log("🔍 Debug: pingConnection called with current connection:", {
      ...config,
      password: config.password ? "***" : undefined,
    });

    const response = await apiClient.post("/ping", config, {
      timeout: 30000, // 30 seconds for ping
    });
    return response.data;
  },

  // List databases using current connection
  listDatabases: async (): Promise<ApiResponse> => {
    const config = currentConnectionApiService.getCurrentConnectionConfig();
    if (!config) {
      return {
        success: false,
        error: "No current connection selected",
      };
    }

    console.log("🔍 Debug: listDatabases called with config:", {
      ...config,
      password: config.password ? "***" : undefined,
    });

    const response = await apiClient.post("/list-databases", config, {
      timeout: 120000,
    });
    console.log("🔍 Debug: listDatabases response:", response);
    return response.data;
  },

  // List tables in a database using current connection
  listTables: async (database: string): Promise<ApiResponse> => {
    const config = currentConnectionApiService.getCurrentConnectionConfig();
    if (!config) {
      return {
        success: false,
        error: "No current connection selected",
      };
    }

    const tableConfig: TableOperationConfig = {
      ...config,
      database,
    };

    const response = await apiClient.post("/list-tables", tableConfig, {
      timeout: 120000,
    });
    return response.data;
  },

  // Get table rows using current connection
  getTableRows: async (
    database: string,
    table: string,
    limit?: number,
    offset?: number
  ): Promise<ApiResponse> => {
    const config = currentConnectionApiService.getCurrentConnectionConfig();
    if (!config) {
      return {
        success: false,
        error: "No current connection selected",
      };
    }

    const tableRowsConfig: TableRowsOperationConfig = {
      ...config,
      database,
      table,
      limit,
      offset,
    };

    const response = await apiClient.post("/get-table-rows", tableRowsConfig, {
      timeout: 180000,
    });
    return response.data;
  },

  // User management operations using current connection
  getUsers: async (database: string): Promise<ApiResponse> => {
    const config = currentConnectionApiService.getCurrentConnectionConfig();
    if (!config) {
      return {
        success: false,
        error: "No current connection selected",
      };
    }

    const userConfig = {
      ...config,
      database,
    };

    const response = await apiClient.post("/get-aspnet-users", userConfig, {
      timeout: 120000,
    });
    return response.data;
  },

  getRoles: async (database: string): Promise<ApiResponse> => {
    const config = currentConnectionApiService.getCurrentConnectionConfig();
    if (!config) {
      return {
        success: false,
        error: "No current connection selected",
      };
    }

    const roleConfig = {
      ...config,
      database,
    };

    const response = await apiClient.post("/get-aspnet-roles", roleConfig, {
      timeout: 120000,
    });
    return response.data;
  },

  getUserRoles: async (
    database: string,
    userId: string
  ): Promise<ApiResponse> => {
    const config = currentConnectionApiService.getCurrentConnectionConfig();
    if (!config) {
      return {
        success: false,
        error: "No current connection selected",
      };
    }

    const userRoleConfig = {
      ...config,
      database,
      userId,
    };

    const response = await apiClient.post("/get-user-roles", userRoleConfig, {
      timeout: 120000,
    });
    return response.data;
  },

  updateUserRole: async (
    database: string,
    userId: string,
    roleId: string,
    action: "add" | "remove"
  ): Promise<ApiResponse> => {
    const config = currentConnectionApiService.getCurrentConnectionConfig();
    if (!config) {
      return {
        success: false,
        error: "No current connection selected",
      };
    }

    const updateConfig = {
      ...config,
      database,
      userId,
      roleId,
      action,
    };

    const response = await apiClient.post("/update-user-role", updateConfig, {
      timeout: 120000,
    });
    return response.data;
  },

  updateMultipleUserRoles: async (
    database: string,
    updates: Array<{ userId: string; roleId: string; action: "add" | "remove" }>
  ): Promise<ApiResponse> => {
    const config = currentConnectionApiService.getCurrentConnectionConfig();
    if (!config) {
      return {
        success: false,
        error: "No current connection selected",
      };
    }

    const updateConfig = {
      ...config,
      database,
      updates,
    };

    const response = await apiClient.post(
      "/update-multiple-user-roles",
      updateConfig,
      {
        timeout: 120000,
      }
    );
    return response.data;
  },

  resetUserPassword: async (
    database: string,
    userId: string,
    newPassword: string
  ): Promise<ApiResponse> => {
    const config = currentConnectionApiService.getCurrentConnectionConfig();
    if (!config) {
      return {
        success: false,
        error: "No current connection selected",
      };
    }

    const passwordConfig = {
      ...config,
      database,
      userId,
      newPassword,
    };

    const response = await apiClient.post(
      "/reset-user-password",
      passwordConfig,
      {
        timeout: 120000,
      }
    );
    return response.data;
  },

  setCustomPassword: async (
    database: string,
    userId: string,
    newPassword: string
  ): Promise<ApiResponse> => {
    const config = currentConnectionApiService.getCurrentConnectionConfig();
    if (!config) {
      return {
        success: false,
        error: "No current connection selected",
      };
    }

    const passwordConfig = {
      ...config,
      database,
      userId,
      newPassword,
    };

    const response = await apiClient.post(
      "/set-custom-password",
      passwordConfig,
      {
        timeout: 120000,
      }
    );
    return response.data;
  },
};
