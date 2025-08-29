import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CloudflareForm({
  setIsConnected,
}: {
  setIsConnected: (isConnected: boolean) => void;
}) {
  const [apiKey, setApiKey] = useState("");
  const [email, setEmail] = useState("");

  const handleConnect = () => {
    if (apiKey && email) {
      setIsConnected(true);
    }
  };
  return (
    <>
      {/* Connection Form */}
      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Cloudflare Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@example.com"
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Cloudflare API key"
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <Button
          onClick={handleConnect}
          disabled={!apiKey || !email}
          className="w-full transition-all duration-200 hover:scale-[1.02]"
        >
          Connect to Cloudflare
        </Button>
      </div>
    </>
  );
}
