import { apiClient } from "./api";
import type { ApiResponse } from "../types/api";

// System operations
export const systemApiService = {
  // Test API connectivity
  testApiConnection: (): Promise<ApiResponse> => {
    console.log("🔍 Debug: Testing API connectivity...");
    return apiClient.get("/detect-local-instances", { timeout: 30000 }); // 30 seconds for simple operations
  },

  // Detect local SQL Server instances
  detectLocalInstances: (): Promise<ApiResponse> => {
    return apiClient.get("/detect-local-instances", { timeout: 60000 }); // 1 minute for local detection
  },
};
