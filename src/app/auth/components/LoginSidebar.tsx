export default function LoginSidebar() {
  return (
    <div className="absolute right-0 hidden h-full min-h-screen lg:block lg:w-[49vw] 2xl:w-[44vw]">
      <div
        className="absolute flex h-full w-full items-end justify-center bg-cover bg-center lg:rounded-bl-[120px] xl:rounded-bl-[200px]"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23374151" stroke-width="0.5" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>')`,
          backgroundSize: "20px 20px",
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20 lg:rounded-bl-[120px] xl:rounded-bl-[200px]"></div>

        {/* Content */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
          {/* Logo and Brand */}
          <div className="mb-12 xl:mb-[70px] mt-8 flex w-full items-center justify-center">
            <div className="me-2 flex h-[56px] w-[56px] xl:h-[76px] xl:w-[76px] items-center justify-center rounded-md bg-white text-zinc-950 dark:text-zinc-900 shadow-lg">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-9 w-9"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <h5 className="text-2xl font-bold leading-5 text-white drop-shadow-lg">
              SQL Server Manager
            </h5>
          </div>

          {/* Testimonial */}
          <div className="flex w-full flex-col items-center justify-center text-2xl font-bold text-white px-8">
            <h4 className="mb-5 flex w-1/2 md:w-9/12 items-center justify-center rounded-md text-center text-xl font-bold leading-relaxed drop-shadow-lg">
              &ldquo;This database management system has revolutionized how we
              handle our SQL Server operations, providing intuitive tools and
              powerful analytics that save us hours every day.&rdquo;
            </h4>
            <h5 className="text-base font-medium leading-5 text-zinc-300 drop-shadow-lg">
              Database Administrator - Enterprise Solutions
            </h5>
          </div>

          {/* Floating elements for visual interest */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
