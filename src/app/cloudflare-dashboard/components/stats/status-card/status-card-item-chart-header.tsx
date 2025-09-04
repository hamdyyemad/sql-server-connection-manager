import { CardTitle } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";

import { cn } from "@/frontend_lib/utils/utils";

export default function StatusCardItemChartHeader({
    title,
    icon,
    iconBgColor,
  }: {
    title: string;
    icon: React.ReactNode;
    iconBgColor: string;
  }) {
    return (
      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-400 transition-colors duration-200 group-hover:text-slate-300">
            {title}
          </CardTitle>
          <div
            className={cn(
              "p-2 rounded-lg transition-all duration-200 group-hover:scale-110",
              iconBgColor
            )}
          >
            {icon}
          </div>
        </div>
      </CardHeader>
    );
  }