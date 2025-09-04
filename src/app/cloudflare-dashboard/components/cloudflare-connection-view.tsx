import { CloudflareFeaturesCard, CloudflareFormHeader } from "./connection";

export default function CloudflareConnectionView({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 space-y-6">
      <CloudflareFormHeader />
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {children}
          <CloudflareFeaturesCard />
        </div>
      </div>
    </div>
  );
}
