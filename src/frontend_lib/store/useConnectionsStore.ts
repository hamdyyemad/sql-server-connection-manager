import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ConnectionInfo } from "../../backend_lib/types/database";

interface ConnectionsState {
  connections: ConnectionInfo[];
  currentConnectionId: string | null; // Track the currently active connection
  addConnection: (conn: ConnectionInfo) => void;
  setOnline: (index: number, online: boolean) => void;
  removeConnection: (index: number) => void;
  hasLocalConnection: () => boolean;
  setCurrentConnection: (connectionId: string | null) => void;
  getCurrentConnection: () => ConnectionInfo | null;
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

export const useConnectionsStore = create<ConnectionsState>()(
  persist(
    (set, get) => ({
      connections: [],
      currentConnectionId: null,
      addConnection: (conn) => {
        const state = get();

        // Check if trying to add a local connection when one already exists
        if (conn.connectionType === "local" && state.hasLocalConnection()) {
          throw new Error(
            "Only one local SQL Server connection is allowed. Please remove the existing local connection first."
          );
        }

        // Generate a unique ID for the connection if it doesn't have one
        const connectionWithId = {
          ...conn,
          id: conn.id || `${conn.server}-${Date.now()}`,
        };

        set((state) => ({
          connections: [...state.connections, connectionWithId],
        }));

        // Set as current connection if it's the first one
        if (state.connections.length === 0) {
          set({ currentConnectionId: connectionWithId.id });
        }
      },
      setOnline: (index, online) =>
        set((state) => {
          const connections = [...state.connections];
          connections[index].online = online;
          return { connections };
        }),
      removeConnection: (index) =>
        set((state) => {
          const connections = [...state.connections];
          const removedConnection = connections[index];
          connections.splice(index, 1);

          // If we're removing the current connection, set the first available as current
          if (removedConnection.id === state.currentConnectionId) {
            const newCurrentId =
              connections.length > 0 ? connections[0].id : null;
            return { connections, currentConnectionId: newCurrentId };
          }

          return { connections };
        }),
      hasLocalConnection: () => {
        const state = get();
        return state.connections.some(
          (conn) => conn.connectionType === "local"
        );
      },
      setCurrentConnection: (connectionId) => {
        set({ currentConnectionId: connectionId });
      },
      getCurrentConnection: () => {
        const state = get();
        if (!state.currentConnectionId) return null;
        return (
          state.connections.find(
            (conn) => conn.id === state.currentConnectionId
          ) || null
        );
      },
    }),
    {
      name: "connections-storage",
      storage: base64Storage,
    }
  )
);
