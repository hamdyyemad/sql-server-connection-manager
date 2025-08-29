import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { ChevronsUpDown } from "lucide-react";
import { forwardRef } from "react";

const NavUserAvatar = forwardRef<
  HTMLButtonElement,
  {
    name: string;
    email: string;
    avatar: string;
  }
>(({ name, email, avatar, ...props }, ref) => {
 
  return (
    <SidebarMenuButton
      ref={ref}
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
      {...props}
    >
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
      <ChevronsUpDown className="ml-auto size-4" />
    </SidebarMenuButton>
  );
});

NavUserAvatar.displayName = "NavUserAvatar";

export default NavUserAvatar;
