import type { Metadata } from "next";
import { CmsImage } from "@/components/cms/cms-image";
import { IntelligenceRail } from "@/components/site/intelligence-rail";
import { PillLink } from "@/components/site/links";
import { DeliverTimeline } from "@/components/site/deliver-timeline";
import { ScrollWords } from "@/components/site/scroll-words";
import { CtaBanner, SectionNumber } from "@/components/site/sections";
import { SolutionsHero } from "@/components/site/solutions-hero";
import { StickySteps } from "@/components/site/sticky-steps";
import { getContent } from "@/lib/content";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("solutions");
  return { title: seo.title, description: seo.description };
}

function SectionHeader({ id, number, title, lead }: { id: string; number: string; title: string; lead: string }) {
  return (
    <div id={id} className="grid scroll-mt-24 gap-4 border-t border-line pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]" data-reveal>
      <SectionNumber>{number}</SectionNumber>
      <div>
        <h2 className="text-headline">{title}</h2>
        <p className="text-lede mt-4 max-w-[52ch] text-accent-ink">{lead}</p>
      </div>
    </div>
  );
}

export default async function SolutionsPage() {
  const s = await getContent("solutions");
  const { hero, intro, infrastructure: infra, intelligence: intel, initiatives: init } = s;

  return (
    <>
      <SolutionsHero hero={hero} />

      <section className="container-site pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="max-w-4xl lg:ml-auto lg:w-2/3">
          <span className="mb-6 inline-block rounded-full bg-signal px-2.5 py-1 text-xs font-medium text-black">{intro.badge}</span>
          <ScrollWords paragraphs={intro.paragraphs} paragraphClassName="text-headline leading-[1.08]" />
        </div>
      </section>

      <section className="container-site">
        <SectionHeader id="digital-infrastructure" number={infra.number} title={infra.title} lead={infra.lead} />
        <div className="mt-16 max-w-md" data-reveal>
          <h3 className="font-heading text-xl heading-type">{infra.subTitle}</h3>
          <p className="mt-3 text-body text-ink-soft">{infra.subText}</p>
        </div>
        <div className="mt-6">
          <StickySteps steps={infra.steps} file="solutions" path="infrastructure.steps" />
        </div>
        <p className="text-title mx-auto mt-20 max-w-2xl text-center" data-reveal>
          {infra.statement}
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {infra.cards.map((card) => (
            <article
              key={card.title}
              className={cn("rounded-3xl p-8 lg:p-10", card.highlight ? "bg-brand text-white" : "bg-surface")}
              data-reveal
            >
              <p className={`eyebrow ${card.highlight ? "text-white/70" : ""}`}>{card.eyebrow}</p>
              <h3 className="text-headline mt-16 lg:mt-24">{card.title}</h3>
              <p className={`text-body mt-5 ${card.highlight ? "text-white/85" : "text-ink-soft"}`}>{card.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <PillLink href={infra.ctaHref}>{infra.ctaLabel}</PillLink>
        </div>
      </section>

      <section className="pt-28 lg:pt-40">
        <div className="container-site">
          <SectionHeader id="applied-intelligence" number={intel.number} title={intel.title} lead={intel.lead} />
        </div>
        <IntelligenceRail eyebrow={intel.eyebrow} intro={intel.intro} items={intel.items} />
        <div className="container-site mt-20 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <h3 className="text-headline" data-reveal>
            {intel.shapedTitle}
          </h3>
          <div data-reveal>
            <ol className="grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
              {intel.shapedItems.map((item, i) => (
                <li key={item}>
                  <p className="font-mono text-[11px] text-ink-faint">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-2 text-[15px]">{item}</p>
                </li>
              ))}
            </ol>
            <p className="mt-10 max-w-lg text-body text-ink-soft">{intel.shapedText}</p>
            <div className="mt-6">
              <PillLink href={intel.ctaHref}>{intel.ctaLabel}</PillLink>
            </div>
          </div>
        </div>
      </section>

      <section className="container-site pt-28 lg:pt-40">
        <SectionHeader id="powering-initiatives" number={init.number} title={init.title} lead={init.lead} />
        <figure className="relative mt-16 overflow-hidden rounded-3xl bg-night" data-reveal>
          <figcaption className="eyebrow absolute top-5 right-6 z-10 text-signal/80">{init.figureLabel}</figcaption>
          <div className="relative aspect-[1360/760]">
            <CmsImage image={init.figure} file="solutions" path="initiatives.figure" sizes="(min-width: 1440px) 1360px, 100vw" emptyClassName="absolute inset-0" />
          </div>
        </figure>

        <div className="mt-20 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div data-reveal>
            <h3 className="text-xl">{init.entrustTitle}</h3>
            <p className="mt-3 max-w-sm text-body text-ink-soft">{init.entrustText}</p>
          </div>
          <ol className="border-t border-line">
            {init.entrustItems.map((item, i) => (
              <li key={item} className="flex items-baseline gap-6 border-b border-line py-4" data-reveal>
                <span className="font-mono text-[11px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-title">{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-20 rounded-3xl bg-brand p-6 text-white sm:p-10" data-reveal>
          <span className="inline-block rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-black">{init.phasesBadge}</span>
          <h3 className="text-headline mt-4">{init.phasesTitle}</h3>
          <DeliverTimeline phases={init.phases} />
          <div className="mt-12 flex flex-col gap-6 border-t border-white/25 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-title max-w-xl">{init.closing}</p>
            <PillLink href={init.ctaHref} className="bg-white text-black hover:bg-signal">
              {init.ctaLabel}
            </PillLink>
          </div>
        </div>
      </section>

      <CtaBanner cta={s.cta} file="solutions" />
    </>
  );
}
