// Debug functions are now automatically handled by console override
import { createErrorObject, createSuccessObject } from "../utils/responseUtils";

export default async function loadSqlDriver(): Promise<{
  success: boolean;
  error: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sql?: any;
}> {
  try {
    const sql = await import("mssql");
    console.log("Imported regular mssql driver");

    return {
      ...createSuccessObject(),
      sql,
    };
  } catch (importError) {
    console.error("Failed to import mssql driver:", importError);
    return createErrorObject("Failed to load SQL Server driver");
  }
}
