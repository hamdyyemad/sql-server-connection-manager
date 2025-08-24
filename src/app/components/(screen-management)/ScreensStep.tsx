"use client";

import React, { useState, useEffect } from "react";
import {
  useGetTableRows,
  useAddScreen,
  useUpdateScreen,
  useDeleteScreen,
} from "../../../frontend_lib/hooks/useApi";
import { useTableFilters } from "../../../frontend_lib/hooks/useTableFilters";
import SearchBar from "../common/SearchBar";
import Pagination from "../common/Pagination";
import type { ConnectionInfo } from "../../../backend_lib/types/database";

interface ScreensStepProps {
  selectedDatabase: string;
  connection: ConnectionInfo;
  onChangeDatabase: () => void;
}

interface Screen {
  [key: string]: any; // Make it flexible to handle any table structure
}

export default function ScreensStep({
  selectedDatabase,
  connection,
  onChangeDatabase,
}: ScreensStepProps) {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingScreen, setEditingScreen] = useState<Screen | null>(null);
  const [newScreen, setNewScreen] = useState<Screen>({});

  // Search and pagination
  const {
    searchTerm,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    paginatedData: paginatedScreens,
    setSearchTerm,
    setCurrentPage,
    setItemsPerPage,
  } = useTableFilters({
    data: screens,
    searchFields: ["ControllerName", "Name", "Description", "Path"], // Search by ControllerName first
  });

  const { loading, error, data, getTableRows } = useGetTableRows();
  const { loading: addLoading, error: addError, addScreen } = useAddScreen();
  const {
    loading: updateLoading,
    error: updateError,
    updateScreen,
  } = useUpdateScreen();
  const {
    loading: deleteLoading,
    error: deleteError,
    deleteScreen,
  } = useDeleteScreen();

  useEffect(() => {
    loadScreens();
  }, [selectedDatabase]);

  const loadScreens = async () => {
    try {
      const config = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        database: selectedDatabase,
        table: "Screens",
        limit: 100,
        offset: 0,
      };

      const response = await getTableRows(config);
      console.log(response);
      if (response.status == 200 && response.data) {
        setScreens(response.data.data.rows || []);
        setColumns(response.data.data.columns || []);
      }
    } catch (error) {
      console.error("Failed to load screens:", error);
    }
  };

  const handleAddScreen = async () => {
    try {
      const config = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        database: selectedDatabase,
        ...newScreen,
      };

      await addScreen(config);
      setShowAddModal(false);
      setNewScreen({});
      await loadScreens();
    } catch (error) {
      console.error("Failed to add screen:", error);
    }
  };

  const handleEditScreen = (screen: Screen) => {
    setEditingScreen(screen);
    setShowEditModal(true);
  };

  const handleUpdateScreen = async () => {
    if (!editingScreen) return;

    try {
      const config = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        database: selectedDatabase,
        ...editingScreen,
      };

      await updateScreen(config);
      setShowEditModal(false);
      setEditingScreen(null);
      await loadScreens();
    } catch (error) {
      console.error("Failed to update screen:", error);
    }
  };

  const handleDeleteScreen = async (id: number) => {
    if (!confirm("Are you sure you want to delete this screen?")) return;

    try {
      const config = {
        server: connection.server,
        user: connection.user,
        password: connection.password,
        authenticationType: connection.authenticationType,
        database: selectedDatabase,
        id: id,
      };

      await deleteScreen(config);
      await loadScreens();
    } catch (error) {
      console.error("Failed to delete screen:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Table Data Management
          </h2>
          <p className="text-gray-400 mt-1">
            Manage data in {selectedDatabase} table
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
            Add Row
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading screens...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
          <p className="text-red-300">Error loading screens: {error}</p>
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
                placeholder="Search screens..."
              />
            </div>
            <div className="text-sm text-gray-400">
              {totalItems} screens found
            </div>
          </div>
        </div>
      )}

      {/* Screens Table */}
      {!loading && !error && (
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      {column}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {paginatedScreens.map((screen, index) => (
                  <tr key={index} className="hover:bg-gray-800/30">
                    {columns.map((column) => (
                      <td
                        key={column}
                        className="px-6 py-4 whitespace-nowrap text-sm text-white"
                      >
                        {screen[column] || "-"}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        onClick={() => handleEditScreen(screen)}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteScreen(screen.ID || screen.Id || index)
                        }
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
          {paginatedScreens.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {searchTerm
                  ? "No screens match your search."
                  : "No screens found."}
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

      {/* Add Screen Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">
              Add New Row
            </h3>
            <div className="space-y-4">
              {columns.map((column) => (
                <div key={column}>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {column}
                  </label>
                  <input
                    type="text"
                    value={newScreen[column] || ""}
                    onChange={(e) =>
                      setNewScreen({ ...newScreen, [column]: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder={`Enter ${column.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddScreen}
                disabled={addLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {addLoading ? "Adding..." : "Add Row"}
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

      {/* Edit Screen Modal */}
      {showEditModal && editingScreen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Edit Row</h3>
            <div className="space-y-4">
              {columns.map((column) => (
                <div key={column}>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {column}
                  </label>
                  <input
                    type="text"
                    value={editingScreen[column] || ""}
                    onChange={(e) =>
                      setEditingScreen({
                        ...editingScreen,
                        [column]: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder={`Enter ${column.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingScreen(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateScreen}
                disabled={updateLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {updateLoading ? "Updating..." : "Update Row"}
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
