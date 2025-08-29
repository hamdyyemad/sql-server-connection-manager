import React from "react";
import { Button } from "@/app/design";

interface LoginButtonProps {
  loading: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const LoginButtonComponent: React.FC<LoginButtonProps> = ({
  loading,
  disabled = false,
  onClick,
}) => {
  return (
    <Button
      variant="primary"
      size="lg"
      loading={loading}
      disabled={disabled}
      fullWidth
      type="submit"
      onClick={onClick}
    >
      {loading ? "Signing in..." : "Sign In"}
    </Button>
  );
};

export const LoginButton = React.memo(LoginButtonComponent);
