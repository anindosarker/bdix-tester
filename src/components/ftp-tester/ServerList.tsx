"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Activity, ExternalLink, Globe } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface ServerListProps {
  servers: FtpServer[];
  isLoading: boolean;
  results: Record<string, TestResult & { loading: boolean }>;
}

export function ServerList({ servers, isLoading, results }: ServerListProps) {
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
            <div className="font-semibold text-foreground flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  !isTested
                    ? "bg-muted"
                    : isOnline
                    ? "bg-emerald-500 shadow-md shadow-emerald-500/50"
                    : "bg-destructive shadow-md shadow-destructive/50"
                }`}
              />
              <span className="truncate max-w-[150px]">{server.name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "url",
        header: "Host",
        cell: ({ row }) => (
          <div className="text-muted-foreground font-mono text-[11px] truncate max-w-[150px]">
            <a
              href={row.original.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
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
            <Badge
              variant={isOnline ? "default" : "destructive"}
              className={`${
                isOnline
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              } border font-bold text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full`}
            >
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
            <div className="relative group/preview w-40 h-24 rounded-lg border border-border bg-muted/30 overflow-hidden shadow-inner">
              <iframe
                src={row.original.url}
                className="w-[1000px] h-[600px] origin-top-left scale-[0.16] pointer-events-none"
                title="Preview"
              />
              <div className="absolute inset-0 bg-transparent flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity">
                <Globe className="w-4 h-4 text-white animate-pulse" />
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

  const table = useReactTable({
    data: servers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="bg-card/40 p-0 backdrop-blur-xl border border-border rounded-xl overflow-hidden shadow-xl">
      <Table>
        <TableHeader className="bg-muted/50 border-b border-border">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="hover:bg-transparent border-none"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] h-12"
                >
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
              <TableRow
                key={row.id}
                className="group border-border hover:bg-primary/5 transition-colors h-28"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={
                      cell.column.id === "name"
                        ? "pl-6"
                        : cell.column.id === "actions"
                        ? "pr-6"
                        : ""
                    }
                  >
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
