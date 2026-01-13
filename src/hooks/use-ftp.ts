import { FtpClientService } from "@/services/ftp.service";
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
