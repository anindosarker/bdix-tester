"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="max-w-3xl mx-auto w-full mb-12 relative group">
      <div
        className={`
        relative overflow-hidden transition-all duration-300 rounded-2xl
        ${
          isFocused
            ? "ring-2 ring-blue-500 shadow-2xl scale-[1.02]"
            : "shadow-xl"
        }
        bg-white/70 backdrop-blur-xl dark:bg-black/70 border border-neutral-200 dark:border-neutral-800
      `}
      >
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-hover:text-blue-500 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <Input
          placeholder="Type to search servers, categories or URLs..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-14 pr-6 h-16 text-lg border-none focus-visible:ring-0 bg-transparent placeholder:text-neutral-400"
        />

        {/* Subtle decorative line like in the reference */}
        <div className="absolute bottom-0 left-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Shortcut hint like in CMD-K menus */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-[10px] font-mono text-neutral-400 pointer-events-none pr-4">
        <kbd className="px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
          ESC
        </kbd>
        <span>to clear</span>
      </div>
    </div>
  );
}
