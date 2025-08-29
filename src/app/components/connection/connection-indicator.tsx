"use client";

import React, { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useConnectionsStore } from "@/frontend_lib/store/useConnectionsStore";

interface ConnectionIndicatorProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ConnectionIndicator = React.memo(function ConnectionIndicator({
  isOpen,
  onToggle,
}: ConnectionIndicatorProps) {
  // Get current connection data directly from store
  const connections = useConnectionsStore((state) => state.connections);
  const currentConnectionId = useConnectionsStore((state) => state.currentConnectionId);
  
  // Memoize current connection
  const currentConnection = useMemo(() => {
    if (!currentConnectionId) return null;
    return connections.find((conn) => conn.id === currentConnectionId) || null;
  }, [connections, currentConnectionId]);

  const isOnline = currentConnection?.online || false;
  const name = currentConnection?.name || "";
  const server = currentConnection?.server || "";
  return (
    <>
      {/* Mobile view - Circle only */}
      <button
        onClick={onToggle}
        className="md:hidden cursor-pointer bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-full p-3 shadow-lg hover:bg-gray-800/80 transition-all duration-200 flex items-center justify-center w-12 h-12"
      >
        <div
          className={`w-4 h-4 rounded-full ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </button>

      {/* Desktop view - Full indicator */}
      <button
        onClick={onToggle}
        className="hidden md:flex cursor-pointer bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-lg p-3 shadow-lg hover:bg-gray-800/80 transition-all duration-200 items-center space-x-3 min-w-[200px]"
      >
        <div className="flex items-center space-x-2 flex-1">
          <div
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <div className="text-left">
            <p className="text-sm text-white font-medium truncate">
              {name || server || "Select Connection"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {server || "No connection selected"}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </>
  );
});

export default ConnectionIndicator;
