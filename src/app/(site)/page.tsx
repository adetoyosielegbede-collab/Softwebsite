import { CmsImage } from "@/components/cms/cms-image";
import { FocusRail } from "@/components/site/focus-rail";
import { HowWeWork } from "@/components/site/how-we-work";
import { InsightCard } from "@/components/site/insight-card";
import { LineReveal } from "@/components/site/line-reveal";
import { ArrowLink, PillLink } from "@/components/site/links";
import { PortalHero } from "@/components/site/portal-hero";
import { CtaBanner, FrameMarks, PartnerMarquee, Stats } from "@/components/site/sections";
import { getContent, getPublishedPosts } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Shared rhythm between homepage bands. Later bands sit closer where the scroll already provides the pause. */
const band = "flex scroll-mt-24 flex-col gap-8 pt-20 md:gap-12 lg:pt-28";

export default async function HomePage() {
  const [home, site, posts] = await Promise.all([getContent("home"), getContent("site"), getPublishedPosts()]);
  const articles = posts.filter((post) => post.featured).slice(0, 2);

  return (
    <>
      <PortalHero hero={home.hero} intro={home.intro} mission={home.mission} />

      <section className={band}>
        <FrameMarks />
        <FocusRail content={home.focusAreas} />
      </section>

      <section className={band}>
        <FrameMarks />
        <div className="container-site">
          <div className="mb-10 grid items-center gap-6 lg:grid-cols-2">
            <LineReveal className="text-headline">{home.audiences.title}</LineReveal>
            <p className="text-body max-w-md text-ink-soft lg:justify-self-end" data-reveal>
              {home.audiences.intro}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
          {home.audiences.items.map((a, i) => (
              <article
                key={a.title}
                className={cn("flex flex-col rounded-3xl p-6 lg:p-8", i === 1 ? "bg-surface-raised" : "bg-surface")}
                data-reveal
                style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-title max-w-[10ch] whitespace-pre-line">{a.title}</h3>
                  <div className="relative h-[115px] w-24 shrink-0">
                    <CmsImage
                      image={a.icon}
                      file="home"
                      path={`audiences.items.${i}.icon`}
                      className="object-contain"
                      sizes="96px"
                      emptyClassName="absolute inset-0 p-2 text-[10px]"
                    />
                  </div>
                </div>
                <p className="text-body mt-10 flex-1 text-ink-soft">{a.text}</p>
                <ul className="mt-6 flex flex-nowrap items-center gap-1">
                  {a.tags.map((t) => (
                    <li key={t} className="shrink-0 rounded-md bg-ink/5 px-1.5 py-1 text-[10px] leading-none whitespace-nowrap text-ink-soft ring-1 ring-line">
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <PillLink href={home.audiences.primaryHref}>{home.audiences.primaryLabel}</PillLink>
            <ArrowLink href={home.audiences.secondaryHref}>{home.audiences.secondaryLabel}</ArrowLink>
          </div>
        </div>
        <div className="pt-6 lg:pt-10" aria-label="Organisations we have worked with">
          <PartnerMarquee partners={site.partners} />
        </div>
        <div className="container-site pt-8 lg:pt-12">
          <Stats stats={site.stats} count lined={false} />
        </div>
      </section>

      <section className="flex scroll-mt-24 flex-col gap-8 pt-12 md:gap-12 lg:pt-16">
        <FrameMarks />
        <HowWeWork content={home.howWeWork} />
      </section>

      <section className="flex scroll-mt-24 flex-col gap-8 pt-12 lg:pt-16">
        <FrameMarks />
        <div className="container-site">
          <div className="grid items-start gap-6 md:grid-cols-12 md:gap-x-6">
            <LineReveal className="text-headline md:col-span-6">{home.thinking.title}</LineReveal>
            <div className="flex max-w-md flex-col items-start gap-6 md:col-span-5 md:col-start-8" data-reveal>
              <p className="text-body text-ink-soft">{home.thinking.text}</p>
              <PillLink href={home.thinking.ctaHref}>{home.thinking.ctaLabel}</PillLink>
            </div>
          </div>
          {articles.length > 0 ? (
            <div className="mt-10 grid gap-10 border-t border-line pt-10 md:grid-cols-2 md:gap-0">
              {articles.map((post, i) => (
                <div
                  key={post.slug}
                  className={cn(i > 0 && "border-t border-line pt-10 md:border-t-0 md:border-l md:pt-0 md:pl-10", i === 0 && articles.length > 1 && "md:pr-10")}
                  data-reveal
                >
                  <InsightCard post={post} index={post.index} size="lead" />
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-sm text-ink-soft">New perspectives are on the way.</p>
          )}
        </div>
      </section>

      <CtaBanner cta={home.cta} file="home" className="mt-16 lg:mt-24" />
    </>
  );
}
