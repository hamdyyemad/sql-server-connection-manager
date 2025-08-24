import type { ConnectionInfo } from "@/backend_lib/types/database";

export const getConnectionStatus = (connection: ConnectionInfo) => ({
  statusColor: connection.online ? "text-green-400" : "text-red-400",
  statusText: connection.online ? "Online" : "Offline",
  statusBadgeClass: connection.online
    ? "bg-green-500/20 text-green-400 border border-green-500/30"
    : "bg-red-500/20 text-red-400 border border-red-500/30",
});

export const getDisplayName = (connection: ConnectionInfo) =>
  connection.name || connection.server;

export const getConnectionTypeLabel = (connectionType: string) =>
  connectionType === "local" ? "Local" : "Remote";

export const getAuthTypeLabel = (authenticationType: string) =>
  authenticationType === "windows" ? "Windows" : "SQL";

export const createRemoveConfirmMessage = (connection: ConnectionInfo) =>
  `Are you sure you want to remove the connection to "${getDisplayName(
    connection
  )}"?`;
