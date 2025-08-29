// Debug functions are now automatically handled by console override
import { createErrorObject, createSuccessObject } from "../utils/responseUtils";

export interface DatabaseConfig {
  server: string;
  user: string;
  password: string;
  options: {
    trustServerCertificate: boolean;
    enableArithAbort: boolean;
    encrypt: boolean;
    connectTimeout: number;
  };
}

export interface ConnectionParams {
  server: string;
  user?: string;
  password?: string;
  authenticationType: "windows" | "sql";
}

export function validateConnectionParams(params: ConnectionParams): {
  success: boolean;
  error: string;
} {
  const { server, authenticationType } = params;

  if (!server) {
    console.error("Server name missing");
    return createErrorObject("Server name is required");
  }

  if (!authenticationType) {
    console.error("Authentication type missing");
    return createErrorObject(
      "Authentication type is required (windows or sql)"
    );
  }

      console.log("Authentication type:", authenticationType);
    console.log("Server:", server);

  return createSuccessObject();
}

// Validate authentication type
export function validateAuthenticationType(authenticationType: string): {
  success: boolean;
  error: string;
} {
  if (authenticationType !== "windows" && authenticationType !== "sql") {
    console.error(
      "Invalid Authentication Type (Windows or SQL only are allowed)."
    );
    return createErrorObject(
      "Invalid Authentication Type (Windows or SQL only are allowed)."
    );
  }
  return createSuccessObject();
}
