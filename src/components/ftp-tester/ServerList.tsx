"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FtpServer, TestResult } from "@/lib/types/ftp";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Activity, ExternalLink, Filter, Globe } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface ServerListProps {
  servers: FtpServer[];
  isLoading: boolean;
  results: Record<string, TestResult & { loading: boolean }>;
}

export function ServerList({ servers, isLoading, results }: ServerListProps) {
  const [filter, setFilter] = useState<"all" | "online">("all");
  const showOnlyOnline = filter === "online";

  const displayServers = useMemo(() => {
    // 1. Filter
    let filtered = servers;
    if (showOnlyOnline) {
      filtered = servers.filter((s) => results[s.id]?.isOnline);
    }

    // 2. Sort: Online > Loading > Others
    return [...filtered].sort((a, b) => {
      const resA = results[a.id];
      const resB = results[b.id];

      // Priority 1: Online
      if (resA?.isOnline && !resB?.isOnline) return -1;
      if (!resA?.isOnline && resB?.isOnline) return 1;

      // Priority 2: Loading
      if (resA?.loading && !resB?.loading) return -1;
      if (!resA?.loading && resB?.loading) return 1;

      // Maintain stability if no difference
      return 0;
    });
  }, [servers, results, showOnlyOnline]);

  const columns = useMemo<ColumnDef<FtpServer>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => (
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3" /> Server Name
          </div>
        ),
        cell: ({ row }) => {
          const server = row.original;
          const result = results[server.id];
          const isOnline = result?.isOnline;
          const isTested = !!result;
          return (
            <div className="font-semibold flex items-center gap-2 min-w-[150px] py-1">
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${
                  !isTested
                    ? "bg-muted"
                    : isOnline
                    ? "bg-emerald-500"
                    : "bg-destructive"
                }`}
              />
              <span className="break-all">
                {row.index + 1}. {server.name}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "url",
        header: "Host",
        cell: ({ row }) => (
          <div className="text-muted-foreground font-mono text-[11px] break-all max-w-[250px] py-1">
            <a
              href={row.original.url}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              {row.original.url.replace("http://", "").replace("/", "")}
            </a>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const result = results[row.original.id];
          if (result?.loading) {
            return (
              <div className="flex items-center gap-2 text-primary text-xs font-bold animate-pulse">
                <Activity className="w-3 h-3 animate-spin" /> Testing
              </div>
            );
          }
          if (!result) {
            return (
              <div className="text-muted-foreground/60 text-[11px] font-medium italic">
                Pending
              </div>
            );
          }
          const isOnline = result.isOnline;
          return (
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          );
        },
      },
      {
        id: "preview",
        header: "Preview",
        cell: ({ row }) => {
          const result = results[row.original.id];
          const isOnline = result?.isOnline;

          if (!isOnline) {
            return (
              <div className="text-muted-foreground/20 text-[10px] italic">
                No preview
              </div>
            );
          }

          return (
            <div className="relative group/preview w-32 h-20 rounded border bg-muted overflow-hidden">
              <iframe
                src={row.original.url}
                className="w-[1000px] h-[600px] origin-top-left scale-[0.128] pointer-events-none"
                title="Preview"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity bg-black/20">
                <Globe className="w-4 h-4 text-white" />
              </div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <Link href={row.original.url} target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2" /> Visit
            </Button>
          </Link>
        ),
      },
    ],
    [results]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: displayServers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center justify-between bg-muted/10">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Server Directory
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={showOnlyOnline ? "default" : "secondary"}
              size="sm"
            >
              <Filter className="w-3 h-3" />
              {showOnlyOnline ? "Filter: Online Only" : "Filter: All"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
              Filter Options
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={filter}
              onValueChange={(v) => setFilter(v as "all" | "online")}
            >
              <DropdownMenuRadioItem
                value="all"
                className="text-xs focus:bg-accent cursor-pointer"
              >
                Show All Servers
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="online"
                className="text-xs focus:bg-accent cursor-pointer"
              >
                Verified Online Only
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-border">
                <TableCell className="pl-6">
                  <Skeleton className="h-4 w-32 bg-muted" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40 bg-muted" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16 bg-muted" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-16 w-32 bg-muted rounded-lg" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 ml-auto bg-muted rounded-full" />
                </TableCell>
              </TableRow>
            ))
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-48 text-center">
                <div className="py-12 space-y-4">
                  <div className="text-muted text-6xl opacity-20">🔍</div>
                  <h3 className="text-xl font-bold text-muted-foreground">
                    No servers found
                  </h3>
                  <p className="text-muted-foreground/60">
                    Try refining your search terms.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
