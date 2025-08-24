"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConnectionsStore } from "../../../frontend_lib/store/useConnectionsStore";
import { useDatabaseConnectionStore } from "../../../frontend_lib/store/useDatabaseConnectionStore";
import DatabaseStep from "../../components/(screen-management)/DatabaseStep";
import ScreensStep from "../../components/(screen-management)/ScreensStep";
import ActionsStep from "../../components/(screen-management)/ActionsStep";
import UserAccessStep from "../../components/(screen-management)/UserAccessStep";
import AuthWrapper from "../../components/AuthWrapper";

export default function ScreenManagementPage() {
  const router = useRouter();
  const { getCurrentConnection } = useConnectionsStore();
  const { getCurrentDatabaseConnection } = useDatabaseConnectionStore();
  const [selectedDatabase, setSelectedDatabase] = useState<string>("");
  const [step, setStep] = useState<
    "database" | "screens" | "actions" | "user-access"
  >("database");

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
    setStep("screens");
  };

  const handleChangeDatabase = () => {
    setSelectedDatabase("");
    setStep("database");
  };

  const handleStepChange = (newStep: "screens" | "actions" | "user-access") => {
    setStep(newStep);
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
            accessing screen management.
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
            <h1 className="text-3xl font-bold text-white">Screen Management</h1>
            <p className="text-gray-400 mt-2">
              Manage screens, actions, and user access for{" "}
              {String(connection.name || connection.server)}
            </p>
          </div>

          {step === "database" && (
            <DatabaseStep
              connection={connection}
              onDatabaseSelected={handleDatabaseSelected}
            />
          )}

          {/* Step Navigation - Only show after database is selected */}
          {selectedDatabase && step !== "database" && (
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex space-x-4">
                <button
                  onClick={() => handleStepChange("screens")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    step === "screens"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Screens
                </button>
                <button
                  onClick={() => handleStepChange("actions")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    step === "actions"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Actions
                </button>
                <button
                  onClick={() => handleStepChange("user-access")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    step === "user-access"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Manage User Access
                </button>
              </div>
            </div>
          )}

          {step === "screens" && selectedDatabase && (
            <ScreensStep
              selectedDatabase={selectedDatabase}
              connection={connection}
              onChangeDatabase={handleChangeDatabase}
            />
          )}

          {step === "actions" && selectedDatabase && (
            <ActionsStep
              selectedDatabase={selectedDatabase}
              connection={connection}
              onChangeDatabase={handleChangeDatabase}
            />
          )}

          {step === "user-access" && selectedDatabase && (
            <UserAccessStep
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
