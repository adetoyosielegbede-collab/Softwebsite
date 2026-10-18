import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOAD_DIR = "uploads";
const MESSAGES_FILE = path.join(process.cwd(), "data", "messages.json");

export type StorageMode = "local" | "github";

export function storageMode(): StorageMode {
  return process.env.CMS_STORAGE === "github" ? "github" : "local";
}

type GithubConfig = { token: string; repo: string; branch: string };

function githubConfig(): GithubConfig {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) {
    throw new Error("CMS_STORAGE=github requires GITHUB_TOKEN and GITHUB_REPO (owner/name).");
  }
  return { token, repo, branch: process.env.GITHUB_BRANCH || "main" };
}

async function github(pathInRepo: string, init?: RequestInit) {
  const { token, repo, branch } = githubConfig();
  const url = `https://api.github.com/repos/${repo}/contents/${pathInRepo}${init?.method ? "" : `?ref=${branch}`}`;
  return fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  });
}

async function githubRead(pathInRepo: string): Promise<{ content: Buffer; sha: string } | null> {
  const res = await github(pathInRepo);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read failed (${res.status}): ${await res.text()}`);
  const json = (await res.json()) as { content: string; sha: string };
  return { content: Buffer.from(json.content, "base64"), sha: json.sha };
}

async function githubWrite(pathInRepo: string, data: Buffer, message: string) {
  const { branch } = githubConfig();
  const existing = await githubRead(pathInRepo);
  const res = await github(pathInRepo, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: data.toString("base64"),
      branch,
      ...(existing ? { sha: existing.sha } : {}),
    }),
  });
  if (!res.ok) throw new Error(`GitHub write failed (${res.status}): ${await res.text()}`);
}

function contentPath(id: string) {
  return path.join(CONTENT_DIR, `${id}.json`);
}

/** Reads the deployed copy bundled with the app. Used for rendering pages. */
export async function readBundledContent<T>(id: string): Promise<T> {
  const raw = await fs.readFile(contentPath(id), "utf8");
  return JSON.parse(raw) as T;
}

/** Reads the latest editable copy (GitHub HEAD in github mode). Used by the admin. */
export async function readEditableContent<T>(id: string): Promise<T> {
  if (storageMode() === "github") {
    const file = await githubRead(`content/${id}.json`);
    if (file) return JSON.parse(file.content.toString("utf8")) as T;
  }
  return readBundledContent<T>(id);
}

export async function writeContent(id: string, data: unknown) {
  const body = JSON.stringify(data, null, 2) + "\n";
  if (storageMode() === "github") {
    await githubWrite(`content/${id}.json`, Buffer.from(body), `cms: update ${id}`);
    return;
  }
  await fs.mkdir(path.dirname(contentPath(id)), { recursive: true });
  await fs.writeFile(contentPath(id), body, "utf8");
}

export async function saveUpload(fileName: string, data: Buffer): Promise<string> {
  const publicPath = `/${UPLOAD_DIR}/${fileName}`;
  if (storageMode() === "github") {
    await githubWrite(`public${publicPath}`, data, `cms: upload ${fileName}`);
    return publicPath;
  }
  const dir = path.join(PUBLIC_DIR, UPLOAD_DIR);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), data);
  return publicPath;
}

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg|avif)$/i;

async function walk(dir: string, prefix: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const out: string[] = [];
  for (const entry of entries) {
    const rel = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) out.push(...(await walk(path.join(dir, entry.name), rel)));
    else if (IMAGE_EXT.test(entry.name)) out.push(rel);
  }
  return out;
}

/** Every image file shipped in /public, newest uploads first. */
export async function listMediaFiles(): Promise<string[]> {
  const uploads = (await walk(path.join(PUBLIC_DIR, UPLOAD_DIR), `/${UPLOAD_DIR}`)).reverse();
  const others = (
    await Promise.all(
      ["images", "media", "partners", "brand"].map((d) => walk(path.join(PUBLIC_DIR, d), `/${d}`)),
    )
  ).flat();
  return [...uploads, ...others];
}

export type ContactMessage = {
  id: string;
  receivedAt: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
};

export async function readMessages(): Promise<ContactMessage[]> {
  try {
    return JSON.parse(await fs.readFile(MESSAGES_FILE, "utf8")) as ContactMessage[];
  } catch {
    return [];
  }
}

export async function appendMessage(message: ContactMessage) {
  const all = await readMessages();
  all.unshift(message);
  await fs.mkdir(path.dirname(MESSAGES_FILE), { recursive: true });
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(all, null, 2), "utf8");
}
