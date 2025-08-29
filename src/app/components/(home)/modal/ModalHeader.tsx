"use client";
import React from "react";

interface ModalHeaderProps {
  title: string;
  // onCloseAction: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {/* <button
        onClick={onCloseAction}
        className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button> */}
    </div>
  );
}; 