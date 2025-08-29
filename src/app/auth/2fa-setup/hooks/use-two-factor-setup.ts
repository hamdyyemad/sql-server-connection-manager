"use client";
import { startTransition, useEffect, useActionState } from "react";
import {
  setup2FAAction,
  TwoFactorSetupFormState,
} from "@/backend_lib/actions/2fa";

const initialState: TwoFactorSetupFormState = {
  success: false,
};

export function useTwoFactorSetup() {
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
  }, [state.qrCode, isPending, state.errors, formAction]);

  // Handle successful setup and redirect
  useEffect(() => {
    if (state.success && state.qrCode) {
      // QR code generated, show verification form
      // This will be handled by the component state
    }
  }, [state.success, state.qrCode]);

  const shouldRender = !!state.qrCode;
  const hasError = !!state.errors?._form;

  return {
    state,
    formAction,
    isPending,
    shouldRender,
    hasError,
    error: state.errors?._form?.[0] || "An error occurred",
    qrCode: state.qrCode,
    secret: state.secret || "",
  };
}
