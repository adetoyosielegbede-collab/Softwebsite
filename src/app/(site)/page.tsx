import { CmsImage } from "@/components/cms/cms-image";
import { FocusRail } from "@/components/site/focus-rail";
import { HowWeWork } from "@/components/site/how-we-work";
import { InsightCard } from "@/components/site/insight-card";
import { LineReveal } from "@/components/site/line-reveal";
import { ArrowLink, PillLink } from "@/components/site/links";
import { PortalHero } from "@/components/site/portal-hero";
import { CtaBanner, FrameMarks, PartnerMarquee, Stats } from "@/components/site/sections";
import { getContent, getPublishedPosts } from "@/lib/content";

/** Same distance between every homepage band: 8rem, then 12rem from the large breakpoint. */
const band = "flex scroll-mt-24 flex-col gap-10 pt-32 md:gap-16 lg:pt-48";

export default async function HomePage() {
  const [home, site, posts] = await Promise.all([getContent("home"), getContent("site"), getPublishedPosts()]);
  const article = posts.find((post) => post.featured) ?? posts[0];

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
          <div className="mb-12 grid gap-6 md:mb-20 lg:grid-cols-2 lg:items-end">
            <LineReveal className="text-headline">{home.audiences.title}</LineReveal>
            <p className="text-body max-w-md text-ink-soft lg:justify-self-end" data-reveal>
              {home.audiences.intro}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
          {home.audiences.items.map((a, i) => (
              <article
                key={a.title}
                className="flex flex-col rounded-3xl bg-surface-raised p-6 transition-colors hover:bg-surface-high lg:p-8"
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
                <ul className="mt-6 flex flex-wrap gap-2">
                  {a.tags.map((t) => (
                    <li key={t} className="rounded-md bg-ink/5 px-2.5 py-1.5 text-[11px] text-ink-soft ring-1 ring-line">
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
      </section>

      <section className={band}>
        <FrameMarks />
        <div className="container-site">
          <Stats stats={site.stats} />
        </div>
      </section>

      <section className={band}>
        <FrameMarks />
        <HowWeWork content={home.howWeWork} />
      </section>

      <section className={band}>
        <FrameMarks />
        <div className="container-site grid gap-12 md:grid-cols-12 md:gap-x-6 md:gap-y-20">
          <LineReveal className="text-headline md:col-span-7">{home.thinking.title}</LineReveal>
          <div className="flex max-w-md flex-col items-start gap-6 md:col-span-4 md:col-start-9 md:self-end" data-reveal>
            <p className="text-body text-ink-soft">{home.thinking.text}</p>
            <PillLink href={home.thinking.ctaHref}>{home.thinking.ctaLabel}</PillLink>
          </div>
          {article ? (
            <div className="md:col-span-7" data-reveal>
              <InsightCard post={article} index={article.index} size="lead" />
            </div>
          ) : (
            <p className="text-sm text-ink-soft md:col-span-7">New perspectives are on the way.</p>
          )}
        </div>
      </section>

      <CtaBanner cta={home.cta} file="home" className="mt-32 lg:mt-48" />
    </>
  );
}
