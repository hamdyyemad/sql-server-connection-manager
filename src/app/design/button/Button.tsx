import React from "react";
import { cn } from "@/frontend_lib/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const buttonVariants = {
  // Primary variant with #231945 color
  primary: {
    base: "bg-gradient-to-r from-[#231945] to-[#2d1f5a] hover:from-[#2d1f5a] hover:to-[#37206f] active:from-[#1a1435] active:to-[#231945] text-white shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 border border-[#231945]/20",
    disabled:
      "bg-gray-400 text-gray-200 cursor-not-allowed shadow-none hover:shadow-none",
    loading: "opacity-75 cursor-wait",
  },
  // Secondary variant
  secondary: {
    base: "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 active:from-gray-50 active:to-gray-100 text-gray-800 shadow-md hover:shadow-lg active:shadow-sm transition-all duration-200 border border-gray-300",
    disabled:
      "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none hover:shadow-none",
    loading: "opacity-75 cursor-wait",
  },
  // Outline variant
  outline: {
    base: "bg-transparent border-2 border-[#231945] text-[#231945] hover:bg-[#231945] hover:text-white active:bg-[#1a1435] transition-all duration-200 shadow-sm hover:shadow-md",
    disabled:
      "border-gray-300 text-gray-400 cursor-not-allowed hover:bg-transparent hover:text-gray-400 shadow-none",
    loading: "opacity-75 cursor-wait",
  },
  // Ghost variant
  ghost: {
    base: "bg-transparent text-[#231945] hover:bg-[#231945]/10 active:bg-[#231945]/20 transition-all duration-200",
    disabled: "text-gray-400 cursor-not-allowed hover:bg-transparent",
    loading: "opacity-75 cursor-wait",
  },
  // Danger variant
  danger: {
    base: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:from-red-500 active:to-red-600 text-white shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 border border-red-600/20",
    disabled:
      "bg-gray-400 text-gray-200 cursor-not-allowed shadow-none hover:shadow-none",
    loading: "opacity-75 cursor-wait",
  },
  // Success variant
  success: {
    base: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 active:from-green-500 active:to-green-600 text-white shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 border border-green-600/20",
    disabled:
      "bg-gray-400 text-gray-200 cursor-not-allowed shadow-none hover:shadow-none",
    loading: "opacity-75 cursor-wait",
  },
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm font-medium rounded-md min-h-[32px]",
  md: "px-4 py-2 text-sm font-medium rounded-lg min-h-[40px]",
  lg: "px-6 py-3 text-base font-semibold rounded-lg min-h-[48px]",
  xl: "px-8 py-4 text-lg font-bold rounded-xl min-h-[56px]",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}) => {
  const variantStyles = buttonVariants[variant];
  const sizeStyles = buttonSizes[size];

  const buttonClasses = cn(
    // Base styles
    "cursor-pointer inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#231945]/50 focus:ring-offset-2 disabled:pointer-events-none",

    // Size styles
    sizeStyles,

    // Variant styles
    disabled ? variantStyles.disabled : variantStyles.base,

    // Loading styles
    loading && variantStyles.loading,

    // Full width
    fullWidth && "w-full",

    // Custom className
    className
  );

  return (
    <button className={buttonClasses} disabled={disabled || loading} {...props}>
      {/* Loading spinner */}
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Left icon */}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}

      {/* Button text */}
      <span>{children}</span>

      {/* Right icon */}
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
