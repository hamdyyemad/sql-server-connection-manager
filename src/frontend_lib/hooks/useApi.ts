import { useState, useCallback } from "react";
import { apiService, type ApiResponse } from "../services";
import type {
  DatabaseOperationConfig,
  TableOperationConfig,
  TableRowsOperationConfig,
  UserOperationConfig,
  UserRoleOperationConfig,
  MultipleUserRoleOperationConfig,
  PasswordOperationConfig,
} from "../types/api";

// Hook for API calls with loading state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useApiCall<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall();
        // Handle both ApiResponse format and direct data format
        if (response && typeof response === 'object' && 'data' in response) {
          setData(response.data as T);
        } else {
          // Direct data format (like login response)
          setData(response as T);
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    data,
    execute,
    reset: () => {
      setLoading(false);
      setError(null);
      setData(null);
    },
  };
}

// Specific hooks for database operations
export function useTestConnection() {
  const { loading, error, data, execute, reset } = useApiCall();

  const testConnection = useCallback(
    async (config: DatabaseOperationConfig) => {
      return execute(() => apiService.testConnection(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    testConnection,
    reset,
  };
}

export function usePingConnection() {
  const { loading, error, data, execute, reset } = useApiCall();

  const pingConnection = useCallback(
    async (config: DatabaseOperationConfig) => {
      return execute(() => apiService.pingConnection(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    pingConnection,
    reset,
  };
}

export function useListDatabases() {
  const { loading, error, data, execute, reset } = useApiCall();

  const listDatabases = useCallback(
    async (config: DatabaseOperationConfig) => {
      return execute(() => apiService.listDatabases(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    listDatabases,
    reset,
  };
}

export function useListTables() {
  const { loading, error, data, execute, reset } = useApiCall();

  const listTables = useCallback(
    async (config: TableOperationConfig) => {
      return execute(() => apiService.listTables(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    listTables,
    reset,
  };
}

export function useGetTableRows() {
  const { loading, error, data, execute, reset } = useApiCall();

  const getTableRows = useCallback(
    async (config: TableRowsOperationConfig) => {
      return execute(() => apiService.getTableRows(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    getTableRows,
    reset,
  };
}

export function useGetAspNetUsers() {
  const { loading, error, data, execute, reset } = useApiCall();

  const getAspNetUsers = useCallback(
    async (config: DatabaseOperationConfig) => {
      return execute(() => apiService.getAspNetUsers(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    getAspNetUsers,
    reset,
  };
}

export function useGetAspNetRoles() {
  const { loading, error, data, execute, reset } = useApiCall();

  const getAspNetRoles = useCallback(
    async (config: DatabaseOperationConfig) => {
      return execute(() => apiService.getAspNetRoles(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    getAspNetRoles,
    reset,
  };
}

export function useGetUserRoles() {
  const { loading, error, data, execute, reset } = useApiCall();

  const getUserRoles = useCallback(
    async (config: UserOperationConfig) => {
      return execute(() => apiService.getUserRoles(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    getUserRoles,
    reset,
  };
}

export function useUpdateUserRole() {
  const { loading, error, data, execute, reset } = useApiCall();

  const updateUserRole = useCallback(
    async (config: UserRoleOperationConfig) => {
      return execute(() => apiService.updateUserRole(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    updateUserRole,
    reset,
  };
}

export function useUpdateMultipleUserRoles() {
  const { loading, error, data, execute, reset } = useApiCall();

  const updateMultipleUserRoles = useCallback(
    async (config: MultipleUserRoleOperationConfig) => {
      return execute(() => apiService.updateMultipleUserRoles(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    updateMultipleUserRoles,
    reset,
  };
}

export function useResetUserPassword() {
  const { loading, error, data, execute, reset } = useApiCall();

  const resetUserPassword = useCallback(
    async (config: UserOperationConfig) => {
      return execute(() => apiService.resetUserPassword(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    resetUserPassword,
    reset,
  };
}

export function useSetCustomPassword() {
  const { loading, error, data, execute, reset } = useApiCall();

  const setCustomPassword = useCallback(
    async (config: PasswordOperationConfig) => {
      return execute(() => apiService.setCustomPassword(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    setCustomPassword,
    reset,
  };
}

export function useDetectLocalInstances() {
  const { loading, error, data, execute, reset } = useApiCall();

  const detectLocalInstances = useCallback(async () => {
    return execute(() => apiService.detectLocalInstances());
  }, [execute]);

  return {
    loading,
    error,
    data,
    detectLocalInstances,
    reset,
  };
}

// Screen Management hooks
export function useAddScreen() {
  const { loading, error, data, execute, reset } = useApiCall();

  const addScreen = useCallback(
    async (
      config: DatabaseOperationConfig & {
        name: string;
        description?: string;
        isActive?: boolean;
      }
    ) => {
      return execute(() => apiService.addScreen(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    addScreen,
    reset,
  };
}

export function useUpdateScreen() {
  const { loading, error, data, execute, reset } = useApiCall();

  const updateScreen = useCallback(
    async (
      config: DatabaseOperationConfig & {
        id: number;
        name: string;
        description?: string;
        isActive?: boolean;
      }
    ) => {
      return execute(() => apiService.updateScreen(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    updateScreen,
    reset,
  };
}

export function useDeleteScreen() {
  const { loading, error, data, execute, reset } = useApiCall();

  const deleteScreen = useCallback(
    async (config: DatabaseOperationConfig & { id: number }) => {
      return execute(() => apiService.deleteScreen(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    deleteScreen,
    reset,
  };
}

export function useAddAction() {
  const { loading, error, data, execute, reset } = useApiCall();

  const addAction = useCallback(
    async (
      config: DatabaseOperationConfig & {
        name: string;
        description?: string;
        isActive?: boolean;
      }
    ) => {
      return execute(() => apiService.addAction(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    addAction,
    reset,
  };
}

export function useUpdateAction() {
  const { loading, error, data, execute, reset } = useApiCall();

  const updateAction = useCallback(
    async (
      config: DatabaseOperationConfig & {
        id: number;
        name: string;
        description?: string;
        isActive?: boolean;
      }
    ) => {
      return execute(() => apiService.updateAction(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    updateAction,
    reset,
  };
}

export function useDeleteAction() {
  const { loading, error, data, execute, reset } = useApiCall();

  const deleteAction = useCallback(
    async (config: DatabaseOperationConfig & { id: number }) => {
      return execute(() => apiService.deleteAction(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    deleteAction,
    reset,
  };
}

export function useAddUserClaim() {
  const { loading, error, data, execute, reset } = useApiCall();

  const addUserClaim = useCallback(
    async (
      config: DatabaseOperationConfig & {
        userId: string;
        claimType: string;
        claimValue: string;
      }
    ) => {
      return execute(() => apiService.addUserClaim(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    addUserClaim,
    reset,
  };
}

export function useUpdateUserClaim() {
  const { loading, error, data, execute, reset } = useApiCall();

  const updateUserClaim = useCallback(
    async (
      config: DatabaseOperationConfig & {
        id: number;
        userId: string;
        claimType: string;
        claimValue: string;
      }
    ) => {
      return execute(() => apiService.updateUserClaim(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    updateUserClaim,
    reset,
  };
}

export function useDeleteUserClaim() {
  const { loading, error, data, execute, reset } = useApiCall();

  const deleteUserClaim = useCallback(
    async (config: DatabaseOperationConfig & { id: number }) => {
      return execute(() => apiService.deleteUserClaim(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    deleteUserClaim,
    reset,
  };
}

export function useGetLastOperations() {
  const { loading, error, data, execute, reset } = useApiCall();

  const getLastOperations = useCallback(
    async (
      config: DatabaseOperationConfig & {
        page?: number;
        limit?: number;
        search?: string;
        startDate?: string;
        endDate?: string;
      }
    ) => {
      return execute(() => apiService.getLastOperations(config));
    },
    [execute]
  );

  return {
    loading,
    error,
    data,
    getLastOperations,
    reset,
  };
}
