"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/frontend_lib/store/useAuthStore";
import {
  Database,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Command,
} from "lucide-react";

import { NavUser } from "./NavUser";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";

// Navigation data
const navMain = [
  {
    title: "Connections",
    url: "/",
    icon: Database,
    isActive: false,
  },
  {
    title: "Cloudflare Dashboard",
    url: "/cloudflare",
    icon: BarChart3,
    isActive: false,
  },
  {
    title: "Auth Users",
    url: "/auth-users",
    icon: Users,
    isActive: false,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    isActive: false,
  },
];

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

const user = {
  name: "Admin User",
  email: "admin@example.com",
  avatar: "/avatars/admin.jpg",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const { setOpen } = useSidebar();

  // Determine active item based on current path
  const getActiveItem = React.useCallback(() => {
    // Exact match for root path
    if (pathname === "/") return navMain[0];

    // Find exact match first
    const exactMatch = navMain.find((item) => item.url === pathname);
    if (exactMatch) return exactMatch;

    // Fallback to startsWith for nested routes
    const startsWithMatch = navMain.find((item) =>
      pathname.startsWith(item.url)
    );
    if (startsWithMatch) return startsWithMatch;

    // Default to Connections
    return navMain[0];
  }, [pathname]);

  const [activeItem, setActiveItem] = React.useState(getActiveItem());
  const [showUnreadOnly, setShowUnreadOnly] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Update active item when pathname changes, but only if it's actually different
  React.useEffect(() => {
    const newActiveItem = getActiveItem();
    if (newActiveItem.title !== activeItem?.title) {
      setActiveItem(newActiveItem);
      // Reset sidebar-specific state when switching items
      setShowUnreadOnly(false);
      setSearchQuery("");
    }
  }, [pathname, getActiveItem, activeItem?.title]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleItemClick = React.useCallback(
    (item: (typeof navMain)[0]) => {
      // Only update if it's actually a different item
      if (item.title !== activeItem?.title) {
        setActiveItem(item);
        // Reset sidebar-specific state
        setShowUnreadOnly(false);
        setSearchQuery("");
      }
      router.push(item.url);
      // Force the sidebar to open
      setOpen(true);
    },
    [activeItem?.title, router, setOpen]
  );

  // Filter connections based on search and status
  const filteredConnections = React.useMemo(() => {
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
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* First sidebar - Icon navigation */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link href="/">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">SQL Manager</span>
                    <span className="truncate text-xs">Dashboard</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => handleItemClick(item)}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} onLogout={handleLogout} />
        </SidebarFooter>
      </Sidebar>

      {/* Second sidebar - Content details */}
      <Sidebar
        key={activeItem?.title}
        collapsible="none"
        className="hidden flex-1 md:flex"
      >
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {activeItem?.title}
            </div>
            {activeItem?.title === "Connections" && (
              <Label className="flex items-center gap-2 text-sm">
                <span>Connected Only</span>
                <Switch
                  checked={showUnreadOnly}
                  onCheckedChange={setShowUnreadOnly}
                  className="shadow-none"
                />
              </Label>
            )}
          </div>
          <SidebarInput
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SidebarHeader>
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
                  <p className="text-sm">
                    Connect to Cloudflare to view analytics
                  </p>
                </div>
              )}
              {activeItem?.title === "Auth Users" && (
                <div className="p-4 text-center text-muted-foreground">
                  <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p className="text-sm">User management and authentication</p>
                </div>
              )}
              {activeItem?.title === "Settings" && (
                <div className="p-4 text-center text-muted-foreground">
                  <Settings className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p className="text-sm">
                    Application settings and configuration
                  </p>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
