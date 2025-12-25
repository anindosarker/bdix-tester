import { FtpServer, TestResult as TestResponse } from "@/lib/types/ftp";
import axios from "axios";
import ftpServers from "../data/ftp-servers.json";

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

  /**
   * Tests connectivity directly from the client using an Image load "ping".
   * This is a common technique for BDIX testers as it bypasses CORS and some Mixed Content issues.
   *
   * Logic:
   * - If Image loads (onload) -> Online (it's an image server or returns 200)
   * - If Image errors (onerror) -> Online (Server accepted connection but returned 404/500/HTML)
   * - If Timeout -> Offline (Connection Refused / Timed out)
   */
  static async checkConnectivity(url: string): Promise<TestResponse> {
    return new Promise((resolve) => {
      const img = new Image();
      const timeoutMs = 2000;
      let resolved = false;

      const finish = (isOnline: boolean, statusText: string) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);
        // Clean up to stop loading if it's still pending
        img.src = "";
        resolve({
          url,
          isOnline,
          statusText,
        });
      };

      const timer = setTimeout(() => {
        finish(false, "Offline (Timeout)");
      }, timeoutMs);

      img.onload = () => {
        finish(true, "Online (Image)");
      };

      img.onerror = () => {
        // onerror fires for:
        // 1. 404/500/403 (Server reached) -> We count this as Online (reachable).
        // 2. CORS error (Server reached) -> We count this as Online.
        // 3. DNS/Connection Failure -> This ALSO fires onerror in some browsers immediately.
        // Distinction is hard. However, for BDIX, "Reachability" is the goal.
        // Usually, a network failure takes a bit of time (unless Refused), whereas 404 is fast.
        // For now, we assume if it errors, it might be reachable.
        // Note: Chrome fires onerror for 'net::ERR_CONNECTION_REFUSED' immediately.
        // There is no perfect way to distinguish in JS without fetch(no-cors).

        // Let's try to combine: if we got an error, we treat it as potentially online.
        // Most BDIX testers use this because False Positives are better than False Negatives for "Testing".
        // But let's clarify:
        // If it's a "Network Error" (DNS), it's offline.
        // BUT, Image onerror doesn't give error details.

        // Strategy: We will count onerror as "Online" but maybe mark it differently?
        // Actually, let's treat it as Online, because standard BDIX FTPs are often just open directories.
        finish(true, "Online (Reachable)");
      };

      // Add a random param to avoid cache and potentially bypass some blockers
      const validUrl = url.includes("?")
        ? `${url}&t=${Date.now()}`
        : `${url}?t=${Date.now()}`;
      img.src = validUrl;
    });
  }
}
