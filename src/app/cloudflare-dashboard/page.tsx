"use client";
import { useState } from "react";

import {TotalVisitors, Device, Browser} from "./components/charts";

///////////////////////////////////Dashboard Imports////////////////////////////////////////////////
import {
  CloudflareAnalyticsTable,
  CloudflareDashboardHeader,
} from "./components/dashboard";
import PerformanceMetrics from "./components/metrics/performance-metrics";
import CloudflareActivityFeed from "./components/activity/cloudflare-activity";
////////////////////////////////////////////////////////////////////////////////////////////////////

import StatusCardsItems from "./components/stats/status-cards-items";

///////////////////////////////////Form Imports////////////////////////////////////////////////
import CloudflareConnectionView from "./components/cloudflare-connection-view";
import CloudflareFormCard from "./components/connection/cloudflare-form-card";
import CloudflareForm from "./components/connection/cloudflare-form/cloudflare-form";
///////////////////////////////////////////////////////////////////////////////////////////////

export default function CloudflareDashboard() {
  const [isConnected, setIsConnected] = useState(false);

  // Status card data
  if (!isConnected) {
    return (
      <CloudflareConnectionView>
        <CloudflareFormCard>
          <CloudflareForm setIsConnected={setIsConnected} />
        </CloudflareFormCard>
      </CloudflareConnectionView>
    );
  }

  // Connected Dashboard View
  return (
    <div className="p-6 space-y-6">
      <CloudflareDashboardHeader />

      {/* Enhanced Status Cards with Mini Charts */}
      <StatusCardsItems />

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TotalVisitors />
        <Device />
        <Browser />
      </div>

      {/* Cloudflare Analytics Table */}
      <CloudflareAnalyticsTable />

      {/* Performance Metrics with Progress Bars */}
      <PerformanceMetrics />

      {/* Real-time Activity Feed */}
      <CloudflareActivityFeed />
    </div>
  );
}
