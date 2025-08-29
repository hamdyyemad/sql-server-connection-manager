import { useCallback, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { navMain, type NavMain, type NavSubItem } from "@/frontend_lib/data/navigation";

interface UseActiveNavigationReturn {
  activeItem: NavMain;
  activeSubItem: NavSubItem | null;
  getActiveItem: () => NavMain;
  getActiveSubItem: () => NavSubItem | null;
  isSubItemActive: (subItemId: string) => boolean;
}

export function useActiveNavigation(): UseActiveNavigationReturn {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine active item based on current path
  const getActiveItem = useCallback((): NavMain => {
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

  // Get active sub-item based on query parameters
  const getActiveSubItem = useCallback((): NavSubItem | null => {
    const activeItem = getActiveItem();
    
    if (!activeItem.subItems || !activeItem.queryParam) {
      return null;
    }

    const queryParamValue = searchParams.get(activeItem.queryParam);
    if (!queryParamValue) {
      return activeItem.subItems[0] || null; // Default to first sub-item
    }

    const subItem = activeItem.subItems.find(item => item.id === queryParamValue);
    return subItem || activeItem.subItems[0] || null;
  }, [getActiveItem, searchParams]);

  const [activeItem, setActiveItem] = useState(() => getActiveItem());
  const [activeSubItem, setActiveSubItem] = useState(() => getActiveSubItem());

  // Update active item and sub-item when pathname or search params change
  useEffect(() => {
    const newActiveItem = getActiveItem();
    const newActiveSubItem = getActiveSubItem();
    
    if (newActiveItem.title !== activeItem?.title) {
      setActiveItem(newActiveItem);
    }
    
    if (newActiveSubItem?.id !== activeSubItem?.id) {
      setActiveSubItem(newActiveSubItem);
    }
  }, [pathname, searchParams, getActiveItem, getActiveSubItem, activeItem?.title, activeSubItem?.id]);

  // Helper function to check if a sub-item is active
  const isSubItemActive = useCallback((subItemId: string): boolean => {
    return activeSubItem?.id === subItemId;
  }, [activeSubItem?.id]);

  return {
    activeItem,
    activeSubItem,
    getActiveItem,
    getActiveSubItem,
    isSubItemActive,
  };
}

export default useActiveNavigation;
