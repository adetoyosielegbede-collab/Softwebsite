import { connection } from "next/server";
import fs from "fs";
import path from "path";
import type { Media, MediaRef, Path, SiteContent, TextField } from "./types";

const filePath = path.join(process.cwd(), "content", "site.json");

const SKIP = new Set([
  "id",
  "src",
  "slug",
  "href",
  "alt",
  "label",
  "width",
  "height",
  "kind",
]);

const MULTILINE = new Set([
  "body",
  "lede",
  "summary",
  "excerpt",
  "more",
  "close",
  "support",
  "story",
  "paragraphs",
  "intro",
  "audienceBody",
  "formIntro",
  "closeBody",
  "partnerIntro",
  "focusIntro",
  "audienceIntro",
  "careersBody",
]);

export async function getSite(): Promise<SiteContent> {
  await connection();
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as SiteContent;
}

export function saveSite(site: SiteContent) {
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(site, null, 2));
  fs.renameSync(tmp, filePath);
}

function humanize(part: string | number) {
  if (typeof part === "number") return String(part + 1).padStart(2, "0");
  const spaced = part
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function groupOf(pathParts: Path) {
  const index = pathParts.findIndex((part) => typeof part === "number");
  if (index === -1) return String(pathParts[0] ?? "site");
  return pathParts.slice(0, index + 1).join(".");
}

export function listTextFields(node: unknown, trail: Path = [], out: TextField[] = []) {
  if (typeof node === "string") {
    const key = String(trail[trail.length - 1] ?? "");
    const parent = String(trail[trail.length - 2] ?? "");
    if (SKIP.has(key)) return out;
    if (node.startsWith("/media") || node.startsWith("http")) return out;
    out.push({
      path: trail,
      label: trail.map(humanize).join(" · "),
      value: node,
      multiline: MULTILINE.has(key) || MULTILINE.has(parent) || node.length > 110,
      group: groupOf(trail),
    });
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((item, index) => listTextFields(item, [...trail, index], out));
    return out;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      listTextFields(value, [...trail, key], out);
    }
  }
  return out;
}

export function listMedia(node: unknown, trail: Path = [], out: MediaRef[] = []) {
  if (!node || typeof node !== "object") return out;
  if (
    !Array.isArray(node) &&
    typeof (node as Media).id === "string" &&
    typeof (node as Media).src === "string" &&
    typeof (node as Media).label === "string"
  ) {
    out.push({ path: trail, media: node as Media });
  }
  if (Array.isArray(node)) {
    node.forEach((item, index) => listMedia(item, [...trail, index], out));
  } else {
    for (const [key, value] of Object.entries(node)) {
      if (value && typeof value === "object") listMedia(value, [...trail, key], out);
    }
  }
  return out;
}

function assertPath(parts: Path) {
  if (!Array.isArray(parts) || parts.length === 0) {
    throw new Error("Missing path");
  }
  for (const part of parts) {
    if (typeof part === "number") {
      if (!Number.isInteger(part) || part < 0) throw new Error("Bad path");
    } else if (!/^[A-Za-z0-9_-]+$/.test(part)) {
      throw new Error("Bad path");
    }
  }
}

function parentOf(root: SiteContent, parts: Path) {
  let current: unknown = root;
  for (const part of parts) {
    if (current == null || typeof current !== "object") throw new Error("Missing path");
    current = (current as Record<string, unknown>)[part as string];
  }
  return current;
}

export function setString(site: SiteContent, parts: Path, value: string) {
  assertPath(parts);
  const parent = parentOf(site, parts.slice(0, -1));
  if (parent == null || typeof parent !== "object") throw new Error("Missing path");
  const last = parts[parts.length - 1];
  const record = parent as Record<string, unknown>;
  if (typeof record[last as string] !== "string") throw new Error("That field is not text");
  record[last as string] = value;
}

export function removeAt(site: SiteContent, parts: Path, index: number) {
  assertPath(parts);
  const list = parentOf(site, parts);
  if (!Array.isArray(list) || !Number.isInteger(index) || index < 0 || index >= list.length) {
    throw new Error("Nothing to remove");
  }
  list.splice(index, 1);
}

function media(id: string, label: string, src = "/media/market-aerial.jpg"): Media {
  return { id, label, src, alt: "" };
}

export function addItem(site: SiteContent, kind: string) {
  const stamp = Date.now().toString(36);
  if (kind === "insight") {
    site.insights.items.push({
      slug: `new-insight-${stamp}`,
      title: "New insight",
      category: "Notes",
      date: "October 18, 2026",
      excerpt: "Write the summary that appears on the insights page.",
      minutes: "4",
      image: media(`insight-${stamp}`, "Insight · New article"),
      paragraphs: ["Write the article here. Each paragraph is its own field in the studio."],
    });
    return;
  }
  if (kind === "case") {
    const n = String(site.caseStudies.items.length + 1).padStart(2, "0");
    site.caseStudies.items.push({
      slug: `new-case-${stamp}`,
      number: n,
      title: "New case study",
      summary: "Describe the engagement and the outcome.",
      sector: "Government",
      metric: "—",
      metricLabel: "Outcome",
      client: "Client",
      image: media(`case-${stamp}`, "Case study · New"),
    });
    return;
  }
  if (kind === "role") {
    site.careers.roles.push({
      title: "New role",
      team: "Team",
      location: "Lagos",
      summary: "Describe the work and what ownership looks like.",
    });
    return;
  }
  if (kind === "leader") {
    site.about.leaders.push({
      name: "New leader",
      role: "Role",
      image: media(`leader-${stamp}`, "About · New leader", "/media/leader-abayomi.png"),
    });
    return;
  }
  throw new Error("Unknown collection");
}

export function findMedia(site: SiteContent, id: string) {
  return listMedia(site).find((item) => item.media.id === id) ?? null;
}
