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
    <div id={id} className="scroll-mt-24 pt-8 text-center" data-reveal>
      <SectionNumber>{number}</SectionNumber>
      <h2 className="text-headline mt-4">{title}</h2>
      <p className="text-lede mx-auto mt-4 max-w-3xl text-balance text-accent-ink">{lead}</p>
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
        <div className="max-w-4xl text-left">
          <p className="label mb-5 text-ink-soft">{intro.badge}</p>
          <ScrollWords
            paragraphs={intro.paragraphs}
            paragraphClassName={cn(textStyleClass(intro.textStyle, "Headline"), intro.textStyle === "Lede" || intro.textStyle === "Body" ? "leading-[1.35]" : "leading-[1.08]")}
            paragraphStyle={fontSizeVars(intro.fontSize)}
          />
        </div>
      </section>

      <section className="border-t border-line bg-paper pb-20 lg:pb-28">
        <div className="container-site">
          <SectionHeader id="digital-infrastructure" number={infra.number} title={infra.title} lead={infra.lead} />
          <DigitalInfrastructureBoard heading={infra.subTitle} intro={infra.subText} steps={infra.steps} />
          <p className="text-title mx-auto mt-8 max-w-2xl text-center lg:mt-10" data-reveal>
            {infra.statement}
          </p>
          <div className="mt-8 text-center">
            <PillLink href={infra.ctaHref}>{infra.ctaLabel}</PillLink>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface pb-8 lg:pb-12">
        <IntelligenceRail
          header={
            <div className="container-site">
              <SectionHeader id="applied-intelligence" number={intel.number} title={intel.title} lead={intel.lead} />
            </div>
          }
          eyebrow={intel.eyebrow}
          intro={intel.intro}
          items={intel.items}
        />
      </section>

      <section className="border-t border-line bg-paper">
        <div className="container-site">
          <SectionHeader id="powering-initiatives" number={init.number} title={init.title} lead={init.lead} />
        <div className="mx-auto mt-8 w-full max-w-[1000px] lg:mt-10">
          <SolutionArt id="field" palette="light" />
        </div>

        <div className="mx-auto mt-16 grid w-full max-w-[80%] gap-4 md:grid-cols-2 lg:mt-20">
          {infra.cards.map((card, index) => (
            <article key={card.title} className="@container flex flex-col rounded-3xl bg-surface p-6 lg:p-8" data-reveal>
              <div className="mx-auto mb-8 flex aspect-[298/185] w-[60%] items-end">
                <SolutionArt id={index === 0 ? "build" : "rails"} palette="light" className="w-full" />
              </div>
              <p className="eyebrow">{card.eyebrow}</p>
              <h3 className="mt-4 font-heading text-[clamp(1.125rem,4.6cqw,1.75rem)] leading-none whitespace-nowrap heading-type">{card.title}</h3>
              <p className="text-body mt-5 text-ink-soft">{card.text}</p>
            </article>
          ))}
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
        </div>
      </section>

      <CtaBanner cta={s.cta} file="solutions" />
    </>
  );
}
