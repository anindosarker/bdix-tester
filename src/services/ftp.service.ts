import axios from "axios";
import ftpServers from "../data/ftp-servers.json";

export interface FtpServer {
  id: string;
  name: string;
  url: string;
  category: string;
}

export interface TestResponse {
  url: string;
  isOnline: boolean;
  statusText: string;
  latency: number;
}

export class FtpClientService {
  /**
   * Returns the list of FTP servers from the local JSON file.
   * In a real app, this could be fetched from an API if the JSON was served dynamically.
   */
  static async getServers(): Promise<FtpServer[]> {
    // Return the imported JSON. Next.js bundles this.
    return ftpServers as FtpServer[];
  }

  /**
   * Calls the backend API to test a specific server.
   */
  static async testServer(url: string): Promise<TestResponse> {
    const response = await axios.post("/api/ftp/test", { url });
    return response.data;
  }
}
