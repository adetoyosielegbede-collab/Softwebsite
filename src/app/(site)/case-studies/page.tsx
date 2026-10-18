import type { Metadata } from "next";
import { CmsImage } from "@/components/cms/cms-image";
import { CaseStudyList } from "@/components/site/case-study-list";
import { CtaBanner, PageHero } from "@/components/site/sections";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("case-studies");
  return { title: seo.title, description: seo.description };
}

export default async function CaseStudiesPage() {
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
      />

      <section className="container-site pb-8">
        <CaseStudyList items={page.items} filters={page.filters} />
      </section>

      {page.band.src && (
        <div className="container-site pt-16">
          <div className="relative aspect-[21/7] overflow-hidden rounded-3xl">
            <CmsImage image={page.band} file="case-studies" path="band" sizes="100vw" />
          </div>
        </div>
      )}

      <CtaBanner cta={page.cta} file="case-studies" />
    </>
  );
}
