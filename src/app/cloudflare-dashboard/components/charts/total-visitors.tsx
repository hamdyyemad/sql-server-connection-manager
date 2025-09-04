import TotalVisitorsChart from "./total-visitors-chart";

import { ChartConfig } from "@/components/ui/chart";
import { VisitorItem } from "../../types/visitor-item";

// 1. Total Visitors Chart - Last 6 months
const visitorsData: VisitorItem[] = [
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

  export default function TotalVisitors() {
    return (
        <TotalVisitorsChart visitorsConfig={visitorsConfig} visitorsData={visitorsData} />
    )
  }