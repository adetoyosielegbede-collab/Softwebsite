import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiftStory } from "@/components/site/lift-story";
import { LiquioStory } from "@/components/site/liquio-story";
import { ProductStory } from "@/components/site/product-story";
import { RtgsStory } from "@/components/site/rtgs-story";
import { UseformsStory } from "@/components/site/useforms-story";
import { getContent, isProductSlugPublished, requirePublishedPage } from "@/lib/content";
import { PRODUCT_SLUGS } from "@/lib/cms/registry";
import type { CmsImage, ContentMap, ProductContent } from "@/lib/content-types";
import { publicPageMetadata } from "@/lib/seo";

type Slug = (typeof PRODUCT_SLUGS)[number];

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

function productShareImage(product: ProductContent): CmsImage | undefined {
  for (const block of product.blocks) {
    for (const figure of block.figures) {
      if (figure.image?.src) return figure.image;
    }
  }
  if (product.cta.image?.src) return product.cta.image;
  if (product.hero.backgroundImage?.src) return product.hero.backgroundImage;
  if (product.hero.logo?.src) return product.hero.logo;
  return undefined;
}

export async function generateMetadata({ params }: PageProps<"/enterprise-products/[slug]">): Promise<Metadata> {
  await requirePublishedPage("enterprise-products");
  const slug = (await params).slug;
  if (!isSlug(slug) || !(await isProductSlugPublished(slug))) {
    return { title: "Enterprise Products", robots: { index: false, follow: false } };
  }
  const product = await load(slug);
  if (!product) return {};
  return publicPageMetadata({
    title: product.seo.title,
    description: product.seo.description,
    path: `/enterprise-products/${slug}`,
    image: product.seo.shareImage?.src ? product.seo.shareImage : productShareImage(product),
  });
}

export default async function ProductPage({ params }: PageProps<"/enterprise-products/[slug]">) {
  await requirePublishedPage("enterprise-products");
  const { slug } = await params;
  if (!isSlug(slug) || !(await isProductSlugPublished(slug))) notFound();
  const product = await load(slug);
  if (!product) notFound();
  if (slug === "lift") return <LiftStory />;
  if (slug === "useforms") return <UseformsStory />;
  if (slug === "liquio") return <LiquioStory />;
  if (slug === "rtgs-global") return <RtgsStory />;
  return <ProductStory product={product} file={`products/${slug}`} />;
}
