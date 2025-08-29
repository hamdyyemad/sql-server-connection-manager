export default function HelpText() {
  return (
    <div className="text-sm text-slate-500 space-y-2 mx-auto flex flex-col items-center mt-3.5">
      <p>To get your API key:</p>
      <ol className="list-decimal list-inside space-y-1 text-left max-w-md mx-auto">
        <li>Log in to your Cloudflare dashboard</li>
        <li>Go to &quot;My Profile&quot; → &quot;API Tokens&quot;</li>
        <li>Create a new token with appropriate permissions</li>
        <li>Copy the token and paste it above</li>
      </ol>
    </div>
  );
}
