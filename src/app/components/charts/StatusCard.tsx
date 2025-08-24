"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/frontend_lib/utils/utils";

interface StatusCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
  iconBgColor: string;
  chartData: {
    labels: string[];
    data: number[];
    color: string;
  };
}

export default function StatusCard({
  title,
  value,
  change,
  changeType,
  icon,
  iconBgColor,
  chartData,
}: StatusCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10 border-slate-200/20 bg-slate-950/50 backdrop-blur-sm">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-slate-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:20px_20px] animate-pulse" />

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

      <CardContent className="relative z-10 pt-0">
        <div className="space-y-2">
          <div className="text-2xl font-bold text-slate-100 transition-colors duration-200 group-hover:text-white">
            {value}
          </div>

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

          {/* Mini chart visualization */}
          <div className="mt-4 h-12 relative">
            <div className="flex items-end justify-between h-full space-x-1">
              {chartData.data.map((value, index) => {
                const maxValue = Math.max(...chartData.data);
                const height = (value / maxValue) * 100;
                return (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-slate-600/50 to-slate-500/30 rounded-sm transition-all duration-300 hover:from-slate-500/70 hover:to-slate-400/50"
                    style={{
                      height: `${height}%`,
                      minHeight: "4px",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Decorative corner elements */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-slate-400/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-gradient-to-br from-slate-500/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Card>
  );
}
