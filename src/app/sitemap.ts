import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/content";
import { PRODUCT_SLUGS } from "@/lib/cms/registry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4317";
  const posts = await getPublishedPosts();
  const paths = [
    "",
    "/about",
    "/solutions",
    "/enterprise-products",
    ...PRODUCT_SLUGS.map((slug) => `/enterprise-products/${slug}`),
    "/case-studies",
    "/insights",
    ...posts.map((post) => `/insights/${post.slug}`),
    "/careers",
    "/alumni",
    "/contact",
  ];
  return paths.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly", priority: path === "" ? 1 : 0.7 }));
}
