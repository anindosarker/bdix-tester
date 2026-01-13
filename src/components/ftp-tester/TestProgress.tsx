"use client";

import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

interface TestProgressProps {
  current: number;
  total: number;
  onlineCount: number;
  offlineCount: number;
  isTesting: boolean;
}

export function TestProgress({
  current,
  total,
  onlineCount,
  offlineCount,
  isTesting,
}: TestProgressProps) {
  if (!isTesting && current === 0) return null;

  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full mx-auto mb-12 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">
        <div className="flex items-center gap-2">
          {isTesting ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
          <span>{isTesting ? "Scanning" : "Scan Completed"}</span>
        </div>
        <span className="font-mono">
          {current} / {total} Checked
        </span>
      </div>

      <div className="relative">
        <Progress
          value={percentage}
          className="h-3 rounded-full shadow-inner"
        />
        <div
          className="absolute -top-1 left-0 h-5 w-1 bg-primary blur-sm transition-all duration-300"
          style={{ left: `${percentage}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-emerald-600/60 leading-none">
              Online
            </span>
            <span className="text-lg font-black text-emerald-600 leading-tight">
              {onlineCount}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-destructive/5 border border-destructive/10">
          <XCircle className="w-4 h-4 text-destructive" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-destructive/60 leading-none">
              Offline
            </span>
            <span className="text-lg font-black text-destructive leading-tight">
              {offlineCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
