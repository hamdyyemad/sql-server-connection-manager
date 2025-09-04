export default function StatusCardItemChartVisualization({
  chartData,
}: {
  chartData: { data: number[]; labels: string[] };
}) {
  return (
    <div className="mt-4 h-12 relative">
      <div className="flex items-end justify-between h-full space-x-1">
        {chartData.data.map((value, index) => {
          const maxValue = Math.max(...chartData.data);
          const height = (value / maxValue) * 100;
          return (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-slate-600/50 to-slate-500/30 rounded-sm transition-all duration-300 hover:from-slate-500/70 hover:to-slate-400/50"
              style={{
                height: `${height}%`,
                minHeight: "4px",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
