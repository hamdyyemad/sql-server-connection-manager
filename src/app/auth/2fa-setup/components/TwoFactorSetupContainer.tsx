"use client";

import React, { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import QRCodeDisplay from "./QRCodeDisplay";
import { TwoFactorStep } from "./TwoFactorSetupFormServer";
import { Button } from "@/app/design/button/Button";

interface TwoFactorSetupContainerProps {
  step: TwoFactorStep;
  qrCode?: string;
  secret?: string;
  formAction: (formData: FormData) => void;
  loading: boolean;
  errors?: {
    verificationCode?: string[];
    _form?: string[];
  };
}

export default function TwoFactorSetupContainer({
  step,
  qrCode,
  secret,
  formAction,
  loading,
  errors,
}: TwoFactorSetupContainerProps) {
  const router = useRouter();
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleNext = () => {
    // Middleware will handle redirects based on authentication status
    // Just navigate to the next step in the flow
    router.push("/auth/2fa-verify");
  };

  const handleRegenerate = () => {
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

  if (!qrCode) {
    return null; // Don't render anything if QR code is not available
  }

  return (
    <div className="space-y-6 flex flex-col items-center">
      {/* QR Code Display */}
      <QRCodeDisplay
        qrCode={qrCode}
        secret={secret || ""}
        onRegenerate={handleRegenerate}
        loading={isRegenerating}
      />

      {/* Next Button */}
      <div className="text-center">
        <Button
          variant="primary"
          size="md"
          style={{
            marginLeft: "-10px",
          }}
          onClick={handleNext}
          disabled={loading}
          rightIcon="→"
        >
          I&apos;ve scanned the QR code
        </Button>
      </div>
    </div>
  );
}
