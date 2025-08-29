import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { type NavMain } from "@/frontend_lib/data/navigation";
// import { useSidebarAction } from "@/frontend_lib/hooks/use-sidebar-action"; // Uncomment if needed

interface SidebarNavItemProps {
  item: NavMain;
  isActive: boolean;
}

const SidebarNavItem = React.memo(function SidebarNavItem({
  item,
  isActive,
}: SidebarNavItemProps) {
  const router = useRouter();
  // const { openSidebar } = useSidebarAction(); // Uncomment if needed

  const handleItemClick = useCallback(() => {
    router.push(item.url);
    // openSidebar(); // Uncomment if you need sidebar to open on navigation
  }, [router, item.url]);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={{
          children: item.title,
          hidden: false,
        }}
        onClick={handleItemClick}
        isActive={isActive}
        className="px-2.5 md:px-2"
      >
        <item.icon />
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});

export { SidebarNavItem };
