import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { TrendingUp } from "lucide-react";

import { type DeviceItem } from "../../types/device-item";
import { type ChartConfig } from "@/components/ui/chart";

interface DeviceChartProps {
  deviceConfig: ChartConfig;
  deviceData: DeviceItem[];
}

export default function DeviceChart({
  deviceConfig,
  deviceData,
}: DeviceChartProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10 border-slate-200/20 bg-slate-950/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-100">Device Usage</CardTitle>
        <CardDescription className="text-slate-400">
          Mobile vs Desktop
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={deviceConfig}>
          <BarChart accessibilityLayer data={deviceData}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
              className="text-slate-400"
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="desktop"
              stackId="a"
              fill="var(--color-desktop)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="mobile"
              stackId="a"
              fill="var(--color-mobile)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium text-blue-400">
          Mobile usage up by 8.7% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-slate-400 leading-none">
          Desktop leads with 71.6% of traffic
        </div>
      </CardFooter>
    </Card>
  );
}
