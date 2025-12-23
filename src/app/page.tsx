"use client";

import { Footer } from "@/components/ftp-tester/Footer";
import { Header } from "@/components/ftp-tester/Header";
import { SearchBar } from "@/components/ftp-tester/SearchBar";
import { ServerList } from "@/components/ftp-tester/ServerList";
import { StatsGrid } from "@/components/ftp-tester/StatsGrid";
import { Topbar } from "@/components/ftp-tester/Topbar";
import { useFtpServers, useTestServer } from "@/hooks/use-ftp";
import { FtpServer, TestResult } from "@/lib/types/ftp";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function FtpTesterPage() {
  const { data: servers, isLoading } = useFtpServers();
  const testMutation = useTestServer();
  const [search, setSearch] = useState("");
  const [hasTested, setHasTested] = useState(false);
  const [results, setResults] = useState<
    Record<string, TestResult & { loading: boolean }>
  >({});

  const filteredServers = useMemo(() => {
    if (!servers) return [];
    return servers.filter(
      (s: FtpServer) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.url.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [servers, search]);

  const testOne = async (id: string, url: string) => {
    setResults((prev) => ({
      ...prev,
      [id]: { url, isOnline: false, statusText: "Testing...", loading: true },
    }));
    try {
      const res = await testMutation.mutateAsync(url);
      setResults((prev) => ({
        ...prev,
        [id]: {
          ...res,
          loading: false,
        },
      }));
    } catch (error) {
      console.error("Test failed", error);
      setResults((prev) => ({
        ...prev,
        [id]: { url, isOnline: false, statusText: "Error", loading: false },
      }));
    }
  };

  const testAll = async () => {
    if (!filteredServers.length) return;
    setHasTested(true);
    toast.info(`Scanning ${filteredServers.length} servers...`, {
      className: "bg-neutral-900 border-neutral-800 text-cyan-400",
    });

    // Test in batches of 5 to avoid overloading the backend/client
    const batchSize = 5;
    for (let i = 0; i < filteredServers.length; i += batchSize) {
      const batch = filteredServers.slice(i, i + batchSize);
      await Promise.all(batch.map((s: FtpServer) => testOne(s.id, s.url)));
    }
    toast.success("All scans completed!", {
      className: "bg-neutral-900 border-neutral-800 text-emerald-400",
    });
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

  const onlineCount = Object.values(results).filter((r) => r.isOnline).length;
  const offlineCount = Object.values(results).filter(
    (r) => !r.isOnline && !r.loading
  ).length;

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-16 px-4 md:px-12 selection:bg-cyan-500/30">
      <Topbar onSubmitServer={openGithubIssue} />

      <div className="max-w-4xl mx-auto">
        <Header
          onTestAll={testAll}
          onSubmitServer={openGithubIssue}
          isTestDisabled={isLoading || filteredServers.length === 0}
          hasTested={hasTested}
        />

        <StatsGrid
          totalCount={filteredServers.length}
          onlineCount={onlineCount}
          offlineCount={offlineCount}
          isVisible={hasTested}
        />

        <SearchBar
          value={search}
          onChange={setSearch}
          totalFiltered={filteredServers.length}
        />

        <ServerList
          servers={filteredServers}
          isLoading={isLoading}
          results={results}
          onTestOne={testOne}
        />

        <Footer />
      </div>
    </div>
  );
}
