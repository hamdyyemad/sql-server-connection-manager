"use client";
import { useTwoFactorSetup } from "../hooks/use-two-factor-setup";

import ErrorState from "./error-state";
import QRCodeDisplay from "./qr-code-display";
import NavigateButton from "./navigate-button";

export default function TwoFactorSetupContainer() {
  const {
    formAction,
    isPending,
    shouldRender,
    hasError,
    error,
    qrCode,
    secret,
  } = useTwoFactorSetup();

  if (!shouldRender) {
    return null; // Don't render anything if QR code is not available
  }

  return (
    <>
      {hasError && <ErrorState error={error} />}
      {qrCode && (
        <div className="space-y-6 flex flex-col items-center">
          {/* QR Code Display */}
          <QRCodeDisplay
            formAction={formAction}
            qrCode={qrCode}
            secret={secret}
          />

          {/* Next Button */}
          <NavigateButton isPending={isPending} />
        </div>
      )}
    </>
  );
}
