"use client";

import React, { useState, useEffect } from "react";
import {
  useGetTableRows,
  useAddAction,
  useUpdateAction,
  useDeleteAction,
} from "../../../frontend_lib/hooks/useApi";
import { useTableFilters } from "../../../frontend_lib/hooks/useTableFilters";
import SearchBar from "../common/SearchBar";
import Pagination from "../common/Pagination";
import type { ConnectionInfo } from "../../../backend_lib/types/database";

interface ActionsStepProps {
  selectedDatabase: string;
  connection: ConnectionInfo;
  onChangeDatabase: () => void;
}

interface Action {
  Id: number;
  Name: string;
  Description?: string;
  IsActive: boolean;
  CreatedDate?: string;
  ModifiedDate?: string;
}

export default function ActionsStep({
  selectedDatabase,
  connection,
  onChangeDatabase,
}: ActionsStepProps) {
  const [actions, setActions] = useState<Action[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAction, setEditingAction] = useState<Action | null>(null);
  const [newAction, setNewAction] = useState({
    Name: "",
    Description: "",
    IsActive: true,
  });

  // Search and pagination
  const {
    searchTerm,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    paginatedData: paginatedActions,
    setSearchTerm,
    setCurrentPage,
    setItemsPerPage,
  } = useTableFilters({
    data: actions,
    searchFields: ["ActionType", "ActionName"], // Adjust based on your actual column names
  });

  const { loading, error, data, getTableRows } = useGetTableRows();
  const { loading: addLoading, error: addError, addAction } = useAddAction();
  const {
    loading: updateLoading,
    error: updateError,
    updateAction,
  } = useUpdateAction();
  const {
    loading: deleteLoading,
    error: deleteError,
    deleteAction,
  } = useDeleteAction();

  useEffect(() => {
    loadActions();
  }, [selectedDatabase]);

  const loadActions = async () => {
    try {
      const config = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        database: selectedDatabase,
        table: "ActionClaimsTable",
        limit: 100,
        offset: 0,
      };

      const response = await getTableRows(config);
      if (response.status == 200 && response.data) {
        setActions(response.data.data.rows || []);
        setColumns(response.data.data.columns || []);
      }
    } catch (error) {
      console.error("Failed to load actions:", error);
    }
  };

  const handleAddAction = async () => {
    try {
      const config = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        database: selectedDatabase,
        name: newAction.Name,
        description: newAction.Description,
        isActive: newAction.IsActive,
      };

      await addAction(config);
      setShowAddModal(false);
      setNewAction({ Name: "", Description: "", IsActive: true });
      await loadActions();
    } catch (error) {
      console.error("Failed to add action:", error);
    }
  };

  const handleEditAction = (action: Action) => {
    setEditingAction(action);
    setShowEditModal(true);
  };

  const handleUpdateAction = async () => {
    if (!editingAction) return;

    try {
      const config = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        database: selectedDatabase,
        id: editingAction.Id,
        name: editingAction.Name,
        description: editingAction.Description || "",
        isActive: editingAction.IsActive,
      };

      await updateAction(config);
      setShowEditModal(false);
      setEditingAction(null);
      await loadActions();
    } catch (error) {
      console.error("Failed to update action:", error);
    }
  };

  const handleDeleteAction = async (id: number) => {
    if (!confirm("Are you sure you want to delete this action?")) return;

    try {
      const config = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        database: selectedDatabase,
        id: id,
      };

      await deleteAction(config);
      await loadActions();
    } catch (error) {
      console.error("Failed to delete action:", error);
    }
  };

  console.log(actions);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Actions Management</h2>
          <p className="text-gray-400 mt-1">
            Manage actions in {selectedDatabase}.ActionClaimsTable
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
            Add Action
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading actions...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
          <p className="text-red-300">Error loading actions: {error}</p>
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
                placeholder="Search actions..."
              />
            </div>
            <div className="text-sm text-gray-400">
              {totalItems} actions found
            </div>
          </div>
        </div>
      )}

      {/* Actions Table */}
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
                {paginatedActions.map((action, ind) => (
                  <tr
                    key={`${ind}_${action.ActionType}`}
                    className="hover:bg-gray-800/30"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {action.ActionType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                      {action.ActionName}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        onClick={() => handleEditAction(action)}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAction(action.Id)}
                        className="text-red-400 hover:text-red-300"
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {paginatedActions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {searchTerm
                  ? "No actions match your search."
                  : "No actions found."}
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

      {/* Add Action Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">
              Add New Action
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Action Name
                </label>
                <input
                  type="text"
                  value={newAction.Name}
                  onChange={(e) =>
                    setNewAction({ ...newAction, Name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter action name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={newAction.Description}
                  onChange={(e) =>
                    setNewAction({ ...newAction, Description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  rows={3}
                  placeholder="Enter description"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newAction.IsActive}
                  onChange={(e) =>
                    setNewAction({ ...newAction, IsActive: e.target.checked })
                  }
                  className="mr-2"
                />
                <label className="text-sm text-gray-400">Active</label>
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
                onClick={handleAddAction}
                disabled={addLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {addLoading ? "Adding..." : "Add Action"}
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

      {/* Edit Action Modal */}
      {showEditModal && editingAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">
              Edit Action
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Action Name
                </label>
                <input
                  type="text"
                  value={editingAction.Name}
                  onChange={(e) =>
                    setEditingAction({ ...editingAction, Name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter action name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={editingAction.Description || ""}
                  onChange={(e) =>
                    setEditingAction({
                      ...editingAction,
                      Description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  rows={3}
                  placeholder="Enter description"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingAction.IsActive}
                  onChange={(e) =>
                    setEditingAction({
                      ...editingAction,
                      IsActive: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label className="text-sm text-gray-400">Active</label>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAction(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAction}
                disabled={updateLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {updateLoading ? "Updating..." : "Update Action"}
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
