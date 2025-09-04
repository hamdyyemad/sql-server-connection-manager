const steps = [
  "Log in to your Cloudflare dashboard",
  'Go to "My Profile" → "API Tokens"',
  "Create a new token with appropriate permissions",
  "Copy the token and paste it above",
];

export default function HelpText() {
  return (
    <div className="text-sm text-slate-500 space-y-2 mx-auto flex flex-col items-center mt-3.5">
      <p>To get your API key:</p>
      <ol className="list-decimal list-inside space-y-1 text-left max-w-md mx-auto">
        {steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
