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
import { Activity, Wifi } from "lucide-react";

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
    <Card className="bg-card/80 backdrop-blur-xl border border-border rounded-xl overflow-hidden shadow-xl">
      <Table>
        <TableHeader className="bg-muted/50 border-b border-border">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] pl-6 h-12 flex items-center gap-2">
              <Activity className="w-3 h-3" /> Server Name
            </TableHead>
            <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] h-12">
              Host
            </TableHead>
            <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] hidden md:table-cell h-12">
              Category
            </TableHead>
            <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] h-12">
              Status
            </TableHead>
            <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] text-right pr-6 h-12">
              {/* No header for action */}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell className="pl-6">
                    <Skeleton className="h-4 w-32 bg-muted" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40 bg-muted" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-20 bg-muted" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 bg-muted" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 ml-auto bg-muted rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            : servers.map((server) => {
                const result = results[server.id];
                const isOnline = result?.isOnline;
                const isTested = !!result;

                return (
                  <TableRow
                    key={server.id}
                    className="group border-border hover:bg-primary/5 transition-colors h-16"
                  >
                    <TableCell className="font-semibold text-foreground pl-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            !isTested
                              ? "bg-muted"
                              : isOnline
                              ? "bg-emerald-500 shadow-md shadow-emerald-500/50"
                              : "bg-destructive shadow-md shadow-destructive/50"
                          }`}
                        />
                        {server.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      <a
                        href={server.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {server.url.replace("http://", "").replace("/", "")}
                      </a>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant="secondary"
                        className="bg-muted text-muted-foreground font-bold text-[10px] uppercase tracking-tighter px-2 border-none"
                      >
                        {server.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {result?.loading ? (
                        <div className="flex items-center gap-2 text-primary text-xs font-bold animate-pulse">
                          <Activity className="w-3 h-3 animate-spin" /> Testing
                        </div>
                      ) : !isTested ? (
                        <div className="text-muted-foreground/60 text-xs font-medium italic">
                          Pending
                        </div>
                      ) : (
                        <Badge
                          variant={isOnline ? "default" : "destructive"}
                          className={`${
                            isOnline
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          } border font-bold text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full`}
                        >
                          {isOnline ? "Online" : "Offline"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onTestOne(server.id, server.url)}
                        disabled={result?.loading}
                        className="rounded-full w-8 h-8 hover:bg-muted transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Wifi className="w-4 h-4 text-primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
      {!isLoading && servers.length === 0 && (
        <div className="py-24 text-center space-y-4">
          <div className="text-muted text-6xl opacity-20">🔍</div>
          <h3 className="text-xl font-bold text-muted-foreground">
            No servers found
          </h3>
          <p className="text-muted-foreground/60">
            Try refining your search terms.
          </p>
        </div>
      )}
    </Card>
  );
}
