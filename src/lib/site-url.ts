/** Public origin without a trailing slash. A trailing slash on NEXT_PUBLIC_SITE_URL must not produce `//about`. */
export function siteUrl() {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4317").trim();
  try {
    const url = new URL(raw);
    const path = url.pathname.replace(/\/+$/, "");
    return `${url.origin}${path === "/" ? "" : path}`;
  } catch {
    return raw.replace(/\/+$/, "");
  }
}

/** Absolute URL for a site path, with no trailing slash. Matches the canonical Next emits. */
export function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path.replace(/\/+$/, "") || path;
  const base = siteUrl();
  if (!path || path === "/") return base;
  const clean = (path.startsWith("/") ? path : `/${path}`).replace(/\/+$/, "");
  return `${base}${clean}`;
}
