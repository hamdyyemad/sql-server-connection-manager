"use client";
import React from "react";

export default function LoadingState() {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-400">Verifying...</p>
    </div>
  );
}
