"use client";

import React, { useState } from "react";
import { useActionState } from "react";
import {
  verify2FAAction,
  type TwoFactorVerifyFormState,
} from "@/backend_lib/actions/2fa";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import VerificationForm from "./VerificationForm";

const initialState: TwoFactorVerifyFormState = {
  success: false,
};

export default function TwoFactorVerifyFormServer() {
  const [otp, setOtp] = useState<string>("");
  const [state, formAction, isPending] = useActionState(
    verify2FAAction,
    initialState
  );

  const handleRetry = () => {
    // Reset form state by refreshing the page
    window.location.reload();
  };

  const handleOtpChange = (value: string) => {
    console.log(
      `TwoFactorVerifyFormServer handleOtpChange called with value: "${value}"`
    );
    setOtp(value);
  };

  return (
    <>
      <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
        Two-Factor Authentication
      </h4>
      <p className="mb-9 ml-1 text-base text-gray-600 dark:text-gray-400">
        Enter the verification code from your authenticator app
      </p>

      {/* Loading State */}
      {isPending && <LoadingState />}

      {/* Verification Form */}
      <VerificationForm
        otp={otp}
        onOtpChange={handleOtpChange}
        formAction={formAction}
        loading={isPending}
        errors={state.errors}
      />

      {/* Error State */}
      {state.errors?._form && (
        <ErrorState
          error={state.errors._form[0] || "An error occurred"}
          onRetry={handleRetry}
        />
      )}
    </>
  );
}
