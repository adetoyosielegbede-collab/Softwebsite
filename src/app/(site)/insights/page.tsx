import type { Metadata } from "next";
import { InsightList } from "@/components/site/insight-list";
import { CtaBanner, PageHero } from "@/components/site/sections";
import { getContent, getPublishedPosts } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("insights");
  return { title: seo.title, description: seo.description };
}

export default async function InsightsPage() {
  const [page, posts] = await Promise.all([getContent("insights"), getPublishedPosts()]);
  const { hero } = page;

  return (
    <>
      <PageHero
        file="insights"
        eyebrow={hero.eyebrow}
        title={hero.title}
        text={hero.text}
        backgroundImage={hero.backgroundImage}
        actions={[{ label: hero.ctaLabel, href: hero.ctaHref }]}
      />

      <section className="container-site pb-8">
        <InsightList
          posts={posts}
          categories={page.categories}
          featuredTitle={page.featuredTitle}
          moreTitle={page.moreTitle}
          emptyText={page.emptyText}
        />
      </section>

      <CtaBanner cta={page.cta} file="insights" />
    </>
  );
}
