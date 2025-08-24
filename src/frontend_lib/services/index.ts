// Export main API client and error handling
export { apiClient } from "./api";
export {
  handleApiError,
  createEnhancedError,
  isErrorType,
  getUserFriendlyMessage,
  type ErrorHandler,
  ErrorType,
} from "./errorHandler";

// Export unified API service (backward compatibility)
export { apiService } from "./unifiedApi";

// Export individual services
export { databaseApiService } from "./databaseApi";
export { userManagementApiService } from "./userManagementApi";
export { systemApiService } from "./systemApi";

// Export types
export type {
  ApiResponse,
  DatabaseOperationConfig,
  UserRoleOperation,
  MultipleUserRoleOperation,
  PasswordOperation,
  DatabaseQueryOperation,
  TableOperationConfig,
  TableRowsOperationConfig,
  UserOperationConfig,
  UserRoleOperationConfig,
  MultipleUserRoleOperationConfig,
  PasswordOperationConfig,
} from "../types/api";

// Re-export axios types for convenience
export type { AxiosInstance, AxiosResponse, AxiosError } from "./api";
