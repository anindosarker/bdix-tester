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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
      <StatCard
        label="Total Servers"
        value={totalCount}
        icon={<Monitor className="w-5 h-5 text-primary" />}
        borderColor="border-border"
      />
      <StatCard
        label="Online"
        value={onlineCount}
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        borderColor="border-emerald-500/20"
        glowColor="shadow-[0_0_15px_rgba(16,185,129,0.1)]"
      />
      <StatCard
        label="Offline"
        value={offlineCount}
        icon={<XCircle className="w-5 h-5 text-destructive" />}
        borderColor="border-destructive/20"
        glowColor="shadow-[0_0_15px_rgba(239,68,68,0.1)]"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  borderColor,
  glowColor = "",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  borderColor: string;
  glowColor?: string;
}) {
  return (
    <Card
      className={`bg-card/60 backdrop-blur-xl border ${borderColor} ${glowColor} rounded-xl overflow-hidden transition-all duration-300 hover:border-accent`}
    >
      <CardContent className="p-6 flex items-center gap-6">
        <div className="w-14 h-14 rounded-xl bg-background border border-border flex items-center justify-center shadow-2xl">
          {icon}
        </div>
        <div className="space-y-0.5">
          <div className="text-3xl font-black text-card-foreground lining-nums tabular-nums leading-none">
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
