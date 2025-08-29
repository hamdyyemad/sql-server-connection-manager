"use client";
import { useRef } from "react";
import { useActionState } from "react";
import {
  verify2FAAction,
  type TwoFactorVerifyFormState,
} from "@/backend_lib/actions/2fa";
import OTPInput from "./otp-input";
import LoadingState from "./loading-state";
import ErrorState from "./error-state";
import VerificationButtons from "./verification-buttons";

const initialState: TwoFactorVerifyFormState = {
  success: false,
};

export default function VerificationForm() {
  const otpRef = useRef<string>("");
  const [state, formAction, isPending] = useActionState(
    verify2FAAction,
    initialState
  );

  const handleOtpChange = (value: string) => {
    console.log(
      `VerificationForm handleOtpChange called with value: "${value}"`
    );
    otpRef.current = value;
  };

  const handleFormAction = (formData: FormData) => {
    // Add the OTP value to the form data if it exists
    if (otpRef.current) {
      formData.set("verificationCode", otpRef.current);
    }
    formAction(formData);
  };

  const formError = state.errors?._form?.[0] || state.errors?.verificationCode?.[0];

  console.log(state, "state");

  // Show loading state
  if (isPending) {
    return <LoadingState />;
  }

  // Show error state
  if (state.errors?._form) {
    return (
      <ErrorState
        error={state.errors._form[0] || "An error occurred"}
      />
    );
  }

  return (
    <>
      <form
        noValidate
        className="mb-4"
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
            value={otpRef.current}
            onChange={handleOtpChange}
            length={6}
            disabled={isPending}
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

        <VerificationButtons isPending={isPending} />
      </form>
    </>
  );
}
