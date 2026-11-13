import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudiesScreen } from "@/components/site/case-studies-screen";
import { caseStudyPath } from "@/lib/case-studies";
import { getContent, requirePublishedPage } from "@/lib/content";
import { publicPageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const { items } = await getContent("case-studies");
  return items.filter((item) => item.slug).map((item) => ({ slug: item.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  await requirePublishedPage("case-studies");
  const { slug } = await params;
  const { items } = await getContent("case-studies");
  const item = items.find((entry) => entry.slug === slug);
  if (!item) return {};
  return publicPageMetadata({
    title: item.seo?.title || `${item.client} — public sector, enterprise, and development work`,
    description: item.seo?.description || item.text,
    path: caseStudyPath(item.slug),
    image: item.seo?.shareImage?.src ? item.seo.shareImage : item.image.src ? item.image : undefined,
  });
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  await requirePublishedPage("case-studies");
  const { slug } = await params;
  const page = await getContent("case-studies");
  if (!page.items.some((item) => item.slug === slug)) notFound();
  return <CaseStudiesScreen slug={slug} />;
}
