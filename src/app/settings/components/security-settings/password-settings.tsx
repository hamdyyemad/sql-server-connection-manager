"use client";
import { useState, useCallback, memo, useImperativeHandle, forwardRef } from "react";

export interface PasswordSettingsRef {
  getValue: () => string;
}

interface PasswordSettingsProps {
  initialValue?: string;
}

const PasswordSettings = forwardRef<PasswordSettingsRef, PasswordSettingsProps>(
  ({ initialValue = "90" }, ref) => {
    const [passwordExpiry, setPasswordExpiry] = useState(initialValue);

    useImperativeHandle(ref, () => ({
      getValue: () => passwordExpiry,
    }));

    const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
      setPasswordExpiry(e.target.value);
    }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Password Expiry (days)
      </label>
      <select
        value={passwordExpiry}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="30">30 days</option>
        <option value="60">60 days</option>
        <option value="90">90 days</option>
        <option value="180">180 days</option>
      </select>
    </div>
  );
});

PasswordSettings.displayName = "PasswordSettings";

export default memo(PasswordSettings);
