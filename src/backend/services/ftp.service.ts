import { TestResult } from "@/lib/types/ftp";
import axios from "axios";
import net from "net";
import { URL } from "url";

export class FtpService {
  /**
   * Tests connectivity to a URL (HTTP/HTTPS or FTP/TCP)
   */
  static async testConnection(targetUrl: string): Promise<TestResult> {
    try {
      const parsedUrl = new URL(targetUrl);
      const isHttp =
        parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";

      if (isHttp) {
        return await this.testHttp(targetUrl);
      } else {
        return await this.testTcp(
          parsedUrl.hostname,
          parsedUrl.port || "21",
          targetUrl
        );
      }
    } catch {
      return {
        url: targetUrl,
        isOnline: false,
        statusText: "Invalid URL",
      };
    }
  }

  private static async testHttp(url: string): Promise<TestResult> {
    try {
      // We use a short timeout for BDIX checks
      const response = await axios.get(url, {
        timeout: 5000,
        validateStatus: () => true, // Accept any status code (even 404/500 means server is online)
        headers: {
          "User-Agent": "BDIX-Tester/1.0",
        },
      });

      return {
        url,
        isOnline: true,
        statusText: `Online (${response.status})`,
      };
    } catch {
      return {
        url,
        isOnline: false,
        statusText: "Offline",
      };
    }
  }

  private static testTcp(
    host: string,
    port: string,
    url: string
  ): Promise<TestResult> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      const timeout = 5000;

      socket.setTimeout(timeout);

      socket.on("connect", () => {
        socket.destroy();
        resolve({
          url,
          isOnline: true,
          statusText: "Online (TCP)",
        });
      });

      socket.on("error", () => {
        socket.destroy();
        resolve({
          url,
          isOnline: false,
          statusText: "Connection Error",
        });
      });

      socket.on("timeout", () => {
        socket.destroy();
        resolve({
          url,
          isOnline: false,
          statusText: "Timed Out",
        });
      });

      socket.connect(parseInt(port), host);
    });
  }
}
