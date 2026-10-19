"use client";

import { CmsImage } from "@/components/cms/cms-image";
import type { Hero } from "@/lib/content-types";
import { ConduitCanvas } from "./conduit-canvas";
import { PillLink } from "./links";

export function SolutionsHero({ hero }: { hero: Hero }) {
  return (
    <section className="dark relative h-svh min-h-[640px] overflow-hidden bg-black text-ink">
      <div aria-hidden className="absolute inset-0">
        {hero.backgroundImage.src ? (
          <>
            <CmsImage image={hero.backgroundImage} file="solutions" path="hero.backgroundImage" priority />
            <div className="absolute inset-0 bg-black/45" />
          </>
        ) : (
          <ConduitCanvas />
        )}
      </div>
      <div data-hero-copy="" className="relative flex h-full flex-col justify-end px-6 pb-16 md:px-10 md:pb-24 lg:px-[7vw]">
        {hero.eyebrow ? <p className="mb-5 font-mono text-[11px] tracking-[0.18em] text-white/55 uppercase">{hero.eyebrow}</p> : null}
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="display max-w-[11em] text-[2.4rem] leading-[1.05] sm:text-6xl lg:text-7xl">{hero.title}</h1>
          <PillLink href={hero.ctaHref} className="bg-white text-black hover:bg-signal">
            {hero.ctaLabel}
          </PillLink>
        </div>
      </div>
    </section>
  );
}
