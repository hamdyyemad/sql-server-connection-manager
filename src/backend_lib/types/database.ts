export interface DatabaseConfig {
  server: string;
  user?: string;
  password?: string;
  authenticationType: "windows" | "sql";
  connectionType?: "local" | "remote";
}

export interface ConnectionInfo {
  id?: string;
  server: string;
  user?: string;
  password?: string;
  authenticationType: "windows" | "sql";
  connectionType: "local" | "remote";
  name?: string;
  online: boolean;
}

export interface DatabaseResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface DatabaseListResponse {
  databases: Array<{ name: string }>;
}

export interface TableListResponse {
  tables: Array<{ name: string }>;
}

export interface TableRowsResponse {
  rows: any[];
  columns: string[];
}
