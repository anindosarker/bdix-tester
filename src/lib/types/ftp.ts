export interface FtpServer {
  id: string;
  name: string;
  url: string;
  category: string;
}

export interface TestResult {
  url: string;
  isOnline: boolean;
  statusText: string;
}
