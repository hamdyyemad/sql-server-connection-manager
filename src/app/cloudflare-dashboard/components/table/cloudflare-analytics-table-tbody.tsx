import { type AnalyticsDataItem } from "../../types/analytics";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/frontend_lib/utils/utils";

const analyticsData: AnalyticsDataItem[] = [
  {
    ip: "192.168.1.100",
    country: "United States",
    city: "New York",
    requests: 15420,
    bandwidth: "2.1 GB",
    threats: 12,
    status: "active",
    lastSeen: "2 min ago",
  },
  {
    ip: "203.0.113.45",
    country: "United Kingdom",
    city: "London",
    requests: 12850,
    bandwidth: "1.8 GB",
    threats: 8,
    status: "active",
    lastSeen: "5 min ago",
  },
  {
    ip: "198.51.100.23",
    country: "Germany",
    city: "Berlin",
    requests: 9870,
    bandwidth: "1.4 GB",
    threats: 15,
    status: "blocked",
    lastSeen: "1 min ago",
  },
  {
    ip: "203.0.113.67",
    country: "France",
    city: "Paris",
    requests: 8760,
    bandwidth: "1.2 GB",
    threats: 5,
    status: "active",
    lastSeen: "8 min ago",
  },
  {
    ip: "198.51.100.89",
    country: "Canada",
    city: "Toronto",
    requests: 7650,
    bandwidth: "1.1 GB",
    threats: 3,
    status: "active",
    lastSeen: "12 min ago",
  },
  {
    ip: "203.0.113.12",
    country: "Australia",
    city: "Sydney",
    requests: 6540,
    bandwidth: "0.9 GB",
    threats: 7,
    status: "active",
    lastSeen: "15 min ago",
  },
  {
    ip: "198.51.100.34",
    country: "Japan",
    city: "Tokyo",
    requests: 5430,
    bandwidth: "0.8 GB",
    threats: 11,
    status: "blocked",
    lastSeen: "3 min ago",
  },
  {
    ip: "203.0.113.78",
    country: "Brazil",
    city: "São Paulo",
    requests: 4320,
    bandwidth: "0.6 GB",
    threats: 4,
    status: "active",
    lastSeen: "20 min ago",
  },
  {
    ip: "198.51.100.56",
    country: "India",
    city: "Mumbai",
    requests: 3980,
    bandwidth: "0.5 GB",
    threats: 9,
    status: "active",
    lastSeen: "25 min ago",
  },
  {
    ip: "203.0.113.90",
    country: "Italy",
    city: "Rome",
    requests: 3650,
    bandwidth: "0.5 GB",
    threats: 6,
    status: "active",
    lastSeen: "30 min ago",
  },
];

export default function CloudflareAnalyticsTableTBody() {
  return (
    <tbody>
      {analyticsData.map((row, index) => (
        <tr
          key={index}
          className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors duration-200"
        >
          <td className="py-3 px-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-100 font-mono">{row.ip}</span>
            </div>
          </td>
          <td className="py-3 px-4">
            <span className="text-sm text-slate-300">{row.country}</span>
          </td>
          <td className="py-3 px-4">
            <span className="text-sm text-slate-400">{row.city}</span>
          </td>
          <td className="py-3 px-4">
            <span className="text-sm text-slate-100 font-medium">
              {row.requests.toLocaleString()}
            </span>
          </td>
          <td className="py-3 px-4">
            <span className="text-sm text-slate-300">{row.bandwidth}</span>
          </td>
          <td className="py-3 px-4">
            <span className="text-sm text-slate-300">{row.threats}</span>
          </td>
          <td className="py-3 px-4">
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                row.status === "active"
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              )}
            >
              {row.status}
            </Badge>
          </td>
          <td className="py-3 px-4">
            <span className="text-sm text-slate-400">{row.lastSeen}</span>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
