"use client";
import { useRef, useCallback, memo } from "react";
import { TwoFactorAuth, SessionSettings, PasswordSettings, SaveSection } from "./";
import type { TwoFactorAuthRef } from "./two-factor-auth";
import type { SessionSettingsRef } from "./session-settings";
import type { PasswordSettingsRef } from "./password-settings";

interface SecurityData {
  twoFactor: boolean;
  sessionTimeout: string;
  passwordExpiry: string;
}

// Create isolated wrapper sections to prevent cross-contamination
const TwoFactorSection = memo(() => {
  const twoFactorRef = useRef<TwoFactorAuthRef>(null);
  return <TwoFactorAuth ref={twoFactorRef} />;
});

const TimeoutSection = memo(() => {
  const sessionRef = useRef<SessionSettingsRef>(null);
  const passwordRef = useRef<PasswordSettingsRef>(null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SessionSettings ref={sessionRef} />
      <PasswordSettings ref={passwordRef} />
    </div>
  );
});

const SaveActionSection = memo(({ onSave }: { onSave: () => void }) => (
  <SaveSection onSave={onSave} />
));

TwoFactorSection.displayName = "TwoFactorSection";
TimeoutSection.displayName = "TimeoutSection";
SaveActionSection.displayName = "SaveActionSection";

function SecuritySettingsForm() {
  const twoFactorRef = useRef<TwoFactorAuthRef>(null);
  const sessionRef = useRef<SessionSettingsRef>(null);
  const passwordRef = useRef<PasswordSettingsRef>(null);

  const handleSave = useCallback(() => {
    // Collect data from all refs
    const securityData: SecurityData = {
      twoFactor: twoFactorRef.current?.getValue() ?? true,
      sessionTimeout: sessionRef.current?.getValue() ?? "24",
      passwordExpiry: passwordRef.current?.getValue() ?? "90",
    };

    // Handle security save logic
    console.log("Security saved:", securityData);
  }, []);

  return (
    <div className="space-y-6">
      <TwoFactorAuth ref={twoFactorRef} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SessionSettings ref={sessionRef} />
        <PasswordSettings ref={passwordRef} />
      </div>
      <SaveActionSection onSave={handleSave} />
    </div>
  );
}

export default memo(SecuritySettingsForm);
