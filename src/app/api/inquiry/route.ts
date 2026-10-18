import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    kind?: string;
    data?: Record<string, string>;
  } | null;
  const kind = body?.kind === "alumni" ? "alumni" : body?.kind === "contact" ? "contact" : "";
  const data = body?.data ?? {};
  const email = String(data.email || "").trim();
  const name = String(data.name || "").trim();
  if (!kind || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Add a name and a valid email." }, { status: 400 });
  }
  if (kind === "contact" && !String(data.message || "").trim()) {
    return NextResponse.json({ error: "Add a message." }, { status: 400 });
  }

  const file = path.join(process.cwd(), "content", "messages.json");
  const current = fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as unknown[]) : [];
  current.push({ kind, data, receivedAt: new Date().toISOString() });
  fs.writeFileSync(file, JSON.stringify(current, null, 2));
  return NextResponse.json({ ok: true });
}
