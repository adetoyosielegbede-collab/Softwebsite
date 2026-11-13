import { CaseStudyList } from "@/components/site/case-study-list";
import { CtaBanner, PageHero } from "@/components/site/sections";
import { getContent, requirePublishedPage } from "@/lib/content";

export async function CaseStudiesScreen({ slug }: { slug?: string }) {
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
        <CaseStudyList items={page.items} filters={page.filters} initialSlug={slug} />
      </section>

      <CtaBanner cta={page.cta} file="case-studies" />
    </>
  );
}
