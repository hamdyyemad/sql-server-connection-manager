import { apiClient } from "./api";
import type { ApiResponse, DatabaseOperationConfig } from "../types/api";

// Screen Management API Service
export const screenManagementApiService = {
  // Screens operations
  addScreen: async (
    config: DatabaseOperationConfig & {
      name: string;
      description?: string;
      isActive?: boolean;
    }
  ): Promise<ApiResponse> => {
    const response = await apiClient.post("/screens/add", {
      ...config,
      name: config.name,
      description: config.description || "",
      isActive: config.isActive !== undefined ? config.isActive : true,
    });
    return response.data;
  },

  updateScreen: async (
    config: DatabaseOperationConfig & {
      id: number;
      name: string;
      description?: string;
      isActive?: boolean;
    }
  ): Promise<ApiResponse> => {
    const response = await apiClient.post("/screens/update", {
      ...config,
      id: config.id,
      name: config.name,
      description: config.description || "",
      isActive: config.isActive !== undefined ? config.isActive : true,
    });
    return response.data;
  },

  deleteScreen: async (
    config: DatabaseOperationConfig & { id: number }
  ): Promise<ApiResponse> => {
    const response = await apiClient.post("/screens/delete", {
      ...config,
      id: config.id,
    });
    return response.data;
  },

  // Actions operations
  addAction: async (
    config: DatabaseOperationConfig & {
      name: string;
      description?: string;
      isActive?: boolean;
    }
  ): Promise<ApiResponse> => {
    const response = await apiClient.post("/actions/add", {
      ...config,
      name: config.name,
      description: config.description || "",
      isActive: config.isActive !== undefined ? config.isActive : true,
    });
    return response.data;
  },

  updateAction: async (
    config: DatabaseOperationConfig & {
      id: number;
      name: string;
      description?: string;
      isActive?: boolean;
    }
  ): Promise<ApiResponse> => {
    const response = await apiClient.post("/actions/update", {
      ...config,
      id: config.id,
      name: config.name,
      description: config.description || "",
      isActive: config.isActive !== undefined ? config.isActive : true,
    });
    return response.data;
  },

  deleteAction: async (
    config: DatabaseOperationConfig & { id: number }
  ): Promise<ApiResponse> => {
    const response = await apiClient.post("/actions/delete", {
      ...config,
      id: config.id,
    });
    return response.data;
  },

  // User Claims operations
  addUserClaim: async (
    config: DatabaseOperationConfig & {
      userId: string;
      claimType: string;
      claimValue: string;
    }
  ): Promise<ApiResponse> => {
    const response = await apiClient.post("/user-claims/add", {
      ...config,
      userId: config.userId,
      claimType: config.claimType,
      claimValue: config.claimValue,
    });
    return response.data;
  },

  updateUserClaim: async (
    config: DatabaseOperationConfig & {
      id: number;
      userId: string;
      claimType: string;
      claimValue: string;
    }
  ): Promise<ApiResponse> => {
    const response = await apiClient.post("/user-claims/update", {
      ...config,
      id: config.id,
      userId: config.userId,
      claimType: config.claimType,
      claimValue: config.claimValue,
    });
    return response.data;
  },

  deleteUserClaim: async (
    config: DatabaseOperationConfig & { id: number }
  ): Promise<ApiResponse> => {
    const response = await apiClient.post("/user-claims/delete", {
      ...config,
      id: config.id,
    });
    return response.data;
  },
};
