"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useConnectionsStore } from "@/frontend_lib/store/useConnectionsStore";
import { useDatabaseConnectionStore } from "@/frontend_lib/store/useDatabaseConnectionStore";
import { createRemoveConfirmMessage } from "@/frontend_lib/helpers/connectionHelper";
import type { ConnectionInfo } from "@/backend_lib/types/database";

export const useConnectionActions = (connection: ConnectionInfo) => {
  const router = useRouter();
  const { removeConnection, setCurrentConnection } = useConnectionsStore();
  const { setCurrentDatabaseConnection } = useDatabaseConnectionStore();

  const handleCardClick = useCallback(
    (server: string) => {
      // Set the current connection before navigating
      if (connection.id) {
        setCurrentConnection(connection.id);
        setCurrentDatabaseConnection(connection);
        console.log(
          "🔍 Debug: Connection card clicked, setting database connection:",
          {
            ...connection,
            password: connection.password ? "***" : undefined,
          }
        );
      }
      router.push(`/connection/${encodeURIComponent(server)}`);
    },
    [router, connection, setCurrentConnection, setCurrentDatabaseConnection]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      if (confirm(createRemoveConfirmMessage(connection))) {
        removeConnection(index);
      }
    },
    [connection, removeConnection]
  );

  return { handleCardClick, handleRemove };
};
