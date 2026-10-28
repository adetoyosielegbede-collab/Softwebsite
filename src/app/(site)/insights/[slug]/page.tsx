import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InsightArticle } from "@/components/site/insight-article";
import { getContent } from "@/lib/content";

export async function generateStaticParams() {
  const { items } = await getContent("posts");
  return items.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { items } = await getContent("posts");
  const post = items.find((p) => p.slug === slug && p.published);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: post.image.src ? [post.image.src] : undefined },
  };
}

export default async function InsightArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const [{ items }, insights] = await Promise.all([getContent("posts"), getContent("insights")]);
  const index = items.findIndex((p) => p.slug === slug && p.published);
  if (index === -1) notFound();

  return <InsightArticle post={items[index]} index={index} cta={insights.cta} />;
}
