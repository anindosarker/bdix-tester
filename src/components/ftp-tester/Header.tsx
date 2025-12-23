"use client";

import { Button } from "@/components/ui/button";
import { Play, Terminal } from "lucide-react";

interface HeaderProps {
  onTestAll: () => void;
  onSubmitServer: () => void;
  isTestDisabled: boolean;
  hasTested: boolean;
}

export function Header({
  onTestAll,
  onSubmitServer,
  isTestDisabled,
  hasTested,
}: HeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-8 mb-16">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 rounded-xl bg-card border border-border flex items-center justify-center shadow-lg">
          <Terminal className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              FTP <span className="text-primary italic">Tester</span>
            </h1>
          </div>
          <p className="text-muted-foreground font-medium max-w-sm">
            Test your FTP server connections instantly
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        <Button
          onClick={onTestAll}
          disabled={isTestDisabled}
          className="w-full h-14 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-extrabold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          {hasTested ? (
            <span className="flex items-center gap-2">
              <Play className="w-5 h-5 fill-current" /> Test Again
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Play className="w-5 h-5 fill-current" /> Start Test
            </span>
          )}
        </Button>

        {!hasTested && (
          <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
            Click the button to test connectivity to all FTP servers in the list
            below.
          </p>
        )}
      </div>
    </div>
  );
}
