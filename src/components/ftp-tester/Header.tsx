"use client";

import { Button } from "@/components/ui/button";
import { Github, Info, Play } from "lucide-react";

interface HeaderProps {
  onTestAll: () => void;
  onSubmitServer: () => void;
  isTestDisabled: boolean;
}

export function Header({
  onTestAll,
  onSubmitServer,
  isTestDisabled,
}: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          BDIX FTP Tester
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2 flex items-center gap-2">
          <Info className="w-4 h-4" /> Discover and test high-speed local FTP
          servers.
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onTestAll}
          disabled={isTestDisabled}
          className="rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 bg-blue-600 hover:bg-blue-700"
        >
          <Play className="w-4 h-4 mr-2" /> Test All
        </Button>
        <Button
          variant="outline"
          onClick={onSubmitServer}
          className="rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <Github className="w-4 h-4 mr-2" /> Submit Server
        </Button>
      </div>
    </div>
  );
}
