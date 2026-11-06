import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CmsImage } from "@/components/cms/cms-image";
import { CtaBanner } from "@/components/site/sections";
import { caseStudyPath } from "@/lib/case-studies";
import { getContent } from "@/lib/content";
import { publicPageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const { items } = await getContent("case-studies");
  return items.filter((item) => item.slug).map((item) => ({ slug: item.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { items } = await getContent("case-studies");
  const item = items.find((entry) => entry.slug === slug);
  if (!item) return {};
  return publicPageMetadata({
    title: `${item.client}: ${item.title}`,
    description: item.text,
    path: caseStudyPath(item.slug),
    image: item.image.src ? item.image : undefined,
  });
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const page = await getContent("case-studies");
  const index = page.items.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();
  const item = page.items[index];

  return (
    <>
      <article className="container-site pt-32 pb-20 md:pt-44">
        <Link href="/case-studies" className="label inline-flex items-center gap-2 text-ink transition-colors hover:text-accent-ink">
          <ArrowLeft className="size-3.5" aria-hidden />
          All case studies
        </Link>

        <p className="label mt-10 text-ink-soft">
          {item.client}
          <span aria-hidden> · </span>
          {item.tag}
        </p>
        <h1 className="text-display mt-4 max-w-[16ch] text-balance">{item.title}</h1>

        {item.image.src ? (
          <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-2xl bg-neutral-900">
            <CmsImage
              image={item.image}
              file="case-studies"
              path={`items.${index}.image`}
              sizes="(min-width: 1024px) 1100px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        <dl className="mt-8 grid overflow-hidden rounded-2xl bg-surface ring-1 ring-line sm:grid-cols-3">
          <div className="border-b border-line p-5 sm:border-r sm:border-b-0">
            <dt className="label text-ink-faint">Outcome</dt>
            <dd className="mt-2 font-heading text-3xl leading-none heading-type">{item.metric}</dd>
            <dd className="text-body mt-2 text-ink-soft">{item.metricLabel}</dd>
          </div>
          <div className="border-b border-line p-5 sm:border-r sm:border-b-0">
            <dt className="label text-ink-faint">Client</dt>
            <dd className="text-body mt-2">{item.client}</dd>
            {item.logo.src ? (
              <dd className="mt-4 inline-flex max-w-[9.5rem] rounded-xl bg-neutral-950 px-3 py-2">
                <CmsImage
                  image={item.logo}
                  file="case-studies"
                  path={`items.${index}.logo`}
                  fluid
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
              </dd>
            ) : null}
          </div>
          <div className="p-5">
            <dt className="label text-ink-faint">Sector</dt>
            <dd className="text-body mt-2">{item.tag}</dd>
          </div>
        </dl>

        <div className="mt-14 flex max-w-[68ch] flex-col gap-12">
          <section>
            <h2 className="label text-ink-faint">Challenge</h2>
            <p className="text-body mt-3 text-ink-soft">{item.text}</p>
          </section>
          {item.solution ? (
            <section>
              <h2 className="label text-ink-faint">Solution</h2>
              <p className="text-body mt-3 text-ink-soft">{item.solution}</p>
            </section>
          ) : null}
          {item.impact.length ? (
            <section>
              <h2 className="label text-ink-faint">Impact</h2>
              <ul className="mt-4 space-y-3">
                {item.impact.map((point) => (
                  <li key={point} className="text-body flex gap-3 text-ink-soft">
                    <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-signal" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {item.takeaway ? (
            <section className="rounded-2xl bg-surface p-6 ring-1 ring-line">
              <h2 className="label text-ink-faint">Takeaway</h2>
              <p className="text-lede mt-3">{item.takeaway}</p>
            </section>
          ) : null}
        </div>
      </article>
      <CtaBanner cta={page.cta} file="case-studies" />
    </>
  );
}
