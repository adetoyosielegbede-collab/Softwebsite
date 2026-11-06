import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LiftStory } from "@/components/site/lift-story";
import { ProductStory } from "@/components/site/product-story";
import { UseformsStory } from "@/components/site/useforms-story";
import { getContent } from "@/lib/content";
import { PRODUCT_SLUGS } from "@/lib/cms/registry";
import type { ContentMap, ProductContent } from "@/lib/content-types";

type Slug = (typeof PRODUCT_SLUGS)[number];

/** Product inner pages temporarily withheld from the public site. */
const BLOCKED_PRODUCT_SLUGS = new Set<Slug>(["reckon"]);

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

function isSlug(slug: string): slug is Slug {
  return (PRODUCT_SLUGS as readonly string[]).includes(slug);
}

async function load(slug: string): Promise<ProductContent | null> {
  if (!isSlug(slug)) return null;
  return getContent(`products/${slug}` as keyof ContentMap) as Promise<ProductContent>;
}

export async function generateMetadata({ params }: PageProps<"/enterprise-products/[slug]">): Promise<Metadata> {
  const slug = (await params).slug;
  if (isSlug(slug) && BLOCKED_PRODUCT_SLUGS.has(slug)) {
    return { title: "Enterprise Products", robots: { index: false, follow: false } };
  }
  const product = await load(slug);
  return product ? { title: product.seo.title, description: product.seo.description } : {};
}

export default async function ProductPage({ params }: PageProps<"/enterprise-products/[slug]">) {
  const { slug } = await params;
  if (isSlug(slug) && BLOCKED_PRODUCT_SLUGS.has(slug)) {
    redirect("/enterprise-products");
  }
  const product = await load(slug);
  if (!product) notFound();
  if (slug === "lift") return <LiftStory />;
  if (slug === "useforms") return <UseformsStory />;
  return <ProductStory product={product} file={`products/${slug}`} />;
}
