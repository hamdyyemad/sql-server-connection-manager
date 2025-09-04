export default function CloudflareAnalyticsStatsItem({
  id,
  title,
  value,
}: {
  id: number;
  title: string;
  value: string;
}) {
  return (
    <>
      <div key={id} className="text-center">
        <div className="text-2xl font-bold text-slate-100">{value}</div>
        <div className="text-sm text-slate-400">{title}</div>
      </div>
    </>
  );
}
