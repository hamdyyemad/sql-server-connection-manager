import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, Rectangle } from "recharts";
import { TrendingUp } from "lucide-react";

import { type BrowserItem } from "../../types/browser-item";
import { type ChartConfig } from "@/components/ui/chart";

interface BrowserChartProps {
    browserConfig: ChartConfig;
    browserData: BrowserItem[];
}

export default function BrowserChart({browserConfig, browserData}: BrowserChartProps) {
    return (
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10 border-slate-200/20 bg-slate-950/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-100">Browser Usage</CardTitle>
          <CardDescription className="text-slate-400">
            Most popular browsers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={browserConfig}>
            <BarChart accessibilityLayer data={browserData}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="browser"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: string) =>
                  String(browserConfig[value as keyof typeof browserConfig]?.label || value)
                }
                className="text-slate-400"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="visitors"
                strokeWidth={2}
                radius={8}
                activeIndex={0}
                activeBar={({ ...props }) => {
                  return (
                    <Rectangle
                      {...props}
                      fillOpacity={0.8}
                      stroke={props.payload.fill}
                      strokeDasharray={4}
                      strokeDashoffset={4}
                    />
                  );
                }}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium text-purple-400">
            Chrome dominates with 62.3% <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-slate-400 leading-none">
            Safari is the second most popular browser
          </div>
        </CardFooter>
      </Card>
    );
  }