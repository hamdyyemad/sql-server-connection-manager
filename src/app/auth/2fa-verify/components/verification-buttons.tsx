"use client";
import { Button } from "@/app/design/button/Button";

interface VerificationButtonsProps {
  isPending: boolean;
}

const VerificationButtons = ({ isPending }: VerificationButtonsProps) => {
  return (
    <>
      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={isPending}
        loading={isPending}
      >
        {isPending ? "Verifying..." : "Verify & Continue"}
      </Button>

      {/* Back to Setup Button */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        fullWidth
        style={{ color: "white" }}
        disabled={isPending}
        onClick={() => window.location.href = "/auth/2fa-setup"}
        className="mt-3"
      >
        Back to Setup
      </Button>
    </>
  );
};

VerificationButtons.displayName = "VerificationButtons";

export default VerificationButtons;
