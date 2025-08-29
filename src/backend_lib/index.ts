// Export middleware
export {
  withDatabase,
  type DatabaseHandler,
  type DatabaseRequest,
} from "./middleware/database";
export {
  createRouteHandler,
  createDatabaseRouteHandler,
  createRegularRouteHandler,
  type RouteHandler,
  type RouteMiddlewareConfig,
} from "./middleware/route-middleware";

// Export error handling
export {
  withErrorHandler,
  withDatabaseErrorHandler,
  ApiError,
  createErrorResponse,
  createSuccessResponse,
  convertDatabaseResponse,
  type ApiResponse,
  type ErrorResponse,
  type SuccessResponse,
} from "./middleware/error-handler";

// Export handlers
export {
  testConnectionHandler,
  listDatabasesHandler,
  listTablesHandler,
  getTableRowsHandler,
  detectLocalInstances,
  getAspNetUsersHandler,
  updateUserRoleHandler,
  updateMultipleUserRolesHandler,
  getUserRolesHandler,
  resetUserPasswordHandler,
  setCustomPasswordHandler,
  getAspNetRolesHandler,
  getLastOperationsHandler,
} from "./handlers";
