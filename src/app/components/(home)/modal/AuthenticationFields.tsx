"use client";
import React from "react";
import { useConnectionFormStore } from "@/frontend_lib/store/useConnectionFormStore";

export const AuthenticationFields: React.FC = React.memo(() => {
  const {
    formData,
    handleAuthenticationTypeChange,
    handleUserChange,
    handlePasswordChange
  } = useConnectionFormStore();

  const { connectionType, authenticationType, user, password } = formData;

  return (
    <>
      {/* Authentication Type - Only show for remote connections */}
      {connectionType === "remote" && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Authentication Type
          </label>
          <select
            className="w-full bg-gray-800 border border-gray-600 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={authenticationType}
            onChange={(e) => {
              const newAuthType = e.target.value as "windows" | "sql";
              handleAuthenticationTypeChange(newAuthType);
              console.log("🔍 Debug: Authentication type changed:", newAuthType);
            }}
          >
            <option value="sql">SQL Server Authentication (Recommended)</option>
            <option value="windows">Windows Authentication</option>
          </select>
          {authenticationType === "windows" && (
            <div className="text-sm text-amber-400 bg-amber-900/20 border border-amber-700 p-3 rounded-lg">
              ⚠️ For Windows Authentication, use format: DOMAIN\\username
            </div>
          )}
        </div>
      )}

      {/* Username - Only show for remote connections with SQL auth */}
      {connectionType === "remote" && authenticationType === "sql" && (
        <input
          className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="SQL Username"
          value={user}
          onChange={(e) => handleUserChange(e.target.value)}
          required
        />
      )}

      {/* Password - Only show for SQL authentication */}
      {authenticationType === "sql" && (
        <input
          className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          required
        />
      )}

      {/* Info for local connections */}
      {connectionType === "local" && (
        <div className="text-sm text-blue-300 bg-blue-900/20 border border-blue-700 p-4 rounded-lg">
          🔐 Local connections use Windows Authentication with your current
          Windows account. No username or password needed.
        </div>
      )}
    </>
  );
});

AuthenticationFields.displayName = "AuthenticationFields"; 