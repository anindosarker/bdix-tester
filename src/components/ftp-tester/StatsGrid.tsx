"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignalHigh } from "lucide-react";

interface StatsGridProps {
  onlineCount: number;
  totalFiltered: number;
  isVisible: boolean;
}

export function StatsGrid({
  onlineCount,
  totalFiltered,
  isVisible,
}: StatsGridProps) {
  if (!isVisible) return null;

  return (
    <div className="max-w-md mx-auto mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
      <Card className="border-none shadow-xl bg-white/70 backdrop-blur-md dark:bg-black/70 overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <SignalHigh className="w-12 h-12" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500 text-center">
            Current Reachability
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <div className="text-5xl font-black flex items-baseline gap-2">
            <span className="text-blue-600 dark:text-blue-400">
              {onlineCount}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700 text-3xl">
              /
            </span>
            <span className="text-neutral-400">{totalFiltered}</span>
            <span className="text-sm font-medium text-neutral-500 ml-2">
              Online
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
