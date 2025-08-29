"use client";
import { useState, useCallback, memo, useImperativeHandle, forwardRef } from "react";

export interface LastNameInputRef {
  getValue: () => string;
}

interface LastNameInputProps {
  initialValue?: string;
}

const LastNameInput = forwardRef<LastNameInputRef, LastNameInputProps>(
  ({ initialValue = "User" }, ref) => {
    const [value, setValue] = useState(initialValue);

    useImperativeHandle(ref, () => ({
      getValue: () => value,
    }));

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    }, []);

    return (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Last Name
        </label>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    );
  }
);

LastNameInput.displayName = "LastNameInput";

export default memo(LastNameInput);
