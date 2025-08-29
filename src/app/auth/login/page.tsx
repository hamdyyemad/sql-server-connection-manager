import LoginFormServer from "./components/login-form-server";

export default function LoginPage() {
  return (
    <>
      <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
        Sign In
      </h4>
      <p className="mb-9 ml-1 text-base text-gray-400 dark:text-gray-400">
        Enter your data to sign in!
      </p>

      {/* Login Form Component */}
      <LoginFormServer />
    </>
  );
}
