import type { CmsImage } from "./paths";

const MAX_DIMENSION = 2800;
const RECOMPRESS_ABOVE_BYTES = 2.5 * 1024 * 1024;

async function readError(res: Response): Promise<string> {
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  return body?.error || `Request failed (${res.status})`;
}

/** Downscales very large photos in the browser so uploads stay fast and under host body limits. */
export async function prepareUpload(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= RECOMPRESS_ABOVE_BYTES) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.86));
  if (!blob || blob.size >= file.size) return file;
  const ext = type === "image/png" ? "png" : "jpg";
  return new File([blob], file.name.replace(/\.[^.]+$/, `.${ext}`), { type });
}

export async function uploadImage(file: File): Promise<string> {
  const prepared = await prepareUpload(file);
  const body = new FormData();
  body.append("file", prepared);
  const res = await fetch("/api/cms/upload", { method: "POST", body });
  if (!res.ok) throw new Error(await readError(res));
  return ((await res.json()) as { src: string }).src;
}

export async function patchImage(file: string, path: string, value: Partial<CmsImage> & { src: string }) {
  const res = await fetch("/api/cms/patch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file, path, value: { alt: "", ...value } }),
  });
  if (!res.ok) throw new Error(await readError(res));
}

export async function loadContent<T = unknown>(file: string): Promise<T> {
  const res = await fetch(`/api/cms/content?file=${encodeURIComponent(file)}`, { cache: "no-store" });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as T;
}

export async function saveContent(file: string, data: unknown) {
  const res = await fetch(`/api/cms/content?file=${encodeURIComponent(file)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await readError(res));
}

export function fileForPathname(pathname: string): string {
  if (pathname === "/") return "home";
  const parts = pathname.replace(/^\/|\/$/g, "").split("/");
  if (parts[0] === "enterprise-products" && parts[1]) return `products/${parts[1]}`;
  if (parts[0] === "insights" && parts[1]) return "posts";
  return parts[0];
}
