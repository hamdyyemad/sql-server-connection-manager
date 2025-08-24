import React from "react";
import { cn } from "@/frontend_lib/utils/cn";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  id: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  error?: boolean;
  className?: string;
  labelClassName?: string;
  children?: React.ReactNode;
}

const checkboxSizes = {
  sm: {
    container: "h-4 w-4",
    icon: "w-4 h-4",
    label: "text-sm",
  },
  md: {
    container: "h-5 w-5",
    icon: "w-5 h-5",
    label: "text-sm",
  },
  lg: {
    container: "h-6 w-6",
    icon: "w-6 h-6",
    label: "text-base",
  },
};

const checkboxVariants = {
  primary: {
    container:
      "border-[#a2a1a833] bg-white dark:bg-[#212121] peer-checked:bg-[#231945] peer-checked:border-[#231945]",
    icon: "stroke-white",
    disabled:
      "border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-600",
  },
  secondary: {
    container:
      "border-gray-300 bg-gray-50 dark:bg-gray-800 peer-checked:bg-gray-600 peer-checked:border-gray-600",
    icon: "stroke-white",
    disabled:
      "border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-600",
  },
  outline: {
    container:
      "border-2 border-[#231945] bg-transparent peer-checked:bg-[#231945]",
    icon: "stroke-white",
    disabled: "border-gray-300 bg-transparent",
  },
};

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  size = "md",
  variant = "primary",
  disabled = false,
  error = false,
  className,
  labelClassName,
  children,
  ...props
}) => {
  const sizeStyles = checkboxSizes[size];
  const variantStyles = checkboxVariants[variant];

  const containerClasses = cn(
    "flex rounded-md border transition-all duration-200 peer-checked:scale-105",
    sizeStyles.container,
    variantStyles.container,
    disabled && variantStyles.disabled,
    error && "border-red-500",
    className
  );

  const labelClasses = cn(
    "flex flex-row items-center gap-2.5 cursor-pointer select-none",
    sizeStyles.label,
    disabled && "cursor-not-allowed opacity-50",
    labelClassName
  );

  const iconClasses = cn(
    "transition-all duration-200",
    sizeStyles.icon,
    variantStyles.icon
  );

  return (
    <label htmlFor={id} className={labelClasses}>
      <input
        id={id}
        type="checkbox"
        className="peer hidden"
        disabled={disabled}
        {...props}
      />
      <div className={containerClasses}>
        <svg
          fill="none"
          viewBox="0 0 24 24"
          className={iconClasses}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 12.6111L8.92308 17.5L20 6.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {(label || children) && (
        <span className="text-gray-500 dark:text-gray-400">
          {label || children}
        </span>
      )}
    </label>
  );
};
