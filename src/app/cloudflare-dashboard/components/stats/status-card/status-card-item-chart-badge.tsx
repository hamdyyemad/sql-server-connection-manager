import { Badge } from "@/components/ui/badge";
import { cn } from "@/frontend_lib/utils/utils";

export default function StatusCardItemChartBadge({
  changeType,
  change,
}: {
  changeType: "positive" | "negative";
  change: string;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Badge
        variant={changeType === "positive" ? "default" : "destructive"}
        className={cn(
          "text-xs font-medium transition-all duration-200",
          changeType === "positive"
            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
            : "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
        )}
      >
        {changeType === "positive" ? "↗" : "↘"} {change}
      </Badge>
    </div>
  );
}
