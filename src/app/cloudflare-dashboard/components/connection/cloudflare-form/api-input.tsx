"use client";
import { useState, forwardRef, useImperativeHandle, memo, useCallback } from "react";

export interface ApiInputRef {
  getValue: () => string;
  isEmpty: () => boolean;
}

interface ApiInputProps {
  onValidationChange?: (isValid: boolean) => void;
}

const ApiInput = forwardRef<ApiInputRef, ApiInputProps>(({ onValidationChange }, ref) => {
  const [value, setValue] = useState("");
  
  console.log("ApiInput rendered");

  useImperativeHandle(ref, () => ({
    getValue: () => value,
    isEmpty: () => value.trim() === "",
  }));

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Notify parent about validation change asynchronously
    if (onValidationChange) {
      setTimeout(() => {
        onValidationChange(newValue.trim().length > 0);
      }, 0);
    }
  }, [onValidationChange]);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        API Key
      </label>
      <input
        type="password"
        value={value}
        onChange={handleChange}
        placeholder="Enter your Cloudflare API key"
        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
    </div>
  );
});

ApiInput.displayName = "ApiInput";

export default memo(ApiInput);
