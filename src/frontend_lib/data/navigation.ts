import { BarChart3, Database, Settings, Users } from "lucide-react";

export interface NavSubItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface NavMain {
  title: string;
  url: string;
  icon: React.ElementType;
  isActive: boolean;
  subItems?: NavSubItem[];
  queryParam?: string; // The query parameter name for sub-items
}

export const navMain: NavMain[] = [
  {
    title: "Connections",
    url: "/",
    icon: Database,
    isActive: false,
  },
  {
    title: "Cloudflare Dashboard",
    url: "/cloudflare-dashboard",
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
    queryParam: "tab",
    subItems: [
      { 
        id: "profile", 
        name: "Profile", 
        icon: "👤",
        description: "Update your personal information and profile details"
      },
      { 
        id: "notifications", 
        name: "Notifications", 
        icon: "🔔",
        description: "Configure how you want to receive notifications"
      },
      { 
        id: "security", 
        name: "Security", 
        icon: "🔒",
        description: "Manage your account security and authentication settings"
      },
      { 
        id: "appearance", 
        name: "Appearance", 
        icon: "🎨",
        description: "Customize the look and feel of your dashboard"
      },
    ],
  },
];