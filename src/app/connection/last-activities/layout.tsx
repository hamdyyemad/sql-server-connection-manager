import BackgroundGradient from "../../components/layout/background-gradient";
import GradientCircles from "../../components/layout/gradient-circles";
import GridPattern from "../../components/layout/grid-pattern";
import ShootingStars from "../../components/layout/shooting-stars";
import ConnectionLine from "../../components/layout/connection-line";
import { Sidebar } from "../../components/Sidebar";

import type { Metadata } from "next";

import "@/app//globals.css";

export const metadata: Metadata = {
  title: "Last Activities - SQL Server Manager",
  description: "View recent database operations and queries",
};

export default function LastActivitiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black relative overflow-hidden font-sans">
        {/* Background Gradient */}
        <BackgroundGradient />

        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
        <div className="relative z-10 overflow-hidden">
          <div className="flex max-h-screen">
            {/* Sidebar */}
            {/* <div className="hidden md:flex w-20 lg:w-24">
              <Sidebar />
            </div> */}

            {/* Main Content */}
            <main className="flex-1 overflow-hidden p-5">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
