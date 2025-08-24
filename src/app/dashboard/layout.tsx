import { Sidebar } from "../components/Sidebar";
import BackgroundGradient from "../components/layout/BackgroundGradient";
import ConnectionLine from "../components/layout/ConnectionLine";
import GradientCircles from "../components/layout/GradientCircles";
import GridPattern from "../components/layout/GridPattern";
import ShootingStars from "../components/layout/ShootingStars";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <div className="hidden md:flex w-20 lg:w-24">
              <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
