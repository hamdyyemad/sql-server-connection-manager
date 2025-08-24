"use client";
import React from "react";
import { Button } from "@/app/design/button/Button";

interface ErrorStateProps {
  error: string | null;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  if (!error) return null;

  return (
    <div className="text-center py-8">
      <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 mb-4">
        <p className="text-sm">{error}</p>
      </div>
      <Button variant="primary" size="md" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}
