import type { Metadata } from "next";
import { InsightList } from "@/components/site/insight-list";
import { CtaBanner, PageHero } from "@/components/site/sections";
import { getContent, getPublishedPosts, requirePublishedPage } from "@/lib/content";
import { publicPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  await requirePublishedPage("insights");
  const page = await getContent("insights");
  return publicPageMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: "/insights",
    image: page.seo.shareImage,
  });
}

export default async function InsightsPage() {
  await requirePublishedPage("insights");
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
        field="torus"
      />

      <section className="container-site pt-32 pb-8 lg:pt-48">
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
