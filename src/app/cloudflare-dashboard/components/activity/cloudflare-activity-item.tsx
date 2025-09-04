import { Badge } from "@/components/ui/badge";
import { cn } from "@/frontend_lib/utils/utils";
import { CloudflareActivityItem as ICloudflareActivityItem } from "../../types/activity-item";

export default function CloudflareActivityItem({
  item,
  index,
}: {
  item: ICloudflareActivityItem;
  index: number;
}) {
  return (
    <>
      <div
        key={index}
        className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors duration-200"
      >
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            item.severity === "high"
              ? "bg-red-500"
              : item.severity === "medium"
              ? "bg-orange-500"
              : item.severity === "warning"
              ? "bg-yellow-500"
              : "bg-emerald-500"
          )}
        ></div>
        <div className="flex-1">
          <p className="text-slate-100 text-sm">{item.event}</p>
          <p className="text-slate-400 text-xs">{item.time}</p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            item.type === "security"
              ? "bg-red-500/20 text-red-400 border-red-500/30"
              : item.type === "performance"
              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
              : item.type === "ssl"
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              : item.type === "traffic"
              ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
              : "bg-purple-500/20 text-purple-400 border-purple-500/30"
          )}
        >
          {item.type}
        </Badge>
      </div>
    </>
  );
}
