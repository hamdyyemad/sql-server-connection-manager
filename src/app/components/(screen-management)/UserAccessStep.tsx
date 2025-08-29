"use client";

import React, { useState, useEffect } from "react";
import {
  useGetTableRows,
  useAddUserClaim,
  useUpdateUserClaim,
  useDeleteUserClaim,
} from "../../../frontend_lib/hooks/useApi";
import { useTableFilters } from "../../../frontend_lib/hooks/useTableFilters";
import SearchBar from "../common/SearchBar";
import Pagination from "../common/Pagination";
import type { ConnectionInfo } from "../../../backend_lib/types/database";

interface UserAccessStepProps {
  selectedDatabase: string;
  connection: ConnectionInfo;
  onChangeDatabase: () => void;
}

interface UserClaim {
  Id: number;
  UserId: string;
  ClaimType: string;
  ClaimValue: string;
  UserName?: string;
  Email?: string;
}

export default function UserAccessStep({
  selectedDatabase,
  connection,
  onChangeDatabase,
}: UserAccessStepProps) {
  const [userClaims, setUserClaims] = useState<UserClaim[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClaim, setEditingClaim] = useState<UserClaim | null>(null);
  const [newClaim, setNewClaim] = useState({
    UserId: "",
    ClaimType: "",
    ClaimValue: "",
  });

  // Search and pagination
  const {
    searchTerm,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    paginatedData: paginatedUserClaims,
    setSearchTerm,
    setCurrentPage,
    setItemsPerPage,
  } = useTableFilters({
    data: userClaims,
    searchFields: ["UserId", "ClaimType", "ClaimValue"], // Adjust based on your actual column names
  });

  const { loading, error, data, getTableRows } = useGetTableRows();
  const {
    loading: addLoading,
    error: addError,
    addUserClaim,
  } = useAddUserClaim();
  const {
    loading: updateLoading,
    error: updateError,
    updateUserClaim,
  } = useUpdateUserClaim();
  const {
    loading: deleteLoading,
    error: deleteError,
    deleteUserClaim,
  } = useDeleteUserClaim();

  useEffect(() => {
    loadUserClaims();
  }, [selectedDatabase]);

  const loadUserClaims = async () => {
    try {
      const config = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        database: selectedDatabase,
        table: "AspNetUserClaims",
        limit: 100,
        offset: 0,
      };

      const response = await getTableRows(config);
      if (response.status == 200 && response.data) {
        setUserClaims(response.data.data.rows || []);
        setColumns(response.data.data.columns || []);
      }
    } catch (error) {
      console.error("Failed to load user claims:", error);
    }
  };

  const handleAddClaim = async () => {
    try {
      const config = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        database: selectedDatabase,
        userId: newClaim.UserId,
        claimType: newClaim.ClaimType,
        claimValue: newClaim.ClaimValue,
      };

      await addUserClaim(config);
      setShowAddModal(false);
      setNewClaim({ UserId: "", ClaimType: "", ClaimValue: "" });
      await loadUserClaims();
    } catch (error) {
      console.error("Failed to add user claim:", error);
    }
  };

  const handleEditClaim = (claim: UserClaim) => {
    setEditingClaim(claim);
    setShowEditModal(true);
  };

  const handleUpdateClaim = async () => {
    if (!editingClaim) return;

    try {
      const config = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        database: selectedDatabase,
        id: editingClaim.Id,
        userId: editingClaim.UserId,
        claimType: editingClaim.ClaimType,
        claimValue: editingClaim.ClaimValue,
      };

      await updateUserClaim(config);
      setShowEditModal(false);
      setEditingClaim(null);
      await loadUserClaims();
    } catch (error) {
      console.error("Failed to update user claim:", error);
    }
  };

  const handleDeleteClaim = async (id: number) => {
    if (!confirm("Are you sure you want to remove this user access?")) return;

    try {
      const config = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        database: selectedDatabase,
        id: id,
      };

      await deleteUserClaim(config);
      await loadUserClaims();
    } catch (error) {
      console.error("Failed to delete user claim:", error);
    }
  };

  const getClaimTypeLabel = (claimType: string) => {
    switch (claimType) {
      case "Screen":
        return "Screen Access";
      case "Action":
        return "Action Permission";
      default:
        return claimType;
    }
  };

  const getClaimValueLabel = (claimValue: string) => {
    // Extract meaningful label from claim value
    return claimValue.split(".").pop() || claimValue;
  };
  console.log(userClaims);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            User Access Management
          </h2>
          <p className="text-gray-400 mt-1">
            Manage user screen accessibility and actions in {selectedDatabase}
            .AspNetUserClaims
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onChangeDatabase}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Change Database
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add User Access
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading user claims...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
          <p className="text-red-300">Error loading user claims: {error}</p>
        </div>
      )}

      {/* Search and Filters */}
      {!loading && !error && (
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 max-w-md">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search user access..."
              />
            </div>
            <div className="text-sm text-gray-400">
              {totalItems} user claims found
            </div>
          </div>
        </div>
      )}

      {/* User Claims Table */}
      {!loading && !error && (
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  {columns.map((col, ind) => (
                    <React.Fragment key={`${ind}_${col}`}>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {col}
                      </th>
                    </React.Fragment>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {paginatedUserClaims.map((claim) => (
                  <tr key={claim.Id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {claim.Id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                      {claim.UserId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          claim.ClaimType === "Screen"
                            ? "bg-blue-900/50 text-blue-400 border border-blue-500/30"
                            : "bg-green-900/50 text-green-400 border border-green-500/30"
                        }`}
                      >
                        {getClaimTypeLabel(claim.ClaimType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {getClaimValueLabel(claim.ClaimValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        onClick={() => handleEditClaim(claim)}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClaim(claim.Id)}
                        className="text-red-400 hover:text-red-300"
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? "Removing..." : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {paginatedUserClaims.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {searchTerm
                  ? "No user claims match your search."
                  : "No user claims found."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
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

      {/* Add User Access Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">
              Add User Access
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  value={newClaim.UserId}
                  onChange={(e) =>
                    setNewClaim({ ...newClaim, UserId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter user ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Claim Type
                </label>
                <select
                  value={newClaim.ClaimType}
                  onChange={(e) =>
                    setNewClaim({ ...newClaim, ClaimType: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select claim type</option>
                  <option value="Screen">Screen Access</option>
                  <option value="Action">Action Permission</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Claim Value
                </label>
                <input
                  type="text"
                  value={newClaim.ClaimValue}
                  onChange={(e) =>
                    setNewClaim({ ...newClaim, ClaimValue: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter claim value (e.g., Screen.Name or Action.Name)"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddClaim}
                disabled={addLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {addLoading ? "Adding..." : "Add Access"}
              </button>
            </div>
            {addError && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-red-300 text-sm">{addError}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit User Access Modal */}
      {showEditModal && editingClaim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">
              Edit User Access
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  value={editingClaim.UserId}
                  onChange={(e) =>
                    setEditingClaim({ ...editingClaim, UserId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter user ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Claim Type
                </label>
                <select
                  value={editingClaim.ClaimType}
                  onChange={(e) =>
                    setEditingClaim({
                      ...editingClaim,
                      ClaimType: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select claim type</option>
                  <option value="Screen">Screen Access</option>
                  <option value="Action">Action Permission</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Claim Value
                </label>
                <input
                  type="text"
                  value={editingClaim.ClaimValue}
                  onChange={(e) =>
                    setEditingClaim({
                      ...editingClaim,
                      ClaimValue: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter claim value (e.g., Screen.Name or Action.Name)"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingClaim(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateClaim}
                disabled={updateLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {updateLoading ? "Updating..." : "Update Access"}
              </button>
            </div>
            {updateError && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-red-300 text-sm">{updateError}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
