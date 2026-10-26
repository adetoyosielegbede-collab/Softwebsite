"use client";

import { useEffect, useRef } from "react";
import { CmsImage } from "@/components/cms/cms-image";
import type { HomeContent } from "@/lib/content-types";
import { ColorReveal } from "./color-reveal";
import { LineReveal } from "./line-reveal";
import { PillLink } from "./links";
import { SwipeCue } from "./swipe-cue";
import { useEqualHeights, useSwipeHint } from "./swipe-rail";

const CHIPS = ["bg-brand text-signal", "bg-signal text-brand", "bg-black text-white"];

/** Focus-area cards. On a large screen they travel sideways as the page scrolls. */
export function FocusRail({ content }: { content: HomeContent["focusAreas"] }) {
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const swiped = useSwipeHint(row);
  useEqualHeights(row, "[data-focus-panel]");

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let current = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const outer = track.current;
      const scroller = row.current;
      if (!outer || !scroller) return;
      if (!media.matches) {
        scroller.style.transform = "";
        return;
      }
      const span = outer.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -outer.getBoundingClientRect().top / Math.max(1, span)));
      const distance = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      const start = 0.08;
      const end = 0.92;
      const local = Math.max(0, Math.min(1, (progress - start) / (end - start)));
      const target = -distance * local;
      current += (target - current) * 0.18;
      scroller.style.transform = `translate3d(${current.toFixed(2)}px,0,0)`;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={track} className="relative lg:motion-safe:h-[260vh]">
      <div className="flex flex-col gap-8 lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:h-svh lg:motion-safe:justify-center lg:motion-safe:overflow-hidden">
        <div className="container-site flex items-end justify-between gap-6">
          <LineReveal className="text-headline">{content.title}</LineReveal>
          <SwipeCue hidden={swiped} className="mb-1 lg:hidden" />
        </div>
        <div
          ref={row}
          className="flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto px-5 pt-2 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden lg:px-10 lg:motion-safe:snap-none lg:motion-safe:overflow-visible"
        >
          {content.items.map((area, i) => (
            <article
              key={area.title}
              className="relative flex w-[min(1176px,85vw)] shrink-0 snap-start flex-col overflow-hidden rounded-[2rem] bg-surface lg:min-h-[min(720px,70svh)] lg:items-end lg:justify-end lg:gap-3 lg:bg-transparent"
            >
              <ColorReveal className="relative aspect-[4/3] w-full shrink-0 sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
                <CmsImage image={area.image} file="home" path={`focusAreas.items.${i}.image`} sizes="(min-width: 1024px) 1176px, 85vw" />
              </ColorReveal>
              <span
                className={
                  "absolute top-4 right-4 grid size-12 place-items-center rounded-2xl font-heading text-2xl heading-type lg:relative lg:top-auto lg:right-auto lg:size-16 lg:text-4xl " +
                  (CHIPS[i] ?? CHIPS[2])
                }
              >
                {area.number}
              </span>
              <div data-focus-panel="" className="relative flex w-full flex-1 flex-col p-6 text-ink lg:m-6 lg:ml-auto lg:max-w-[560px] lg:flex-none lg:rounded-2xl lg:bg-paper/95 lg:p-8 lg:backdrop-blur">
                <h3 className="text-title xl:text-headline xl:leading-[1.1]">{area.title}</h3>
                <p className="mt-4 text-base leading-[1.6] text-ink-soft">{area.text}</p>
                <div className="mt-auto pt-6">
                  <PillLink href={area.href}>{area.ctaLabel}</PillLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
