import { Metric } from "../../types/metric";
import PerformanceMetricsItem from "./performance-metrics.item";

const performanceMetrics: Metric[] = [
  {
    id: "cache-hit-rate",
    title: "Cache Hit Rate",
    value: "94.2%",
    percentage: 94.2,
    gradient: "from-emerald-500 to-emerald-400",
  },
  {
    id: "ssl-tls-coverage",
    title: "SSL/TLS Coverage",
    value: "99.8%",
    percentage: 99.8,
    gradient: "from-blue-500 to-blue-400",
  },
  {
    id: "uptime",
    title: "Uptime",
    value: "99.99%",
    percentage: 99.99,
    gradient: "from-purple-500 to-purple-400",
  },
  {
    id: "threat-protection",
    title: "Threat Protection",
    value: "98.5%",
    percentage: 98.5,
    gradient: "from-orange-500 to-orange-400",
  },
];

export default function PerformanceMetricsItems() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        {performanceMetrics.slice(0, 2).map((metric) => (
          <PerformanceMetricsItem key={metric.id} {...metric} />
        ))}
      </div>
      <div className="space-y-4">
        {performanceMetrics.slice(2, 4).map((metric) => (
          <PerformanceMetricsItem key={metric.id} {...metric} />
        ))}
      </div>
    </div>
  );
}
