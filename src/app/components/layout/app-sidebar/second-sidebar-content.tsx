import React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarContent,
} from "@/components/ui/sidebar";
import { Database, BarChart3, Users } from "lucide-react";
import { type NavMain, type NavSubItem } from "@/frontend_lib/data/navigation";
import { useRouter } from "next/navigation";
import { useNavigationStore } from "@/frontend_lib/store/use-navigation-store";

const SecondSidebarContent = React.memo(function SecondSidebarContent({
  activeItem,
  activeSubItem,
  filteredConnections,
  searchQuery,
}: {
  activeItem: NavMain;
  activeSubItem: NavSubItem | null;
  filteredConnections: {
    name: string;
    description: string;
    type: string;
    status: string;
    lastActivity: string;
  }[];
  searchQuery: string;
}) {
  const router = useRouter();
  const isSubItemActive = useNavigationStore((state) => state.isSubItemActive);

  return (
    <SidebarContent>
      <SidebarGroup className="px-0">
        <SidebarGroupContent>
          {activeItem?.title === "Connections" && (
            <>
              {filteredConnections.length > 0 ? (
                filteredConnections.map((connection) => (
                  <a
                    href="#"
                    key={connection.name}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                  >
                    <div className="flex w-full items-center gap-2">
                      <span className="font-medium">{connection.name}</span>
                      <span
                        className={`ml-auto text-xs px-2 py-1 rounded-full ${
                          connection.status === "Connected"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {connection.status}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {connection.type}
                    </span>
                    <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
                      {connection.description}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Last activity: {connection.lastActivity}
                    </span>
                  </a>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <Database className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">
                    {searchQuery
                      ? "No connections found"
                      : "No connections available"}
                  </p>
                </div>
              )}
            </>
          )}
          {activeItem?.title === "Cloudflare Dashboard" && (
            <div className="p-4 text-center text-muted-foreground">
              <BarChart3 className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-sm">Connect to Cloudflare to view analytics</p>
            </div>
          )}
          {activeItem?.title === "Auth Users" && (
            <div className="p-4 text-center text-muted-foreground">
              <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-sm">User management and authentication</p>
            </div>
          )}
          {activeItem?.title === "Settings" && activeItem.subItems && (
            <div className="p-4 space-y-2">
              <div className="text-sm font-medium text-foreground mb-3">
                Settings Categories
              </div>
              {activeItem.subItems.map((subItem) => {
                const isActive = isSubItemActive(subItem.id);
                return (
                  <button
                    key={subItem.id}
                    onClick={() => {
                      // Navigate to settings with tab parameter
                      router.push(`/settings?${activeItem.queryParam}=${subItem.id}`);
                    }}
                    className={`cursor-pointer w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <span className="text-base">{subItem.icon}</span>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{subItem.name}</span>
                      {subItem.description && (
                        <span className="text-xs text-muted-foreground text-left">
                          {subItem.description}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
});

export default SecondSidebarContent;
