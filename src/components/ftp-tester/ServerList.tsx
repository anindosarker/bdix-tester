"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ExternalLink,
  Filter,
  Globe,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface ServerListProps {
  servers: FtpServer[];
  isLoading: boolean;
  results: Record<string, TestResult & { loading: boolean }>;
}

export function ServerList({ servers, isLoading, results }: ServerListProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "priority", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const data = useMemo(() => {
    return servers.map((s) => ({
      ...s,
      // Add a hidden priority field for the initial sort
      priority: results[s.id]?.isOnline ? 0 : results[s.id]?.loading ? 1 : 2,
      result: results[s.id],
    }));
  }, [servers, results]);

  const columns = useMemo<
    ColumnDef<
      FtpServer & {
        priority: number;
        result: TestResult & { loading: boolean };
      }
    >[]
  >(
    () => [
      {
        id: "priority",
        accessorKey: "priority",
        header: () => null,
        cell: () => null,
        enableHiding: true,
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <div className="flex flex-col gap-2 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                <span>Server Name</span>
                {column.getIsSorted() === "asc" ? (
                  <ArrowUp className="ml-2 h-3 w-3" />
                ) : column.getIsSorted() === "desc" ? (
                  <ArrowDown className="ml-2 h-3 w-3" />
                ) : (
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                )}
              </Button>
              <div className="relative group">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Filter name..."
                  value={(column.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    column.setFilterValue(event.target.value)
                  }
                  className="h-7 w-full pl-7 pr-7 text-[10px] bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
                />
                {(column.getFilterValue() as string) && (
                  <button
                    onClick={() => column.setFilterValue("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
            </div>
          );
        },
        cell: ({ row }) => {
          const server = row.original;
          const result = results[server.id];
          const isOnline = result?.isOnline;
          const isTested = !!result;
          return (
            <div className="font-semibold flex items-center gap-2 min-w-[200px] py-1">
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${
                  !isTested
                    ? "bg-muted"
                    : isOnline
                    ? "bg-emerald-500"
                    : "bg-destructive"
                }`}
              />
              <span className="break-all">{server.name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "url",
        header: ({ column }) => (
          <div className="flex flex-col gap-2 py-2">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span>Host</span>
              <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
            <div className="relative">
              <Input
                placeholder="Filter host..."
                value={(column.getFilterValue() as string) ?? ""}
                onChange={(event) => column.setFilterValue(event.target.value)}
                className="h-7 w-full px-2 text-[10px] bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
          </div>
        ),
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
        id: "status",
        accessorFn: (row) => {
          const res = results[row.id];
          if (res?.isOnline) return 0;
          if (res && !res.loading) return 1;
          return 2;
        },
        header: ({ column }) => (
          <div className="flex flex-col gap-2 py-2">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 w-fit justify-start bg-transparent hover:bg-transparent px-2"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <div className="h-8 flex items-center text-xs font-medium">
                Status
              </div>
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-3 w-3" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-3 w-3" />
              ) : (
                <ArrowUpDown className="ml-2 h-3 w-3" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-full justify-between px-2 text-[10px] bg-muted/50 hover:bg-muted font-normal border-none"
                >
                  <span className="truncate">
                    {column.getFilterValue() === 0
                      ? "Online"
                      : column.getFilterValue() === 1
                      ? "Offline"
                      : column.getFilterValue() === 2
                      ? "Pending"
                      : "All"}
                  </span>
                  <Filter className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-32">
                <DropdownMenuItem
                  onClick={() => column.setFilterValue(undefined)}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue(0)}>
                  Online
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue(1)}>
                  Offline
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue(2)}>
                  Pending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
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
              className={
                isOnline
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-none hover:bg-emerald-500/20"
                  : ""
              }
            >
              {isOnline ? "Online" : "Offline"}
            </Badge>
          );
        },
      },
      {
        id: "preview",
        header: () => (
          <div className="flex flex-col gap-2 py-2">
            <div className="h-8 flex items-center text-xs font-medium px-2">
              Preview
            </div>
            <div className="h-7" /> {/* Spacer */}
          </div>
        ),
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
        header: () => (
          <div className="flex flex-col gap-2 py-2">
            <div className="h-8 flex items-center text-xs font-medium px-2">
              Action
            </div>
            <div className="h-7" /> {/* Spacer */}
          </div>
        ),
        cell: ({ row }) => (
          <Link href={row.original.url} target="_blank">
            <Button variant="outline" size="sm" className="h-8 px-3">
              <ExternalLink className="w-3 h-3 mr-2" /> Visit
            </Button>
          </Link>
        ),
      },
    ],
    [results]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      columnVisibility: {
        priority: false,
      },
      pagination: {
        pageSize: 50,
      },
    },
  });

  return (
    <Card className="rounded-xl border bg-card/30 backdrop-blur-sm overflow-hidden shadow-2xl border-white/5">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-foreground/90">
              Server Directory
            </h3>
            <p className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-widest">
              {table.getFilteredRowModel().rows.length} Total Servers Found
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {columnFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.resetColumnFilters()}
              className="h-8 text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      <Table>
        <TableHeader className="bg-white/[0.01]">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="hover:bg-transparent border-white/5"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="p-0 border-r border-white/5 last:border-0 align-top"
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
              <TableRow key={i} className="border-white/5">
                <TableCell className="pl-6">
                  <Skeleton className="h-4 w-32 bg-white/5" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40 bg-white/5" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16 bg-white/5" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-16 w-32 bg-white/5 rounded-lg" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 ml-auto bg-white/5 rounded-full" />
                </TableCell>
              </TableRow>
            ))
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="group hover:bg-white/[0.02] border-white/5 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3 px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-48 text-center bg-white/[0.01]"
              >
                <div className="py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-2">
                    <Search className="w-8 h-8 text-primary/20" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground/80">
                    No servers found
                  </h3>
                  <p className="text-muted-foreground/60 text-sm max-w-xs mx-auto">
                    No results match your current filters. Try resetting or
                    adjusting your search terms.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.resetColumnFilters()}
                  >
                    Clear all filters
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
