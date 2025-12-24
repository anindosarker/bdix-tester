"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  totalFiltered: number;
}

export function SearchBar({ value, onChange, totalFiltered }: SearchBarProps) {
  return (
    <div className="max-w-4xl mx-auto w-full mb-8 space-y-2">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
        <span>Available FTP Servers</span>
        <span className="font-mono italic opacity-60">
          {totalFiltered} of {totalFiltered} servers
        </span>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search servers..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 h-12"
        />
      </div>
    </div>
  );
}
