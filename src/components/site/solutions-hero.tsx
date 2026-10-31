"use client";

import type { Hero } from "@/lib/content-types";
import { HeroMotion } from "./hero-motion";
import { PillLink } from "./links";
import { TorusField } from "./torus-field";

export function SolutionsHero({ hero }: { hero: Hero }) {
  return (
    <section className="relative isolate flex min-h-[78svh] flex-col overflow-x-clip pt-28 pb-8 md:pt-32">
      <TorusField variant="portals" />
      <div className="container-site relative z-10 flex flex-1 flex-col pb-12 md:pb-16">
        <HeroMotion className="flex w-full flex-1 flex-col items-center justify-end text-center">
          {hero.eyebrow ? <p className="label text-ink-soft">{hero.eyebrow}</p> : null}
          <h1 className="text-display mx-auto max-w-[18ch] text-balance">{hero.title}</h1>
          {hero.ctaLabel ? (
            <div className="mt-10">
              <PillLink href={hero.ctaHref}>{hero.ctaLabel}</PillLink>
            </div>
          ) : null}
        </HeroMotion>
      </div>
    </section>
  );
}
