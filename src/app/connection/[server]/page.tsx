"use client";
import { useParams, useRouter } from "next/navigation";
import { useConnectionsStore } from "../../../frontend_lib/store/useConnectionsStore";
import { useDatabaseConnectionStore } from "../../../frontend_lib/store/useDatabaseConnectionStore";
import { useEffect, useState } from "react";
import {
  useTestConnection,
  usePingConnection,
} from "../../../frontend_lib/hooks/useApi";
import type { ConnectionInfo } from "../../../backend_lib/types/database";
import ConnectionKeeper from "../../components/ConnectionKeeper";
import AuthWrapper from "../../components/AuthWrapper";

export default function ConnectionPage() {
  const params = useParams();
  const router = useRouter();
  const server = decodeURIComponent(params.server as string);
  const { getCurrentConnection, connections } = useConnectionsStore();
  const { getCurrentDatabaseConnection, setCurrentDatabaseConnection } =
    useDatabaseConnectionStore();
  const [connection, setConnection] = useState<ConnectionInfo | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "online" | "offline" | "testing"
  >("offline");
  const [hasInitialTestRun, setHasInitialTestRun] = useState(false);
  const {
    loading: testLoading,
    error: testError,
    data: testData,
    testConnection,
  } = useTestConnection();
  const {
    loading: pingLoading,
    error: pingError,
    data: pingData,
    pingConnection,
  } = usePingConnection();

  useEffect(() => {
    // First try to get from database connection store (more specific)
    let currentConnection = getCurrentDatabaseConnection();

    // If no database connection or it doesn't match the server in URL, try general store
    if (!currentConnection || currentConnection.server !== server) {
      currentConnection = getCurrentConnection();

      // If current connection doesn't match the server in URL, find it by server name
      if (!currentConnection || currentConnection.server !== server) {
        const foundConnection = connections.find(
          (conn) => conn.server === server
        );

        // If found, set it as current connection in both stores
        if (foundConnection && foundConnection.id) {
          useConnectionsStore
            .getState()
            .setCurrentConnection(foundConnection.id);
          setCurrentDatabaseConnection(foundConnection);
          currentConnection = foundConnection;
        }
      } else if (currentConnection) {
        // If we found a matching connection in general store, also set it in database store
        setCurrentDatabaseConnection(currentConnection);
      }
    }

    setConnection(currentConnection || null);
    // Reset initial test flag when connection changes
    setHasInitialTestRun(false);
  }, [
    server,
    connections,
    getCurrentConnection,
    getCurrentDatabaseConnection,
    setCurrentDatabaseConnection,
  ]);

  // Monitor test connection results and update status
  useEffect(() => {
    if (testLoading) {
      setConnectionStatus("testing");
    } else if (testError) {
      setConnectionStatus("offline");
    } else if (testData) {
      setConnectionStatus("online");
    }
  }, [testLoading, testError, testData]);

  // Monitor ping connection results and update status
  useEffect(() => {
    if (pingLoading) {
      setConnectionStatus("testing");
    } else if (pingError) {
      setConnectionStatus("offline");
    } else if (pingData) {
      setConnectionStatus("online");
    }
  }, [pingLoading, pingError, pingData]);

  // Perform initial connection test when connection is loaded
  useEffect(() => {
    if (connection && !hasInitialTestRun) {
      const performInitialTest = async () => {
        try {
          const config = {
            server: connection.server,
            user: connection.user,
            password: connection.password,
            authenticationType: connection.authenticationType,
          };

          setConnectionStatus("testing");
          setHasInitialTestRun(true);

          // Small delay to prevent race conditions
          await new Promise((resolve) => setTimeout(resolve, 100));
          await pingConnection(config);
        } catch (error) {
          console.log("Initial connection test failed:", error);
          setConnectionStatus("offline");
        }
      };

      performInitialTest();
    }
  }, [connection, hasInitialTestRun, pingConnection]);

  const handleTestConnection = async () => {
    if (!connection) return;

    try {
      const config = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
      };

      await testConnection(config);
    } catch (error) {
      console.error("Test connection failed:", error);
    }
  };

  // const handlePingConnection = async () => {
  //   if (!connection) return;

  //   try {
  //     const config = {
  //       server: connection.server,
  //       user: connection.user,
  //       password: connection.password,
  //       authenticationType: connection.authenticationType,
  //     };

  //     await pingConnection(config);
  //   } catch (error) {
  //     console.error("Ping connection failed:", error);
  //   }
  // };

  if (!connection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Connection Not Found
          </h1>
          <p className="text-gray-400">{`The connection to "{server}" could not be found.`}</p>
        </div>
      </div>
    );
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen overflow-hidden">
        {/* Connection keeper to maintain connection */}
        <ConnectionKeeper
          enabled={!!connection}
          intervalMs={30000}
          onStatusChange={(status) => setConnectionStatus(status)}
        />

        <div className="flex-1 space-y-6 pt-0 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {connection.name || connection.server}
              </h1>
              <p className="text-gray-400 mt-2">
                SQL Server Connection Details
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  connectionStatus === "online"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : connectionStatus === "testing"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {connectionStatus === "online"
                  ? "Online"
                  : connectionStatus === "testing"
                  ? "Testing..."
                  : "Offline"}
              </span>
            </div>
          </div>

          {/* Show offline message when connection is offline */}
          {connectionStatus === "offline" && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-red-400 rounded-full"></div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Connection Offline
                </h2>
                <p className="text-gray-400 mb-6">
                  The connection to{" "}
                  <span className="text-white font-medium">
                    {connection.server}
                  </span>{" "}
                  is currently unavailable.
                </p>
                <button
                  onClick={handleTestConnection}
                  disabled={testLoading}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testLoading ? "Testing..." : "Try to Reconnect"}
                </button>
                {testError && (
                  <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
                    <p className="text-red-300 text-sm">{testError}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Show connection details only when online or testing */}
          {(connectionStatus === "online" ||
            connectionStatus === "testing") && (
            <>
              {/* Connection Details */}
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                {/* Basic Info */}
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Connection Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">
                        Server Name
                      </label>
                      <p className="text-white mt-1">{connection.server}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">
                        Connection Type
                      </label>
                      <p className="text-white mt-1 capitalize">
                        {connection.connectionType}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">
                        Authentication
                      </label>
                      <p className="text-white mt-1">
                        {connection.authenticationType === "windows"
                          ? "Windows Authentication"
                          : "SQL Server Authentication"}
                      </p>
                    </div>
                    {connection.user && (
                      <div>
                        <label className="text-sm font-medium text-gray-400">
                          Username
                        </label>
                        <p className="text-white mt-1">{connection.user}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm flex flex-col justify-between">
                  <div className="space-y-4 mt-2">
                    <h2 className="text-xl font-semibold text-white mb-0.5">
                      Status & Actions
                    </h2>
                    <label className="text-sm font-medium text-gray-400">
                      Connection Status
                    </label>
                    <div>
                      <div className="flex items-center space-x-2 mt-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            connectionStatus === "online"
                              ? "bg-green-400"
                              : connectionStatus === "testing"
                              ? "bg-yellow-400 animate-pulse"
                              : "bg-red-400"
                          }`}
                        ></div>
                        <span className="text-white">
                          {connectionStatus === "online"
                            ? "Connected"
                            : connectionStatus === "testing"
                            ? "Testing..."
                            : "Disconnected"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-8">
                      <button
                        onClick={handleTestConnection}
                        disabled={testLoading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {testLoading ? "Testing..." : "Test Connection"}
                      </button>
                      {testError && (
                        <div className="mt-3 p-3 bg-red-900/50 border border-red-500 rounded-lg">
                          <p className="text-red-300 text-sm">{testError}</p>
                        </div>
                      )}
                      {(pingError || pingData) && (
                        <div className="mb-1.5 mt-2.5">
                          {pingData && (
                            <div className="p-3 bg-green-900/50 border border-green-500 rounded-lg">
                              <p className="text-green-300 text-sm">
                                ✅ Ping successful at{" "}
                                {new Date().toLocaleTimeString()}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* <div className="">
                      <button className="w-full bg-gray-700 text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                        View Databases
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Quick Actions
                </h2>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  <button
                    onClick={() => router.push("/connection/screen-management")}
                    className="p-4 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-800/70 transition-colors text-left backdrop-blur-sm"
                  >
                    <div className="text-green-400 text-lg mb-2">🖥️</div>
                    <h3 className="text-white font-medium">
                      Screen Management
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Manage screen accessibility
                    </p>
                  </button>

                  <button
                    onClick={() => router.push("/connection/user-management")}
                    className="p-4 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-800/70 transition-colors text-left backdrop-blur-sm"
                  >
                    <div className="text-yellow-400 text-lg mb-2">👥</div>
                    <h3 className="text-white font-medium">User Management</h3>
                    <p className="text-gray-400 text-sm">
                      Manage AspNetUsers & Roles
                    </p>
                  </button>

                  <button
                    onClick={() => router.push("/connection/last-activities")}
                    className="p-4 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-800/70 transition-colors text-left backdrop-blur-sm"
                  >
                    <div className="text-indigo-400 text-lg mb-2">📊</div>
                    <h3 className="text-white font-medium">Last Activities</h3>
                    <p className="text-gray-400 text-sm">
                      View recent database operations
                    </p>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
}
