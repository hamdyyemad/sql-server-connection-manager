import LoginSidebar from "./components/LoginSidebar";
import ThemeToggle from "./components/ThemeToggle";
import "./style.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto min-h-screen">
      <div className="relative flex">
        <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%] lg:h-screen lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:h-[100vh] xl:max-w-[1383px] xl:px-0 xl:pl-[70px]">
          <div className="mb-auto flex flex-col pl-5 pr-5 md:pr-0 md:pl-12 lg:max-w-[48%] lg:pl-0 xl:max-w-full">
            {/* Content Container */}
            <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
              <div className="flex min-h-[calc(100vh-8rem)] w-full max-w-full flex-col items-center justify-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                {children}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <LoginSidebar />
        </div>
      </div>

      {/* Theme Toggle Button */}
      <ThemeToggle />
    </main>
  );
}
