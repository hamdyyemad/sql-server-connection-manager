"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUserAvatar, NavUserDropdown } from "./layout/nav-user";

const user = {
  name: "Admin User",
  email: "admin@example.com",
  avatar: "/avatars/admin.jpg",
};

const NavUser = React.memo(function NavUser() { 
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <NavUserAvatar name={user.name} email={user.email} avatar={user.avatar} />
          </DropdownMenuTrigger>
          <NavUserDropdown name={user.name} email={user.email} avatar={user.avatar} />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
});

export { NavUser };
