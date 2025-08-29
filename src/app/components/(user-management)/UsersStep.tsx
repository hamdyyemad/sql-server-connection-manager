import { useState, useEffect } from "react";
import {
  useGetAspNetUsers,
  useResetUserPassword,
} from "@/frontend_lib/hooks/useApi";
import {
  type DatabaseOperationConfig,
  type UserOperationConfig,
} from "@/frontend_lib/types/api";
import { ConnectionInfo } from "@/backend_lib/types/database";
import { useTableFilters } from "@/frontend_lib/hooks/useTableFilters";
import SearchBar from "../common/SearchBar";
import Pagination from "../common/Pagination";
import PasswordModal from "./PasswordModal";
import RoleManagementModal from "./RoleManagementModal";

interface User {
  Id: string;
  UserName: string | null;
  UserName_HR: string | null;
  ChangePass: number; // 0 = Required, 1 = Not Required
  TypeLogin: string | null;
  LocationId: string | null;
  RoleName: string | null;
  RoleId: string | null;
}

interface Props {
  selectedDatabase: string;
  connection: ConnectionInfo | undefined;
  onChangeDatabase: () => void;
}

export default function UsersStep({
  selectedDatabase,
  connection,
  onChangeDatabase,
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [sortColumn, setSortColumn] = useState("UserName");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Search and pagination using our custom hook
  const {
    searchTerm,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    paginatedData: paginatedUsers,
    setSearchTerm,
    setCurrentPage,
    setItemsPerPage,
  } = useTableFilters({
    data: users,
    searchFields: ["UserName", "UserName_HR", "TypeLogin", "RoleName"],
  });

  const {
    loading: usersLoading,
    error: usersError,
    getAspNetUsers,
  } = useGetAspNetUsers();
  const {
    loading: resetPasswordLoading,
    error: resetPasswordError,
    resetUserPassword,
  } = useResetUserPassword();

  const fetchUsers = async (sortCol = sortColumn, sortDir = sortDirection) => {
    if (!selectedDatabase || !connection) return;

    console.log("Fetching users for database:", selectedDatabase);

    try {
      const requestBody = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        database: selectedDatabase,
        page: 1,
        limit: 1000, // Get all users for client-side filtering
        search: "",
        sortColumn: sortCol,
        sortDirection: sortDir,
      };
      console.log("Request body:", { ...requestBody, password: "***" });

      const response = await getAspNetUsers(requestBody);
      console.log("Received data:", response);

      // Handle different response structures
      let users = [];
      let success = false;

      if (response.success && response.data && response.data.data) {
        // Nested structure: response.data.data.users
        const usersData = response.data.data;
        users = usersData.users || [];
        success = true;
      } else if (response.success && response.data && response.data.users) {
        // Direct structure: response.data.users
        users = response.data.users || [];
        success = true;
      } else if (response.data && response.data.success && response.data.data) {
        // Alternative nested structure
        const usersData = response.data.data;
        users = usersData.users || [];
        success = response.data.success;
      } else if (
        response.data &&
        response.data.success &&
        response.data.users
      ) {
        // Alternative direct structure
        users = response.data.users || [];
        success = response.data.success;
      }

      if (success) {
        setUsers(users);

        if (!users || users.length === 0) {
          console.warn("No users found in AspNetUsers table");
        }
      } else {
        console.warn("No users found or invalid response structure");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert(
        `Error fetching users: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleSort = (column: string) => {
    const newDirection =
      sortColumn === column && sortDirection === "ASC" ? "DESC" : "ASC";
    setSortColumn(column);
    setSortDirection(newDirection);
    fetchUsers(column, newDirection);
  };

  const resetPassword = async (userId: string) => {
    if (!connection || !selectedDatabase) return;

    try {
      const dbConfig: UserOperationConfig = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        userId: userId,
      };

      const response = await resetUserPassword(dbConfig);
      if (response.success) {
        alert("Password reset successfully!");
        fetchUsers(); // Refresh the user list
      } else {
        alert(`Failed to reset password: ${response.error}`);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert(
        `Error resetting password: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const getRoleDisplayName = (user: User) => {
    return user.RoleName || "No Role";
  };

  const handleUserRefresh = () => {
    fetchUsers();
  };

  // Load users when database or connection changes
  useEffect(() => {
    if (selectedDatabase && connection) {
      fetchUsers();
    }
  }, [selectedDatabase, connection]);

  return (
    <>
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        user={selectedUser}
        connection={connection}
        onSuccess={handleUserRefresh}
      />

      <RoleManagementModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        user={selectedUser}
        connection={connection}
        selectedDatabase={selectedDatabase}
        onSuccess={handleUserRefresh}
      />

      {usersError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="text-red-400">Error loading users: {usersError}</div>
        </div>
      )}

      {resetPasswordError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="text-red-400">
            Error resetting password: {resetPasswordError}
          </div>
        </div>
      )}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">
            AspNetUsers - {selectedDatabase}
          </h3>
          <button
            onClick={onChangeDatabase}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Change Database
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 max-w-md">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search users..."
              />
            </div>
            <div className="text-sm text-gray-400">
              {totalItems} users found
            </div>
          </div>
        </div>

        {usersLoading ? (
          <div className="text-white">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 border border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-700">
                  {[
                    { key: "Id", label: "ID" },
                    { key: "UserName", label: "Username" },
                    { key: "UserName_HR", label: "Username HR" },
                    { key: "TypeLogin", label: "Type" },
                    { key: "RoleName", label: "Role" },
                    { key: "ChangePass", label: "Change Pass" },
                    { key: "LocationId", label: "Location ID" },
                  ].map((column) => (
                    <th
                      key={column.key}
                      className="p-3 text-left text-white font-semibold border-b border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors"
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {sortColumn === column.key && (
                          <span className="text-blue-400">
                            {sortDirection === "ASC" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="p-3 text-left text-white font-semibold border-b border-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, userIndex) => (
                  <tr
                    key={`user-${userIndex}-${user.Id}`}
                    className="border-b border-gray-700"
                  >
                    <td className="p-3 text-gray-300">{user.Id}</td>
                    <td className="p-3 text-gray-300">
                      {user.UserName || "-"}
                    </td>
                    <td className="p-3 text-gray-300">
                      {user.UserName_HR || "-"}
                    </td>
                    <td className="p-3 text-gray-300">
                      {user.TypeLogin || "-"}
                    </td>
                    <td className="p-3 text-gray-300">
                      {getRoleDisplayName(user)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          user.ChangePass === 0
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {user.ChangePass === 0 ? "Required" : "Not Required"}
                      </span>
                    </td>
                    <td className="p-3 text-gray-300">
                      {user.LocationId || "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => resetPassword(user.Id)}
                          className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
                        >
                          Reset to 123456
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowPasswordModal(true);
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Set Custom Password
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowRoleModal(true);
                          }}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                        >
                          Manage Roles
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
