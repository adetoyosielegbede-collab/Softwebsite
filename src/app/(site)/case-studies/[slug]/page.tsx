import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CmsImage } from "@/components/cms/cms-image";
import { CaseStudyDetail } from "@/components/site/case-study-detail";
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

        <div className="mt-8 max-w-[68ch]">
          <CaseStudyDetail item={item} index={index} />
        </div>
      </article>
      <CtaBanner cta={page.cta} file="case-studies" />
    </>
  );
}
