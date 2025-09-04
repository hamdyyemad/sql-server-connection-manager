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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { type VisitorItem } from "../../types/visitor-item";
import { type ChartConfig } from "@/components/ui/chart";

interface TotalVisitorsChartProps {
  visitorsConfig: ChartConfig;
  visitorsData: VisitorItem[];
}

export default function TotalVisitorsChart({
  visitorsConfig,
  visitorsData,
}: TotalVisitorsChartProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10 border-slate-200/20 bg-slate-950/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-100">Total Visitors</CardTitle>
        <CardDescription className="text-slate-400">
          Last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={visitorsConfig}>
          <BarChart
            accessibilityLayer
            data={visitorsData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.1)" />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="visitors"
              layout="vertical"
              fill="var(--color-visitors)"
              radius={4}
            >
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-slate-100"
                fontSize={12}
              />
              <LabelList
                dataKey="visitors"
                position="right"
                offset={8}
                className="fill-slate-100"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium text-emerald-400">
          Trending up by 12.3% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-slate-400 leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
