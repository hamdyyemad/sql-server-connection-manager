import React from "react";

interface TableProps {
  columns: string[];
  data: any[];
}

export const Table: React.FC<TableProps> = ({ columns, data }) => {
  if (columns.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow-sm border h-96">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">📊</div>
          <p className="text-gray-500 font-medium">No table structure available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Fixed height container with scrollable content */}
      <div className="h-96 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap bg-gray-50"
                >
                  <div className="flex items-center space-x-1">
                    <span>{col}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="text-gray-300 text-2xl mb-3">📝</div>
                    <p className="text-gray-500 font-medium">No data exists</p>
                    <p className="text-gray-400 text-sm mt-1">This table is empty</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                  {columns.map((col) => (
                    <td 
                      key={col} 
                      className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap"
                    >
                      <div className="truncate" title={row[col] != null ? String(row[col]) : ""}>
                        {row[col] != null ? String(row[col]) : (
                          <span className="text-gray-400 italic">null</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Footer with info - outside scrollable area */}
      {data.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Showing {data.length} row{data.length !== 1 ? 's' : ''}</span>
            <span>{columns.length} column{columns.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
}; 