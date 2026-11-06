import "server-only";
import { execFile } from "node:child_process";
import { stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

let gitDates: Promise<Map<string, Date>> | null = null;

/** Newest commit date for each file under content/, from git history when the checkout has it. */
function loadGitDates() {
  if (!gitDates) {
    gitDates = (async () => {
      const map = new Map<string, Date>();
      try {
        const { stdout } = await execFileAsync("git", ["log", "--pretty=format:%cI", "--name-only", "--", "content"], {
          cwd: process.cwd(),
          maxBuffer: 4 * 1024 * 1024,
        });
        let current: Date | null = null;
        for (const line of stdout.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) {
            const date = new Date(trimmed);
            current = Number.isNaN(date.getTime()) ? null : date;
            continue;
          }
          if (current && trimmed.startsWith("content/") && !map.has(trimmed)) map.set(trimmed, current);
        }
      } catch {
        // A build without git history falls back to the file's own mtime.
      }
      return map;
    })();
  }
  return gitDates;
}

/** Later of the git commit dates (or file mtimes) for the content files that feed a URL. */
export async function contentLastModified(...relativeFiles: string[]): Promise<Date | undefined> {
  const dates = await loadGitDates();
  const found: Date[] = [];
  for (const file of relativeFiles) {
    const fromGit = dates.get(file);
    if (fromGit) {
      found.push(fromGit);
      continue;
    }
    const insideContent = file.startsWith("content/") ? file.slice("content/".length) : "";
    if (!insideContent || insideContent.includes("..")) continue;
    try {
      const info = await stat(path.join(process.cwd(), "content", insideContent));
      found.push(info.mtime);
    } catch {
      // The file is not in this checkout.
    }
  }
  if (found.length === 0) return undefined;
  return new Date(Math.max(...found.map((date) => date.getTime())));
}

/** Article dates stored as YYYY-MM or YYYY-MM-DD. */
export function contentDate(value: string): Date | undefined {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(`${value}T00:00:00.000Z`);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  if (/^\d{4}-\d{2}$/.test(value)) {
    const date = new Date(`${value}-01T00:00:00.000Z`);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  return undefined;
}
