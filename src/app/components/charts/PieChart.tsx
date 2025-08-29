"use client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
  title?: string;
}

export default function PieChart({ data, title }: PieChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#9CA3AF",
          font: {
            size: 12,
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#FFFFFF",
        bodyColor: "#D1D5DB",
        borderColor: "#000000",
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          label: (context: {
            label?: string;
            parsed: number;
            dataset: { data: number[] };
          }) => {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 3,
        borderColor: "#000000",
        hoverBorderWidth: 4,
        hoverBorderColor: "#FFFFFF",
      },
    },
  };

  // Enhanced data with better styling
  const enhancedData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      borderWidth: 3,
      borderColor: Array(dataset.data.length).fill("#000000"),
      hoverBorderWidth: 4,
      hoverBorderColor: Array(dataset.data.length).fill("#FFFFFF"),
    })),
  };

  return (
    <div className="w-full h-64 relative">
      {title && (
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          {title}
        </h4>
      )}
      <div className="relative bg-gray-900/20 rounded-xl p-4 border border-gray-800/30">
        <Pie data={enhancedData} options={options} />
        {/* Decorative elements */}
        <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full"></div>
      </div>
    </div>
  );
}
