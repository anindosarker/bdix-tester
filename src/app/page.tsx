"use client";

import { Footer } from "@/components/ftp-tester/Footer";
import { Header } from "@/components/ftp-tester/Header";
import { SearchBar } from "@/components/ftp-tester/SearchBar";
import { ServerList } from "@/components/ftp-tester/ServerList";
import { TestProgress } from "@/components/ftp-tester/TestProgress";
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
  const [isTesting, setIsTesting] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);
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
    } finally {
      setCheckedCount((prev) => prev + 1);
    }
  };

  const testAll = async () => {
    if (!filteredServers.length) return;
    setHasTested(true);
    setIsTesting(true);
    setCheckedCount(0);
    setResults({});

    toast.info(`Scanning ${filteredServers.length} servers...`);

    const batchSize = 5;
    for (let i = 0; i < filteredServers.length; i += batchSize) {
      const batch = filteredServers.slice(i, i + batchSize);
      await Promise.all(batch.map((s: FtpServer) => testOne(s.id, s.url)));
    }

    setIsTesting(false);
    toast.success("All scans completed!");
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
    <div className="min-h-screen bg-background pt-24 pb-16 px-0 selection:bg-primary/20">
      <Topbar onSubmitServer={openGithubIssue} />

      <div className="max-w-7xl mx-auto">
        <Header
          onTestAll={testAll}
          isTestDisabled={isLoading || filteredServers.length === 0}
          hasTested={hasTested}
        />

        <TestProgress
          current={checkedCount}
          total={filteredServers.length}
          onlineCount={onlineCount}
          offlineCount={offlineCount}
          isTesting={isTesting}
        />

        <div className="space-y-12 px-4 md:px-0">
          <SearchBar
            value={search}
            onChange={setSearch}
            totalFiltered={filteredServers.length}
          />

          <ServerList
            servers={filteredServers}
            isLoading={isLoading}
            results={results}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
}
