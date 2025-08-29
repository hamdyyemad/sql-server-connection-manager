import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useNavigationStore } from "@/frontend_lib/store/use-navigation-store";

/**
 * Hook that synchronizes the Zustand navigation store with URL changes
 * This separates concerns: store handles state, hook handles URL sync
 */
export function useNavigationSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const updateNavigation = useNavigationStore((state) => state.updateNavigation);

  // Sync store with URL changes
  useEffect(() => {
    updateNavigation(pathname, searchParams);
  }, [pathname, searchParams, updateNavigation]);
}

/**
 * Hook that provides navigation state and actions
 * Use this in components that need navigation data
 */
export function useNavigation() {
  const {
    activeItem,
    activeSubItem,
    isSubItemActive,
  } = useNavigationStore();

  return {
    activeItem,
    activeSubItem,
    isSubItemActive,
  };
}

export default useNavigationSync;
