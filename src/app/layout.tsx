import BackgroundGradient from "./components/layout/background-gradient";
import GradientCircles from "./components/layout/gradient-circles";
import GridPattern from "./components/layout/grid-pattern";
import ShootingStars from "./components/layout/shooting-stars";
import ConnectionLine from "./components/layout/connection-line";
import LayoutWrapper from "./components/LayoutWrapper";

import type { Metadata } from "next";
import "./globals.css";

// Import debug utilities to activate console override
import "@/frontend_lib/utils/debug-init";


export const metadata: Metadata = {
  title: "SQL Server Manager",
  description: "Modern SQL Server connection manager with smooth shadcn design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-foreground font-sans relative overflow-hidden">
        <BackgroundGradient />
        {/* Animated Background Elements */}
        <div
          className="fixed inset-0 overflow-hidden pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {/* Large gradient circles */}
          <GradientCircles />

          {/* Grid pattern */}
          <GridPattern />

          {/* Floating particles */}
          <ShootingStars />

          {/* Connection lines */}
          <ConnectionLine />
        </div>
        {/* Content */}
        <div className="" style={{ zIndex: 10 }}>
          <LayoutWrapper>{children}</LayoutWrapper>
        </div>
      </body>
    </html>
  );
}
