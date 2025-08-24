import { apiClient } from "./api";
import type {
  ApiResponse,
  DatabaseOperationConfig,
  UserOperationConfig,
  UserRoleOperationConfig,
  MultipleUserRoleOperationConfig,
  PasswordOperationConfig,
} from "../types/api";

// User management operations
export const userManagementApiService = {
  // Get ASP.NET users
  getAspNetUsers: (config: DatabaseOperationConfig): Promise<ApiResponse> => {
    return apiClient.post("/get-aspnet-users", config, { timeout: 120000 }); // 2 minutes
  },

  // Get ASP.NET roles
  getAspNetRoles: (config: DatabaseOperationConfig): Promise<ApiResponse> => {
    return apiClient.post("/get-aspnet-roles", config, { timeout: 120000 }); // 2 minutes
  },

  // Get user roles
  getUserRoles: (config: UserOperationConfig): Promise<ApiResponse> => {
    return apiClient.post("/get-user-roles", config, { timeout: 120000 }); // 2 minutes
  },

  // Update user role
  updateUserRole: (config: UserRoleOperationConfig): Promise<ApiResponse> => {
    return apiClient.post("/update-user-role", config, { timeout: 120000 }); // 2 minutes
  },

  // Update multiple user roles
  updateMultipleUserRoles: (
    config: MultipleUserRoleOperationConfig
  ): Promise<ApiResponse> => {
    return apiClient.post("/update-multiple-user-roles", config, {
      timeout: 180000,
    }); // 3 minutes for bulk operations
  },

  // Reset user password
  resetUserPassword: (config: UserOperationConfig): Promise<ApiResponse> => {
    return apiClient.post("/reset-user-password", config, { timeout: 120000 }); // 2 minutes
  },

  // Set custom password
  setCustomPassword: (
    config: PasswordOperationConfig
  ): Promise<ApiResponse> => {
    return apiClient.post("/set-custom-password", config, { timeout: 120000 }); // 2 minutes
  },
};
