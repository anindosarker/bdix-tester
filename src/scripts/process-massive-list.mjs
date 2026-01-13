import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, "../data/massive-list.md");
const OUTPUT_FILE = path.join(__dirname, "../data/massive-servers.json");

async function processList() {
  console.log("Reading file...");
  const content = fs.readFileSync(INPUT_FILE, "utf8");
  const lines = content.split("\n");

  const urlMap = new Map(); // Use Map to store unique URLs and their names/categories
  let currentCategory = "General";
  let currentName = "Unnamed Server";

  console.log("Parsing and filtering...");

  // Junk keywords to filter out
  const junkKeywords = [
    "facebook.com",
    "fb.com",
    "groups",
    "google.com",
    "youtube.com",
    "twitter.com",
    "pastebin.com",
    "wixsite.com",
    ".tk", // Often dead or spam mirrors
    "yolasite.com",
    "blogspot.com",
  ];

  for (let line of lines) {
    line = line.trim();

    // Detect Category Headers (e.g., "1. BUSINESS NETWORK (FTPBD) FTP SERVER")
    const headerMatch = line.match(/^\d+\.\s+(.*?)(?:\s+FTP SERVER)?$/i);
    if (headerMatch) {
      currentCategory = headerMatch[1].trim();
      currentName = currentCategory; // Often a good fallback for name
      continue;
    }

    // Detect URLs (lines starting with -)
    const urlMatch = line.match(/^-\s+(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      const url = urlMatch[1].replace(/\/+$/, ""); // Normalize: remove trailing slashes

      // Filter out junk
      const isJunk = junkKeywords.some((k) =>
        url.toLowerCase().includes(k.toLowerCase())
      );
      if (isJunk) continue;

      // Extract a name if possible (the name from the header is usually best)
      if (!urlMap.has(url)) {
        urlMap.set(url, {
          id: `ftp-${Math.random().toString(36).substr(2, 9)}`,
          name: currentName,
          url: url,
          category: currentCategory,
        });
      }
    }
  }

  console.log(`Found ${urlMap.size} unique server URLs.`);

  const servers = Array.from(urlMap.values());

  // Sort by category then name
  servers.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.name.localeCompare(b.name);
  });

  console.log("Writing to JSON...");
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(servers, null, 2));
  console.log(`Successfully created ${OUTPUT_FILE}`);
}

processList().catch(console.error);
