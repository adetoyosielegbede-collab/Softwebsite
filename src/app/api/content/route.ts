import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";
import { addItem, getSite, removeAt, saveSite, setString } from "@/lib/content";
import type { Path } from "@/lib/types";

export async function POST(request: Request) {
  const jar = await cookies();
  if (!isValidSession(jar.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Sign in to the studio first." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    op?: string;
    path?: Path;
    value?: string;
    index?: number;
    kind?: string;
  } | null;
  if (!body?.op) return NextResponse.json({ error: "Missing operation." }, { status: 400 });

  try {
    const site = await getSite();
    if (body.op === "set" && body.path) setString(site, body.path, String(body.value ?? ""));
    else if (body.op === "remove" && body.path) removeAt(site, body.path, Number(body.index));
    else if (body.op === "add") addItem(site, String(body.kind || ""));
    else return NextResponse.json({ error: "Unknown operation." }, { status: 400 });
    saveSite(site);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
