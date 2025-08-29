"use client";
import { usePathname } from "next/navigation";
import ClientLayout from "./ClientLayout";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth/");

  if (isAuthPage) {
    // For auth pages, render children directly without ClientLayout
    return <>{children}</>;
  }

  // For non-auth pages, wrap with ClientLayout
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}
