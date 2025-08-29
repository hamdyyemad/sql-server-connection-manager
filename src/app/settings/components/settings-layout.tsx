"use client";

import React from "react";

interface SettingsLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export default function SettingsLayout({
  children,
  activeTab,
}: SettingsLayoutProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-extralight text-white/50">
          {activeTab[0]?.toUpperCase() + activeTab.slice(1)} Settings
        </h3>
      </div>

      <div className="w-full">
        <div className="w-full">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
