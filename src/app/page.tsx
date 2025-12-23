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
    toast.info(`Testing ${filteredServers.length} servers...`);

    // Test in batches of 5 to avoid overloading the backend/client
    const batchSize = 5;
    for (let i = 0; i < filteredServers.length; i += batchSize) {
      const batch = filteredServers.slice(i, i + batchSize);
      await Promise.all(batch.map((s: FtpServer) => testOne(s.id, s.url)));
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

  const onlineCount = Object.values(results).filter((r) => r.isOnline).length;

  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-50 to-neutral-200 dark:from-neutral-950 dark:to-neutral-900 pt-24 pb-12 px-4 md:px-12 transition-colors duration-500">
      <Topbar onSubmitServer={openGithubIssue} />

      <div className="max-w-5xl mx-auto space-y-4">
        <Header
          onTestAll={testAll}
          onSubmitServer={openGithubIssue}
          isTestDisabled={isLoading || filteredServers.length === 0}
        />

        <SearchBar value={search} onChange={setSearch} />

        <StatsGrid
          onlineCount={onlineCount}
          totalFiltered={filteredServers.length}
          isVisible={hasTested}
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
