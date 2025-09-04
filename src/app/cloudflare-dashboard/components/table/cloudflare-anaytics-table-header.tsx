import { CardHeader, CardTitle } from "@/components/ui/card";

export default function CloudflareAnalyticsTableHeader() {
  return (
    <CardHeader className="relative z-10">
      <CardTitle className="text-lg font-semibold text-slate-100">
        Cloudflare Analytics Data
      </CardTitle>
      <p className="text-sm text-slate-400">
        Real-time traffic analytics from Cloudflare edge servers
      </p>
    </CardHeader>
  );
}
