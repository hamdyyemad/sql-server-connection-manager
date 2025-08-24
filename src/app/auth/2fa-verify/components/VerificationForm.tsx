"use client";
import React from "react";
import OTPInput from "./OTPInput";
import { Button } from "@/app/design/button/Button";

interface VerificationFormProps {
  otp?: string;
  loading: boolean;
  error?: string | null;
  onOtpChange?: (value: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  formAction?: (formData: FormData) => void;
  errors?: {
    verificationCode?: string[];
    _form?: string[];
  };
}

export default function VerificationForm({
  otp = "",
  loading,
  error,
  onOtpChange,
  onSubmit,
  formAction,
  errors,
}: VerificationFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    if (onSubmit) {
      onSubmit(e);
    }
  };

  const handleOtpChange = (value: string) => {
    if (onOtpChange) {
      onOtpChange(value);
    }
  };

  const handleFormAction = (formData: FormData) => {
    // Add the OTP value to the form data if it exists
    if (otp) {
      formData.set("verificationCode", otp);
    }
    if (formAction) {
      formAction(formData);
    }
  };

  const formError =
    error || errors?._form?.[0] || errors?.verificationCode?.[0];

  return (
    <>
      <form
        noValidate
        className="mb-4"
        onSubmit={handleSubmit}
        action={handleFormAction}
      >
        <div className="mb-3">
          <label
            htmlFor="verificationCode"
            className="text-sm text-navy-700 dark:text-white ml-1.5 font-medium"
          >
            Verification Code*
          </label>

          <OTPInput
            value={otp}
            onChange={handleOtpChange}
            length={6}
            disabled={loading}
            autoFocus={true}
          />

          <p className="text-xs text-gray-400 mt-1 text-center">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        {/* Error Message */}
        {formError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
            {formError}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
          loading={loading}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </Button>

        {/* Back to Setup Button */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          fullWidth
          style={{ color: "white" }}
          disabled={loading}
          onClick={() => window.location.href = "/auth/2fa-setup"}
          className="mt-3"
        >
          Back to Setup
        </Button>
      </form>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h3 className="text-sm font-medium text-blue-300 mb-2">Need help?</h3>
        <p className="text-xs text-gray-400">
          Open your authenticator app and enter the 6-digit code that appears.
          The code refreshes every 30 seconds.
        </p>
      </div>
    </>
  );
}
