import React from "react";
import { Label } from "@/components/ui/label";
import { SidebarHeader, SidebarInput } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { type NavMain } from "@/frontend_lib/data/navigation";

const SecondSidebarHeader = React.memo(function SecondSidebarHeader({
  activeItem,
  showUnreadOnly,
  setShowUnreadOnly,
  searchQuery,
  setSearchQuery,
}: {
  activeItem: NavMain;
  showUnreadOnly: boolean;
  setShowUnreadOnly: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}) {
  return <SidebarHeader className="gap-3.5 border-b p-4">
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
});

export default SecondSidebarHeader;