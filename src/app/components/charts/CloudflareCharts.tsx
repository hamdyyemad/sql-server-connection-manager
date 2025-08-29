"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  Rectangle,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// 1. Total Visitors Chart - Last 6 months
const visitorsData = [
  { month: "January", visitors: 12450 },
  { month: "February", visitors: 15890 },
  { month: "March", visitors: 14230 },
  { month: "April", visitors: 18920 },
  { month: "May", visitors: 16540 },
  { month: "June", visitors: 20180 },
];

const visitorsConfig = {
  visitors: {
    label: "Total Visitors",
    color: "var(--chart-1)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

export function TotalVisitorsChart() {
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

// 2. Mobile vs Desktop Chart
const deviceData = [
  { month: "Jan", desktop: 8920, mobile: 3530 },
  { month: "Feb", desktop: 11420, mobile: 4470 },
  { month: "Mar", desktop: 10210, mobile: 4020 },
  { month: "Apr", desktop: 13580, mobile: 5340 },
  { month: "May", desktop: 11850, mobile: 4690 },
  { month: "Jun", desktop: 14460, mobile: 5720 },
];

const deviceConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function DeviceChart() {
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

// 3. Browser Usage Chart
const browserData = [
  { browser: "chrome", visitors: 12540, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 3420, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 2180, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 1560, fill: "var(--color-edge)" },
  { browser: "other", visitors: 480, fill: "var(--color-other)" },
];

const browserConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function BrowserChart() {
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
              tickFormatter={(value) =>
                browserConfig[value as keyof typeof browserConfig]?.label
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
