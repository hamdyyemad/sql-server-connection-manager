import DeviceChart from "./device-chart";

import { ChartConfig } from "@/components/ui/chart";
import { type DeviceItem } from "../../types/device-item";

const deviceData: DeviceItem[] = [
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

export default function Device() {
    return (
        <DeviceChart deviceConfig={deviceConfig} deviceData={deviceData} />
    )
}