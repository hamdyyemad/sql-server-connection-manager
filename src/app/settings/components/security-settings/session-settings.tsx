"use client";
import { useState, useCallback, memo, useImperativeHandle, forwardRef } from "react";

export interface SessionSettingsRef {
  getValue: () => string;
}

interface SessionSettingsProps {
  initialValue?: string;
}

const SessionSettings = forwardRef<SessionSettingsRef, SessionSettingsProps>(
  ({ initialValue = "24" }, ref) => {
    const [sessionTimeout, setSessionTimeout] = useState(initialValue);

    useImperativeHandle(ref, () => ({
      getValue: () => sessionTimeout,
    }));

    const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
      setSessionTimeout(e.target.value);
    }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Session Timeout (hours)
      </label>
      <select
        value={sessionTimeout}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="1">1 hour</option>
        <option value="8">8 hours</option>
        <option value="24">24 hours</option>
        <option value="168">1 week</option>
      </select>
    </div>
  );
});

SessionSettings.displayName = "SessionSettings";

export default memo(SessionSettings);
