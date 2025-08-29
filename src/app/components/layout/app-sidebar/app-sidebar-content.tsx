import React from "react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarContent,
} from "@/components/ui/sidebar";
import { type NavMain, navMain } from "@/frontend_lib/data/navigation";
import { SidebarNavItem } from ".";

const AppSidebarContent = React.memo(function AppSidebarContent({
  activeItem,
}: {
  activeItem: NavMain;
}) {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent className="px-1.5 md:px-0">
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarNavItem 
                key={item.title} 
                item={item} 
                isActive={activeItem?.title === item.title} 
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
});

export default AppSidebarContent;
