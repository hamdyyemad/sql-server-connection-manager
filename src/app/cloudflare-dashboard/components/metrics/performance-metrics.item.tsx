export default function PerformanceMetricsItem({
  id,
  title,
  value,
  percentage,
  gradient,
}: {
  id: string;
  title: string;
  value: string;
  percentage: number;
  gradient: string;
}) {
  return (
    <div key={id}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-300 text-sm">{title}</span>
        <span className="text-slate-100 font-medium">{value}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className={`bg-gradient-to-r ${gradient} h-2 rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
