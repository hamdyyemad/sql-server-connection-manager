"use client";
import { Button } from "@/app/design/button/Button";
import { forceLogoutAction } from "@/backend_lib/actions/auth";

interface ErrorStateProps {
  error: string | null;
}

const handleRetry = () => {
  // Reset form state by refreshing the page
  window.location.reload();
};

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="text-center py-8">
      <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 mb-4">
        <p className="text-sm">{error}</p>
      </div>
      <div className="space-y-2 flex flex-col gap-2">
        <Button variant="primary" size="md" onClick={handleRetry}>
          Try Again
        </Button>
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
