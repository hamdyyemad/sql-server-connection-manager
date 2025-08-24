"use client";
import React from "react";
import Image from "next/image";

interface QRCodeDisplayProps {
  qrCode: string;
  secret: string;
  onRegenerate?: () => void;
  loading?: boolean;
}

// Refresh/Reload SVG Icon
const RefreshIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

export default function QRCodeDisplay({
  qrCode,
  secret,
  onRegenerate,
  loading = false,
}: QRCodeDisplayProps) {
  return (
    <div
      className="w-full flex flex-col items-center justify-center mb-8"
      style={{ marginLeft: "-20px", marginRight: "-20px" }}
    >
      <div className="bg-white p-4 rounded-lg mb-4 flex items-center justify-center shadow-lg relative">
        {/* QR Code Image with Next/Image and Skeleton Placeholder */}
        <div className="w-48 h-48 relative">
          {loading ? (
            // Skeleton placeholder when loading
            <div className="w-48 h-48 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <svg
                  className="animate-spin w-8 h-8 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-xs text-gray-500">
                  Generating new QR code...
                </p>
              </div>
            </div>
          ) : (
            // Next/Image with blur placeholder
            <Image
              src={qrCode}
              alt="QR Code"
              width={192}
              height={192}
              className="w-48 h-48"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              priority
            />
          )}
        </div>

        {/* Regenerate button positioned in top right */}
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={loading}
            className="absolute -top-2 -right-2 p-2 bg-gray-100 hover:scale-110 hover:rotate-180 border border-gray-200 rounded-full shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            title="Regenerate QR Code"
          >
            <RefreshIcon className="w-4 h-4 text-gray-900" />
          </button>
        )}
      </div>

      <p className="text-sm text-gray-400 mb-2 text-center w-full px-4">
        Scan this QR code with your authenticator app
      </p>
      <div className="bg-gray-800 p-3 rounded-lg w-full max-w-md mx-auto px-4 mb-4">
        <p className="text-xs text-gray-400 mb-1 text-center">
          Manual entry code:
        </p>
        <p className="text-white font-mono text-sm break-all text-center">
          {secret}
        </p>
      </div>
    </div>
  );
}
