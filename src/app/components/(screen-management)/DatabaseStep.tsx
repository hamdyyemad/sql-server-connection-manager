/* eslint-disable @typescript-eslint/no-explicit-any */
// DatabaseStep.tsx for Screen Management
import { useState, useEffect, useCallback, memo } from "react";
import { currentConnectionApiService } from "@/frontend_lib/services/currentConnectionApi";
import { type ConnectionInfo } from "@/backend_lib/types/database";

interface Props {
  connection: ConnectionInfo | undefined;
  onDatabaseSelected: (database: string) => void;
}

export default function DatabaseStep({
  connection,
  onDatabaseSelected,
}: Props) {
  const [selectedDatabase, setSelectedDatabase] = useState<string>("");
  const [databases, setDatabases] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDatabases = useCallback(async () => {
    if (!connection) return;

    try {
      setLoading(true);
      setError(null);

      const response = await currentConnectionApiService.listDatabases();
      console.log("Database response:", response);

      if (response.success && response.data?.databases) {
        const databaseNames = response.data.databases.map((db: any) => db.name);
        console.log("Database names:", databaseNames);
        setDatabases(databaseNames);
      } else if (response.success && response.data) {
        // Handle case where data is directly in response.data
        const databaseNames = response.data.map((db: any) => db.name);
        console.log("Database names (direct):", databaseNames);
        setDatabases(databaseNames);
      } else {
        setDatabases([]);
        setError(response.error || "Failed to fetch databases");
      }
    } catch (error) {
      console.error("Error fetching databases:", error);
      setDatabases([]);
      setError("Failed to fetch databases");
    } finally {
      setLoading(false);
    }
  }, [connection]);

  const handleRefreshDatabases = useCallback(() => {
    setDatabases([]);
    setSelectedDatabase("");
    fetchDatabases();
  }, [fetchDatabases]);

  const handleContinue = useCallback(() => {
    if (selectedDatabase) {
      onDatabaseSelected(selectedDatabase);
    }
  }, [selectedDatabase, onDatabaseSelected]);

  useEffect(() => {
    if (connection) {
      setDatabases([]);
      setSelectedDatabase("");
      fetchDatabases();
    }
  }, [connection, fetchDatabases]);

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">Select Database</h3>
      <p className="text-gray-400 mb-4">
        Choose a database to manage screens, actions, and user access:
      </p>
      {loading ? (
        <div className="text-white">Loading databases...</div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <DatabaseDropdown
              databases={databases}
              selectedDatabase={selectedDatabase}
              loading={loading}
              onSelect={setSelectedDatabase}
            />
            <RefreshButton loading={loading} onClick={handleRefreshDatabases} />
          </div>
          <DatabaseStatusMessages
            error={error}
            databases={databases}
            loading={loading}
          />
          <button
            onClick={handleContinue}
            disabled={!selectedDatabase}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Continue to Screen Management
          </button>
        </div>
      )}
    </div>
  );
}

interface DatabaseDropdownProps {
  databases: string[];
  selectedDatabase: string;
  loading: boolean;
  onSelect: (database: string) => void;
}

export const DatabaseDropdown = memo(function DatabaseDropdown({
  databases,
  selectedDatabase,
  loading,
  onSelect,
}: DatabaseDropdownProps) {
  return (
    <select
      value={selectedDatabase}
      onChange={(e) => onSelect(e.target.value)}
      disabled={loading}
      className="flex-1 bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    >
      <option value="">Select a database...</option>
      {databases.map((database) => (
        <option key={database} value={database}>
          {database}
        </option>
      ))}
    </select>
  );
});

interface RefreshButtonProps {
  loading: boolean;
  onClick: () => void;
}

export const RefreshButton = memo(function RefreshButton({
  loading,
  onClick,
}: RefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
      title="Refresh databases"
    >
      {loading ? "🔄" : "🔄"}
    </button>
  );
});

interface DatabaseStatusMessagesProps {
  error: string | null;
  databases: string[];
  loading: boolean;
}

export const DatabaseStatusMessages = memo(function DatabaseStatusMessages({
  error,
  databases,
  loading,
}: DatabaseStatusMessagesProps) {
  if (loading) {
    return <div className="text-blue-400">Loading databases...</div>;
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  if (databases.length === 0) {
    return <div className="text-yellow-400">No databases found</div>;
  }

  return (
    <div className="text-green-400">
      Found {databases.length} database{databases.length !== 1 ? "s" : ""}
    </div>
  );
}); 