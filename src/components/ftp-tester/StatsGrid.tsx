"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, SignalHigh, SignalLow } from "lucide-react";

interface StatsGridProps {
  onlineCount: number;
  totalFiltered: number;
  avgLatency: number;
  search: string;
  onSearchChange: (value: string) => void;
}

export function StatsGrid({
  onlineCount,
  totalFiltered,
  avgLatency,
  search,
  onSearchChange,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-none shadow-xl bg-white/50 backdrop-blur-md dark:bg-black/50 overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <SignalHigh className="w-12 h-12" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-500">
            Online Servers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {onlineCount} / {totalFiltered}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl bg-white/50 backdrop-blur-md dark:bg-black/50 overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <SignalLow className="w-12 h-12 text-red-500" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-500">
            Avg. Latency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{avgLatency}ms</div>
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input
          placeholder="Search by name, URL or category..."
          className="pl-10 h-full min-h-[80px] text-lg bg-white/50 backdrop-blur-md dark:bg-black/50 border-none shadow-xl rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
