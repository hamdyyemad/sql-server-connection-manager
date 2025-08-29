"use client";

import React from "react";
import ConnectionItem from "./connection-item";
import { useConnectionsStore } from "@/frontend_lib/store/useConnectionsStore";
import { useDatabaseConnectionStore } from "@/frontend_lib/store/useDatabaseConnectionStore";
import type { ConnectionInfo } from "@/backend_lib/types/database";

interface ConnectionDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectionDropdown = React.memo(function ConnectionDropdown({
  isOpen,
  onClose,
}: ConnectionDropdownProps) {
  // Get data directly from stores
  const connections = useConnectionsStore((state) => state.connections);
  const currentConnectionId = useConnectionsStore((state) => state.currentConnectionId);
  const setCurrentConnection = useConnectionsStore((state) => state.setCurrentConnection);
  const setCurrentDatabaseConnection = useDatabaseConnectionStore((state) => state.setCurrentDatabaseConnection);

  const handleConnectionSelect = (connection: ConnectionInfo) => {
    setCurrentConnection(connection.id || null);
    setCurrentDatabaseConnection(connection);
    onClose();
    console.log(
      "🔍 Debug: Connection selector clicked, setting database connection:",
      {
        ...connection,
        password: connection.password ? "***" : undefined,
      }
    );
  };
  if (!isOpen) return null;

  return (
    <>
      {/* Dropdown Menu */}
      <div className="absolute bottom-full right-0 mb-2 w-72 md:left-0 md:right-auto md:w-auto md:min-w-[200px] bg-gray-900/95 backdrop-blur-sm border border-gray-800/50 rounded-lg shadow-xl z-50">
        <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
          {connections.map((connection) => (
            <ConnectionItem
              key={connection.id || connection.server}
              id={connection.id || ""}
              name={connection.name || ""}
              server={connection.server}
              connectionType={connection.connectionType}
              isOnline={connection.online}
              isSelected={connection.id === currentConnectionId}
              onClick={() => handleConnectionSelect(connection)}
            />
          ))}
        </div>
      </div>

      {/* Backdrop to close dropdown */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
    </>
  );
});

export default ConnectionDropdown;
