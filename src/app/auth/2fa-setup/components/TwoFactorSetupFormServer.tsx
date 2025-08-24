"use client";

import React, { useEffect, startTransition } from "react";
import { useActionState } from "react";
import {
  setup2FAAction,
  type TwoFactorSetupFormState,
} from "@/backend_lib/actions/2fa";
import ErrorState from "./ErrorState";
import TwoFactorSetupContainer from "./TwoFactorSetupContainer";

const initialState: TwoFactorSetupFormState = {
  success: false,
};

export type TwoFactorStep = "setup" | "verify" | "existing";

export default function TwoFactorSetupFormServer() {
  const [state, formAction, isPending] = useActionState(
    setup2FAAction,
    initialState
  );

  // Trigger initial 2FA setup to generate QR code
  useEffect(() => {
    if (!state.qrCode && !isPending && !state.errors) {
      // Create a FormData object with no verification code to trigger initial setup
      const formData = new FormData();
      startTransition(() => {
        formAction(formData);
      });
    }
  }, [state.qrCode, isPending, state.errors, formAction]); // Include dependencies

  // Handle successful setup and redirect
  useEffect(() => {
    if (state.success && state.qrCode) {
      // QR code generated, show verification form
      // This will be handled by the component state
    }
  }, [state.success, state.qrCode]);

  const handleRetry = () => {
    // Reset form state by refreshing the page
    window.location.reload();
  };

  const step = state.success && state.qrCode ? "verify" : "setup";
  console.log(step);
  return (
    <>
      <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
        Two-Factor Authentication Setup
      </h4>
      <p className="mb-9 ml-1 text-base text-gray-600 dark:text-gray-400">
        Scan the QR code with your authenticator app to set up 2FA for your
        account
      </p>

      {/* Error State */}
      {state.errors?._form && (
        <ErrorState
          error={state.errors._form[0] || "An error occurred"}
          step={step}
          onRetrySetup={handleRetry}
          onRetryStatus={handleRetry}
        />
      )}

      {/* Two Factor Setup Container */}
      {state.qrCode && (
        <TwoFactorSetupContainer
          step={step}
          qrCode={state.qrCode}
          secret={state.secret}
          formAction={formAction}
          loading={isPending}
          errors={state.errors}
        />
      )}
    </>
  );
}
