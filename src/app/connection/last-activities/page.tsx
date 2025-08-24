"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDatabaseConnectionStore } from "../../../frontend_lib/store/useDatabaseConnectionStore";
import { useGetLastOperations } from "../../../frontend_lib/hooks/useApi";
import { useTableFilters } from "../../../frontend_lib/hooks/useTableFilters";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import AuthWrapper from "../../components/AuthWrapper";
import type { ConnectionInfo } from "../../../backend_lib/types/database";

interface DatabaseOperation {
  session_id: number;
  request_id: number;
  start_time: string;
  status: string;
  command: string;
  cpu_time: number;
  total_elapsed_time: number;
  reads: number;
  writes: number;
  logical_reads: number;
  row_count: number;
  wait_type: string;
  wait_time: number;
  wait_resource: string;
  blocking_session_id: number;
  user_name: string;
  host_name: string;
  application_name: string;
  login_name: string;
  database_id: number;
  database_name: string;
  sql_text: string;
  object_name: string;
  schema_name: string;
}

export default function LastActivitiesPage() {
  const router = useRouter();
  const { getCurrentDatabaseConnection } = useDatabaseConnectionStore();
  const [connection, setConnection] = useState<ConnectionInfo | null>(null);
  const [selectedDatabase, setSelectedDatabase] = useState<string>("");
  const [operations, setOperations] = useState<DatabaseOperation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { loading, error, data, getLastOperations } = useGetLastOperations();

  // Search and pagination using our custom hook
  const {
    searchTerm: clientSearchTerm,
    currentPage: clientCurrentPage,
    itemsPerPage: clientItemsPerPage,
    totalItems,
    totalPages,
    paginatedData: paginatedOperations,
    setSearchTerm: setClientSearchTerm,
    setCurrentPage: setClientCurrentPage,
    setItemsPerPage: setClientItemsPerPage,
  } = useTableFilters({
    data: operations,
    searchFields: [
      "sql_text",
      "user_name",
      "host_name",
      "application_name",
      "command",
      "object_name",
      "schema_name",
    ],
  });

  useEffect(() => {
    const currentConnection = getCurrentDatabaseConnection();
    if (currentConnection) {
      setConnection(currentConnection);
      // Try to get database from connection or use a default
      setSelectedDatabase(currentConnection.database || "master");
    } else {
      // Redirect to home if no connection
      router.push("/");
    }
  }, [getCurrentDatabaseConnection, router]);

  useEffect(() => {
    if (connection && selectedDatabase) {
      fetchOperations();
    }
  }, [
    connection,
    selectedDatabase,
    currentPage,
    itemsPerPage,
    searchTerm,
    startDate,
    endDate,
  ]);

  const fetchOperations = async () => {
    if (!connection || !selectedDatabase) return;

    try {
      const config = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        database: selectedDatabase,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      const response = await getLastOperations(config);
      if (response.status === 200 && response.data?.data) {
        setOperations(response.data.data.operations || []);
        // Update pagination from server response
        if (response.data.data.pagination) {
          setCurrentPage(response.data.data.pagination.currentPage);
          setItemsPerPage(response.data.data.pagination.itemsPerPage);
        }
      }
    } catch (error) {
      console.error("Failed to fetch operations:", error);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const formatDuration = (milliseconds: number) => {
    if (milliseconds < 1000) return `${milliseconds}ms`;
    if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(2)}s`;
    return `${(milliseconds / 60000).toFixed(2)}m`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (!connection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            No Connection Found
          </h1>
          <p className="text-gray-400">Please establish a connection first.</p>
        </div>
      </div>
    );
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-950">
        <div className="flex-1 space-y-6 p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white"
              >
                ← Back
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Last Activities</h1>
              <p className="text-gray-400 mt-2">
                Database operations and queries on {connection.server}
              </p>
            </div>
            <div className="flex space-x-3">
              {/* <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back
              </button> */}
              <button
                onClick={fetchOperations}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Search
                </label>
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  placeholder="Search operations..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Database
                </label>
                <input
                  type="text"
                  value={selectedDatabase}
                  onChange={(e) => setSelectedDatabase(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading operations...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
              <p className="text-red-300">Error loading operations: {error}</p>
            </div>
          )}

          {/* Operations Table */}
          {!loading && !error && (
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Command
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Object
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        SQL Query
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {operations.map((operation, index) => (
                      <tr key={index} className="hover:bg-gray-800/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {formatDateTime(operation.start_time)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {operation.user_name || operation.login_name || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              operation.command === "SELECT"
                                ? "bg-green-500/20 text-green-400"
                                : operation.command === "INSERT"
                                ? "bg-blue-500/20 text-blue-400"
                                : operation.command === "UPDATE"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : operation.command === "DELETE"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {operation.command}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {operation.object_name
                            ? `${operation.schema_name || "dbo"}.${
                                operation.object_name
                              }`
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {formatDuration(operation.total_elapsed_time)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              operation.status === "running"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : operation.status === "suspended"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {operation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">
                          <div className="truncate" title={operation.sql_text}>
                            {truncateText(operation.sql_text, 80)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {operations.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    {searchTerm || startDate || endDate
                      ? "No operations match your filters."
                      : "No operations found."}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && operations.length > 0 && (
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(
                  (data?.data?.pagination?.totalItems || operations.length) /
                    itemsPerPage
                )}
                totalItems={
                  data?.data?.pagination?.totalItems || operations.length
                }
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
}
