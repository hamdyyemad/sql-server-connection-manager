"use client";
import { useState, useCallback, memo, useImperativeHandle, forwardRef } from "react";

export interface BioInputRef {
  getValue: () => string;
}

interface BioInputProps {
  initialValue?: string;
}

const BioInput = forwardRef<BioInputRef, BioInputProps>(
  ({ initialValue = "System Administrator" }, ref) => {
    const [value, setValue] = useState(initialValue);

    useImperativeHandle(ref, () => ({
      getValue: () => value,
    }));

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    }, []);

    return (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Bio
        </label>
        <textarea
          value={value}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    );
  }
);

BioInput.displayName = "BioInput";

export default memo(BioInput);
