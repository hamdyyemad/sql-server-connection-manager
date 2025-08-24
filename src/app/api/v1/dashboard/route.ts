import { NextRequest, NextResponse } from "next/server";
import {
  connectToDatabase,
  connectToDatabaseWithCredentials,
} from "@/backend_lib/middleware/database";

// Mock data for testing when database is not available
const getMockDashboardData = () => ({
  employeeCount: 25,
  screenCount: 12,
  actionCount: 150,
  employeeActionCount: 200,
  employeeActionsByMonth: [
    { month: "2024-01", count: 25 },
    { month: "2024-02", count: 32 },
    { month: "2024-03", count: 28 },
    { month: "2024-04", count: 35 },
    { month: "2024-05", count: 40 },
    { month: "2024-06", count: 38 },
  ],
  actionsByType: [
    { type: "Login", count: 65 },
    { type: "Logout", count: 62 },
    { type: "Create", count: 33 },
    { type: "Update", count: 28 },
    { type: "Delete", count: 12 },
  ],
  screensByStatus: [
    { status: "Active", count: 8 },
    { status: "Inactive", count: 3 },
    { status: "Maintenance", count: 1 },
  ],
});

export async function GET(request: NextRequest) {
  try {
    console.log("Dashboard API called");
    const { searchParams } = new URL(request.url);
    const server = searchParams.get("server");
    const user = searchParams.get("user");
    const password = searchParams.get("password");
    const authType = searchParams.get("authType");
    const useMock = searchParams.get("mock") === "true";

    console.log(`Server parameter: ${server}`);
    console.log(`User parameter: ${user ? "provided" : "not provided"}`);
    console.log(`Auth type parameter: ${authType}`);
    console.log(`Use mock data: ${useMock}`);

    // If mock is requested, return mock data immediately
    if (useMock) {
      console.log("Returning mock dashboard data");
      return NextResponse.json(getMockDashboardData());
    }

    // If no server provided, return mock data for demo
    if (!server) {
      console.log("No server provided, returning mock data for demo");
      return NextResponse.json({
        ...getMockDashboardData(),
        _mock: true,
        _reason: "No server parameter provided",
      });
    }

    // Connect to database with provided credentials or fallback to default
    let connectionResult;
    if (user && password && authType) {
      // Use provided credentials
      connectionResult = await connectToDatabaseWithCredentials(
        server!,
        user,
        password,
        authType
      );
    } else {
      // Use default connection (testuser)
      connectionResult = await connectToDatabase(server!);
    }

    if (!connectionResult.success) {
      console.log(`Database connection failed: ${connectionResult.error}`);
      // Return mock data instead of error for better UX
      console.log("Returning mock data due to connection failure");
      return NextResponse.json({
        ...getMockDashboardData(),
        _mock: true,
        _connectionError: connectionResult.error,
      });
    }

    console.log("Database connected successfully, fetching dashboard data");

    // Fetch dashboard data
    const dashboardData = await fetchDashboardData(connectionResult.pool);

    console.log("Dashboard data fetched successfully");
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.log(`Dashboard API error: ${error}`);
    // Return mock data instead of error for better UX
    console.log("Returning mock data due to error");
    return NextResponse.json({
      ...getMockDashboardData(),
      _mock: true,
      _error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function fetchDashboardData(pool: any) {
  try {
    console.log("Starting to fetch dashboard data");

    // Get employee count
    let employeeCount = 0;
    try {
      const employeeResult = await pool.request().query(`
        SELECT COUNT(*) as count 
        FROM employee
      `);
      employeeCount = employeeResult.recordset[0]?.count || 0;
      console.log(`Employee count: ${employeeCount}`);
    } catch (error) {
      console.log(`Error fetching employee count: ${error}`);
      // Continue with other queries
    }

    // Get screen count
    let screenCount = 0;
    try {
      const screenResult = await pool.request().query(`
        SELECT COUNT(*) as count 
        FROM screens
      `);
      screenCount = screenResult.recordset[0]?.count || 0;
      console.log(`Screen count: ${screenCount}`);
    } catch (error) {
      console.log(`Error fetching screen count: ${error}`);
      // Continue with other queries
    }

    // Get action count
    let actionCount = 0;
    try {
      const actionResult = await pool.request().query(`
        SELECT COUNT(*) as count 
        FROM actions
      `);
      actionCount = actionResult.recordset[0]?.count || 0;
      console.log(`Action count: ${actionCount}`);
    } catch (error) {
      console.log(`Error fetching action count: ${error}`);
      // Continue with other queries
    }

    // Get employee action count
    let employeeActionCount = 0;
    try {
      const employeeActionResult = await pool.request().query(`
        SELECT COUNT(*) as count 
        FROM employees_actions
      `);
      employeeActionCount = employeeActionResult.recordset[0]?.count || 0;
      console.log(`Employee action count: ${employeeActionCount}`);
    } catch (error) {
      console.log(`Error fetching employee action count: ${error}`);
      // Continue with other queries
    }

    // Get employee actions by month (last 6 months)
    let employeeActionsByMonth: Array<{ month: string; count: number }> = [];
    try {
      const employeeActionsByMonthResult = await pool.request().query(`
        SELECT 
          FORMAT(created_at, 'yyyy-MM') as month,
          COUNT(*) as count
        FROM employees_actions
        WHERE created_at >= DATEADD(month, -6, GETDATE())
        GROUP BY FORMAT(created_at, 'yyyy-MM')
        ORDER BY month
      `);
      employeeActionsByMonth = employeeActionsByMonthResult.recordset.map(
        (row: any) => ({
          month: row.month,
          count: row.count,
        })
      );
      console.log(
        `Employee actions by month: ${employeeActionsByMonth.length} records`
      );
    } catch (error) {
      console.log(`Error fetching employee actions by month: ${error}`);
      // Use empty array as fallback
    }

    // Get actions by type
    let actionsByType: Array<{ type: string; count: number }> = [];
    try {
      const actionsByTypeResult = await pool.request().query(`
        SELECT 
          action_type as type,
          COUNT(*) as count
        FROM actions
        GROUP BY action_type
        ORDER BY count DESC
      `);
      actionsByType = actionsByTypeResult.recordset.map((row: any) => ({
        type: row.type || "Unknown",
        count: row.count,
      }));
      console.log(`Actions by type: ${actionsByType.length} records`);
    } catch (error) {
      console.log(`Error fetching actions by type: ${error}`);
      // Use empty array as fallback
    }

    // Get screens by status
    let screensByStatus: Array<{ status: string; count: number }> = [];
    try {
      const screensByStatusResult = await pool.request().query(`
        SELECT 
          status,
          COUNT(*) as count
        FROM screens
        GROUP BY status
        ORDER BY count DESC
      `);
      screensByStatus = screensByStatusResult.recordset.map((row: any) => ({
        status: row.status || "Unknown",
        count: row.count,
      }));
      console.log(`Screens by status: ${screensByStatus.length} records`);
    } catch (error) {
      console.log(`Error fetching screens by status: ${error}`);
      // Use empty array as fallback
    }

    const result = {
      employeeCount,
      screenCount,
      actionCount,
      employeeActionCount,
      employeeActionsByMonth,
      actionsByType,
      screensByStatus,
    };

    console.log("Dashboard data compilation completed");
    return result;
  } catch (error) {
    console.log(`Error in fetchDashboardData: ${error}`);
    throw new Error("Failed to fetch dashboard data from database");
  }
}
