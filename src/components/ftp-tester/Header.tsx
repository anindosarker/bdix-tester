"use client";

import { Button } from "@/components/ui/button";
import { Github, Play, Wifi } from "lucide-react";

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
    <div className="flex flex-col items-center text-center space-y-6 mb-12">
      <div className="space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent pb-1">
          BDIX FTP Tester
        </h1>
        <div className="flex flex-col items-center space-y-2">
          <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl px-4">
            This tester identifies which BDIX FTP servers are accessible on your
            current WiFi/Network.
          </p>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 flex items-center justify-center gap-2">
            <Wifi className="w-4 h-4 text-blue-500" /> High-speed local
            discovery made easy.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          size="lg"
          onClick={onTestAll}
          disabled={isTestDisabled}
          className="rounded-full shadow-2xl h-16 px-12 text-lg font-bold transition-all hover:scale-105 active:scale-95 bg-blue-600 hover:bg-blue-700 glow-blue group"
        >
          <Play className="w-6 h-6 mr-3 group-hover:animate-ping" /> Start Total
          Scan
        </Button>

        <Button
          variant="ghost"
          onClick={onSubmitServer}
          className="rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
        >
          <Github className="w-4 h-4 mr-2" /> Submit New Server
        </Button>
      </div>

      <style jsx global>{`
        .glow-blue {
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.3);
        }
        .glow-blue:hover {
          box-shadow: 0 0 30px rgba(37, 99, 235, 0.5);
        }
      `}</style>
    </div>
  );
}
