import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CmsImage } from "@/components/cms/cms-image";
import { HeroBits } from "@/components/site/dot-canvas";
import { CtaBanner } from "@/components/site/sections";
import { getContent } from "@/lib/content";
import { formatDate } from "@/lib/format";

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
  const post = items[index];

  return (
    <>
      <article className="relative isolate">
        <HeroBits />
        <div className="container-site relative pt-32 pb-8 lg:pt-40">
          <Link href="/insights" className="inline-flex items-center gap-2 text-xs text-ink-soft transition-colors hover:text-accent-ink">
            <ArrowLeft className="size-3.5" /> Insights
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-ink-soft">
            <span className="rounded-full bg-ink/5 px-3 py-1 ring-1 ring-line">{post.category}</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          <h1 className="text-display mt-6 max-w-4xl">{post.title}</h1>
          {post.image.src && (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl">
              <CmsImage image={post.image} file="posts" path={`items.${index}.image`} priority sizes="(min-width: 1440px) 1360px, 100vw" />
            </div>
          )}
          <div className="text-body mx-auto mt-12 max-w-2xl space-y-6 text-ink-soft">
            {post.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
      <CtaBanner cta={insights.cta} file="insights" />
    </>
  );
}
