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
import { Signal } from "lucide-react";

interface ServerListProps {
  servers: FtpServer[];
  isLoading: boolean;
  results: Record<string, TestResult & { loading: boolean }>;
  onTestOne: (id: string, url: string) => void;
}

export function ServerList({
  servers,
  isLoading,
  results,
  onTestOne,
}: ServerListProps) {
  return (
    <Card className="border-none shadow-2xl overflow-hidden bg-white/30 backdrop-blur-xl dark:bg-black/30">
      <Table>
        <TableHeader className="bg-neutral-100/50 dark:bg-neutral-800/50">
          <TableRow>
            <TableHead className="font-bold">Name</TableHead>
            <TableHead className="font-bold">URL</TableHead>
            <TableHead className="font-bold hidden md:table-cell">
              Category
            </TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="font-bold text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            : servers.map((server) => {
                const result = results[server.id];
                return (
                  <TableRow
                    key={server.id}
                    className="group hover:bg-white/40 dark:hover:bg-black/40 transition-colors"
                  >
                    <TableCell className="font-medium">{server.name}</TableCell>
                    <TableCell className="truncate max-w-[200px] md:max-w-none">
                      <a
                        href={server.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {server.url}
                      </a>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary" className="rounded-full px-3">
                        {server.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {!result ? (
                        <Badge
                          variant="outline"
                          className="rounded-full px-3 text-neutral-400 border-neutral-300"
                        >
                          Not Tested
                        </Badge>
                      ) : result.loading ? (
                        <Badge
                          variant="outline"
                          className="rounded-full px-3 animate-pulse border-blue-400 text-blue-500"
                        >
                          Testing...
                        </Badge>
                      ) : result.isOnline ? (
                        <div className="flex flex-col gap-1">
                          <Badge className="bg-emerald-500 hover:bg-emerald-600 rounded-full px-3 w-fit">
                            Online
                          </Badge>
                          <span className="text-[10px] text-emerald-600 font-mono ml-1">
                            {result.latency}ms
                          </span>
                        </div>
                      ) : (
                        <Badge
                          variant="destructive"
                          className="rounded-full px-3"
                        >
                          Offline
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onTestOne(server.id, server.url)}
                        disabled={result?.loading}
                        className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <Signal className="w-4 h-4 mr-2" /> Test
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
      {!isLoading && servers.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="text-neutral-400 text-6xl">🔍</div>
          <h3 className="text-xl font-semibold">No servers found</h3>
          <p className="text-neutral-500">
            Try searching for something else or submit a new server.
          </p>
        </div>
      )}
    </Card>
  );
}
