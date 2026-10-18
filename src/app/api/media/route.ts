import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";
import { findMedia, getSite, saveSite } from "@/lib/content";

const types: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export async function POST(request: Request) {
  const jar = await cookies();
  if (!isValidSession(jar.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Sign in to the studio first." }, { status: 401 });
  }

  const form = await request.formData();
  const id = String(form.get("id") || "");
  const file = form.get("file");
  if (!/^[A-Za-z0-9_-]+$/.test(id)) {
    return NextResponse.json({ error: "Unknown image." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image." }, { status: 400 });
  }
  if (file.size > 12 * 1024 * 1024) {
    return NextResponse.json({ error: "Images need to be under 12MB." }, { status: 400 });
  }
  const ext = types[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Use a JPG, PNG, WEBP, GIF, or SVG." }, { status: 400 });
  }

  const site = await getSite();
  const found = findMedia(site, id);
  if (!found) return NextResponse.json({ error: "That image slot does not exist." }, { status: 404 });

  const filename = `${id}-${Date.now().toString(36)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "media", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  found.media.src = `/media/uploads/${filename}`;
  saveSite(site);
  return NextResponse.json({ src: found.media.src });
}
