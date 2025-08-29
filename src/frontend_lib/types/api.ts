// API service types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// Database operation types
export interface DatabaseOperationConfig {
  server: string;
  user?: string;
  password?: string;
  authenticationType: "windows" | "sql";
}

// User management operation types
export interface UserRoleOperation {
  userId: string;
  roleId: string;
  action: "add" | "remove";
}

export interface MultipleUserRoleOperation {
  updates: Array<UserRoleOperation>;
}

export interface PasswordOperation {
  userId: string;
  newPassword: string;
}

// Database query operation types
export interface DatabaseQueryOperation {
  database: string;
  table?: string;
  limit?: number;
  offset?: number;
}

// Table operation types
export interface TableOperationConfig extends DatabaseOperationConfig {
  database: string;
}

export interface TableRowsOperationConfig
  extends TableOperationConfig,
    DatabaseQueryOperation {
  table: string;
}

// User management operation types
export interface UserOperationConfig extends DatabaseOperationConfig {
  userId: string;
}

export interface UserRoleOperationConfig extends UserOperationConfig {
  roleId: string;
  action: "add" | "remove";
}

export interface MultipleUserRoleOperationConfig
  extends DatabaseOperationConfig {
  updates: Array<UserRoleOperation>;
}

export interface PasswordOperationConfig extends UserOperationConfig {
  newPassword: string;
}
