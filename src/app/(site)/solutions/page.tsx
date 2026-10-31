import type { Metadata } from "next";
import { IntelligenceRail } from "@/components/site/intelligence-rail";
import { PillLink } from "@/components/site/links";
import { DeliverTimeline } from "@/components/site/deliver-timeline";
import { ScrollWords } from "@/components/site/scroll-words";
import { CtaBanner, SectionNumber } from "@/components/site/sections";
import { DigitalInfrastructureBoard, SolutionArt } from "@/components/site/solution-art";
import { SolutionsHero } from "@/components/site/solutions-hero";
import { getContent } from "@/lib/content";
import { fontSizeVars, textStyleClass } from "@/lib/typography";
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
          <ScrollWords
            paragraphs={intro.paragraphs}
            paragraphClassName={cn(textStyleClass(intro.textStyle, "Headline"), intro.textStyle === "Lede" || intro.textStyle === "Body" ? "leading-[1.35]" : "leading-[1.08]")}
            paragraphStyle={fontSizeVars(intro.fontSize)}
          />
        </div>
      </section>

      <section className="container-site">
        <SectionHeader id="digital-infrastructure" number={infra.number} title={infra.title} lead={infra.lead} />
        <div className="mt-16 max-w-md" data-reveal>
          <h3 className="font-heading text-xl heading-type">{infra.subTitle}</h3>
          <p className="mt-3 text-body text-ink-soft">{infra.subText}</p>
        </div>
        <div className="mt-10">
          <DigitalInfrastructureBoard steps={infra.steps} />
        </div>
        <p className="text-title mx-auto mt-20 max-w-2xl text-center" data-reveal>
          {infra.statement}
        </p>
        <div className="mt-16 flex flex-col gap-14 lg:gap-20">
          {infra.cards.map((card, index) => (
            <article key={card.title} className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.85fr)] lg:gap-12" data-reveal>
              <div>
                <p className="eyebrow">{card.eyebrow}</p>
                <h3 className="text-headline mt-3 max-w-[16ch]">{card.title}</h3>
                <p className="text-body mt-4 max-w-[48ch] text-ink-soft">{card.text}</p>
              </div>
              <SolutionArt
                id={index === 0 ? "build" : "rails"}
                className={index === 0 ? "mx-auto w-full max-w-[298px]" : "mx-auto w-full max-w-[370px]"}
              />
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <PillLink href={infra.ctaHref}>{infra.ctaLabel}</PillLink>
        </div>
      </section>

      <section className="pt-20 lg:pt-28">
        <div className="container-site">
          <SectionHeader id="applied-intelligence" number={intel.number} title={intel.title} lead={intel.lead} />
        </div>
        <IntelligenceRail eyebrow={intel.eyebrow} intro={intel.intro} items={intel.items} />
        <div className="container-site mt-12">
          <PillLink href={intel.ctaHref}>{intel.ctaLabel}</PillLink>
        </div>
      </section>

      <section className="container-site pt-20 lg:pt-28">
        <SectionHeader id="powering-initiatives" number={init.number} title={init.title} lead={init.lead} />
        <div className="mt-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <SolutionArt id="field" />
          <div>
            <h3 className="text-headline">{init.entrustTitle}</h3>
            <ol className="mt-6 border-t border-line">
              {init.entrustItems.map((item, i) => (
                <li key={item} className="flex items-baseline gap-6 border-b border-line py-4">
                  <span className="font-mono text-[11px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-title">{item}</span>
                </li>
              ))}
            </ol>
          </div>
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
