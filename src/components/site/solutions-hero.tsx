"use client";

import { CmsImage } from "@/components/cms/cms-image";
import type { Hero } from "@/lib/content-types";
import { ConduitCanvas } from "./conduit-canvas";
import { HeroMotion } from "./hero-motion";
import { PillLink } from "./links";

export function SolutionsHero({ hero }: { hero: Hero }) {
  return (
    <section className="dark relative min-h-svh bg-black text-ink">
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {hero.backgroundImage.src ? (
          <>
            <CmsImage image={hero.backgroundImage} file="solutions" path="hero.backgroundImage" priority />
            <div className="absolute inset-0 bg-black/45" />
          </>
        ) : (
          <ConduitCanvas />
        )}
      </div>
      <HeroMotion className="relative z-10 flex min-h-svh flex-col justify-end px-6 pt-28 pb-16 md:px-10 md:pb-24 lg:px-[7vw]">
        {hero.eyebrow ? <p className="label mb-5 text-white/55">{hero.eyebrow}</p> : null}
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="text-display max-w-[12em]">{hero.title}</h1>
          <PillLink href={hero.ctaHref} className="shrink-0 bg-white text-black hover:bg-signal">
            {hero.ctaLabel}
          </PillLink>
        </div>
      </HeroMotion>
    </section>
  );
}
