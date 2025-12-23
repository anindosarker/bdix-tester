"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  totalFiltered: number;
}

export function SearchBar({ value, onChange, totalFiltered }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="max-w-4xl mx-auto w-full mb-8 space-y-4">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
        <span>Available FTP Servers</span>
        <span className="text-muted-foreground/60 font-mono italic">
          {totalFiltered} of {totalFiltered} servers
        </span>
      </div>

      <div className="relative group">
        <div
          className={`
          relative overflow-hidden transition-all duration-300 rounded-xl
          ${
            isFocused
              ? "ring-1 ring-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
              : "border border-border shadow-xl"
          }
          bg-card/60 backdrop-blur-xl
        `}
        >
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary/70 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <Input
            placeholder="Search servers by name, host, or protocol..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="pl-14 pr-6 h-14 text-sm font-medium border-none focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50 text-foreground"
          />
        </div>
      </div>
    </div>
  );
}
