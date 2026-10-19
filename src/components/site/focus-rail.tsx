"use client";

import { useEffect, useRef } from "react";
import { CmsImage } from "@/components/cms/cms-image";
import type { HomeContent } from "@/lib/content-types";
import { ColorReveal } from "./color-reveal";
import { LineReveal } from "./line-reveal";
import { PillLink } from "./links";

const CHIPS = ["bg-brand text-signal", "bg-signal text-brand", "bg-black text-white"];

/** Focus-area cards. On a large screen they travel sideways as the page scrolls. */
export function FocusRail({ content }: { content: HomeContent["focusAreas"] }) {
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);

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
        <div className="container-site">
          <LineReveal className="text-headline">{content.title}</LineReveal>
        </div>
        <div
          ref={row}
          className="flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto px-5 pt-2 sm:px-8 lg:px-10 lg:motion-safe:snap-none lg:motion-safe:overflow-visible"
        >
          {content.items.map((area, i) => (
            <article
              key={area.title}
              className="relative flex min-h-[min(560px,80svh)] w-[min(1176px,85vw)] shrink-0 snap-start flex-col items-end justify-end gap-3 overflow-hidden rounded-[2rem] lg:min-h-[min(720px,70svh)]"
            >
              <ColorReveal className="absolute inset-0">
                <CmsImage image={area.image} file="home" path={`focusAreas.items.${i}.image`} sizes="(min-width: 1024px) 1176px, 85vw" />
              </ColorReveal>
              <span
                className={
                  "relative grid size-14 place-items-center rounded-2xl font-heading text-3xl font-light lg:size-16 lg:text-4xl " +
                  (CHIPS[i] ?? CHIPS[2])
                }
              >
                {area.number}
              </span>
              <div className="relative m-3 w-full rounded-2xl bg-paper/95 p-6 text-ink backdrop-blur sm:ml-auto sm:max-w-[560px] lg:m-6 lg:p-8">
                <h3 className="text-title xl:text-headline xl:leading-[1.1]">{area.title}</h3>
                <p className="mt-4 text-base leading-[1.6] text-ink-soft">{area.text}</p>
                <div className="mt-6">
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
