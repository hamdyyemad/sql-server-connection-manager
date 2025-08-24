"use client";
import { useState, useEffect } from "react";
import { useConnectionsStore } from "@/frontend_lib/store/useConnectionsStore";
import { useAuthStore } from "@/frontend_lib/store/useAuthStore";
import { DashboardCharts } from "../components/charts/DashboardCharts";
import ConnectionSelector from "../components/ConnectionSelector";
import { useSearchParams } from "next/navigation";

interface DashboardData {
  employeeCount: number;
  screenCount: number;
  actionCount: number;
  employeeActionCount: number;
  employeeActionsByMonth: Array<{ month: string; count: number }>;
  actionsByType: Array<{ type: string; count: number }>;
  screensByStatus: Array<{ status: string; count: number }>;
  _mock?: boolean;
  _connectionError?: string;
  _error?: string;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getCurrentConnection } = useConnectionsStore();
  const { authToken } = useAuthStore();
  const searchParams = useSearchParams();
  const currentConnection = getCurrentConnection();

  // Get connection parameters from URL
  const serverFromUrl = searchParams.get("server");
  const userFromUrl = searchParams.get("user");
  const passwordFromUrl = searchParams.get("password");
  const authTypeFromUrl = searchParams.get("authType");
  const tokenFromUrl = searchParams.get("token");

  // Use URL parameters if available, otherwise fall back to store
  const server = serverFromUrl || currentConnection?.server;
  const user = userFromUrl || currentConnection?.user;
  const password = passwordFromUrl || currentConnection?.password;
  const authType = authTypeFromUrl || currentConnection?.authenticationType;
  const token = tokenFromUrl || authToken;

  useEffect(() => {
    // Always try to fetch data, even without server parameter
    // The API will handle fallback to mock data
    fetchDashboardData();
  }, [server, user, password, authType, token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      // Build query parameters
      const params = new URLSearchParams();
      if (server) {
        params.append("server", server);
        if (user) params.append("user", user);
        if (password) params.append("password", password);
        if (authType) params.append("authType", authType);
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Only add authorization header if token is available
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`/api/v1/dashboard?${params.toString()}`, {
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch dashboard data");
      }

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Connection Required
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>

          {(error.includes("No database connection") ||
            error.includes("No database server")) && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Please select a database connection to view the dashboard:
              </p>
              <ConnectionSelector />
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={() => (window.location.href = "/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-500 mb-4">No dashboard data available</div>
          <div className="text-sm text-gray-400">
            Please ensure you have a valid database connection and the required
            tables exist.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            {server && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">{server}</span>
              </div>
            )}
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        {/* Mock Data Notification */}
        {data?._mock && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-600 mr-2 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-800">
                  Demo Mode - Sample Data
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  The dashboard is currently showing sample data. To see real
                  data from your database:
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-blue-600">
                    <strong>Option 1:</strong> Install SQL Server and run:{" "}
                    <code className="bg-blue-100 px-1 rounded">
                      node scripts/setup-dashboard-database.js
                    </code>
                  </p>
                  <p className="text-xs text-blue-600">
                    <strong>Option 2:</strong> Use SQL Server Management Studio
                    with:{" "}
                    <code className="bg-blue-100 px-1 rounded">
                      create-dashboard-tables.sql
                    </code>
                  </p>
                  <p className="text-xs text-blue-600">
                    <strong>Option 3:</strong> Connect with custom credentials:{" "}
                    <code className="bg-blue-100 px-1 rounded">
                      /dashboard?server=YOUR_SERVER&user=YOUR_USER&password=YOUR_PASSWORD
                    </code>
                  </p>
                </div>
                <div className="mt-2">
                  <a
                    href="/dashboard-test"
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    View detailed setup guide →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Employees
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {data.employeeCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Screens
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {data.screenCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Actions
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {data.actionCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Employee Actions
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {data.employeeActionCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <DashboardCharts data={data} />

        {/* Recent Activity */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Dashboard loaded successfully
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Data fetched from database
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Charts ready to display
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
