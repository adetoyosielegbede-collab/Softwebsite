"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { SolutionsContent } from "@/lib/content-types";
import { PillLink } from "./links";
import { SolutionArt, type SolutionArtId } from "./solution-art";
import { SwipeCue } from "./swipe-cue";
import { useEqualHeights, useSwipeHint } from "./swipe-rail";

type Item = SolutionsContent["intelligence"]["items"][number];

const ARTS: SolutionArtId[] = ["audit", "financial", "market", "regulatory", "societal"];

/** Intro panel and five intelligence cards. Large screens pin the section, then slide the row sideways. */
export function IntelligenceRail({
  header,
  eyebrow,
  intro,
  items,
  ctaLabel,
  ctaHref,
}: {
  header?: ReactNode;
  eyebrow: string;
  intro: string;
  items: Item[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
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
      const frame = clip.current;
      const stage = frame?.parentElement;
      if (!outer || !scroller || !frame || !stage) return;
      const cover = veil.current;
      const heading = stage.querySelector<HTMLElement>("[data-intel-header]");
      if (!media.matches) {
        scroller.style.transform = "";
        outer.style.height = "";
        outer.style.marginTop = "";
        stage.style.top = "";
        frame?.style.removeProperty("height");
        if (cover) cover.style.display = "none";
        return;
      }
      const naturalH = scroller.offsetHeight;
      const gap = parseFloat(getComputedStyle(frame).marginTop) || 0;
      const available = window.innerHeight - (heading?.offsetHeight ?? 0) - gap - 16;
      const scale = Math.min(1, available / Math.max(1, naturalH));
      frame.style.height = `${Math.round(naturalH * scale)}px`;
      const width = frame.clientWidth || window.innerWidth;
      const travel = Math.max(0, scroller.scrollWidth * scale - width);
      outer.style.height = `${stage.offsetHeight + travel}px`;
      const progress = travel === 0 ? 0 : Math.max(0, Math.min(1, -outer.getBoundingClientRect().top / travel));
      const shift = scale === 0 ? 0 : -progress * (scroller.scrollWidth - width / scale);
      scroller.style.transformOrigin = "top left";
      scroller.style.transform = `scale(${scale}) translate3d(${shift.toFixed(2)}px,0,0)`;
      if (cover) {
        const bottom = stage.getBoundingClientRect().bottom;
        const pinned = stage.getBoundingClientRect().top <= 1 && progress < 1 && bottom < window.innerHeight - 8;
        cover.style.display = pinned ? "block" : "none";
        cover.style.top = `${Math.max(0, bottom)}px`;
      }
    };
    update();
    const observer = new ResizeObserver(update);
    if (row.current) observer.observe(row.current);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    media.addEventListener("change", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      media.removeEventListener("change", update);
    };
  }, []);

  return (
    <div ref={track} className="relative">
      <div className="lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:z-30 lg:motion-safe:bg-surface">
        {header ? <div data-intel-header="">{header}</div> : null}
        <div className="container-site mb-4 flex justify-end lg:hidden">
          <SwipeCue hidden={swiped} />
        </div>
        <div ref={clip} className="mt-8 overflow-hidden lg:mt-10">
          <div
            ref={row}
            className="flex snap-x snap-mandatory items-stretch gap-2.5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-8 lg:px-10 [&::-webkit-scrollbar]:hidden lg:motion-safe:w-max lg:motion-safe:snap-none lg:motion-safe:overflow-visible lg:motion-safe:pb-0"
          >
          <div
            ref={lead}
            className="flex w-[82vw] shrink-0 snap-start flex-col justify-end gap-5 rounded-3xl p-2 sm:w-[420px] lg:w-[460px] lg:gap-6 lg:p-8 lg:pb-24"
          >
            <span className="label">{eyebrow} →</span>
            <p className="text-xl leading-[1.4] text-ink lg:text-2xl">{intro}</p>
            {ctaLabel && ctaHref ? (
              <div className="pt-1">
                <PillLink href={ctaHref}>{ctaLabel}</PillLink>
              </div>
            ) : null}
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
      </div>
      {/* Hides the next section on tall screens until the row has finished sliding. */}
      <div ref={veil} aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-20 hidden bg-surface" />
    </div>
  );
}
