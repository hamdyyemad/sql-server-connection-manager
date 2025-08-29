import React from "react";

interface LoginInputProps {
  id: string;
  label: string;
  type: "text" | "password";
  placeholder: string;
  autoComplete?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: "on" | "off";
  required?: boolean;
  error?: string;
}

export const LoginInput: React.FC<LoginInputProps> = ({
  id,
  label,
  type,
  placeholder,
  autoComplete,
  autoCapitalize,
  autoCorrect,
  required = false,
  error,
}) => {
  return (
    <div className="mb-3">
      <label
        htmlFor={id}
        className="text-sm text-navy-700 dark:text-white ml-1.5 font-medium"
      >
        {label}
        {required && "*"}
      </label>
      <input
        className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none ${
          error
            ? "border-red-500 dark:!border-red-500"
            : "border-gray-200 dark:!border-white/10"
        } dark:text-white`}
        id={id}
        placeholder={placeholder}
        type={type}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        name={id}
        required={required}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
