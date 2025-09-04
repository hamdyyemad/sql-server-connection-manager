import { Card, CardContent } from "@/components/ui/card";

import { HelpText, CloudflareInfo } from "./cloudflare-form";

export default function CloudflareFormCard({children}: {children: React.ReactNode}) {
  return (
    <div className="lg:col-span-3 mt-3.5">
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10 border-slate-200/20 bg-slate-950/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-slate-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="relative z-10 p-8">
          {/* Cloudflare Icon */}
          <CloudflareInfo />
          <div className="text-center space-y-6">
            {children}
          </div>
          {/* Help Text */}
          <HelpText />
        </CardContent>
      </Card>
    </div>
  );
}
