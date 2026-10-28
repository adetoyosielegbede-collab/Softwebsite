import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CmsImage } from "@/components/cms/cms-image";
import { CtaBanner } from "@/components/site/sections";
import { getContent } from "@/lib/content";
import type { CmsImage as CmsImageValue, Post, PostFigure } from "@/lib/content-types";
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
  const share = post.heroImage?.src || post.image.src;
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: share ? [share] : undefined },
  };
}

function readingMinutes(post: Post) {
  const text = [post.excerpt, ...post.body, ...(post.sections ?? []).flatMap((section) => [section.title, ...section.paragraphs])].join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function Figure({ image, file, path }: { image: CmsImageValue; file: string; path: string }) {
  if (!image.src) return null;
  return (
    <figure className="overflow-clip rounded-2xl bg-white ring-1 ring-black/10">
      <CmsImage image={image} file={file} path={path} fluid />
    </figure>
  );
}

function Prose({
  paragraphs,
  figures = [],
  file,
  path,
}: {
  paragraphs: string[];
  figures?: PostFigure[];
  file: string;
  path: string;
}) {
  const last = Math.max(0, paragraphs.length - 1);
  return (
    <div className="text-lede flex flex-col gap-6 leading-[1.6] text-ink">
      {paragraphs.map((paragraph, i) => (
        <div key={paragraph.slice(0, 48)} className="flex flex-col gap-6">
          <p>{paragraph}</p>
          {figures.map((figure, fi) =>
            (figure.after ?? last) === i ? <Figure key={figure.src || fi} image={figure} file={file} path={`${path}.${fi}`} /> : null,
          )}
        </div>
      ))}
    </div>
  );
}

export default async function InsightArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const [{ items }, insights] = await Promise.all([getContent("posts"), getContent("insights")]);
  const index = items.findIndex((p) => p.slug === slug && p.published);
  if (index === -1) notFound();
  const post = items[index];
  const sections = post.sections ?? [];
  const hero = post.heroImage?.src ? post.heroImage : post.image;
  const minutes = readingMinutes(post);

  return (
    <>
      <article>
        <header className="container-site flex flex-col items-center pt-32 text-center md:pt-44">
          <p className="label text-ink-soft">
            {post.category}
            <span aria-hidden> · </span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>
          <h1 className="text-display mt-6 max-w-[18ch] text-balance text-ink">{post.title}</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-ink-soft">{post.excerpt}</p>
        </header>

        <div className="container-site mt-16 flex flex-col gap-16 md:mt-24">
          {hero.src ? (
            <div className="overflow-clip rounded-2xl bg-white ring-1 ring-black/10">
              <CmsImage
                image={hero}
                file="posts"
                path={post.heroImage?.src ? `items.${index}.heroImage` : `items.${index}.image`}
                fluid
                priority
              />
            </div>
          ) : null}

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <aside className="lg:col-span-3">
              <div className="flex flex-col gap-8 lg:sticky lg:top-28">
                <Link href="/insights" className="label inline-flex items-center gap-2 text-ink transition-colors hover:text-accent-ink">
                  <ArrowLeft className="size-3.5" aria-hidden />
                  All insights
                </Link>
                <p className="label text-ink-soft">
                  {minutes} min read
                </p>
                <div aria-hidden className="hidden h-48 w-px bg-line lg:block" />
              </div>
            </aside>

            <div className="flex max-w-[64ch] flex-col gap-14 lg:col-span-8 lg:col-start-5">
              {post.body.length > 0 ? (
                <div className="flex flex-col gap-6">
                  <Prose paragraphs={post.body} file="posts" path={`items.${index}.body`} />
                  {post.bodyFigure?.src ? (
                    <Figure image={post.bodyFigure} file="posts" path={`items.${index}.bodyFigure`} />
                  ) : null}
                </div>
              ) : null}
              {sections.map((section, si) => (
                <section key={section.title} className="flex flex-col gap-6">
                  <h2 className="text-title text-ink">{section.title}</h2>
                  <Prose
                    paragraphs={section.paragraphs}
                    figures={section.figures}
                    file="posts"
                    path={`items.${index}.sections.${si}.figures`}
                  />
                </section>
              ))}
            </div>
          </div>

          <div aria-hidden className="h-px bg-line" />
        </div>
      </article>
      <CtaBanner cta={insights.cta} file="insights" />
    </>
  );
}
