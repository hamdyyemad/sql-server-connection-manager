import { useCallback } from 'react';

// Custom hook for sidebar actions that doesn't cause re-renders
export function useSidebarAction() {
  const openSidebar = useCallback(() => {
    // Use imperative DOM manipulation or event dispatch instead of context
    const sidebarTrigger = document.querySelector('[data-sidebar="trigger"]') as HTMLButtonElement;
    if (sidebarTrigger) {
      sidebarTrigger.click();
    }
  }, []);

  return { openSidebar };
}
