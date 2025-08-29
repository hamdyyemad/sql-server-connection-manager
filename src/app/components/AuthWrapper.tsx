"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../frontend_lib/store/useAuthStore";

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthWrapper({
  children,
  requireAuth = true,
}: AuthWrapperProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 AuthWrapper - Current state:", { isAuthenticated, requireAuth });
    
    if (requireAuth && !isAuthenticated) {
      console.log("🔍 AuthWrapper - Redirecting to login");
      router.push("/auth/login");
      return;
    }
    
    console.log("🔍 AuthWrapper - Setting loading to false");
    setIsLoading(false);
  }, [requireAuth, isAuthenticated, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is not required or user is authenticated, render children
  if (!requireAuth || isAuthenticated) {
    return <>{children}</>;
  }

  // This should not be reached due to the redirect in useEffect
  return null;
}
