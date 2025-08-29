"use client";
import { useState, useCallback, memo, useImperativeHandle, forwardRef } from "react";

export interface TwoFactorAuthRef {
  getValue: () => boolean;
}

interface TwoFactorAuthProps {
  initialValue?: boolean;
}

const TwoFactorAuth = forwardRef<TwoFactorAuthRef, TwoFactorAuthProps>(
  ({ initialValue = true }, ref) => {
    const [twoFactor, setTwoFactor] = useState(initialValue);

    useImperativeHandle(ref, () => ({
      getValue: () => twoFactor,
    }));

    const handleToggle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setTwoFactor(e.target.checked);
    }, []);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
      <div>
        <h5 className="text-white font-medium">Two-Factor Authentication</h5>
        <p className="text-gray-400 text-sm">
          Add an extra layer of security to your account
        </p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={twoFactor}
          onChange={handleToggle}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
});

TwoFactorAuth.displayName = "TwoFactorAuth";

export default memo(TwoFactorAuth);
