"use client";
import { useRef, memo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import EmailInput, { EmailInputRef } from "./email-input";
import ApiInput, { ApiInputRef } from "./api-input";

// Memoized wrapper components to prevent cross-contamination
const EmailSection = memo(({ 
  emailRef, 
  onValidationChange 
}: { 
  emailRef: React.RefObject<EmailInputRef | null>;
  onValidationChange: (isValid: boolean) => void;
}) => {
  console.log("EmailSection rendered");
  return <EmailInput ref={emailRef} onValidationChange={onValidationChange} />;
});

const ApiSection = memo(({ 
  apiRef, 
  onValidationChange 
}: { 
  apiRef: React.RefObject<ApiInputRef | null>;
  onValidationChange: (isValid: boolean) => void;
}) => {
  console.log("ApiSection rendered");
  return <ApiInput ref={apiRef} onValidationChange={onValidationChange} />;
});

const ConnectButton = memo(({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => {
  console.log("ConnectButton rendered");
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full transition-all duration-200 hover:scale-[1.02]"
    >
      Connect to Cloudflare
    </Button>
  );
});

EmailSection.displayName = "EmailSection";
ApiSection.displayName = "ApiSection";
ConnectButton.displayName = "ConnectButton";

export default function CloudflareForm({
  setIsConnected,
}: {
  setIsConnected: (isConnected: boolean) => void;
}) {
  console.log("CloudflareForm rendered");
  
  const emailRef = useRef<EmailInputRef>(null);
  const apiRef = useRef<ApiInputRef>(null);
  
  // Validation state
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isApiValid, setIsApiValid] = useState(false);

  // Memoized validation callbacks
  const handleEmailValidation = useCallback((isValid: boolean) => {
    setIsEmailValid(isValid);
  }, []);

  const handleApiValidation = useCallback((isValid: boolean) => {
    setIsApiValid(isValid);
  }, []);

  const handleConnect = () => {
    const email = emailRef.current?.getValue() || "";
    const apiKey = apiRef.current?.getValue() || "";
    
    if (email.trim() && apiKey.trim()) {
      console.log("Connecting with:", { email, apiKey: "***" });
      setIsConnected(true);
    } else {
      console.log("Form validation failed");
    }
  };

  const isFormValid = isEmailValid && isApiValid;

  return (
    <>
      {/* Connection Form */}
      <div className="max-w-md mx-auto space-y-4">
        <EmailSection emailRef={emailRef} onValidationChange={handleEmailValidation} />
        <ApiSection apiRef={apiRef} onValidationChange={handleApiValidation} />
        <ConnectButton onClick={handleConnect} disabled={!isFormValid} />
      </div>
    </>
  );
}
