"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/frontend_lib/utils/utils";
import StatusCard from "../components/charts/StatusCard";
import {
  TotalVisitorsChart,
  DeviceChart,
  BrowserChart,
} from "../components/charts/CloudflareCharts";
import CloudflareFeaturesCard from "./components/cloudflare-features-card";
import CloudflareFormCard from "./components/cloudflare-form-card";

// Cloudflare Analytics Table Component
function CloudflareAnalyticsTable() {
  // Sample data that Cloudflare would typically provide
  const analyticsData = [
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

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10 border-slate-200/20 bg-slate-950/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-slate-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="relative z-10">
        <CardTitle className="text-lg font-semibold text-slate-100">
          Cloudflare Analytics Data
        </CardTitle>
        <p className="text-sm text-slate-400">
          Real-time traffic analytics from Cloudflare edge servers
        </p>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                  IP Address
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                  Country
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                  City
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                  Requests
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                  Bandwidth
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                  Threats
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                  Last Seen
                </th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors duration-200"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-100 font-mono">
                        {row.ip}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-slate-300">
                      {row.country}
                    </span>
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
                    <span className="text-sm text-slate-300">
                      {row.bandwidth}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-slate-300">
                      {row.threats}
                    </span>
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
                    <span className="text-sm text-slate-400">
                      {row.lastSeen}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-100">78,920</div>
            <div className="text-sm text-slate-400">Total Requests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-100">10.4 GB</div>
            <div className="text-sm text-slate-400">Total Bandwidth</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-100">80</div>
            <div className="text-sm text-slate-400">Total Threats</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">8</div>
            <div className="text-sm text-slate-400">Active IPs</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CloudflareDashboard() {
  const [isConnected, setIsConnected] = useState(false);
  

  // Status card data
  const statusCardData = [
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

  if (!isConnected) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-3xl font-extralight text-slate-400">
            Cloudflare Dashboard
          </h3>
        </div>

        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <CloudflareFormCard setIsConnected={setIsConnected}/>

            <CloudflareFeaturesCard />
          </div>
        </div>
      </div>
    );
  }

  // Connected Dashboard View
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-extralight text-slate-400">
          Cloudflare Dashboard
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <Badge
            variant="secondary"
            className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
          >
            Connected
          </Badge>
        </div>
      </div>

      {/* Enhanced Status Cards with Mini Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {statusCardData.map((card, index) => (
          <StatusCard
            key={index}
            title={card.title}
            value={card.value}
            change={card.change}
            changeType={card.changeType}
            icon={card.icon}
            iconBgColor={card.iconBgColor}
            chartData={card.chartData}
          />
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TotalVisitorsChart />
        <DeviceChart />
        <BrowserChart />
      </div>

      {/* Cloudflare Analytics Table */}
      <CloudflareAnalyticsTable />

      {/* Performance Metrics with Progress Bars */}
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10 border-slate-200/20 bg-slate-950/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-slate-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="relative z-10">
          <CardTitle className="text-lg font-semibold text-slate-100">
            Performance Metrics
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 text-sm">Cache Hit Rate</span>
                  <span className="text-slate-100 font-medium">94.2%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: "94.2%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 text-sm">
                    SSL/TLS Coverage
                  </span>
                  <span className="text-slate-100 font-medium">99.8%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: "99.8%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 text-sm">Uptime</span>
                  <span className="text-slate-100 font-medium">99.99%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: "99.99%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 text-sm">
                    Threat Protection
                  </span>
                  <span className="text-slate-100 font-medium">98.5%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: "98.5%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity Feed */}
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10 border-slate-200/20 bg-slate-950/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-slate-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="relative z-10">
          <CardTitle className="text-lg font-semibold text-slate-100">
            Real-time Activity Feed
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {[
              {
                time: "2 min ago",
                event: "DDoS attack blocked from 192.168.1.100",
                type: "security",
                severity: "high",
              },
              {
                time: "5 min ago",
                event: "Cache hit rate improved to 94.2%",
                type: "performance",
                severity: "info",
              },
              {
                time: "8 min ago",
                event: "New SSL certificate deployed",
                type: "ssl",
                severity: "info",
              },
              {
                time: "12 min ago",
                event: "Bot traffic detected and filtered",
                type: "security",
                severity: "medium",
              },
              {
                time: "15 min ago",
                event: "CDN edge server optimized",
                type: "performance",
                severity: "info",
              },
              {
                time: "18 min ago",
                event: "SQL injection attempt blocked",
                type: "security",
                severity: "high",
              },
              {
                time: "22 min ago",
                event: "Bandwidth usage spike detected",
                type: "traffic",
                severity: "warning",
              },
              {
                time: "25 min ago",
                event: "New country added to traffic analytics",
                type: "analytics",
                severity: "info",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors duration-200"
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    item.severity === "high"
                      ? "bg-red-500"
                      : item.severity === "medium"
                      ? "bg-orange-500"
                      : item.severity === "warning"
                      ? "bg-yellow-500"
                      : "bg-emerald-500"
                  )}
                ></div>
                <div className="flex-1">
                  <p className="text-slate-100 text-sm">{item.event}</p>
                  <p className="text-slate-400 text-xs">{item.time}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    item.type === "security"
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : item.type === "performance"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : item.type === "ssl"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : item.type === "traffic"
                      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                  )}
                >
                  {item.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
