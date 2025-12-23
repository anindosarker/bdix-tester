import { FtpClientService } from "@/services/ftp.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFtpServers = () => {
  return useQuery({
    queryKey: ["ftp-servers"],
    queryFn: () => FtpClientService.getServers(),
  });
};

export const useTestServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (url: string) => FtpClientService.testServer(url),
    onSuccess: (data) => {
      // We could update a global state or cache here if needed
      // For now, we'll just return the result to the caller
    },
  });
};
