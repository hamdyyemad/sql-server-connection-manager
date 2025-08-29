"use client";
import { startTransition, useState } from "react";

import ManualSecret from "./qr-code-display/manual-secret";
import QRCodeSkeleton from "./qr-code-display/qr-code-skeleton";
import QRCodeRegenerateBtn from "./qr-code-display/qr-code-regenerate-btn";
import QRCodeImage from "./qr-code-display/qr-code-image";

interface QRCodeDisplayProps {
  qrCode: string;
  secret: string;
  formAction: (formData: FormData) => void;
}

export default function QRCodeDisplay({
  qrCode,
  secret,
  formAction,
}: QRCodeDisplayProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const onRegenerate = () => {
    setIsRegenerating(true);

    // Use startTransition to properly handle the server action
    startTransition(() => {
      const formData = new FormData();
      formAction(formData);
    });

    // Set a timeout to reset the loading state after a reasonable delay
    // This ensures the loading state is shown even if the formAction completes quickly
    setTimeout(() => {
      setIsRegenerating(false);
    }, 1000); // Show loading for at least 1 second
  };

  return (
    <div
      className="w-full flex flex-col items-center justify-center mb-8"
      style={{ marginLeft: "-20px", marginRight: "-20px" }}
    >
      <div className="bg-white p-4 rounded-lg mb-4 flex items-center justify-center shadow-lg relative">
        {/* QR Code Image with Next/Image and Skeleton Placeholder */}
        <div className="w-48 h-48 relative">
          {isRegenerating ? (
            // Skeleton placeholder when loading
            <QRCodeSkeleton />
          ) : (
            // Next/Image with blur placeholder
            <QRCodeImage qrCode={qrCode} />
          )}
        </div>

        {/* Regenerate button positioned in top right */}
        {!isRegenerating && (
          <QRCodeRegenerateBtn onRegenerate={onRegenerate} isRegenerating={isRegenerating} />
        )}
      </div> 

      <ManualSecret secret={secret} />
    </div>
  );
}
