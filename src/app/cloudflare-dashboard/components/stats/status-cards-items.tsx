import StatusCardItemChart from "./status-card-item-chart";
import { StatusCardData } from "../../types/status-card";

const statusCardData: StatusCardData[] = [
  {
    title: "Total Requests",
    value: "2.4M",
    change: "+12.5% from last month",
    changeType: "positive" as const,
    icon: (
      <svg
        className="w-5 h-5 text-blue-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    iconBgColor: "bg-blue-500/20",
    chartData: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [180, 210, 230, 240, 220, 250, 260],
      color: "#3B82F6",
    },
  },
  {
    title: "Bandwidth Used",
    value: "1.2TB",
    change: "+8.3% from last month",
    changeType: "positive" as const,
    icon: (
      <svg
        className="w-5 h-5 text-green-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    iconBgColor: "bg-green-500/20",
    chartData: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [800, 900, 1000, 1100, 1000, 1200, 1300],
      color: "#10B981",
    },
  },
  {
    title: "Cache Hit Rate",
    value: "94.2%",
    change: "+2.1% from last month",
    changeType: "positive" as const,
    icon: (
      <svg
        className="w-5 h-5 text-purple-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    iconBgColor: "bg-purple-500/20",
    chartData: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [92, 93, 94, 95, 94, 93, 94],
      color: "#8B5CF6",
    },
  },
  {
    title: "Threats Blocked",
    value: "12.5K",
    change: "+15.2% from last month",
    changeType: "negative" as const,
    icon: (
      <svg
        className="w-5 h-5 text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    ),
    iconBgColor: "bg-red-500/20",
    chartData: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [1200, 1350, 1100, 1250, 1400, 1150, 1300],
      color: "#EF4444",
    },
  },
];

export default function StatusCardsItems() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {statusCardData.map((card, index) => (
        <StatusCardItemChart
          key={index}
          title={card.title}
          value={card.value}
          change={card.change}
          changeType={card.changeType as "positive" | "negative"}
          icon={card.icon}
          iconBgColor={card.iconBgColor}
          chartData={card.chartData}
        />
      ))}
    </div>
  );
}
