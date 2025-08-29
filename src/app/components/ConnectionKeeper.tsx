"use client";

import { useEffect, useRef } from "react";
import { usePingConnection } from "../../frontend_lib/hooks/useApi";
import { useDatabaseConnectionStore } from "../../frontend_lib/store/useDatabaseConnectionStore";

interface ConnectionKeeperProps {
  intervalMs?: number; // Default 30 seconds
  enabled?: boolean; // Default true
  onStatusChange?: (status: "online" | "offline") => void; // Callback for status updates
}

export default function ConnectionKeeper({
  intervalMs = 30000,
  enabled = true,
  onStatusChange,
}: ConnectionKeeperProps) {
  const { pingConnection } = usePingConnection();
  const { getCurrentDatabaseConnection } = useDatabaseConnectionStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPingingRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const performPing = async () => {
      // Prevent multiple simultaneous pings
      if (isPingingRef.current) {
        console.log("🔍 ConnectionKeeper: Ping already in progress, skipping");
        return;
      }

      try {
        isPingingRef.current = true;
        const currentConnection = getCurrentDatabaseConnection();
        if (!currentConnection) {
          console.log(
            "🔍 ConnectionKeeper: No current connection, skipping ping"
          );
          return;
        }

        const config = {
          server: currentConnection.server,
          user: currentConnection.user,
          password: currentConnection.password,
          authenticationType: currentConnection.authenticationType,
        };

        console.log("🔍 ConnectionKeeper: Pinging connection to keep alive");
        await pingConnection(config);
        console.log("✅ ConnectionKeeper: Ping successful");
        onStatusChange?.("online");
      } catch (error) {
        console.warn(
          "⚠️ ConnectionKeeper: Ping failed, but continuing:",
          error
        );
        onStatusChange?.("offline");
      } finally {
        isPingingRef.current = false;
      }
    };

    // Perform initial ping
    performPing();

    // Set up interval for periodic pings
    intervalRef.current = setInterval(performPing, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, intervalMs, pingConnection, getCurrentDatabaseConnection]);

  // This component doesn't render anything visible
  return null;
}
