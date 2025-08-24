"use client";
import React from "react";
import { useConnectionFormStore } from "@/frontend_lib/store/useConnectionFormStore";
import { useConnectionsStore } from "@/frontend_lib/store/useConnectionsStore";

export const ConnectionTypeSelector: React.FC = React.memo(() => {
  const { formData, handleConnectionTypeChange } = useConnectionFormStore();
  const hasLocalConnection = useConnectionsStore((s) => s.hasLocalConnection);

  const { connectionType } = formData;
  const isLocalDisabled = hasLocalConnection();

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        Connection Type
      </label>
      <div className="flex space-x-3">
        <button
          type="button"
          className={`flex-1 p-3 rounded-lg border-2 transition-all ${connectionType === "local"
            ? "bg-blue-600/20 border-blue-500 text-blue-400"
            : "bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-800/70"
            } ${isLocalDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !isLocalDisabled && handleConnectionTypeChange("local")}
          disabled={isLocalDisabled}
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg">🏠</span>
            <span className="hidden md:inline font-medium">Local SQL Server</span>
          </div>
        </button>
        <button
          type="button"
          className={`flex-1 p-3 rounded-lg border-2 transition-all ${connectionType === "remote"
            ? "bg-blue-600/20 border-blue-500 text-blue-400"
            : "bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-800/70"
            }`}
          onClick={() => handleConnectionTypeChange("remote")}
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg">🌐</span>
            <span className="hidden md:inline font-medium">Remote Server</span>
          </div>
        </button>
      </div>
      {isLocalDisabled && (
        <div className="text-sm text-amber-400 bg-amber-900/20 border border-amber-700 p-3 rounded-lg">
          ⚠️ Local SQL Server connection already exists. Only one local
          connection is allowed.
        </div>
      )}
    </div>
  );
});

ConnectionTypeSelector.displayName = "ConnectionTypeSelector"; 