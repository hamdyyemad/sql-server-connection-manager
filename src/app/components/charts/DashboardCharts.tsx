"use client";
import { useEffect, useRef } from "react";
import BackgroundGradient from "../layout/background-gradient";

interface ChartData {
  employeeActionsByMonth: Array<{ month: string; count: number }>;
  actionsByType: Array<{ type: string; count: number }>;
  screensByStatus: Array<{ status: string; count: number }>;
}

interface DashboardChartsProps {
  data: ChartData;
}

export function EmployeeActionsChart({
  data,
}: {
  data: ChartData["employeeActionsByMonth"];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Simple bar chart implementation
    const maxCount = Math.max(...data.map((d) => d.count));
    const barWidth = 40;
    const barSpacing = 20;
    const chartHeight = 200;
    const chartWidth = data.length * (barWidth + barSpacing) + barSpacing;

    canvasRef.current.width = chartWidth;
    canvasRef.current.height = chartHeight + 50; // Extra space for labels

    // Draw bars
    data.forEach((item, index) => {
      const x = index * (barWidth + barSpacing) + barSpacing;
      const barHeight = (item.count / maxCount) * chartHeight;
      const y = chartHeight - barHeight;

      // Bar
      ctx.fillStyle = "#3B82F6";
      ctx.fillRect(x, y, barWidth, barHeight);

      // Label
      ctx.fillStyle = "#374151";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(item.count.toString(), x + barWidth / 2, y - 5);

      // Month label
      ctx.fillText(item.month, x + barWidth / 2, chartHeight + 20);
    });
  }, [data]);

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export function ActionsByTypeChart({
  data,
}: {
  data: ChartData["actionsByType"];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Simple pie chart implementation
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    const total = data.reduce((sum, item) => sum + item.count, 0);

    let currentAngle = 0;
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

    data.forEach((item, index) => {
      const sliceAngle = (item.count / total) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        radius,
        currentAngle,
        currentAngle + sliceAngle
      );
      ctx.closePath();

      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();

      // Label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
      const labelY = centerY + Math.sin(labelAngle) * (radius + 20);

      ctx.fillStyle = "#374151";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${item.type}: ${item.count}`, labelX, labelY);

      currentAngle += sliceAngle;
    });
  }, [data]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <canvas ref={canvasRef} width="300" height="300" />
    </div>
  );
}

export function ScreensByStatusChart({
  data,
}: {
  data: ChartData["screensByStatus"];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Simple horizontal bar chart
    const maxCount = Math.max(...data.map((d) => d.count));
    const barHeight = 30;
    const barSpacing = 10;
    const chartWidth = 200;
    const chartHeight = data.length * (barHeight + barSpacing) + barSpacing;

    canvasRef.current.width = chartWidth + 100; // Extra space for labels
    canvasRef.current.height = chartHeight;

    // Draw bars
    data.forEach((item, index) => {
      const y = index * (barHeight + barSpacing) + barSpacing;
      const barWidth = (item.count / maxCount) * chartWidth;

      // Bar
      ctx.fillStyle = "#10B981";
      ctx.fillRect(0, y, barWidth, barHeight);

      // Label
      ctx.fillStyle = "#374151";
      ctx.font = "12px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`${item.status}: ${item.count}`, barWidth + 10, y + 20);
    });
  }, [data]);

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
      {/* Employee Actions by Month */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Employee Actions by Month
        </h3>
        <div className="h-64">
          <EmployeeActionsChart data={data.employeeActionsByMonth} />
        </div>
      </div>

      {/* Actions by Type */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Actions by Type
        </h3>
        <div className="h-64">
          <ActionsByTypeChart data={data.actionsByType} />
        </div>
      </div>

      {/* Screens by Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Screens by Status
        </h3>
        <div className="h-64">
          <ScreensByStatusChart data={data.screensByStatus} />
        </div>
      </div>
    </div>
  );
}
