"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface TopbarProps {
  onSubmitServer: () => void;
}

export function Topbar({ onSubmitServer }: TopbarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/50 dark:bg-black/50 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
            B
          </div>
          <span className="font-bold text-lg hidden sm:inline">
            BDIX Tester
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSubmitServer}
            className="rounded-full text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
          >
            <Github className="w-4 h-4 mr-2" /> Submit Server
          </Button>
          <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 mx-1" />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
