const features = [
  { color: "bg-emerald-500", label: "Website Traffic Analytics" },
  { color: "bg-blue-500", label: "Global CDN Performance" },
  { color: "bg-purple-500", label: "Security Insights" },
  { color: "bg-orange-500", label: "DNS Management" },
];

export default function FeaturesCard() {
  return (
    <>
      {features.map((feature, idx) => (
        <div key={idx} className="flex items-center space-x-3">
          <div className={`w-2 h-2 ${feature.color} rounded-full`} />
          <span className="text-slate-300 text-sm">{feature.label}</span>
        </div>
      ))}
    </>
  );
}
