import type { DatabaseHandler } from "../middleware/database";
import {
  ParameterBinder,
  SQLInjectionPrevention,
} from "../middleware/sql-injection-prevention";

export const getLastOperationsHandler: DatabaseHandler = async (req, pool) => {
  const {
    database,
    page = 1,
    limit = 25,
    search = "",
    startDate,
    endDate,
  } = req.parsedBody;

  console.log(
    `🔍 Debug: getLastOperationsHandler called with database: ${database}, page: ${page}, limit: ${limit}, search: ${search}`
  );

  if (!database) {
    return {
      success: false,
      error: "Database name is required",
    };
  }

  try {
    // Validate database name to prevent SQL injection
    const sqlPrevention = new SQLInjectionPrevention();
    const dbValidation = sqlPrevention.validateIdentifier(database, "database");
    if (!dbValidation.isValid) {
      return {
        success: false,
        error: `Invalid database name: ${dbValidation.error}`,
      };
    }

    const sanitizedDatabase = dbValidation.sanitized;
    const safeLimit = Math.max(
      1,
      Math.min(100, parseInt(limit.toString()) || 25)
    );
    const safePage = Math.max(1, parseInt(page.toString()) || 1);
    const offset = (safePage - 1) * safeLimit;

    // Build the query to get last operations
    let query = `
      SELECT 
        r.session_id,
        r.request_id,
        r.start_time,
        r.status,
        r.command,
        r.cpu_time,
        r.total_elapsed_time,
        r.reads,
        r.writes,
        r.logical_reads,
        r.row_count,
        r.wait_type,
        r.wait_time,
        r.wait_resource,
        r.blocking_session_id,
        r.user_name,
        r.host_name,
        r.application_name,
        r.login_name,
        r.database_id,
        r.statement_start_offset,
        r.statement_end_offset,
        r.plan_handle,
        r.sql_handle,
        r.query_hash,
        r.query_plan_hash,
        r.granted_query_memory,
        r.dop,
        r.parallel_worker_count,
        r.exec_context_id,
        r.task_address,
        r.requested_memory_kb,
        r.granted_memory_kb,
        r.ideal_memory_kb,
        r.used_memory_kb,
        r.max_used_memory_kb,
        r.blocking_exec_context_id,
        r.blocking_task_address,
        r.blocking_sql_handle,
        r.blocking_statement_start_offset,
        r.blocking_statement_end_offset,
        r.blocking_plan_handle,
        r.blocking_query_hash,
        r.blocking_query_plan_hash,
        r.blocking_granted_query_memory,
        r.blocking_dop,
        r.blocking_parallel_worker_count,
        r.blocking_exec_context_id,
        r.blocking_task_address,
        r.blocking_requested_memory_kb,
        r.blocking_granted_memory_kb,
        r.blocking_ideal_memory_kb,
        r.blocking_used_memory_kb,
        r.blocking_max_used_memory_kb,
        r.blocking_wait_type,
        r.blocking_wait_time,
        r.blocking_wait_resource,
        st.text as sql_text,
        DB_NAME(r.database_id) as database_name,
        OBJECT_NAME(st.objectid, r.database_id) as object_name,
        SCHEMA_NAME(st.schemaid, r.database_id) as schema_name
      FROM sys.dm_exec_requests r
      CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) st
      WHERE r.session_id > 50
        AND r.session_id != @@SPID
        AND r.database_id = DB_ID('${sanitizedDatabase}')
    `;

    // Add search filter if provided
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      query += `
        AND (
          LOWER(st.text) LIKE '%${searchLower}%'
          OR LOWER(r.user_name) LIKE '%${searchLower}%'
          OR LOWER(r.host_name) LIKE '%${searchLower}%'
          OR LOWER(r.application_name) LIKE '%${searchLower}%'
          OR LOWER(r.command) LIKE '%${searchLower}%'
        )
      `;
    }

    // Add date filters if provided
    if (startDate) {
      query += ` AND r.start_time >= '${startDate}'`;
    }
    if (endDate) {
      query += ` AND r.start_time <= '${endDate}'`;
    }

    // Add ordering and pagination
    query += `
      ORDER BY r.start_time DESC
      OFFSET ${offset} ROWS
      FETCH NEXT ${safeLimit} ROWS ONLY
    `;

    console.log(`🔍 Debug: Executing query: ${query}`);

    // Execute the query
    const result = await pool.request().query(query);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM sys.dm_exec_requests r
      CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) st
      WHERE r.session_id > 50
        AND r.session_id != @@SPID
        AND r.database_id = DB_ID('${sanitizedDatabase}')
    `;

    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      countQuery += `
        AND (
          LOWER(st.text) LIKE '%${searchLower}%'
          OR LOWER(r.user_name) LIKE '%${searchLower}%'
          OR LOWER(r.host_name) LIKE '%${searchLower}%'
          OR LOWER(r.application_name) LIKE '%${searchLower}%'
          OR LOWER(r.command) LIKE '%${searchLower}%'
        )
      `;
    }

    if (startDate) {
      countQuery += ` AND r.start_time >= '${startDate}'`;
    }
    if (endDate) {
      countQuery += ` AND r.start_time <= '${endDate}'`;
    }

    const countResult = await pool.request().query(countQuery);
    const totalCount = countResult.recordset[0]?.total || 0;

    console.log(
      `✅ Success: Retrieved ${result.recordset.length} operations from database ${sanitizedDatabase} on server: ${req.dbConfig.server}`
    );

    return {
      success: true,
      data: {
        operations: result.recordset,
        pagination: {
          currentPage: safePage,
          totalPages: Math.ceil(totalCount / safeLimit),
          totalItems: totalCount,
          itemsPerPage: safeLimit,
        },
      },
    };
  } catch (error) {
    console.error("❌ Error retrieving last operations:", error);
    console.error("❌ Error details:", {
      database,
      page,
      limit,
      search,
      server: req.dbConfig.server,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorStack: error instanceof Error ? error.stack : undefined,
    });

    return {
      success: false,
      error: `Failed to retrieve last operations: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};
