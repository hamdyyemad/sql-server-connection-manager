import CloudflareAnalyticsStatsItem from "./cloudflare-analytics-stats-item";
import { type SummaryStatsItem } from "../../types/analytics";

const summaryStats: SummaryStatsItem[] = [
  {
    id: 1,
    title: "Total Requests",
    value: "78,920",
  },
  {
    id: 2,
    title: "Total Bandwidth",
    value: "10.4 GB",
  },
  {
    id: 3,
    title: "Total Threats",
    value: "80",
  },
  {
    id: 4,
    title: "Active IPs",
    value: "8",
  },
];

export default function CloudflareAnalyticsStatsItems() {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
      {summaryStats.map((stat) => (
        <CloudflareAnalyticsStatsItem key={stat.id} {...stat} />
      ))}
    </div>
  );
}
