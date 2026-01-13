"use client";

import { Button } from "@/components/ui/button";
import { Play, Terminal } from "lucide-react";

interface HeaderProps {
  onTestAll: () => void;
  isTestDisabled: boolean;
  hasTested: boolean;
  isTesting: boolean;
}

export function Header({
  onTestAll,
  isTestDisabled,
  hasTested,
  isTesting,
}: HeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-8 mb-16">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 rounded-xl border flex items-center justify-center bg-card">
          <Terminal className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            BDIX FTP <span className="text-primary">Tester</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Test your FTP server connections instantly
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        <Button
          onClick={onTestAll}
          disabled={isTestDisabled}
          className="w-full h-14 font-extrabold text-lg"
        >
          {isTesting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin text-xl">◌</span> Scanning...
            </span>
          ) : hasTested ? (
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
