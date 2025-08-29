import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with proper default to prevent initial re-render
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Server-side safe check
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    
    // Only set if different to prevent unnecessary re-render
    const currentIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
    if (currentIsMobile !== isMobile) {
      setIsMobile(currentIsMobile);
    }
    
    return () => mql.removeEventListener("change", onChange)
  }, [isMobile])

  return isMobile
}
