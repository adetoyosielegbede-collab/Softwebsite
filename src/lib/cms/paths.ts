export type CmsImage = {
  src: string;
  alt: string;
  position?: string;
};

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function isImageValue(value: unknown): value is CmsImage {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    typeof (value as Record<string, unknown>).src === "string" &&
    "alt" in value
  );
}

export function splitPath(path: string): string[] {
  return path === "" ? [] : path.split(".");
}

export function getAt(root: unknown, path: string): unknown {
  let cur: unknown = root;
  for (const key of splitPath(path)) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur;
}

export function setAt<T>(root: T, path: string, value: unknown): T {
  const keys = splitPath(path);
  if (keys.length === 0) return value as T;
  const [head, ...rest] = keys;
  const container = (root ?? {}) as Record<string, unknown> | unknown[];
  const child = (container as Record<string, unknown>)[head];
  const next = setAt(child, rest.join("."), value);
  if (Array.isArray(container)) {
    const copy = container.slice();
    copy[Number(head)] = next;
    return copy as T;
  }
  return { ...container, [head]: next } as T;
}

export type ImageRef = { path: string; image: CmsImage; name?: string };

const IMAGE_KEYS = new Set(["image", "backgroundImage", "logo", "band"]);

function imageName(record: Record<string, unknown>): string {
  for (const key of ["title", "label", "name"] as const) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function collectImages(root: unknown, base = ""): ImageRef[] {
  if (isImageValue(root)) return [{ path: base, image: root }];
  if (Array.isArray(root)) {
    return root.flatMap((item, i) => collectImages(item, base ? `${base}.${i}` : String(i)));
  }
  if (root && typeof root === "object") {
    const record = root as Record<string, unknown>;
    const hint = imageName(record);
    return Object.entries(record).flatMap(([key, value]) => {
      const path = base ? `${base}.${key}` : key;
      if (hint && IMAGE_KEYS.has(key) && isImageValue(value)) {
        return [{ path, image: value, name: hint }];
      }
      return collectImages(value, path);
    });
  }
  return [];
}

export function humanize(key: string): string {
  if (/^\d+$/.test(key)) return `#${Number(key) + 1}`;
  const spaced = key
    .replace(/[-_]/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
