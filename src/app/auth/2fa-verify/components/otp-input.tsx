"use client";
import React, { useRef, useEffect, useState } from "react";

interface OTPInputProps {
  value?: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function OTPInput({
  value = "",
  onChange,
  length = 6,
  disabled = false,
  autoFocus = false,
}: OTPInputProps) {
  const [internalValue, setInternalValue] = useState<string>(value);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update internal value when external value changes (for reset scenarios)
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    // Initialize refs array
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  useEffect(() => {
    // Always focus first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, digit: string) => {
    console.log(
      `handleChange called: index=${index}, digit="${digit}", current value="${internalValue}"`
    );

    // Only allow digits
    if (!/^\d*$/.test(digit)) {
      console.log(`Invalid digit: "${digit}"`);
      return;
    }

    // Update the internal value
    const currentValue = internalValue || "";
    const newValue = currentValue.split("");
    newValue[index] = digit;
    const newValueString = newValue.join("").slice(0, length);

    console.log(`Updating value: "${currentValue}" -> "${newValueString}"`);
    
    // Update internal state
    setInternalValue(newValueString);
    
    // Call the onChange callback
    onChange(newValueString);

    // Move to next input if digit was entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const currentValue = internalValue || "";

    // Handle backspace
    if (e.key === "Backspace") {
      if (currentValue[index]) {
        // If current input has a value, clear it
        const newValue = currentValue.split("");
        newValue[index] = "";
        const newValueString = newValue.join("");
        setInternalValue(newValueString);
        onChange(newValueString);
      } else if (index > 0) {
        // If current input is empty, go to previous input and clear it
        const newValue = currentValue.split("");
        newValue[index - 1] = "";
        const newValueString = newValue.join("");
        setInternalValue(newValueString);
        onChange(newValueString);
        inputRefs.current[index - 1]?.focus();
      }
    }
    // Handle arrow keys
    else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "");
    const digits = pastedData.slice(0, length).split("");

    // Fill the inputs with pasted data
    const newValue = Array(length)
      .fill("")
      .map((_, i) => digits[i] || "");
    const newValueString = newValue.join("");
    
    setInternalValue(newValueString);
    onChange(newValueString);

    // Focus the next empty input or the last input
    const nextIndex = Math.min(digits.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex justify-center space-x-3 mb-6">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={(internalValue || "")[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          tabIndex={index + 1}
          className="w-14 h-14 text-center text-xl font-semibold rounded-lg border-2 bg-white/0 border-gray-200 dark:!border-white/10 dark:text-white focus:border-blue-500 focus:outline-none transition-colors duration-200 disabled:opacity-50 shadow-sm"
          autoComplete="one-time-code"
          placeholder="*"
        />
      ))}
    </div>
  );
}
