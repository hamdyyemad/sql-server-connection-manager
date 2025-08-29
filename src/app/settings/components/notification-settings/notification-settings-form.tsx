"use client";
import { useRef, useCallback, memo } from "react";
import EmailNotifications from "./email-notifications";
import PushNotifications from "./push-notifications";
import SecurityNotifications from "./security-notifications";
import UpdateNotifications from "./update-notifications";
import SaveSection from "./save-section";
import type { EmailNotificationsRef } from "./email-notifications";
import type { PushNotificationsRef } from "./push-notifications";
import type { SecurityNotificationsRef } from "./security-notifications";
import type { UpdateNotificationsRef } from "./update-notifications";

interface NotificationData {
  email: boolean;
  push: boolean;
  security: boolean;
  updates: boolean;
}

// Create isolated wrapper sections to prevent cross-contamination
const EmailSection = memo(({ emailRef }: { emailRef: React.RefObject<EmailNotificationsRef | null> }) => (
  <EmailNotifications ref={emailRef} />
));

const PushSection = memo(({ pushRef }: { pushRef: React.RefObject<PushNotificationsRef | null> }) => (
  <PushNotifications ref={pushRef} />
));

const SecuritySection = memo(({ securityRef }: { securityRef: React.RefObject<SecurityNotificationsRef | null> }) => (
  <SecurityNotifications ref={securityRef} />
));

const UpdatesSection = memo(({ updatesRef }: { updatesRef: React.RefObject<UpdateNotificationsRef | null> }) => (
  <UpdateNotifications ref={updatesRef} />
));

const SaveActionSection = memo(({ onSave }: { onSave: () => void }) => (
  <SaveSection onSave={onSave} />
));

EmailSection.displayName = "EmailSection";
PushSection.displayName = "PushSection";
SecuritySection.displayName = "SecuritySection";
UpdatesSection.displayName = "UpdatesSection";
SaveActionSection.displayName = "SaveActionSection";

function NotificationSettingsForm() {
  const emailRef = useRef<EmailNotificationsRef>(null);
  const pushRef = useRef<PushNotificationsRef>(null);
  const securityRef = useRef<SecurityNotificationsRef>(null);
  const updatesRef = useRef<UpdateNotificationsRef>(null);

  const handleSave = useCallback(() => {
    // Collect data from all refs
    const notificationData: NotificationData = {
      email: emailRef.current?.getValue() ?? true,
      push: pushRef.current?.getValue() ?? false,
      security: securityRef.current?.getValue() ?? true,
      updates: updatesRef.current?.getValue() ?? true,
    };

    // Handle notification save logic
    console.log("Notifications saved:", notificationData);
  }, []);

  return (
    <>
      <div className="space-y-4">
        <EmailSection emailRef={emailRef} />
        <PushSection pushRef={pushRef} />
        <SecuritySection securityRef={securityRef} />
        <UpdatesSection updatesRef={updatesRef} />
      </div>

      <SaveActionSection onSave={handleSave} />
    </>
  );
}

export default memo(NotificationSettingsForm);
