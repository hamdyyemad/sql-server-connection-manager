import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  requires2FA: boolean;
  login: (userData: any) => void;
  logout: () => void;
  checkAuth: () => boolean;
  setRequires2FA: (requires: boolean) => void;
  complete2FA: (userData: any) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      requires2FA: false,
      login: (userData: any) => {
        set({ user: userData, requires2FA: true, isAuthenticated: false });
        // Don't set auth token yet - wait for 2FA completion
      },
      logout: () => {
        set({ isAuthenticated: false, user: null, requires2FA: false });
        // Remove cookie
        document.cookie =
          "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      },
      setRequires2FA: (requires: boolean) => {
        set({ requires2FA: requires });
      },
      complete2FA: (userData: any) => {
        console.log("🔍 Starting 2FA completion...");
        
        // Update state (cookie is set by backend)
        set({ isAuthenticated: true, user: userData, requires2FA: false });
        console.log("🔍 State updated");
        
        // Force a small delay to ensure everything is set
        setTimeout(() => {
          console.log("🔍 2FA completed, final auth state:", {
            isAuthenticated: true,
            user: userData,
            requires2FA: false
          });
        }, 100);
      },
      checkAuth: () => {
        const currentState = get();
        
        // For httpOnly cookies, we rely on the persisted state
        // The middleware will handle server-side authentication
        return currentState.isAuthenticated;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        requires2FA: state.requires2FA,
      }),
    }
  )
);
