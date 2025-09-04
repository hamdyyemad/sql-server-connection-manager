import { Card, CardContent } from "@/components/ui/card";

import CloudflareActivityHeader from "./cloudflare-activity-header";
import CloudflareActivityItems from "./cloudflare-activity-items";

export default function CloudflareActivityFeed() {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10 border-slate-200/20 bg-slate-950/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-slate-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CloudflareActivityHeader />

      <CardContent className="relative z-10">
        <div className="space-y-3 max-h-64 overflow-y-auto">
          <CloudflareActivityItems />
        </div>
      </CardContent>
    </Card>
  );
}
