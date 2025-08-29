import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface UseActiveTabOptions {
  tabs: string[];
  defaultTab?: string;
  urlParamName?: string;
}

interface UseActiveTabReturn {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isTabActive: (tab: string) => boolean;
}

export function useActiveTab(options: UseActiveTabOptions): UseActiveTabReturn {
  const { tabs, defaultTab, urlParamName = "tab" } = options;
  const searchParams = useSearchParams();
  
  // Default to first tab if no defaultTab is provided
  const initialTab = defaultTab || tabs[0];
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Handle tab parameter from URL
  useEffect(() => {
    const tabParam = searchParams.get(urlParamName);
    if (tabParam && tabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams, tabs, urlParamName]);

  // Helper function to check if a tab is active
  const isTabActive = (tab: string): boolean => {
    return activeTab === tab;
  };

  return {
    activeTab,
    setActiveTab,
    isTabActive,
  };
}

export default useActiveTab;