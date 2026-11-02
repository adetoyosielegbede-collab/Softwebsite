"use client";

import { useEffect, useRef } from "react";
import type { SolutionsContent } from "@/lib/content-types";
import { SolutionArt, type SolutionArtId } from "./solution-art";
import { SwipeCue } from "./swipe-cue";
import { useEqualHeights, useSwipeHint } from "./swipe-rail";

type Item = SolutionsContent["intelligence"]["items"][number];

const ARTS: SolutionArtId[] = ["audit", "financial", "market", "regulatory", "societal"];

/** Intro panel and five intelligence cards. Large screens slide the row sideways as you scroll. */
export function IntelligenceRail({ eyebrow, intro, items }: { eyebrow: string; intro: string; items: Item[] }) {
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const lead = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const swiped = useSwipeHint(row);
  useEqualHeights(row, "[data-rail-art]");

  useEffect(() => {
    const scroller = row.current;
    const panel = lead.current;
    if (!scroller || !panel) return;
    const layout = window.matchMedia("(max-width: 1023.98px)");
    const align = () => {
      const text = scroller.querySelector<HTMLElement>("[data-rail-text]");
      const card = text?.closest("article");
      panel.style.paddingTop = "";
      panel.style.justifyContent = "";
      if (!layout.matches || !text || !card) return;
      const offset = text.getBoundingClientRect().top - card.getBoundingClientRect().top + parseFloat(getComputedStyle(text).paddingTop);
      panel.style.paddingTop = `${offset}px`;
      panel.style.justifyContent = "flex-start";
    };
    align();
    const observer = new ResizeObserver(align);
    observer.observe(scroller);
    layout.addEventListener("change", align);
    return () => {
      observer.disconnect();
      layout.removeEventListener("change", align);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const update = () => {
      const outer = track.current;
      const scroller = row.current;
      const stage = scroller?.parentElement;
      if (!outer || !scroller || !stage) return;
      const cover = veil.current;
      if (!media.matches) {
        scroller.style.transform = "";
        outer.style.height = "";
        if (cover) cover.style.display = "none";
        return;
      }
      const distance = Math.max(0, scroller.scrollWidth - stage.clientWidth);
      outer.style.height = `${stage.offsetHeight + distance}px`;
      const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
      const progress = Math.max(0, Math.min(1, (stickyTop - outer.getBoundingClientRect().top) / Math.max(1, distance)));
      scroller.style.transform = `translate3d(${(-distance * progress).toFixed(2)}px,0,0)`;
      if (cover) {
        const bottom = stage.getBoundingClientRect().bottom;
        const pinned = progress > 0 && progress < 1 && bottom < window.innerHeight - 8;
        cover.style.display = pinned ? "block" : "none";
        cover.style.top = `${Math.max(0, bottom)}px`;
      }
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
    <div ref={track} className="relative mt-12 lg:mt-16">
      <div className="container-site mb-4 flex justify-end lg:hidden">
        <SwipeCue hidden={swiped} />
      </div>
      <div className="lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:z-10 lg:motion-safe:overflow-hidden lg:motion-safe:bg-surface">
        <div
          ref={row}
          className="flex snap-x snap-mandatory items-stretch gap-2.5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-8 lg:px-10 [&::-webkit-scrollbar]:hidden lg:motion-safe:w-max lg:motion-safe:snap-none lg:motion-safe:overflow-visible lg:motion-safe:pb-0"
        >
          <div ref={lead} className="flex w-[82vw] shrink-0 snap-start flex-col justify-end gap-6 rounded-3xl p-2 sm:w-[420px] lg:w-[460px] lg:p-8">
            <span className="label">{eyebrow} →</span>
            <p className="text-xl leading-[1.4] text-ink lg:text-2xl">{intro}</p>
          </div>
          {items.map((item, i) => (
            <article
              key={item.title}
              className="flex w-[82vw] shrink-0 snap-start flex-col overflow-clip rounded-3xl bg-paper sm:w-[420px] lg:w-[440px]"
            >
              <div data-rail-art="" className="px-4 pt-6">
                {ARTS[i] ? <SolutionArt id={ARTS[i]} palette="light" /> : null}
              </div>
              <div data-rail-text="" className="flex flex-1 flex-col gap-3 p-6 lg:p-8">
                <span className="font-mono text-xs text-ink-soft tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-heading text-2xl leading-none heading-type">{item.title}</h3>
                <p className="text-base leading-[1.6] text-ink-soft">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      {/* Covers the screen below the cards until the row finishes, without pushing the next section down. */}
      <div ref={veil} aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-20 hidden bg-surface" />
    </div>
  );
}
