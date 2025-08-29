"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConnectionsStore } from "../../../frontend_lib/store/useConnectionsStore";
import { useDatabaseConnectionStore } from "../../../frontend_lib/store/useDatabaseConnectionStore";
import DatabaseStep from "../../components/(user-management)/DatabaseStep";
import UsersStep from "../../components/(user-management)/UsersStep";
import AuthWrapper from "../../components/AuthWrapper";

export default function UserManagementPage() {
  const router = useRouter();
  const { getCurrentConnection } = useConnectionsStore();
  const { getCurrentDatabaseConnection } = useDatabaseConnectionStore();
  const [selectedDatabase, setSelectedDatabase] = useState<string>("");
  const [step, setStep] = useState<"database" | "users">("database");

  // First try to get from database connection store (more specific)
  let connection = getCurrentDatabaseConnection();

  // Fallback to general connections store
  if (!connection) {
    connection = getCurrentConnection();
  }

  // Reset to database step when connection changes
  useEffect(() => {
    if (connection) {
      setSelectedDatabase("");
      setStep("database");
    }
  }, [connection]);

  const handleDatabaseSelected = (database: string) => {
    setSelectedDatabase(database);
    setStep("users");
  };

  const handleChangeDatabase = () => {
    setSelectedDatabase("");
    setStep("database");
  };

  if (!connection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            No Active Connection
          </h1>
          <p className="text-gray-400 mb-6">
            Please select a database connection from the main page before
            accessing user management.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mr-3"
            >
              Go to Connections
            </button>
            <button
              onClick={() => router.back()}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Go Back
            </button>
          </div>
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
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 ml-auto rounded-full text-sm font-medium ${
                connection.online
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {connection.online ? "Online" : "Offline"}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-gray-400 mt-2">
              Manage AspNetUsers for{" "}
              {String(connection.name || connection.server)}
            </p>
          </div>

          {step === "database" && (
            <DatabaseStep
              connection={connection}
              onDatabaseSelected={handleDatabaseSelected}
            />
          )}

          {step === "users" && (
            <UsersStep
              selectedDatabase={selectedDatabase}
              connection={connection}
              onChangeDatabase={handleChangeDatabase}
            />
          )}
        </div>
      </div>
    </AuthWrapper>
  );
}
