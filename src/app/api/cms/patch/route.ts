import { errorResponse, revalidateSite, unauthorized } from "@/lib/cms/api";
import { getAt, isImageValue, setAt } from "@/lib/cms/paths";
import { isContentFile } from "@/lib/cms/registry";
import { readEditableContent, writeContent } from "@/lib/cms/storage";

type PatchBody = { file?: string; path?: string; value?: unknown };

/** Updates a single image slot in a content file (used by on-page editing). */
export async function POST(request: Request) {
  const denied = await unauthorized();
  if (denied) return denied;
  try {
    const { file, path, value } = (await request.json()) as PatchBody;
    if (!file || !isContentFile(file)) throw new Error("Unknown content file");
    if (typeof path !== "string" || !path) throw new Error("Missing path");
    if (!isImageValue(value)) throw new Error("Value must be an image ({ src, alt })");
    const content = await readEditableContent<Record<string, unknown>>(file);
    const current = getAt(content, path);
    if (!isImageValue(current)) throw new Error(`No image slot at ${file}:${path}`);
    await writeContent(file, setAt(content, path, { ...current, ...value }));
    revalidateSite();
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
