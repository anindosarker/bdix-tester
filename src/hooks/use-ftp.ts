import { FtpClientService } from "@/services/ftp.service";
import { useAsyncBatchedCallback } from "@tanstack/react-pacer";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useFtpServers = () => {
  return useQuery({
    queryKey: ["ftp-servers"],
    queryFn: () => FtpClientService.getServers(),
  });
};

export const useTestServer = () => {
  return useMutation({
    mutationFn: (url: string) => FtpClientService.testServer(url),
    onSuccess: () => {
      // We could update a global state or cache here if needed
    },
  });
};

export const useFtpBatchTester = () => {
  return useAsyncBatchedCallback(
    async (urls: string[]) => {
      // Execute up to 50 checks concurrently
      return await Promise.all(
        urls.map((url) => FtpClientService.checkConnectivity(url))
      );
    },
    {
      maxSize: 50,
      wait: 200,
    }
  );
};
