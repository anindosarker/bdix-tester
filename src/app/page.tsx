"use client";

import { Footer } from "@/components/ftp-tester/Footer";
import { Header } from "@/components/ftp-tester/Header";
import { ServerList } from "@/components/ftp-tester/ServerList";
import { TestProgress } from "@/components/ftp-tester/TestProgress";
import { Topbar } from "@/components/ftp-tester/Topbar";
import { useFtpBatchTester, useFtpServers } from "@/hooks/use-ftp";
import { FtpServer, TestResult } from "@/lib/types/ftp";
import { useState } from "react";
import { toast } from "sonner";

export default function FtpTesterPage() {
  const { data: servers, isLoading } = useFtpServers();
  const batchTester = useFtpBatchTester();
  const [hasTested, setHasTested] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);
  const [results, setResults] = useState<
    Record<string, TestResult & { loading: boolean }>
  >({});

  const testOne = async (id: string, url: string) => {
    setResults((prev) => ({
      ...prev,
      [id]: { url, isOnline: false, statusText: "Testing...", loading: true },
    }));
    try {
      const res = await batchTester(url);
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
        [id]: { url, isOnline: false, statusText: "Offline", loading: false },
      }));
    } finally {
      setCheckedCount((prev) => prev + 1);
    }
  };

  const testAll = async () => {
    if (!servers || !servers.length) return;
    setHasTested(true);
    setIsTesting(true);
    setCheckedCount(0);
    setResults({});

    toast.info(`Scanning ${servers.length} servers...`);

    // We can just fire them all off, the batchTester (Pacer) will queue them up
    // However, for 4000+ items, pushing 4000 promises to the stack at once might still suffice?
    // Let's rely on Pacer, but maybe do it in chunks of 500 to be safe for the UI thread?
    // Actually, Pacer handles the execution, but the loop itself is sync.
    // Iterating 4000 times is fine.

    // We use Promise.all to wait for all of them to finish for the "isTesting" state
    await Promise.all(servers.map((s: FtpServer) => testOne(s.id, s.url)));

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
          isTestDisabled={isLoading || !servers || servers.length === 0}
          hasTested={hasTested}
          isTesting={isTesting}
        />

        <TestProgress
          current={checkedCount}
          total={servers?.length || 0}
          onlineCount={onlineCount}
          offlineCount={offlineCount}
          isTesting={isTesting}
        />

        <div className="space-y-12 px-4 md:px-0">
          <ServerList
            servers={servers || []}
            isLoading={isLoading}
            results={results}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
}
