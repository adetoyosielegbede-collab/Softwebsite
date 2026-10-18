import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditableImage } from "@/components/editable-image";
import { getSite } from "@/lib/content";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite();
  const article = site.insights.items.find((item) => item.slug === slug);
  return { title: article?.title ?? "Insight", description: article?.excerpt };
}

export default async function InsightPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const site = await getSite();
  const article = site.insights.items.find((item) => item.slug === slug);
  if (!article) notFound();

  return (
    <article className="px-6 pt-36 pb-20 md:px-12">
      <div className="mx-auto max-w-3xl">
        <p className="kicker">
          {article.category} · {article.date}
        </p>
        <h1 className="display mt-4 text-[clamp(40px,6vw,72px)]">{article.title}</h1>
        <p className="mt-6 text-lg text-white/70">{article.excerpt}</p>
        <p className="mt-4 text-sm text-white/40">{article.minutes} min read</p>
      </div>
      <EditableImage media={article.image} className="mx-auto mt-10 aspect-[16/9] max-w-5xl rounded-[2rem]" />
      <div className="mx-auto mt-12 max-w-3xl space-y-6 text-lg leading-8 text-white/78">
        {article.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="mx-auto mt-12 max-w-3xl">
        <Link href="/insights" className="text-sm text-white/70">
          All insights
        </Link>
      </div>
    </article>
  );
}
