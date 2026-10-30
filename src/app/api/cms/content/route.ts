import { errorResponse, revalidateSite, unauthorized } from "@/lib/cms/api";
import { isContentFile } from "@/lib/cms/registry";
import { readEditableContent, writeContent } from "@/lib/cms/storage";

const FEATURED_LIMIT = 2;

function assertFeaturedLimit(data: unknown) {
  const items = (data as { items?: { featured?: boolean }[] }).items;
  if (!Array.isArray(items)) return;
  const featured = items.filter((item) => item?.featured).length;
  if (featured > FEATURED_LIMIT) {
    throw new Error("Only two insights can be featured at a time. They are the ones shown on the homepage.");
  }
}

function fileFrom(request: Request): string | null {
  const id = new URL(request.url).searchParams.get("file");
  return id && isContentFile(id) ? id : null;
}

export async function GET(request: Request) {
  const denied = await unauthorized();
  if (denied) return denied;
  const id = fileFrom(request);
  if (!id) return Response.json({ error: "Unknown content file" }, { status: 404 });
  try {
    return Response.json(await readEditableContent(id), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request) {
  const denied = await unauthorized();
  if (denied) return denied;
  const id = fileFrom(request);
  if (!id) return Response.json({ error: "Unknown content file" }, { status: 404 });
  try {
    const data = await request.json();
    if (!data || typeof data !== "object") throw new Error("Content must be a JSON object");
    if (id === "posts") assertFeaturedLimit(data);
    await writeContent(id, data);
    revalidateSite();
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
