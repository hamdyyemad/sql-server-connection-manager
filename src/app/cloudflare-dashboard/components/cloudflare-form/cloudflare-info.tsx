export default function CloudflareInfo() {
  return (
    <>
      <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-slate-100 mt-2 mb-2">
          Connect to Cloudflare
        </h2>
        <p className="text-slate-400 mb-6">
          Enter your Cloudflare API credentials to access your dashboard
        </p>
      </div>
    </>
  );
}
