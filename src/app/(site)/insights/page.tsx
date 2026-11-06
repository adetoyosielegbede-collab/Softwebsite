import type { Metadata } from "next";
import { InsightList } from "@/components/site/insight-list";
import { CtaBanner, PageHero } from "@/components/site/sections";
import { getContent, getPublishedPosts } from "@/lib/content";
import { publicPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [page, posts] = await Promise.all([getContent("insights"), getPublishedPosts()]);
  const featured = posts.find((post) => post.heroImage?.src || post.image.src);
  const image = featured?.heroImage?.src ? featured.heroImage : featured?.image;
  return publicPageMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: "/insights",
    image: image ?? page.cta.image,
  });
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
