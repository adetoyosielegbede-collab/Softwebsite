import "server-only";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PRODUCT_SLUGS } from "@/lib/cms/registry";
import { readBundledContent } from "@/lib/cms/storage";
import type { ContentMap, EnterpriseProductsContent, Link, Post, SiteContent } from "@/lib/content-types";

export const getContent = cache(async <K extends keyof ContentMap>(id: K): Promise<ContentMap[K]> => {
  return readBundledContent<ContentMap[K]>(id);
});

/** Published posts, newest first. `index` is the post's position in posts.json (for CMS image paths). */
export async function getPublishedPosts(): Promise<(Post & { index: number })[]> {
  const { items } = await getContent("posts");
  return items
    .map((p, index) => ({ ...p, index }))
    .filter((p) => p.published)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export type SoftcomProduct = EnterpriseProductsContent["products"]["items"][number] & { index: number };

function slugFromProductHref(href: string): string | null {
  const match = href.replace(/\/$/, "").match(/\/enterprise-products\/([^/]+)$/);
  return match?.[1] ?? null;
}

/** Softcom product cards marked published in the Enterprise Products CMS entry. */
export async function getPublishedSoftcomProducts(): Promise<SoftcomProduct[]> {
  const { products } = await getContent("enterprise-products");
  return products.items
    .map((product, index) => ({ ...product, index }))
    .filter((product) => product.published);
}

/** Pages with their own content file. Missing `published` stays public. */
export const PAGE_CONTENT_IDS = [
  "home",
  "about",
  "solutions",
  "enterprise-products",
  "case-studies",
  "insights",
  "careers",
  "alumni",
  "contact",
] as const;

export type PageContentId = (typeof PAGE_CONTENT_IDS)[number];

const PAGE_PATHS: Record<string, PageContentId> = {
  "/": "home",
  "/about": "about",
  "/solutions": "solutions",
  "/enterprise-products": "enterprise-products",
  "/case-studies": "case-studies",
  "/insights": "insights",
  "/careers": "careers",
  "/alumni": "alumni",
  "/contact": "contact",
};

export function isPageContentId(id: string): id is PageContentId {
  return (PAGE_CONTENT_IDS as readonly string[]).includes(id);
}

export async function isPagePublished(id: PageContentId): Promise<boolean> {
  const content = (await getContent(id)) as { published?: boolean };
  return content.published !== false;
}

/** Public URL for an unpublished page is a 404. The studio editor is unchanged. */
export async function requirePublishedPage(id: PageContentId): Promise<void> {
  if (!(await isPagePublished(id))) notFound();
}

function pageIdForHref(href: string): PageContentId | "product" | null {
  const path = href.split("?")[0].replace(/\/$/, "") || "/";
  if (path.startsWith("/enterprise-products/") && path !== "/enterprise-products") return "product";
  if (path.startsWith("/case-studies/")) return "case-studies";
  if (path.startsWith("/insights/") && path !== "/insights") return "insights";
  return PAGE_PATHS[path] ?? null;
}

/** Whether a public href should stay in nav, footer, and the sitemap. */
export async function isHrefPublished(href: string): Promise<boolean> {
  const kind = pageIdForHref(href);
  if (!kind) return true;
  if (kind === "product") {
    const slug = href.split("?")[0].replace(/\/$/, "").split("/").pop() ?? "";
    return (await isPagePublished("enterprise-products")) && (await isProductSlugPublished(slug));
  }
  return isPagePublished(kind);
}

async function publishedLinks(links: Link[]): Promise<Link[]> {
  const kept: Link[] = [];
  for (const link of links) {
    if (await isHrefPublished(link.href)) kept.push(link);
  }
  return kept;
}

/** Header and footer with unpublished pages removed. Content files are unchanged. */
export async function getPublicSite(): Promise<SiteContent> {
  const site = await getContent("site");
  const headerNav = [];
  for (const item of site.headerNav) {
    if (!(await isHrefPublished(item.href))) continue;
    headerNav.push({ ...item, links: item.links ? await publishedLinks(item.links) : undefined });
  }
  const menu = [];
  for (const group of site.menu) {
    const links = await publishedLinks(group.links);
    if (links.length) menu.push({ ...group, links });
  }
  return { ...site, headerNav, menu };
}

/** Whether a product (or partner) slug should be reachable on the public site. */
export async function isProductSlugPublished(slug: string): Promise<boolean> {
  if (!(PRODUCT_SLUGS as readonly string[]).includes(slug)) return false;
  const page = await getContent("enterprise-products");
  const softcom = page.products.items.find((item) => slugFromProductHref(item.href) === slug);
  if (softcom) return softcom.published;
  // Partner platforms stay public unless added to Softcom products with published: false.
  return page.partners.items.some((item) => slugFromProductHref(item.href) === slug);
}
