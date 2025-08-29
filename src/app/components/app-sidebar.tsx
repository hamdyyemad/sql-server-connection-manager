import { Sidebar } from "@/components/ui/sidebar";
import { AppSidebarNavItems } from "./layout/app-sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* First & Second sidebars - Icon navigation */}
      <AppSidebarNavItems />
    </Sidebar>
  );
}
