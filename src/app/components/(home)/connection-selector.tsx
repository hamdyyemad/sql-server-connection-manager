"use client";

import { useState } from "react";
import { useConnectionsStore } from "@/frontend_lib/store/useConnectionsStore";
import { ConnectionIndicator, ConnectionDropdown } from "../connection";

export default function ConnectionSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const connections = useConnectionsStore((state) => state.connections);

  if (connections.length === 0) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-lg p-2 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-xs text-gray-400">No connections</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ConnectionIndicator 
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      <ConnectionDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
