"use client";
import { useState, useCallback, memo, useImperativeHandle, forwardRef } from "react";

export interface PushNotificationsRef {
  getValue: () => boolean;
}

interface PushNotificationsProps {
  initialValue?: boolean;
}

const PushNotifications = forwardRef<PushNotificationsRef, PushNotificationsProps>(
  ({ initialValue = false }, ref) => {
    const [checked, setChecked] = useState(initialValue);

    useImperativeHandle(ref, () => ({
      getValue: () => checked,
    }));

    const handleToggle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(e.target.checked);
    }, []);

    return (
      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
        <div>
          <h5 className="text-white font-medium">Push Notifications</h5>
          <p className="text-gray-400 text-sm">Receive push notifications in browser</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleToggle}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    );
  }
);

PushNotifications.displayName = "PushNotifications";

export default memo(PushNotifications);
