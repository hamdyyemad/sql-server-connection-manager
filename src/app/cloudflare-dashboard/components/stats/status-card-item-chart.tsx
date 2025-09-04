"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  StatusCardDecorativeWrapper,
  StatusCardItemChartHeader,
  StatusCardItemChartBadge,
  StatusCardItemChartVisualization,
} from "./status-card";

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

export default function StatusCardItemChart({
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
      <StatusCardDecorativeWrapper>
        <StatusCardItemChartHeader
          title={title}
          icon={icon}
          iconBgColor={iconBgColor}
        />

        <CardContent className="relative z-10 pt-0">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-slate-100 transition-colors duration-200 group-hover:text-white">
              {value}
            </div>

            <StatusCardItemChartBadge changeType={changeType} change={change} />

            {/* Mini chart visualization */}
            <StatusCardItemChartVisualization chartData={chartData} />
          </div>
        </CardContent>
      </StatusCardDecorativeWrapper>
    </Card>
  );
}
