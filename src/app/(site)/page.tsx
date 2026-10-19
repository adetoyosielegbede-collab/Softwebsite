import { CmsImage } from "@/components/cms/cms-image";
import { FocusRail } from "@/components/site/focus-rail";
import { HowWeWork } from "@/components/site/how-we-work";
import { InsightCard } from "@/components/site/insight-card";
import { LineReveal } from "@/components/site/line-reveal";
import { ArrowLink, PillLink } from "@/components/site/links";
import { PortalHero } from "@/components/site/portal-hero";
import { CtaBanner, FrameMarks, PartnerMarquee, Stats } from "@/components/site/sections";
import { getContent, getPublishedPosts } from "@/lib/content";

export default async function HomePage() {
  const [home, site, posts] = await Promise.all([getContent("home"), getContent("site"), getPublishedPosts()]);

  return (
    <>
      <PortalHero hero={home.hero} intro={home.intro} mission={home.mission} />

      <section className="flex flex-col gap-8 pt-16 lg:gap-10 lg:pt-8">
        <FrameMarks />
        <FocusRail content={home.focusAreas} />
      </section>

      <section className="flex flex-col gap-10 pt-20 md:gap-14 lg:pt-28">
        <FrameMarks />
        <div className="container-site">
          <div className="mb-12 grid gap-6 lg:grid-cols-2 lg:items-end">
            <LineReveal className="display text-4xl lg:text-5xl">{home.audiences.title}</LineReveal>
            <p className="max-w-md text-sm leading-relaxed text-ink-soft lg:justify-self-end" data-reveal>
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
                  <h3 className="display max-w-[10ch] text-2xl leading-tight">{a.title}</h3>
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
                <p className="mt-10 flex-1 text-[13px] leading-relaxed text-ink-soft">{a.text}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {a.tags.map((t) => (
                    <li key={t} className="rounded-md bg-white/5 px-2.5 py-1.5 text-[11px] text-ink-soft ring-1 ring-line">
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
      </section>

      <section className="pt-20 lg:pt-28" aria-label="Organisations we have worked with">
        <PartnerMarquee partners={site.partners} />
      </section>

      <section className="mt-14 flex flex-col gap-8 lg:mt-16">
        <FrameMarks />
        <div className="container-site">
          <Stats stats={site.stats} />
        </div>
      </section>

      <section className="mt-4 flex flex-col gap-3 md:mt-6">
        <FrameMarks />
        <HowWeWork content={home.howWeWork} />
      </section>

      <section className="flex flex-col gap-10 pt-16 md:gap-14 lg:pt-24">
        <FrameMarks />
        <div className="container-site">
          <div className="mb-12 grid gap-6 lg:grid-cols-2 lg:items-end">
            <LineReveal className="display text-4xl lg:text-5xl">{home.thinking.title}</LineReveal>
            <div className="flex flex-col gap-5 lg:items-end lg:text-right" data-reveal>
              <p className="max-w-sm text-sm leading-relaxed text-ink-soft">{home.thinking.text}</p>
              <PillLink href={home.thinking.ctaHref}>{home.thinking.ctaLabel}</PillLink>
            </div>
          </div>
          {posts.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((post) => (
                <div key={post.slug} data-reveal>
                  <InsightCard post={post} index={post.index} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-soft">New perspectives are on the way.</p>
          )}
        </div>
      </section>

      <CtaBanner cta={home.cta} file="home" />
    </>
  );
}
