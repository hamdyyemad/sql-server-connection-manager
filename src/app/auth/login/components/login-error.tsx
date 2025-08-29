import React from "react";

interface LoginErrorProps {
  error: string | null;
}

const LoginErrorComponent: React.FC<LoginErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
      {error}
    </div>
  );
};

export const LoginError = React.memo(LoginErrorComponent);
