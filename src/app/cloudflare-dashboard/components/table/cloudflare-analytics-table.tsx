import {
  CloudflareAnalyticsTableHead,
  CloudflareAnalyticsTableTHead,
  CloudflareAnalyticsTableTBody,
  CloudflareAnalyticsStatsItems,
} from ".";

import { Card, CardContent } from "@/components/ui/card";

export default function CloudflareAnalyticsTable() {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10 border-slate-200/20 bg-slate-950/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-slate-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CloudflareAnalyticsTableHead />

      <CardContent className="relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <CloudflareAnalyticsTableTHead />
            <CloudflareAnalyticsTableTBody />
          </table>
        </div>

        {/* Summary Stats */}
        <CloudflareAnalyticsStatsItems />
      </CardContent>
    </Card>
  );
}
