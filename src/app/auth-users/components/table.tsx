"use client";
import { useState } from "react";
import TableFilters from "./table-filters";
import TableUsers from "./table-users";

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    role: "Administrator",
    status: "Active",
    lastLogin: "2024-01-15 14:30:00",
    createdAt: "2024-01-01 10:00:00",
  },
  {
    id: 2,
    username: "john_doe",
    email: "john.doe@example.com",
    role: "User",
    status: "Active",
    lastLogin: "2024-01-14 16:45:00",
    createdAt: "2024-01-05 09:15:00",
  },
  {
    id: 3,
    username: "jane_smith",
    email: "jane.smith@example.com",
    role: "Moderator",
    status: "Inactive",
    lastLogin: "2024-01-10 11:20:00",
    createdAt: "2024-01-03 14:30:00",
  },
  {
    id: 4,
    username: "bob_wilson",
    email: "bob.wilson@example.com",
    role: "User",
    status: "Active",
    lastLogin: "2024-01-15 08:15:00",
    createdAt: "2024-01-08 16:45:00",
  },
  {
    id: 5,
    username: "alice_brown",
    email: "alice.brown@example.com",
    role: "User",
    status: "Suspended",
    lastLogin: "2024-01-12 13:10:00",
    createdAt: "2024-01-02 12:00:00",
  },
];

export default function Table() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400";
      case "Inactive":
        return "bg-gray-500/20 text-gray-400";
      case "Suspended":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrator":
        return "bg-purple-500/20 text-purple-400";
      case "Moderator":
        return "bg-blue-500/20 text-blue-400";
      case "User":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };
  return (
    <>
      {/* Filters */}
      <TableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Users Table */}
      <TableUsers
        filteredUsers={filteredUsers}
        getRoleColor={getRoleColor}
        getStatusColor={getStatusColor}
        users={users}
      />
    </>
  );
}
