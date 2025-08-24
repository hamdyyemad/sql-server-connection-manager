import React from "react";
import { cn } from "@/frontend_lib/utils/cn";
import { Checkbox, CheckboxProps } from "./Checkbox";

export interface CheckboxOption {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  options: CheckboxOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  size?: CheckboxProps["size"];
  variant?: CheckboxProps["variant"];
  disabled?: boolean;
  error?: boolean;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  value = [],
  onChange,
  size = "md",
  variant = "primary",
  disabled = false,
  error = false,
  className,
  orientation = "vertical",
}) => {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (!onChange) return;

    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  const containerClasses = cn(
    "space-y-2",
    orientation === "horizontal" && "flex flex-wrap gap-4",
    className
  );

  return (
    <div className={containerClasses}>
      {options.map((option) => (
        <Checkbox
          key={option.id}
          id={option.id}
          label={option.label}
          size={size}
          variant={variant}
          disabled={disabled || option.disabled}
          error={error}
          checked={value.includes(option.value)}
          onChange={(e) => handleChange(option.value, e.target.checked)}
        />
      ))}
    </div>
  );
};
