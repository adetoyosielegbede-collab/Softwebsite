import "server-only";
import { cache } from "react";
import { PRODUCT_SLUGS } from "@/lib/cms/registry";
import { readBundledContent } from "@/lib/cms/storage";
import type { ContentMap, EnterpriseProductsContent, Post } from "@/lib/content-types";

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

/** Whether a product (or partner) slug should be reachable on the public site. */
export async function isProductSlugPublished(slug: string): Promise<boolean> {
  if (!(PRODUCT_SLUGS as readonly string[]).includes(slug)) return false;
  const page = await getContent("enterprise-products");
  const softcom = page.products.items.find((item) => slugFromProductHref(item.href) === slug);
  if (softcom) return softcom.published;
  // Partner platforms stay public unless added to Softcom products with published: false.
  return page.partners.items.some((item) => slugFromProductHref(item.href) === slug);
}
