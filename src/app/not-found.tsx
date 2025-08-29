"use client"
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Main content */}
      <div className="relative z-10 text-center px-6">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>


        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-100 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            {"The page you're looking for seems to have wandered off into the digital cosmos."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 border border-blue-500/30"
          >
            Return Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-transparent border border-gray-600 hover:border-blue-500 text-gray-300 hover:text-blue-400 font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Go Back
          </button>
        </div>

        {/* Decorative elements */}
        <div className="mt-16 flex justify-center space-x-2">
          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

    </div>
  );
} 