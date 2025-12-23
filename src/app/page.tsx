"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useFtpServers, useTestServer } from "@/hooks/use-ftp";
import {
  Github,
  Info,
  Play,
  Search,
  Signal,
  SignalHigh,
  SignalLow,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function FtpTesterPage() {
  const { data: servers, isLoading } = useFtpServers();
  const testMutation = useTestServer();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<
    Record<
      string,
      { status: string; isOnline?: boolean; latency?: number; loading: boolean }
    >
  >({});

  const filteredServers = useMemo(() => {
    if (!servers) return [];
    return servers.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.url.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [servers, search]);

  const testOne = async (id: string, url: string) => {
    setResults((prev) => ({
      ...prev,
      [id]: { status: "Testing...", loading: true },
    }));
    try {
      const res = await testMutation.mutateAsync(url);
      setResults((prev) => ({
        ...prev,
        [id]: {
          status: res.statusText,
          isOnline: res.isOnline,
          latency: res.latency,
          loading: false,
        },
      }));
    } catch (_err) {
      setResults((prev) => ({
        ...prev,
        [id]: { status: "Error", isOnline: false, loading: false },
      }));
    }
  };

  const testAll = async () => {
    if (!filteredServers.length) return;
    toast.info(`Testing ${filteredServers.length} servers...`);

    // Test in batches of 5 to avoid overloading the backend/client
    const batchSize = 5;
    for (let i = 0; i < filteredServers.length; i += batchSize) {
      const batch = filteredServers.slice(i, i + batchSize);
      await Promise.all(batch.map((s) => testOne(s.id, s.url)));
    }
    toast.success("All tests completed!");
  };

  const openGithubIssue = () => {
    const title = encodeURIComponent("New FTP Server Request");
    const body = encodeURIComponent(
      "Please add/update this FTP server:\n\nName: \nURL: \nCategory: \nDescription: "
    );
    window.open(
      `https://github.com/anindosarker/bdix-tester/issues/new?title=${title}&body=${body}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              BDIX FTP Tester
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2 flex items-center gap-2">
              <Info className="w-4 h-4" /> Discover and test high-speed local
              FTP servers.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={testAll}
              disabled={isLoading || filteredServers.length === 0}
              className="rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 bg-blue-600 hover:bg-blue-700"
            >
              <Play className="w-4 h-4 mr-2" /> Test All
            </Button>
            <Button
              variant="outline"
              onClick={openGithubIssue}
              className="rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Github className="w-4 h-4 mr-2" /> Submit Server
            </Button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-xl bg-white/50 backdrop-blur-md dark:bg-black/50 overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <SignalHigh className="w-12 h-12" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-neutral-500">
                Online Servers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Object.values(results).filter((r) => r.isOnline).length} /{" "}
                {filteredServers.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white/50 backdrop-blur-md dark:bg-black/50 overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <SignalLow className="w-12 h-12 text-red-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-neutral-500">
                Avg. Latency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(
                  Object.values(results)
                    .filter((r) => r.latency)
                    .reduce((acc, curr) => acc + (curr.latency || 0), 0) /
                    (Object.values(results).filter((r) => r.latency).length ||
                      1)
                )}
                ms
              </div>
            </CardContent>
          </Card>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Search by name, URL or category..."
              className="pl-10 h-full min-h-[80px] text-lg bg-white/50 backdrop-blur-md dark:bg-black/50 border-none shadow-xl rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Server Table */}
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
                : filteredServers.map((server) => {
                    const result = results[server.id];
                    return (
                      <TableRow
                        key={server.id}
                        className="group hover:bg-white/40 dark:hover:bg-black/40 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {server.name}
                        </TableCell>
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
                          <Badge
                            variant="secondary"
                            className="rounded-full px-3"
                          >
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
                            onClick={() => testOne(server.id, server.url)}
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
          {!isLoading && filteredServers.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="text-neutral-400 text-6xl">🔍</div>
              <h3 className="text-xl font-semibold">No servers found</h3>
              <p className="text-neutral-500">
                Try searching for something else or submit a new server.
              </p>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center text-neutral-400 text-sm mt-12 pb-8">
          <p>
            © {new Date().getFullYear()} BDIX FTP Tester • Made with ❤️ for the
            community
          </p>
        </div>
      </div>
    </div>
  );
}
