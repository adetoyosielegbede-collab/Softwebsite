import { errorResponse, unauthorized } from "@/lib/cms/api";
import { collectImages } from "@/lib/cms/paths";
import { CONTENT_FILES } from "@/lib/cms/registry";
import { listMediaFiles, readEditableContent } from "@/lib/cms/storage";

export async function GET() {
  const denied = await unauthorized();
  if (denied) return denied;
  try {
    const [files, slots] = await Promise.all([
      listMediaFiles(),
      Promise.all(
        CONTENT_FILES.map(async (f) => ({
          file: f.id,
          label: f.label,
          href: f.href,
          images: collectImages(await readEditableContent(f.id)),
        })),
      ),
    ]);
    return Response.json({ files, slots }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
