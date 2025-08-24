"use client";

import React, { useState } from "react";
import { useConnectionsStore } from "../../frontend_lib/store/useConnectionsStore";
import { useDatabaseConnectionStore } from "../../frontend_lib/store/useDatabaseConnectionStore";

export default function ConnectionSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    connections,
    currentConnectionId,
    setCurrentConnection,
    getCurrentConnection,
  } = useConnectionsStore();
  const { setCurrentDatabaseConnection } = useDatabaseConnectionStore();
  const currentConnection = getCurrentConnection();

  if (connections.length === 0) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-lg p-2 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-xs text-gray-400">No connections</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Connection Indicator Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-lg p-3 shadow-lg hover:bg-gray-800/80 transition-all duration-200 flex items-center space-x-3 min-w-[200px]"
      >
        <div className="flex items-center space-x-2 flex-1">
          <div
            className={`w-2 h-2 rounded-full ${
              currentConnection?.online ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <div className="text-left">
            <p className="text-sm text-white font-medium truncate">
              {currentConnection?.name ||
                currentConnection?.server ||
                "Select Connection"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {currentConnection?.server || "No connection selected"}
            </p>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full bg-gray-900/95 backdrop-blur-sm border border-gray-800/50 rounded-lg shadow-xl z-50">
          <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
            {connections.map((connection) => (
              <button
                key={connection.id}
                className={`w-full p-2 rounded-md text-left transition-all duration-200 ${
                  connection.id === currentConnectionId
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                }`}
                onClick={() => {
                  setCurrentConnection(connection.id || null);
                  setCurrentDatabaseConnection(connection);
                  setIsOpen(false);
                  console.log(
                    "🔍 Debug: Connection selector clicked, setting database connection:",
                    {
                      ...connection,
                      password: connection.password ? "***" : undefined,
                    }
                  );
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        connection.online ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <div className="text-left min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {connection.name || connection.server}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {connection.server} • {connection.connectionType}
                      </p>
                    </div>
                  </div>
                  {connection.id === currentConnectionId && (
                    <svg
                      className="w-4 h-4 text-blue-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
