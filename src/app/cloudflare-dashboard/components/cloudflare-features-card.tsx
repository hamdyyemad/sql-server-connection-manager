import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";

export default function CloudflareFeaturesCard() {
  return <div className="lg:col-span-1 mt-3.5">
  <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10 border-slate-200/20 bg-slate-950/50 backdrop-blur-sm">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-slate-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <CardHeader className="relative z-10">
      <CardTitle className="text-lg font-semibold text-slate-100">
        Cloudflare Features
      </CardTitle>
    </CardHeader>

    <CardContent className="relative z-10">
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <span className="text-slate-300 text-sm">
            Website Traffic Analytics
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-slate-300 text-sm">
            Global CDN Performance
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-slate-300 text-sm">
            Security Insights
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-slate-300 text-sm">
            DNS Management
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
</div>;
}