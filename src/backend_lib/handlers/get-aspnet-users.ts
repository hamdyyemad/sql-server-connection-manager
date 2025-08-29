import type { DatabaseHandler } from "../middleware/database";
import { SQLInjectionPrevention } from "../middleware/sql-injection-prevention";
import { ApiError } from "../middleware/error-handler";
import {
  ensureActiveConnection,
  executeWithRetry,
} from "../utils/database-utils";

export const getAspNetUsersHandler: DatabaseHandler = async (req, pool) => {
  const {
    database,
    page = 1,
    limit = 10,
    search = "",
    sortColumn = "Id",
    sortDirection = "ASC",
  } = req.parsedBody;

  if (!database) {
    throw ApiError.badRequest("Database name is required");
  }

  console.log(`Fetching AspNetUsers from database: ${database}`);

  // Validate database name to prevent SQL injection
  const sqlPrevention = new SQLInjectionPrevention();
  const dbValidation = sqlPrevention.validateIdentifier(database, "database");

  if (!dbValidation.isValid) {
    throw ApiError.badRequest(`Invalid database name: ${dbValidation.error}`);
  }

  // Use the sanitized database name directly in queries
  const sanitizedDatabase = dbValidation.sanitized;

  // Validate pool connection
  if (!pool || pool.state === "closed") {
    throw ApiError.internal("Database connection is not available");
  }

  // First, check if table exists
  const exists = await doesTableExist(sanitizedDatabase, pool);
  if (!exists) {
    throw ApiError.notFound(
      "AspNetUsers table does not exist in the specified database"
    );
  }

  // Check which columns exist in the table
  const columnCheckQuery = `
    SELECT COLUMN_NAME 
    FROM [${sanitizedDatabase}].INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'AspNetUsers';
  `;

  const columnCheckResult = await executeWithRetry(pool, columnCheckQuery);
  const availableColumns = new Set(
    columnCheckResult.recordset.map(
      (row: { COLUMN_NAME: string }) => row.COLUMN_NAME
    )
  );

  // Define all possible columns and filter out those that don't exist
  const allColumns = [
    "Id",
    "UserName",
    "UserName_HR",
    "ChangePass",
    "TypeLogin",
    "LocationId",
  ];

  const existingColumns = allColumns.filter((col) => availableColumns.has(col));

  // Build the SELECT clause with only existing columns
  const selectClause = existingColumns
    .map((col) => `u.[${col}]`)
    .join(",\n      ");

  // Build search condition with direct parameter assignment
  let searchCondition = "";
  let hasSearch = false;

  // if (search.trim()) {
  //   hasSearch = true;
  //   searchCondition = `
  //     WHERE (
  //       u.[Id] LIKE @searchTerm OR
  //       u.[UserName] LIKE @searchTerm OR
  //       u.[UserName_HR] LIKE @searchTerm OR
  //       u.[TypeLogin] LIKE @searchTerm OR
  //       u.[LocationId] LIKE @searchTerm OR
  //       r.[Name] LIKE @searchTerm
  //     )
  //   `;
  // }

  if (search.trim()) {
    hasSearch = true;
    const searchableColumns = existingColumns.filter((col) =>
      ["Id", "UserName", "UserName_HR", "TypeLogin", "LocationId"].includes(col)
    );

    if (searchableColumns.length > 0) {
      searchCondition = `
        WHERE (
          ${searchableColumns
            .map((col) => `u.[${col}] LIKE @searchTerm`)
            .join(" OR\n          ")}
          OR r.[Name] LIKE @searchTerm
        )
      `;
    } else {
      searchCondition = `WHERE r.[Name] LIKE @searchTerm`;
    }
  }

  // Validate sort column - only allow sorting by existing columns or RoleName
  const validSortColumns = [...existingColumns, "RoleName"];
  const safeSortColumn = validSortColumns.includes(sortColumn)
    ? sortColumn
    : "Id";

  const safeSortDirection =
    sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";

  // Combined query: Check table existence and get count in one go
  // const combinedQuery = `
  //   -- Check if AspNetUsers table exists and get count
  //   DECLARE @tableExists INT = 0;
  //   DECLARE @totalCount INT = 0;

  //   -- Check table existence
  //   SELECT @tableExists = COUNT(*)
  //   FROM [${sanitizedDatabase}].INFORMATION_SCHEMA.TABLES
  //   WHERE TABLE_NAME = 'AspNetUsers';

  //   -- If table exists, get the count
  //   IF @tableExists > 0
  //   BEGIN
  //     SELECT @totalCount = COUNT(*)
  //     FROM [${sanitizedDatabase}].[dbo].[AspNetUsers] u
  //     LEFT JOIN [${sanitizedDatabase}].[dbo].[AspNetUserRoles] ur ON u.[Id] = ur.[UserId]
  //     LEFT JOIN [${sanitizedDatabase}].[dbo].[AspNetRoles] r ON ur.[RoleId] = r.[Id]
  //     ${searchCondition};
  //   END

  //   -- Return results
  //   SELECT @tableExists as table_exists, @totalCount as total_count;
  // `;

  // Get total count
  const combinedQuery = `
    SELECT COUNT(*) as total_count
    FROM [${sanitizedDatabase}].[dbo].[AspNetUsers] u
    LEFT JOIN [${sanitizedDatabase}].[dbo].[AspNetUserRoles] ur ON u.[Id] = ur.[UserId]
    LEFT JOIN [${sanitizedDatabase}].[dbo].[AspNetRoles] r ON ur.[RoleId] = r.[Id]
    ${searchCondition}
  `;

  console.log(`Executing combined query:`, combinedQuery);

  // Ensure connection is ready before any queries
  // await ensureActiveConnection(pool);

  const combinedResult = await executeWithRetry(
    pool,
    combinedQuery,
    hasSearch ? { searchTerm: `%${search}%` } : {}
  );

  if (!combinedResult) {
    throw ApiError.notFound("There's no count in the table.");
  }

  const { total_count } = combinedResult.recordset[0];

  if (!total_count) {
    throw ApiError.notFound(`No Data found`);
  }

  const totalCount = total_count;

  // Calculate pagination
  const offset = (page - 1) * limit;
  const totalPages = Math.ceil(totalCount / limit);

  // Get users with their roles (with pagination and sorting) - single query
  // const query = `
  //   SELECT
  //     u.[Id],
  //     u.[UserName],
  //     u.[UserName_HR],
  //     u.[ChangePass],
  //     u.[TypeLogin],
  //     u.[LocationId],
  //     r.[Name] as RoleName,
  //     ur.[RoleId]
  //   FROM [${sanitizedDatabase}].[dbo].[AspNetUsers] u
  //   LEFT JOIN [${sanitizedDatabase}].[dbo].[AspNetUserRoles] ur ON u.[Id] = ur.[UserId]
  //   LEFT JOIN [${sanitizedDatabase}].[dbo].[AspNetRoles] r ON ur.[RoleId] = r.[Id]
  //   ${searchCondition}
  //   ORDER BY ${
  //     safeSortColumn === "RoleName" ? "r.[Name]" : "u.[" + safeSortColumn + "]"
  //   } ${safeSortDirection}
  //   OFFSET @offset ROWS
  //   FETCH NEXT @limit ROWS ONLY
  // `;

  // Main query with dynamic columns
  const query = `
    SELECT 
      ${selectClause},
      r.[Name] as RoleName,
      ur.[RoleId]
    FROM [${sanitizedDatabase}].[dbo].[AspNetUsers] u
    LEFT JOIN [${sanitizedDatabase}].[dbo].[AspNetUserRoles] ur ON u.[Id] = ur.[UserId]
    LEFT JOIN [${sanitizedDatabase}].[dbo].[AspNetRoles] r ON ur.[RoleId] = r.[Id]
    ${searchCondition}
    ORDER BY ${
      safeSortColumn === "RoleName" ? "r.[Name]" : "u.[" + safeSortColumn + "]"
    } ${safeSortDirection}
    OFFSET @offset ROWS
    FETCH NEXT @limit ROWS ONLY
  `;
  console.log(`Executing main query:`, query);

  const result = await executeWithRetry(pool, query, {
    ...(hasSearch ? { searchTerm: `%${search}%` } : {}),
    offset,
    limit,
  });

  console.log(
    `Retrieved ${result.recordset.length} users (page ${page} of ${totalPages}, total: ${totalCount}) from AspNetUsers in database ${sanitizedDatabase} on server: ${req.dbConfig.server}`
  );

  if (result.recordset.length > 0) {
    console.log(`Sample user data:`, result.recordset[0]);
  }

  return {
    success: true,
    data: {
      users: result.recordset,
      columns: [
        "Id",
        "UserName",
        "UserName_HR",
        "ChangePass",
        "TypeLogin",
        "LocationId",
        "RoleName",
      ],
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        limit: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    },
  };
};

async function doesTableExist(
  sanitizedDatabase: string | undefined,
  pool: {
    request: () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (): any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (): any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query: { (arg0: string): any; new (): any };
    };
  }
): Promise<boolean> {
  const tableCheckQuery = `
    SELECT COUNT(*) as table_exists
    FROM [${sanitizedDatabase}].INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_NAME = 'AspNetUsers';
  `;

  try {
    const tableCheckResult = await executeWithRetry(pool, tableCheckQuery);

    if (!tableCheckResult?.recordset?.[0]) {
      throw new Error("Invalid query result structure");
    }
    //
    const tableExists = tableCheckResult.recordset[0].table_exists;
    return Boolean(tableExists);
  } catch (error) {
    console.error(`Error checking table existence: ${(error as Error).message}`);

    // Handle specific SQL errors differently if needed
    if ((error as Error).message.includes("Invalid object name")) {
      return false;
    }

    // Re-throw the error if it's not related to table existence
    throw new Error(
      `Failed to check table existence: ${(error as Error).message}`
    );
  }
}
