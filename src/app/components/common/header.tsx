import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigationStore } from "@/frontend_lib/store/use-navigation-store";

const Header = React.memo(function Header() {
  const activeItem = useNavigationStore((state) => state.activeItem);
  const activeSubItem = useNavigationStore((state) => state.activeSubItem);

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 flex shrink-0 items-center gap-2 border-b p-4 z-30">
      <SidebarTrigger className="-ml-1 cursor-pointer" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/">SQL Manager</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          
          {activeSubItem ? (
            // When we have a sub-item, show: ActiveItem -> ActiveSubItem
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href={activeItem.url}>
                  {activeItem.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{activeSubItem.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            // When no sub-item, show: ActiveItem (as current page)
            <BreadcrumbItem>
              <BreadcrumbPage>{activeItem.title}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
});

export default Header;
