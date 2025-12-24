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
      // Use HEAD request for efficiency and a browser-like User-Agent to avoid bot blocking
      const response = await axios.head(url, {
        timeout: 5000,
        validateStatus: () => true, // Accept any status code as "online"
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      return {
        url,
        isOnline: true,
        statusText: `Online (${response.status})`,
      };
    } catch {
      // Fallback to GET if HEAD fails (some servers block HEAD)
      try {
        const response = await axios.get(url, {
          timeout: 5000,
          validateStatus: () => true,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        return {
          url,
          isOnline: true,
          statusText: `Online (GET ${response.status})`,
        };
      } catch {
        return {
          url,
          isOnline: false,
          statusText: "Offline",
        };
      }
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
      let buffer = "";

      socket.setTimeout(timeout);

      socket.on("data", (data) => {
        buffer += data.toString();
        // Standard FTP greeting starts with 220
        if (buffer.startsWith("220")) {
          socket.destroy();
          resolve({
            url,
            isOnline: true,
            statusText: "Online (FTP)",
          });
        }
      });

      socket.on("connect", () => {
        // For non-FTP services, just connecting might be enough
        // but we wait a bit for the greeting if it's expected to be FTP
        if (port !== "21") {
          socket.destroy();
          resolve({
            url,
            isOnline: true,
            statusText: `Online (TCP:${port})`,
          });
        }
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
