"use client";

import { Button } from "@/components/ui/button";
import { Github, Terminal } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface TopbarProps {
  onSubmitServer: () => void;
}

export function Topbar({ onSubmitServer }: TopbarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-card border border-border flex items-center justify-center shadow-lg">
            <Terminal className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-lg hidden sm:inline">
            BDIX FTP Tester
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onSubmitServer}>
            <Github className="w-4 h-4 mr-2" /> Submit Server
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
