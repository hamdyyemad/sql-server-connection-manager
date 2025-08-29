import VerificationForm from "./verification-form";
import HelpText from "./help-text";

export default function TwoFactorVerifyFormServer() {
  return (
    <>
      <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
        Two-Factor Authentication
      </h4>
      <p className="mb-9 ml-1 text-base text-gray-600 dark:text-gray-400">
        Enter the verification code from your authenticator app
      </p>

      <VerificationForm />
      
      <HelpText />
    </>
  );
}
