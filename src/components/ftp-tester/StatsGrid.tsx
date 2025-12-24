"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Monitor, XCircle } from "lucide-react";

interface StatsGridProps {
  totalCount: number;
  onlineCount: number;
  offlineCount: number;
  isVisible: boolean;
}

export function StatsGrid({
  totalCount,
  onlineCount,
  offlineCount,
  isVisible,
}: StatsGridProps) {
  if (!isVisible) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
      <StatCard
        label="Total Servers"
        value={totalCount}
        icon={<Monitor className="w-5 h-5 text-primary" />}
      />
      <StatCard
        label="Online"
        value={onlineCount}
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
      />
      <StatCard
        label="Offline"
        value={offlineCount}
        icon={<XCircle className="w-5 h-5 text-destructive" />}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="transition-all hover:bg-accent/50">
      <CardContent className="p-6 flex items-center gap-6">
        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
          {icon}
        </div>
        <div className="space-y-0.5">
          <div className="text-3xl font-black text-foreground lining-nums tabular-nums leading-none">
            {value}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
