import { useState, useMemo } from "react";

interface UseTableFiltersProps<T> {
  data: T[];
  searchFields?: (keyof T)[];
}

export function useTableFilters<T>({
  data,
  searchFields,
}: UseTableFiltersProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const searchLower = searchTerm.toLowerCase();

    return data.filter((item) => {
      if (!searchFields) {
        // If no specific fields provided, search in all string/number fields
        return Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchLower)
        );
      }

      return searchFields.some((field) => {
        const value = item[field];
        return String(value).toLowerCase().includes(searchLower);
      });
    });
  }, [data, searchTerm, searchFields]);

  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Reset to first page when items per page changes
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return {
    // State
    searchTerm,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,

    // Data
    filteredData,
    paginatedData,

    // Handlers
    setSearchTerm: handleSearchChange,
    setCurrentPage,
    setItemsPerPage: handleItemsPerPageChange,
  };
}
