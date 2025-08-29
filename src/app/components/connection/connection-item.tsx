"use client";

import React from "react";
import { Check } from "lucide-react";

interface ConnectionItemProps {
  id: string;
  name: string;
  server: string;
  connectionType: string;
  isOnline: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const ConnectionItem = React.memo(function ConnectionItem({
  id,
  name,
  server,
  connectionType,
  isOnline,
  isSelected,
  onClick,
}: ConnectionItemProps) {
  return (
    <button
      className={`cursor-pointer w-full p-2 rounded-md text-left transition-all duration-200 ${
        isSelected
          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
          : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <div
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <div className="text-left min-w-0 flex-1">
            <p className="text-sm font-medium truncate">
              {name || server}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {server} • {connectionType}
            </p>
          </div>
        </div>
        {isSelected && (
          <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
        )}
      </div>
    </button>
  );
});

export default ConnectionItem;
