import type { Metadata } from "next";
import { CaseStudyList } from "@/components/site/case-study-list";
import { CtaBanner, PageHero } from "@/components/site/sections";
import { getContent, requirePublishedPage } from "@/lib/content";
import { publicPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  await requirePublishedPage("case-studies");
  const page = await getContent("case-studies");
  return publicPageMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: "/case-studies",
    image: page.band.src ? page.band : page.cta.image,
  });
}

export default async function CaseStudiesPage() {
  await requirePublishedPage("case-studies");
  const page = await getContent("case-studies");
  const { hero } = page;

  return (
    <>
      <PageHero
        file="case-studies"
        eyebrow={hero.eyebrow}
        title={hero.title}
        text={hero.text}
        backgroundImage={hero.backgroundImage}
        actions={[{ label: hero.ctaLabel, href: hero.ctaHref }]}
        field="torus"
      />

      <section className="container-site pt-32 pb-8 lg:pt-48">
        <CaseStudyList items={page.items} filters={page.filters} />
      </section>

      <CtaBanner cta={page.cta} file="case-studies" />
    </>
  );
}
