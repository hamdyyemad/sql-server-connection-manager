export { testConnectionHandler } from "./test-connection";
export { listDatabasesHandler } from "./list-databases";
export { listTablesHandler } from "./list-tables";
export { getTableRowsHandler } from "./get-table-rows";
export { detectLocalInstances } from "./detect-local-instances";
export { getAspNetUsersHandler } from "./get-aspnet-users";
export { updateUserRoleHandler } from "./update-user-role";
export { updateMultipleUserRolesHandler } from "./update-multiple-user-roles";
export { getUserRolesHandler } from "./get-user-roles";
export { resetUserPasswordHandler } from "./reset-user-password";
export { setCustomPasswordHandler } from "./set-custom-password";
export { getAspNetRolesHandler } from "./get-aspnet-roles";

// Screen Management handlers
export {
  addScreenHandler,
  updateScreenHandler,
  deleteScreenHandler,
} from "./screen-management";
export {
  addActionHandler,
  updateActionHandler,
  deleteActionHandler,
} from "./screen-management";
export {
  addUserClaimHandler,
  updateUserClaimHandler,
  deleteUserClaimHandler,
} from "./screen-management";

// Database Operations handlers
export { getLastOperationsHandler } from "./get-last-operations";


