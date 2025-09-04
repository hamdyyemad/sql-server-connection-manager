import {
  ChartConfig
} from "@/components/ui/chart";
import BrowserChart from "./browser-chart";

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


export default function Browser() {
    return (
        <BrowserChart browserConfig={browserConfig} browserData={browserData} />
    )
}