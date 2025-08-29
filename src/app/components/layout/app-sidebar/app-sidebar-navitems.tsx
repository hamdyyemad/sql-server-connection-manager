"use client";
import React from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { AppSidebarFooter, AppSidebarHeader, AppSidebarContent, SecondSidebar } from ".";
import { useNavigationSync, useNavigation } from "@/frontend_lib/hooks";

const AppSidebarNavItems = React.memo(function AppSidebarNavItems() {
  // Sync navigation store with URL changes
  useNavigationSync();
  
  // Get navigation state from store
  const { activeItem, activeSubItem } = useNavigation();

  return (
    <>
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <AppSidebarHeader />
        <AppSidebarContent activeItem={activeItem} />
        <AppSidebarFooter />
      </Sidebar>
      <SecondSidebar
        activeItem={activeItem}
        activeSubItem={activeSubItem}
      />
    </>
  );
});

export default AppSidebarNavItems;
