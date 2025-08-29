import { create } from "zustand";
import { navMain, type NavMain, type NavSubItem } from "@/frontend_lib/data/navigation";

interface NavigationState {
  activeItem: NavMain;
  activeSubItem: NavSubItem | null;
  
  // Actions
  setActiveItemByPath: (pathname: string) => void;
  setActiveSubItemByQuery: (queryParams: URLSearchParams, activeItem: NavMain) => void;
  updateNavigation: (pathname: string, searchParams: URLSearchParams) => void;
  isSubItemActive: (subItemId: string) => boolean;
  
  // Helpers
  getActiveItem: (pathname: string) => NavMain;
  getActiveSubItem: (queryParams: URLSearchParams, activeItem: NavMain) => NavSubItem | null;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  // Initial state - default to first nav item
  activeItem: navMain[0],
  activeSubItem: null,

  // Helper to determine active item based on pathname
  getActiveItem: (pathname: string): NavMain => {
    // Exact match for root path
    if (pathname === "/") return navMain[0];

    // Find exact match first
    const exactMatch = navMain.find((item) => item.url === pathname);
    if (exactMatch) return exactMatch;

    // Fallback to startsWith for nested routes
    const startsWithMatch = navMain.find((item) =>
      pathname.startsWith(item.url) && item.url !== "/"
    );
    if (startsWithMatch) return startsWithMatch;

    // Default to first item
    return navMain[0];
  },

  // Helper to get active sub-item based on query parameters
  getActiveSubItem: (searchParams: URLSearchParams, activeItem: NavMain): NavSubItem | null => {
    if (!activeItem.subItems || !activeItem.queryParam) {
      return null;
    }

    const queryParamValue = searchParams.get(activeItem.queryParam);
    if (!queryParamValue) {
      return activeItem.subItems[0] || null; // Default to first sub-item
    }

    const subItem = activeItem.subItems.find(item => item.id === queryParamValue);
    return subItem || activeItem.subItems[0] || null;
  },

  // Actions
  setActiveItemByPath: (pathname: string) => {
    const newActiveItem = get().getActiveItem(pathname);
    set({ activeItem: newActiveItem });
  },

  setActiveSubItemByQuery: (searchParams: URLSearchParams, activeItem: NavMain) => {
    const newActiveSubItem = get().getActiveSubItem(searchParams, activeItem);
    set({ activeSubItem: newActiveSubItem });
  },

  // Main update function that handles both pathname and query changes
  updateNavigation: (pathname: string, searchParams: URLSearchParams) => {
    const { getActiveItem, getActiveSubItem } = get();
    
    const newActiveItem = getActiveItem(pathname);
    const newActiveSubItem = getActiveSubItem(searchParams, newActiveItem);
    
    set({ 
      activeItem: newActiveItem, 
      activeSubItem: newActiveSubItem 
    });
  },

  // Helper to check if a sub-item is active
  isSubItemActive: (subItemId: string): boolean => {
    const { activeSubItem } = get();
    return activeSubItem?.id === subItemId;
  },
}));