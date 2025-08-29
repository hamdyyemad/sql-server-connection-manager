"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/frontend_lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/frontend_lib/utils/utils";

interface NavbarProps {
  onSidebarToggle: () => void;
}

export default function Navbar({ onSidebarToggle }: NavbarProps) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(3);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add actual dark mode toggle logic here
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50 h-16 flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSidebarToggle}
          className="p-2 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 transition-all duration-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center space-x-2 text-slate-400">
          <span className="text-sm font-medium">SQL Manager</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-slate-100 text-sm font-medium">Dashboard</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 transition-all duration-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v4.25l2.5 2.5V9.75a8.5 8.5 0 0 0-17 0v4.25l2.5-2.5V9.75a6 6 0 0 1 6-6z"
            />
          </svg>
          {notifications > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {notifications}
            </Badge>
          )}
        </Button>

        {/* Dark/Light Mode Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 transition-all duration-200"
        >
          {isDarkMode ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </Button>

        {/* Avatar */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group hover:scale-110 transition-transform duration-200">
            <span className="text-white text-sm font-medium">A</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-100">Admin User</p>
            <p className="text-xs text-slate-400">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
