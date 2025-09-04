const columnHeaders = [
  "IP Address",
  "Country",
  "City",
  "Requests",
  "Bandwidth",
  "Threats",
  "Status",
  "Last Seen",
];

export default function CloudflareAnalyticsTableTHead() {
  return (
    <thead>
      <tr className="border-b border-slate-700">
        {columnHeaders.map((header, idx) => (
          <th
            key={idx}
            className="text-left py-3 px-4 text-sm font-medium text-slate-300"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
