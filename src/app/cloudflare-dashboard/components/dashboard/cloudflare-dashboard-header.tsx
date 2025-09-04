import { Badge } from "@/components/ui/badge";

export default function CloudflareDashboardHeader() {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-3xl font-extralight text-slate-400">
        Cloudflare Dashboard
      </h3>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <Badge
          variant="secondary"
          className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
        >
          Connected
        </Badge>
      </div>
    </div>
  );
}
