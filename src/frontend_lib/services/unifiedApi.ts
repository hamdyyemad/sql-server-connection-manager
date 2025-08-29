import { databaseApiService } from "./databaseApi";
import { userManagementApiService } from "./userManagementApi";
import { systemApiService } from "./systemApi";
import { screenManagementApiService } from "./screenManagementApi";

// Unified API service that combines all services
export const apiService = {
  // System operations
  ...systemApiService,

  // Database operations
  ...databaseApiService,

  // User management operations
  ...userManagementApiService,

  // Screen management operations
  ...screenManagementApiService,
};

// Export individual services for specific use cases
export { databaseApiService } from "./databaseApi";
export { userManagementApiService } from "./userManagementApi";
export { systemApiService } from "./systemApi";
export { screenManagementApiService } from "./screenManagementApi";
