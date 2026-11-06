import type { MetadataRoute } from "next";
import { getContent, getPublishedPosts, isProductSlugPublished } from "@/lib/content";
import { contentDate, contentLastModified } from "@/lib/content-modified";
import { PRODUCT_SLUGS } from "@/lib/cms/registry";
import { caseStudyPath } from "@/lib/case-studies";
import { absoluteUrl } from "@/lib/site-url";

type Entry = { path: string; files: string[]; lastModified?: Date };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const studies = await getContent("case-studies");
  const productPaths = (
    await Promise.all(
      PRODUCT_SLUGS.map(async (slug) => ((await isProductSlugPublished(slug)) ? `/enterprise-products/${slug}` : null)),
    )
  ).filter((path): path is string => Boolean(path));

  const pages: Entry[] = [
    { path: "/", files: ["content/home.json", "content/site.json"] },
    { path: "/about", files: ["content/about.json"] },
    { path: "/solutions", files: ["content/solutions.json"] },
    { path: "/enterprise-products", files: ["content/enterprise-products.json"] },
    ...productPaths.map((path) => ({ path, files: [`content/products/${path.split("/").pop()}.json`] })),
    { path: "/case-studies", files: ["content/case-studies.json"] },
    ...studies.items.filter((item) => item.slug).map((item) => ({ path: caseStudyPath(item.slug), files: ["content/case-studies.json"] })),
    { path: "/insights", files: ["content/insights.json", "content/posts.json"] },
    ...posts.map((post) => ({
      path: `/insights/${post.slug}`,
      files: ["content/posts.json"],
      lastModified: contentDate(post.date),
    })),
    { path: "/careers", files: ["content/careers.json"] },
    { path: "/alumni", files: ["content/alumni.json"] },
    { path: "/contact", files: ["content/contact.json"] },
  ];

  return Promise.all(
    pages.map(async (page) => {
      const lastModified = page.lastModified ?? (await contentLastModified(...page.files));
      return { url: absoluteUrl(page.path), ...(lastModified ? { lastModified } : {}) };
    }),
  );
}
