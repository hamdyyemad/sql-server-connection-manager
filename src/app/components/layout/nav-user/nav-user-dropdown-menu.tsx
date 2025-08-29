import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sparkles, BadgeCheck, CreditCard, Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/frontend_lib/store/useAuthStore";
import { useIsMobile } from "@/frontend_lib/hooks/use-mobile";
import React from "react";

const menuItems = [
  {
    group: "pro",
    items: [
      {
        icon: Sparkles,
        label: "Upgrade to Pro",
        onClick: () => console.log("Upgrade to Pro clicked")
      }
    ]
  },
  {
    group: "account",
    items: [
      {
        icon: BadgeCheck,
        label: "Account",
        onClick: () => console.log("Account clicked")
      },
      {
        icon: CreditCard,
        label: "Billing",
        onClick: () => console.log("Billing clicked")
      },
      {
        icon: Bell,
        label: "Notifications",
        onClick: () => console.log("Notifications clicked")
      }
    ]
  }
];

const NavUserDropdown = React.memo(function NavUserDropdown({
  name,
  email,
  avatar,
}: {
  name: string;
  email: string;
  avatar: string;
}) {
  const isMobile = useIsMobile();

  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      side={isMobile ? "bottom" : "right"}
      align="end"
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="rounded-lg">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{name}</span>
            <span className="truncate text-xs">{email}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {menuItems.map((group, groupIndex) => (
        <div key={group.group}>
          <DropdownMenuGroup>
            {group.items.map((item, itemIndex) => {
              const IconComponent = item.icon;
              return (
                <DropdownMenuItem key={itemIndex} onClick={item.onClick}>
                  <IconComponent className="mr-2 h-4 w-4" />
                  {item.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
          {groupIndex < menuItems.length - 1 && <DropdownMenuSeparator />}
        </div>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
});

export default NavUserDropdown;
