/** Production host. No trailing slash. Override locally with NEXT_PUBLIC_SITE_URL. */
const PRODUCTION_SITE_URL = "https://www.softcom.xyz";

/** Public origin without a trailing slash. A trailing slash on NEXT_PUBLIC_SITE_URL must not produce `//about`. */
export function siteUrl() {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_SITE_URL).trim();
  try {
    const url = new URL(raw);
    const path = url.pathname.replace(/\/+$/, "");
    return `${url.origin}${path === "/" ? "" : path}`.replace(/\/+$/, "");
  } catch {
    return raw.replace(/\/+$/, "");
  }
}

/** Absolute URL for a site path, with no trailing slash. Matches the canonical Next emits. */
export function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path.replace(/\/+$/, "") || path;
  const base = siteUrl().replace(/\/+$/, "");
  if (!path || path === "/") return base;
  const clean = (path.startsWith("/") ? path : `/${path}`).replace(/\/+$/, "");
  return `${base}${clean}`;
}
