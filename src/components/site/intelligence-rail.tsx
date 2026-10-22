"use client";

import { useEffect, useRef } from "react";
import type { SolutionsContent } from "@/lib/content-types";
import { intelligenceSvgs, isoDefs } from "./iso-art";

type Item = SolutionsContent["intelligence"]["items"][number];

/** Intro panel and five intelligence cards on one row. Large screens scrub the row sideways. */
export function IntelligenceRail({ eyebrow, intro, items }: { eyebrow: string; intro: string; items: Item[] }) {
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const update = () => {
      const outer = track.current;
      const scroller = row.current;
      if (!outer || !scroller) return;
      if (!media.matches) {
        scroller.style.transform = "";
        outer.style.height = "";
        if (bar.current) bar.current.style.transform = "scaleX(0)";
        return;
      }
      const distance = Math.max(0, scroller.scrollWidth - window.innerWidth);
      outer.style.height = `${window.innerHeight + distance}px`;
      const progress = Math.max(0, Math.min(1, -outer.getBoundingClientRect().top / Math.max(1, distance)));
      scroller.style.transform = `translate3d(${(-distance * progress).toFixed(2)}px,0,0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${progress.toFixed(4)})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    media.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      media.removeEventListener("change", update);
    };
  }, []);

  return (
    <div ref={track} className="relative mt-16 lg:motion-safe:h-[220vh]">
      <div className="iso softcom-line" aria-hidden dangerouslySetInnerHTML={{ __html: isoDefs }} />
      <div className="lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-svh lg:motion-safe:items-center lg:motion-safe:overflow-hidden">
        <div
          ref={row}
          className="flex snap-x snap-mandatory items-stretch gap-2.5 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-10 lg:motion-safe:w-max lg:motion-safe:snap-none lg:motion-safe:overflow-visible lg:motion-safe:pb-0"
        >
          <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-end gap-6 rounded-3xl p-2 sm:w-[420px] lg:w-[460px] lg:p-8">
            <span className="label">{eyebrow} →</span>
            <p className="text-xl leading-[1.4] text-ink lg:text-2xl">{intro}</p>
          </div>
          {items.map((item, i) => (
            <article
              key={item.title}
              className="flex w-[82vw] shrink-0 snap-start flex-col overflow-clip rounded-3xl bg-surface sm:w-[420px] lg:w-[440px]"
            >
              <div className="iso softcom-line line-panel px-6 pt-6">
                {intelligenceSvgs[i] ? (
                  <div dangerouslySetInnerHTML={{ __html: intelligenceSvgs[i] }} />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6 lg:p-8">
                <span className="font-mono text-xs text-ink-soft tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-heading text-2xl leading-none heading-type">{item.title}</h3>
                <p className="text-base leading-[1.6] text-ink-soft">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="absolute inset-x-10 bottom-8 hidden h-px bg-line lg:motion-safe:block" aria-hidden>
          <div ref={bar} className="h-px origin-left bg-accent-ink" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}
