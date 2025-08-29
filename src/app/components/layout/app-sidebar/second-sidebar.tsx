"use client";

import React, { useState, useMemo } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { type NavMain, type NavSubItem } from "@/frontend_lib/data/navigation";
import { SecondSidebarContent, SecondSidebarHeader } from ".";

// Sample connection data for the nested sidebar
const connections = [
  {
    name: "Production Server",
    type: "SQL Server",
    status: "Connected",
    lastActivity: "2 min ago",
    description: "Main production database server with high availability setup",
  },
  {
    name: "Development DB",
    type: "SQL Server",
    status: "Connected",
    lastActivity: "5 min ago",
    description: "Development environment database for testing new features",
  },
  {
    name: "Staging Server",
    type: "SQL Server",
    status: "Disconnected",
    lastActivity: "1 hour ago",
    description: "Staging environment for pre-production testing",
  },
  {
    name: "Analytics DB",
    type: "PostgreSQL",
    status: "Connected",
    lastActivity: "10 min ago",
    description: "Analytics and reporting database with read replicas",
  },
  {
    name: "Backup Server",
    type: "SQL Server",
    status: "Connected",
    lastActivity: "30 min ago",
    description: "Backup and disaster recovery server",
  },
];

const SecondSidebar = React.memo(function SecondSidebar({
  activeItem,
  activeSubItem,
}: {
  activeItem: NavMain;
  activeSubItem: NavSubItem | null;
}) {
  // Move states into this component
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  console.log(activeItem);
  // Filter connections based on search and status
  const filteredConnections = useMemo(() => {
    return connections.filter((conn) => {
      const matchesSearch =
        searchQuery === "" ||
        conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conn.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conn.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !showUnreadOnly || conn.status === "Connected";

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, showUnreadOnly]);

  return (
    <Sidebar
      key={activeItem?.title}
      collapsible="none"
      className="hidden flex-1 md:flex"
    >
      <SecondSidebarHeader
        activeItem={activeItem}
        showUnreadOnly={showUnreadOnly}
        setShowUnreadOnly={setShowUnreadOnly}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <SecondSidebarContent
        activeItem={activeItem}
        activeSubItem={activeSubItem}
        filteredConnections={filteredConnections}
        searchQuery={searchQuery}
      />
    </Sidebar>
  );
});

export default SecondSidebar;
