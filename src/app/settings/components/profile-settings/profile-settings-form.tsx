"use client";
import { useRef, useCallback, memo } from "react";
import UsernameInput from "./username-input";
import EmailInput from "./email-input";
import FirstNameInput from "./first-name-input";
import LastNameInput from "./last-name-input";
import BioInput from "./bio-input";
import SaveSection from "./save-section";
import type { UsernameInputRef } from "./username-input";
import type { EmailInputRef } from "./email-input";
import type { FirstNameInputRef } from "./first-name-input";
import type { LastNameInputRef } from "./last-name-input";
import type { BioInputRef } from "./bio-input";

interface ProfileData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
}

// Create isolated wrapper sections to prevent cross-contamination
const UsernameSection = memo(({ usernameRef }: { usernameRef: React.RefObject<UsernameInputRef | null> }) => (
  <UsernameInput ref={usernameRef} />
));

const EmailSection = memo(({ emailRef }: { emailRef: React.RefObject<EmailInputRef | null> }) => (
  <EmailInput ref={emailRef} />
));

const FirstNameSection = memo(({ firstNameRef }: { firstNameRef: React.RefObject<FirstNameInputRef | null> }) => (
  <FirstNameInput ref={firstNameRef} />
));

const LastNameSection = memo(({ lastNameRef }: { lastNameRef: React.RefObject<LastNameInputRef | null> }) => (
  <LastNameInput ref={lastNameRef} />
));

const BioSection = memo(({ bioRef }: { bioRef: React.RefObject<BioInputRef | null> }) => (
  <BioInput ref={bioRef} />
));

const SaveActionSection = memo(({ onSave }: { onSave: () => void }) => (
  <SaveSection onSave={onSave} />
));

UsernameSection.displayName = "UsernameSection";
EmailSection.displayName = "EmailSection";
FirstNameSection.displayName = "FirstNameSection";
LastNameSection.displayName = "LastNameSection";
BioSection.displayName = "BioSection";
SaveActionSection.displayName = "SaveActionSection";

function ProfileSettingsForm() {
  const usernameRef = useRef<UsernameInputRef>(null);
  const emailRef = useRef<EmailInputRef>(null);
  const firstNameRef = useRef<FirstNameInputRef>(null);
  const lastNameRef = useRef<LastNameInputRef>(null);
  const bioRef = useRef<BioInputRef>(null);

  const handleSave = useCallback(() => {
    // Collect data from all refs
    const profileData: ProfileData = {
      username: usernameRef.current?.getValue() ?? "admin",
      email: emailRef.current?.getValue() ?? "admin@example.com",
      firstName: firstNameRef.current?.getValue() ?? "Admin",
      lastName: lastNameRef.current?.getValue() ?? "User",
      bio: bioRef.current?.getValue() ?? "System Administrator",
    };

    // Handle profile save logic
    console.log("Profile saved:", profileData);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UsernameSection usernameRef={usernameRef} />
        <EmailSection emailRef={emailRef} />
        <FirstNameSection firstNameRef={firstNameRef} />
        <LastNameSection lastNameRef={lastNameRef} />
      </div>

      <BioSection bioRef={bioRef} />

      <SaveActionSection onSave={handleSave} />
    </>
  );
}

export default memo(ProfileSettingsForm);
