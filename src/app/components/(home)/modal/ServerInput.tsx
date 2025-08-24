"use client";
import React, { useEffect } from "react";
import { useConnectionFormStore } from "@/frontend_lib/store/useConnectionFormStore";

export const ServerInput: React.FC = () => {
  const {
    formData,
    detectingLocal,
    localInstance,
    handleServerChange,
    detectLocalInstance
  } = useConnectionFormStore();

  const { connectionType, server } = formData;

  // Auto-detect local instance when local connection type is selected
  useEffect(() => {
    if (connectionType === "local" && !localInstance && !detectingLocal) {
      detectLocalInstance();
    }
  }, [connectionType, localInstance, detectingLocal, detectLocalInstance]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        Server Name
      </label>
      {connectionType === "local" ? (
        <div className="space-y-3">
          {detectingLocal ? (
            <div className="flex items-center space-x-3 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
              <span className="text-blue-300">
                Detecting local SQL Server instances...
              </span>
            </div>
          ) : localInstance ? (
            <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <div className="text-green-300 font-medium">
                ✅ {localInstance.connectionString}
              </div>
              {localInstance.edition && (
                <div className="text-xs text-green-400 mt-2">
                  {localInstance.edition} - Version {localInstance.version}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
              <div className="text-red-300">
                ❌ No local SQL Server instance detected
              </div>
              <button
                type="button"
                onClick={detectLocalInstance}
                className="text-xs text-blue-400 hover:text-blue-300 underline mt-2"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      ) : (
        <input
          className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Server Name (e.g., ATLAS-CB38B4CQ0)"
          value={server}
          onChange={(e) => {
            handleServerChange(e.target.value);
            console.log("🔍 Debug: Server name changed:", e.target.value);
          }}
          required
        />
      )}
    </div>
  );
}; 