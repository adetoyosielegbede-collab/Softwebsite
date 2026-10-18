import { randomBytes } from "node:crypto";
import { errorResponse, unauthorized } from "@/lib/cms/api";
import { saveUpload } from "@/lib/cms/storage";

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/svg+xml", "svg"],
  ["image/avif", "avif"],
]);

function slugify(name: string): string {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "image"
  );
}

export async function POST(request: Request) {
  const denied = await unauthorized();
  if (denied) return denied;
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("No file uploaded");
    const ext = ALLOWED.get(file.type);
    if (!ext) throw new Error(`Unsupported file type: ${file.type || "unknown"}. Use PNG, JPG, WebP, GIF, SVG or AVIF.`);
    if (file.size > MAX_BYTES) throw new Error("Image is larger than 15 MB");
    const name = `${slugify(file.name)}-${randomBytes(3).toString("hex")}.${ext}`;
    const src = await saveUpload(name, Buffer.from(await file.arrayBuffer()));
    return Response.json({ src });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
