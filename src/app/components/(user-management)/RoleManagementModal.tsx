import { useState, useEffect } from "react";
import { useGetUserRoles, useUpdateMultipleUserRoles, useGetAspNetRoles } from "@/frontend_lib/hooks/useApi";
import { type UserOperationConfig, type MultipleUserRoleOperationConfig, type DatabaseOperationConfig } from "@/frontend_lib/types/api";
import { ConnectionInfo } from "@/backend_lib/types/database";

interface User {
  Id: string;
  UserName: string | null;
  UserName_HR: string | null;
  ChangePass: number;
  TypeLogin: string | null;
  LocationId: string | null;
  RoleName: string | null;
  RoleId: string | null;
}

interface Role {
  Id: string;
  Name: string;
  IsAssigned?: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  connection: ConnectionInfo | undefined;
  selectedDatabase: string;
  onSuccess: () => void;
}

export default function RoleManagementModal({
  isOpen,
  onClose,
  user,
  connection,
  selectedDatabase,
  onSuccess,
}: Props) {
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  
  const { loading: userRolesLoading, error: userRolesError, getUserRoles } = useGetUserRoles();
  const { loading: updateRolesLoading, error: updateRolesError, updateMultipleUserRoles } = useUpdateMultipleUserRoles();
  const { loading: rolesLoading, error: rolesError, getAspNetRoles } = useGetAspNetRoles();

  const fetchAllRoles = async () => {
    if (!selectedDatabase || !connection) return;

    try {
      const dbConfig: DatabaseOperationConfig & { database: string } = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        database: selectedDatabase,
      };

      const response = await getAspNetRoles(dbConfig);
      console.log("All roles response:", response);

      // Handle different response structures
      let roles = [];
      let success = false;

      if (response.success && response.data && response.data.data) {
        // Nested structure: response.data.data.roles
        roles = response.data.data.roles || [];
        success = true;
      } else if (response.success && response.data && response.data.roles) {
        // Direct structure: response.data.roles
        roles = response.data.roles || [];
        success = true;
      } else if (response.data && response.data.success && response.data.data) {
        // Alternative nested structure
        roles = response.data.data.roles || [];
        success = response.data.success;
      } else if (response.data && response.data.success && response.data.roles) {
        // Alternative direct structure
        roles = response.data.roles || [];
        success = response.data.success;
      }

      if (success && roles.length > 0) {
        setAllRoles(roles);
        console.log("✅ Debug: Extracted all roles:", roles);
      } else {
        console.warn("❌ Debug: No roles found or invalid response structure");
        setAllRoles([]);
      }
    } catch (error) {
      console.error("Error fetching all roles:", error);
    }
  };

  const fetchUserRoles = async (userId: string) => {
    if (!connection || !selectedDatabase) return;

    try {
      const dbConfig: UserOperationConfig = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        userId: userId,
      };

      const response = await getUserRoles(dbConfig);
      console.log("User roles response:", response);

      // Handle different response structures
      let userRoles = [];
      let success = false;

      if (response.success && response.data && response.data.data) {
        // Nested structure: response.data.data.roles
        userRoles = response.data.data.roles || [];
        success = true;
      } else if (response.success && response.data && response.data.roles) {
        // Direct structure: response.data.roles
        userRoles = response.data.roles || [];
        success = true;
      } else if (response.data && response.data.success && response.data.data) {
        // Alternative nested structure
        userRoles = response.data.data.roles || [];
        success = response.data.success;
      } else if (response.data && response.data.success && response.data.roles) {
        // Alternative direct structure
        userRoles = response.data.roles || [];
        success = response.data.success;
      }

      if (success) {
        setUserRoles(userRoles);
        setSelectedRoles(userRoles?.map((role: Role) => role.Id) || []);
        console.log("✅ Debug: Extracted user roles:", userRoles);
      } else {
        console.warn("❌ Debug: No user roles found or invalid response structure");
        setUserRoles([]);
        setSelectedRoles([]);
      }
    } catch (error) {
      console.error("Error fetching user roles:", error);
    }
  };

  const handleClose = () => {
    setUserRoles([]);
    setAllRoles([]);
    setSelectedRoles([]);
    onClose();
  };

  const handleUpdateRoles = async () => {
    if (!user || !connection || !selectedDatabase) return;

    try {
      const updates = allRoles.map((role) => ({
        userId: user.Id,
        roleId: role.Id,
        action: selectedRoles.includes(role.Id) ? "add" : "remove" as "add" | "remove",
      }));

      const dbConfig: MultipleUserRoleOperationConfig = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        updates: updates,
      };

      const response = await updateMultipleUserRoles(dbConfig);
      if (response.success) {
        alert("User roles updated successfully!");
        handleClose();
        onSuccess(); // Refresh user list
      } else {
        alert(`Failed to update user roles: ${response.error}`);
      }
    } catch (error) {
      console.error("Error updating user roles:", error);
      alert(`Error updating user roles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const toggleRoleSelection = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  // Load data when modal opens and user changes
  useEffect(() => {
    if (isOpen && user && connection && selectedDatabase) {
      fetchAllRoles();
      fetchUserRoles(user.Id);
    }
  }, [isOpen, user, connection, selectedDatabase]);

  if (!isOpen || !user) return null;

  // Merge all roles with user's current roles to show assignment status
  const rolesWithAssignment = allRoles.map(role => ({
    ...role,
    IsAssigned: userRoles.some(userRole => userRole.Id === role.Id) ? 1 : 0
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-md w-full m-4">
        <h4 className="text-lg font-semibold text-white mb-4">
          Manage Roles for User: {user.UserName || user.UserName_HR}
        </h4>
        
        {(userRolesLoading || rolesLoading) ? (
          <div className="text-white text-center py-4">Loading roles...</div>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {rolesWithAssignment.map((role, roleIndex) => (
              <div
                key={`role-${roleIndex}-${role.Id}`}
                className="flex items-center space-x-3 p-3 rounded border bg-gray-700 border-gray-600"
              >
                <input
                  type="checkbox"
                  id={`role-${role.Id}`}
                  checked={selectedRoles.includes(role.Id)}
                  onChange={() => toggleRoleSelection(role.Id)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                  disabled={updateRolesLoading}
                />
                <label
                  htmlFor={`role-${role.Id}`}
                  className="flex-1 text-gray-300 cursor-pointer"
                >
                  {role.Name}
                </label>
                {role.IsAssigned === 1 && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    Current
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {(userRolesError || rolesError || updateRolesError) && (
          <div className="text-red-400 text-sm mt-4">
            Error: {userRolesError || rolesError || updateRolesError}
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleClose}
            disabled={updateRolesLoading}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateRoles}
            disabled={updateRolesLoading || userRolesLoading || rolesLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {updateRolesLoading ? "Updating..." : "Update Roles"}
          </button>
        </div>
      </div>
    </div>
  );
}