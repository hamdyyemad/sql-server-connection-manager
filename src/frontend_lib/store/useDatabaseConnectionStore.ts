import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ConnectionInfo } from "../../backend_lib/types/database";

interface DatabaseConnectionState {
  currentDatabaseConnection: ConnectionInfo | null;
  setCurrentDatabaseConnection: (connection: ConnectionInfo | null) => void;
  getCurrentDatabaseConnection: () => ConnectionInfo | null;
  clearCurrentDatabaseConnection: () => void;
}

const base64Storage = {
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    if (!value) return null;
    try {
      return JSON.parse(atob(value));
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, btoa(JSON.stringify(value)));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const useDatabaseConnectionStore = create<DatabaseConnectionState>()(
  persist(
    (set, get) => ({
      currentDatabaseConnection: null,

      setCurrentDatabaseConnection: (connection) => {
        console.log("🔍 Debug: Setting current database connection:", {
          ...connection,
          password: connection?.password ? "***" : undefined,
        });
        set({ currentDatabaseConnection: connection });
      },

      getCurrentDatabaseConnection: () => {
        const state = get();
        return state.currentDatabaseConnection;
      },

      clearCurrentDatabaseConnection: () => {
        console.log("🔍 Debug: Clearing current database connection");
        set({ currentDatabaseConnection: null });
      },
    }),
    {
      name: "database-connection-storage",
      storage: base64Storage,
    }
  )
);
