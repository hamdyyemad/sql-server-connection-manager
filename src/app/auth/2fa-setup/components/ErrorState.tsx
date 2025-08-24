"use client";
import React from "react";
import { Button } from "@/app/design/button/Button";
import { forceLogoutAction } from "@/backend_lib/actions/auth";

type TwoFactorStep = "setup" | "verify" | "existing";

interface ErrorStateProps {
  error: string | null;
  step: TwoFactorStep;
  onRetrySetup: () => void;
  onRetryStatus: () => void;
}

export default function ErrorState({
  error,
  step,
  onRetrySetup,
  onRetryStatus,
}: ErrorStateProps) {
  if (step !== "setup" && step !== "existing") return null;

  return (
    <div className="text-center py-8">
      <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 mb-4">
        <p className="text-sm">{error}</p>
      </div>
      <div className="space-y-2 flex flex-col gap-2">
        {step === "setup" && (
          <Button variant="primary" size="md" onClick={onRetrySetup}>
            Try Again
          </Button>
        )}
        {step === "existing" && (
          <Button variant="primary" size="md" onClick={onRetryStatus}>
            Retry
          </Button>
        )}
        <Button
          variant="outline"
          style={{ color: "white" }}
          size="md"
          onClick={forceLogoutAction}
        >
          Log out
        </Button>
      </div>
    </div>
  );
}
